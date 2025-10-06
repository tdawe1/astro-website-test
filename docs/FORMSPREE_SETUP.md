# Formspree Setup Guide

This guide explains how to set up Formspree for the Kyros website contact forms and configure it properly for both development and production environments.

## Overview

The Kyros website uses Formspree to handle contact form submissions securely without requiring a database or server-side code. Formspree provides a serverless backend that forwards form data to your email.

### Why Formspree?

- No database required
- Built-in spam protection
- Email notifications for new submissions
- Free tier: 50 submissions per month
- GDPR compliant and secure

## Setup Steps

### 1. Create a Formspree Account (Free)

1. Go to [https://formspree.io](https://formspree.io)
2. Click "Sign Up" and create a free account
3. Verify your email address when prompted

### 2. Create a New Form

1. In your Formspree dashboard, click "Create a new form"
2. Give your form a descriptive name (e.g., "Kyros Contact Form")
3. The form will be created and you'll see its unique ID in the URL

### 3. Get Your Form ID

1. After creating the form, look at the URL in your browser
2. It will look like: `https://formspree.io/forms/xrbaloye`
3. The form ID is the part after "/forms/" (e.g., "xrbaloye")
4. You can also find it in your dashboard under the form's settings

### 4. Configure Email Notifications

1. In your form settings, go to the "Emails" tab
2. Add your email address to receive notifications when forms are submitted
3. You can add multiple email addresses if needed

### 5. Set Up Environment Variables

#### For Local Development

1. Copy the example environment file: `cp .env.example .env`
2. Replace "your_form_id_here" with your actual form ID
3. Save the .env file

```bash
# Required: Your Formspree form ID (used in production builds)
PUBLIC_FORMSPREE_FORM_ID=your_form_id_here
```

#### For CI/CD and Production

The `PUBLIC_FORMSPREE_FORM_ID` environment variable must be configured in your CI/CD pipeline and hosting environment:

**GitHub Actions:**
- Add the form ID as a repository secret named `PUBLIC_FORMSPREE_FORM_ID`
- Configure it in your workflow files (see updated workflows in `.github/workflows/`)

**Production Hosting:**
- Set the environment variable in your hosting platform (Netlify, Vercel, etc.)
- Ensure it's available during the build process

## Environment Variable Requirements

The build script includes validation that checks for the `PUBLIC_FORMSPREE_FORM_ID` environment variable during production builds. This validation:

- Only runs when `NODE_ENV=production`
- Prevents builds from completing without the required configuration
- Provides clear error messages and setup instructions

## Testing Your Setup

1. Run your development server: `npm run dev`
2. Navigate to the contact form on your website
3. Submit a test form
4. Check your email for the notification
5. Verify submissions appear in your Formspree dashboard

## Troubleshooting

- **Form ID not working**: Make sure the form ID is copied exactly (case-sensitive)
- **Environment variable not found**: Check that your .env file is in the project root
- **Build failing**: Restart your development server after changing .env
- **Submission limit reached**: If you exceed 50 submissions/month, upgrade to a paid plan

## CI/CD Configuration

### GitHub Actions

The repository includes GitHub Actions workflows that need the `PUBLIC_FORMSPREE_FORM_ID` environment variable:

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add a new repository secret:
   - Name: `PUBLIC_FORMSPREE_FORM_ID`
   - Value: Your Formspree form ID

### Other CI/CD Platforms

For other platforms (GitLab CI, CircleCI, etc.), ensure you:

1. Add `PUBLIC_FORMSPREE_FORM_ID` as an environment variable
2. Make it available during the build process
3. Set `NODE_ENV=production` for production builds

## Security Notes

- The form ID is safe to expose in client-side code (it's prefixed with `PUBLIC_`)
- Never commit actual form IDs to version control
- Use different form IDs for development and production environments if needed
- Regularly monitor your Formspree dashboard for spam or abuse

## Form Integration

The Formspree form is integrated in `/src/pages/discovery.astro` and uses the action URL format:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

The form ID is automatically injected during the build process using the environment variable.