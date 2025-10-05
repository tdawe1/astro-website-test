# kyros Website - Project Context

## Project Overview

This is a website for kyros, a UK-based automation agency that builds automation and workflow optimization tools. The site is built with Astro as a static site generator with some dynamic functionality through API endpoints.

**Key Features:**

- Responsive design optimized for all screen sizes
- Performance-focused with Astro's "zero JavaScript by default" approach
- SEO optimized with semantic HTML and proper meta tags
- Accessibility support with ARIA labels and keyboard navigation
- SQLite database integration for contact form submissions
- Modern UI with 3D visual effects and gradient styling

## Tech Stack

- **Framework**: Astro v5.13.3 (static site generator)
- **Styling**: CSS with custom properties and responsive design
- **Database**: SQLite with sqlite3 driver
- **Fonts**: Inter from Google Fonts
- **Deployment**: Static hosting ready

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.astro    # Navigation and hero section
│   ├── WhyUs.astro     # Value propositions
│   ├── Process.astro   # 3-step methodology
│   ├── CaseStudies.astro # Success stories
│   ├── Industries.astro # Industry focus areas
│   ├── Testimonials.astro # Client testimonials
│   ├── FinalCTA.astro    # Final call-to-action section
│   └── Footer.astro    # Site footer
├── layouts/            # Page layouts
│   └── Layout.astro   # Main HTML boilerplate
├── pages/              # Page components
│   ├── index.astro    # Homepage
│   ├── discovery.astro # Discovery call landing page
│   └── api/           # API endpoints
├── styles/            # Global styles
│   └── global.css     # CSS variables and base styles
└── lib/               # Business logic
    └── database.js    # SQLite database operations
```

## Key Components

1. **Header**: Navigation and hero section with 3D visual elements
2. **WhyUs**: Value propositions section
3. **Process**: 3-step methodology explanation
4. **CaseStudies**: Success stories showcase
5. **Industries**: Industry focus areas
6. **Testimonials**: Client testimonials
7. **FinalCTA**: Final call-to-action section
8. **Footer**: Site footer with contact information

## Database Integration

The site uses SQLite for storing contact form submissions through a simple database library (`src/lib/database.js`) that provides:

- Contact form submission storage
- Contact retrieval and management
- Status tracking for leads

**Note**: The database tables are created lazily when the first contact form submission is processed. Currently, the database is empty with no tables created yet. The tables will be automatically created when the first submission is made through the dashboard contact form.

## API Endpoints

The site includes API endpoints for handling form submissions:

- `/api/contact` - Handles contact form submissions with validation and database storage

## Contact Forms

There are two different contact forms in the project:

1. **Discovery Page Form** (`/discovery`): Uses Formspree (external service) for handling submissions. This form is designed for booking discovery calls and is not connected to the local database.

2. **Dashboard Page Form** (`/dashboard`): Uses the local API endpoint (`/api/contact`) which connects to the SQLite database. This form stores submissions in the local `data/contacts.db` database.

The local database functionality is implemented in `src/lib/database.js` and provides:

- Contact form submission storage
- Contact retrieval and management
- Status tracking for leads

## Building and Running

**Development:**

```bash
npm run dev
```

**Building for Production:**

```bash
npm run build
```

**Preview Production Build:**

```bash
npm run preview
```

## Development Notes

This is the developer's first Astro project, so the codebase represents a learning journey. The project follows Astro's component-based architecture with a focus on performance and minimal JavaScript.

The site uses a modern color palette with electric blue gradients and responsive design patterns. All styling is done with pure CSS, including custom animations and 3D transformations for visual elements.

Contact form submissions can be stored in a SQLite database (`data/contacts.db`) through the dashboard form, while the discovery form uses Formspree. The local database functionality can be extended to integrate with email services in the future.

## Responsive Design

- Mobile: < 768px
- Tablet: 768px - 1920px
- Desktop: > 1920px

The site is optimized for 4K displays with enhanced spacing and sizing.

## Assets

All images and assets are stored in the `public/` directory, including:

- Logo variations
- Hero images with 3D effects
- Industry-specific visuals
- UI elements and icons

## Future Improvements

1. Email service integration for contact form notifications
2. Admin dashboard for managing contact submissions
3. Enhanced analytics tracking
4. Additional dynamic content management
