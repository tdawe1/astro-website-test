# Environment Configuration Guide

This document explains how to configure environment variables for the Kyros website, including deployed agents and integrations.

## Quick Setup

1. **For Local Development:**
   ```bash
   cp .env.template .env
   ```

2. **For Production Deployment:**
   ```bash
   cp .env.template .env.production
   ```

3. **Fill in the required values** based on your environment and integrations.

## Required Environment Variables

### Minimal Setup
For basic functionality, you only need:

```env
NODE_ENV=development
APP_URL=http://localhost:4321
DATABASE_PATH=data/contacts.db
EMAIL_NOTIFICATION_TO=your-email@example.com
```

### Production Setup
For production deployments, additionally configure:

```env
NODE_ENV=production
APP_URL=https://your-domain.com
SENDGRID_API_KEY=your_sendgrid_key
FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

## Environment Variable Categories

### 🏗️ Application Configuration
- `NODE_ENV`: Environment mode (development/staging/production)
- `APP_URL`: Base URL for absolute links in emails and webhooks
- `DATABASE_PATH`: SQLite database file location

### 📧 Email Services
Choose one email provider and configure its variables:

**SendGrid** (Recommended):
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=hello@kyros.solutions
```

**Mailgun**:
```env
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=key-xxx
MAILGUN_DOMAIN=mg.yourdomain.com
```

**Resend**:
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxx
```

### 📝 Form Services
- `FORMSPREE_ENDPOINT`: External form handling service
- `FORM_RATE_LIMIT_*`: Protection against form spam

### 🤖 AI/Automation Agents
For repository-level agents and automation:

```env
GITHUB_TOKEN=ghp_xxx
GITHUB_WEBHOOK_SECRET=your_webhook_secret
OPENAI_API_KEY=sk-xxx
AGENT_SECRET_KEY=your_agent_secret
```

### 🔒 Security Configuration
- `SESSION_SECRET`: Secure random string for session management
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins
- `API_RATE_LIMIT_*`: API protection settings

### 📊 Analytics & Monitoring
- `GA_TRACKING_ID`: Google Analytics tracking ID
- `SENTRY_DSN`: Error tracking and monitoring
- `LOG_LEVEL`: Application logging level

## Security Best Practices

### ⚠️ Important Security Guidelines

1. **Never commit environment files to Git:**
   ```bash
   # These are already in .gitignore:
   .env
   .env.production
   .env.local
   ```

2. **Use strong, unique secrets:**
   ```bash
   # Generate secure random strings:
   openssl rand -hex 32
   ```

3. **Scope API keys appropriately:**
   - Use read-only keys where possible
   - Set shortest practical expiration times
   - Regularly rotate keys

4. **Validate environment on startup:**
   The application should validate required environment variables exist.

### 🔐 Token Management

**For Deployed Agents:**
- Use short-lived tokens (max 24-48 hours)
- Implement token rotation
- Use scoped permissions only
- Monitor token usage

**For Development:**
- Use separate development keys
- Never use production tokens locally
- Use `.env.local` for personal overrides

### 🚨 Secret Detection

**Pre-commit Checks:**
```bash
# Install pre-commit hooks for secret detection
pip install pre-commit
pre-commit install
```

**Manual Scanning:**
```bash
# Scan for accidentally committed secrets
git log --grep="password\|secret\|key\|token" --oneline
```

## Deployment-Specific Configuration

### GitHub Actions
Store secrets in GitHub repository settings:
- `SENDGRID_API_KEY`
- `DATABASE_CONNECTION_STRING`
- `DEPLOYMENT_TOKEN`

### Vercel/Netlify
Configure environment variables in the deployment dashboard.

### Docker
Use Docker secrets or environment files:
```bash
docker run --env-file .env.production kyros-website
```

## Troubleshooting

### Common Issues

1. **Email not sending:**
   - Check `EMAIL_PROVIDER` is set correctly
   - Verify API key has send permissions
   - Check `EMAIL_NOTIFICATION_TO` is valid

2. **Database errors:**
   - Ensure `DATABASE_PATH` directory exists
   - Check file permissions
   - Verify SQLite is installed

3. **Form submissions failing:**
   - Validate `FORMSPREE_ENDPOINT`
   - Check CORS configuration
   - Verify rate limiting settings

### Debug Mode
Enable detailed logging:
```env
LOG_LEVEL=debug
DEV_API_LOGGING=true
DEV_PRETTY_ERRORS=true
```

## Environment Validation

The application should validate environment variables on startup. Required checks:

- [ ] `NODE_ENV` is valid
- [ ] `APP_URL` is properly formatted
- [ ] Email provider configuration is complete
- [ ] Database path is accessible
- [ ] Required secrets are present and non-empty

## Support

For questions about environment configuration:
1. Check this documentation
2. Review `SECURITY.md` for security guidelines
3. Contact: hello@kyros.solutions

---

**Last Updated:** 2025-01-27  
**Version:** 1.0