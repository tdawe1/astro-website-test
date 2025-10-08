#!/usr/bin/env node

// Environment validation script for production builds
// This script ensures required environment variables are set before building

// Validate environment variables for all builds (development and production)




// Check if PUBLIC_FORMSPREE_FORM_ID is set
if (!process.env.PUBLIC_FORMSPREE_FORM_ID) {
  console.error("❌ Build failed: Missing required environment variable");
  console.error("");
  console.error("PUBLIC_FORMSPREE_FORM_ID is required for all builds (development and production).");
  console.error("This variable must be set in your environment or .env file.");
  console.error("");
  console.error("📖 Setup instructions: See docs/FORMSPREE_SETUP.md");
  console.error("");
  console.error("💡 To fix this:");
  console.error("   1. Copy .env.example to .env");
  console.error("   2. Set PUBLIC_FORMSPREE_FORM_ID=your_form_id_here");
  console.error("   3. Run the build again");
  process.exit(1);
}

// Validation passed
console.log("✅ Environment validation passed");
process.exit(0);
