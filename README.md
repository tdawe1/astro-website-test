# kyros Website

A website for kyros - a UK-based automation agency that builds automation and workflow optimisation tools.

## 🚀 Features

- **Responsive**: Optimized for all screen sizes with fluid typography
- **Performance**: Fast-loading static site built with Astro
- **SEO Optimized**: Semantic HTML and proper meta tags
- **Accessibility**: ARIA labels and keyboard navigation support
- **Secure**: No self-hosted server-side code, database, or backend infrastructure
- **Contact Forms**: Serverless form handling via Formspree

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator
- **Styling**: CSS with custom properties and responsive design
- **Fonts**: Inter from Google Fonts
- **Icons**: Emoji-based icon system
- **Forms**: [Formspree](https://formspree.io) - Serverless form backend
- **Deployment**: Static hosting ready

## Environment Variables

The application uses the following environment variables:

### Formspree Configuration

```env
# Required: Production Formspree form ID
PUBLIC_FORMSPREE_FORM_ID=your_production_form_id_here

# Optional: Development Formspree form ID
# When set, development mode uses this form ID
# When not set, development mode falls back to PUBLIC_FORMSPREE_FORM_ID
PUBLIC_FORMSPREE_FORM_ID_DEV=your_dev_form_id_here
```

**Setup**: Copy `.env.example` to `.env` and configure the variables above.

## 📧 Contact Forms

The website uses [Formspree](https://formspree.io) for secure, serverless contact form handling. This eliminates the need for server-side code, databases, or API endpoints.

### Setup

1. Create a free Formspree account at [formspree.io](https://formspree.io)
2. Create forms and copy the form IDs
3. Configure the Formspree environment variables (see Environment Variables section above)
4. See `docs/FORMSPREE_SETUP.md` for detailed setup instructions

### Features

- **Spam Protection**: Built-in spam filtering
- **Email Notifications**: Instant notifications for new submissions
- **Dashboard**: Web interface to view and manage submissions
- **GDPR Compliant**: Secure data handling
- **Free Tier**: 50 submissions per month

## 🤔 Why Astro?

This project was built using **Astro** as a learning experience and exploration of modern web development tools. As my first time using Astro, I chose it for several compelling reasons:

- **Performance First**: Astro's "zero JavaScript by default" approach ensures lightning-fast page loads
- **Component Islands**: The ability to selectively add interactivity only where needed
- **Framework Agnostic**: Can use React, Vue, Svelte components alongside vanilla HTML/CSS
- **Static Site Generation**: Perfect for content-heavy websites that don't need complex client-side state
- **Modern Developer Experience**: Built-in TypeScript support, hot reloading, and excellent tooling
- **Learning Opportunity**: A chance to explore a framework that's gaining significant traction in the static site space

**Note**: This is my first Astro project, so the codebase represents a learning journey. It may not follow all Astro best practices yet.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.astro    # Navigation and hero section
│   ├── WhyUs.astro     # Value propositions
│   ├── Process.astro   # 3-step methodology
│   ├── CaseStudies.astro # Success stories
│   ├── Industries.astro # Industry focus areas
│   ├── FinalCTA.astro  # Call-to-action section
│   └── Footer.astro    # Site footer
├── layouts/            # Page layouts
│   └── Layout.astro   # Main HTML boilerplate
├── pages/              # Page components
│   ├── index.astro    # Homepage
│   └── discovery.astro # Discovery call landing page
└── styles/             # Global styles
    └── global.css     # CSS variables and base styles
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1920px
- **Desktop**: > 1920px

## 📄 License

All rights reserved © 2025 kyros

## 🤝 Contact

hello@kyros.solutions

---

Built with ❤️ using [Astro](https://astro.build/)
