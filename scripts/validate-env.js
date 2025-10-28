#!/usr/bin/env node

/**
 * Environment Configuration Validator
 * 
 * This script validates that environment variables are properly configured
 * for the Kyros website. Run this before deployment or when troubleshooting.
 * 
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate-env
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
function loadEnvFile(envPath) {
  if (!existsSync(envPath)) {
    return {};
  }
  
  const envContent = readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

// Validation rules
const validationRules = {
  // Required for basic functionality
  required: {
    NODE_ENV: {
      required: true,
      validValues: ['development', 'staging', 'production'],
      description: 'Application environment'
    },
    APP_URL: {
      required: true,
      pattern: /^https?:\/\/.+/,
      description: 'Application base URL'
    }
  },
  
  // Required for production
  production: {
    EMAIL_PROVIDER: {
      required: true,
      validValues: ['sendgrid', 'mailgun', 'resend'],
      description: 'Email service provider'
    },
    EMAIL_NOTIFICATION_TO: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      description: 'Email notification recipient'
    },
    FORMSPREE_ENDPOINT: {
      required: true,
      description: 'Formspree endpoint for forms'
    },
    SESSION_SECRET: {
      required: true,
      minLength: 32,
      description: 'Session encryption secret (required in production)'
    }
  },
  
  // Conditional requirements
  conditional: {
    // SendGrid configuration
    sendgrid: {
      condition: (env) => env.EMAIL_PROVIDER === 'sendgrid',
      variables: {
        SENDGRID_API_KEY: {
          required: true,
          pattern: /^SG\./,
          description: 'SendGrid API key'
        },
        SENDGRID_FROM_EMAIL: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          description: 'SendGrid from email'
        }
      }
    },
    
    // Mailgun configuration
    mailgun: {
      condition: (env) => env.EMAIL_PROVIDER === 'mailgun',
      variables: {
        MAILGUN_API_KEY: {
          required: true,
          pattern: /^key-/,
          description: 'Mailgun API key'
        },
        MAILGUN_DOMAIN: {
          required: true,
          description: 'Mailgun domain'
        }
      }
    },
    
    // Resend configuration
    resend: {
      condition: (env) => env.EMAIL_PROVIDER === 'resend',
      variables: {
        RESEND_API_KEY: {
          required: true,
          pattern: /^re_/,
          description: 'Resend API key'
        }
      }
    },
    
    // AI Agent configuration
    agents: {
      condition: (env) => env.GITHUB_TOKEN || env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY,
      variables: {
        AGENT_SECRET_KEY: {
          required: true,
          minLength: 32,
          description: 'Agent authentication secret'
        }
      }
    }
  },
  
  // Security recommendations
  security: {
    SESSION_SECRET: {
      recommended: true,
      minLength: 32,
      description: 'Session encryption secret'
    },
    CORS_ALLOWED_ORIGINS: {
      recommended: true,
      description: 'CORS allowed origins'
    }
  }
};

// Validation functions
function validateVariable(key, value, rule) {
  const errors = [];
  const warnings = [];
  
  // Check if required
  if (rule.required && (!value || value.trim() === '')) {
    errors.push(`${key} is required but not set`);
    return { errors, warnings };
  }
  
  // Skip further validation if not set and not required
  if (!value || value.trim() === '') {
    if (rule.recommended) {
      warnings.push(`${key} is recommended but not set`);
    }
    return { errors, warnings };
  }
  
  // Validate against allowed values
  if (rule.validValues && !rule.validValues.includes(value)) {
    errors.push(`${key} must be one of: ${rule.validValues.join(', ')}`);
  }
  
  // Validate against pattern
  if (rule.pattern && !rule.pattern.test(value)) {
    errors.push(`${key} does not match required pattern`);
  }
  
  // Validate minimum length
  if (rule.minLength && value.length < rule.minLength) {
    errors.push(`${key} must be at least ${rule.minLength} characters long`);
  }
  
  return { errors, warnings };
}

function validateEnvironment(envVars) {
  const results = {
    errors: [],
    warnings: [],
    valid: true
  };
  
  const isProduction = envVars.NODE_ENV === 'production';
  
  // Validate required variables
  Object.entries(validationRules.required).forEach(([key, rule]) => {
    const { errors, warnings } = validateVariable(key, envVars[key], rule);
    results.errors.push(...errors);
    results.warnings.push(...warnings);
  });
  
  // Validate production variables
  if (isProduction) {
    Object.entries(validationRules.production).forEach(([key, rule]) => {
      const { errors, warnings } = validateVariable(key, envVars[key], rule);
      results.errors.push(...errors);
      results.warnings.push(...warnings);
    });
  }
  
  // Validate conditional requirements
  Object.entries(validationRules.conditional).forEach(([groupName, group]) => {
    if (group.condition(envVars)) {
      Object.entries(group.variables).forEach(([key, rule]) => {
        const { errors, warnings } = validateVariable(key, envVars[key], rule);
        results.errors.push(...errors);
        results.warnings.push(...warnings);
      });
    }
  });
  
  // Validate security recommendations
  Object.entries(validationRules.security).forEach(([key, rule]) => {
    const { errors, warnings } = validateVariable(key, envVars[key], rule);
    results.errors.push(...errors);
    results.warnings.push(...warnings);
  });
  
  results.valid = results.errors.length === 0;
  return results;
}

// Main execution
function main() {
  console.log('🔍 Validating environment configuration...\n');
  
  // Determine which env file to check
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
  const envPath = join(projectRoot, envFile);
  
  console.log(`📁 Checking: ${envFile}`);
  
  if (!existsSync(envPath)) {
    console.log(`❌ Environment file ${envFile} not found`);
    console.log(`💡 Copy .env.template to ${envFile} and configure it`);
    process.exit(1);
  }
  
  // Load and validate
  const envVars = loadEnvFile(envPath);
  const results = validateEnvironment(envVars);
  
  // Display results
  if (results.errors.length > 0) {
    console.log('\n❌ Validation errors:');
    results.errors.forEach(error => console.log(`  • ${error}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(`  • ${warning}`));
  }
  
  if (results.valid) {
    console.log('\n✅ Environment configuration is valid!');
    
    if (results.warnings.length > 0) {
      console.log('💡 Consider addressing the warnings above for better security');
    }
    
    process.exit(0);
  } else {
    console.log('\n❌ Environment configuration has errors');
    console.log('📚 See docs/ENVIRONMENT.md for configuration help');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateEnvironment, loadEnvFile };