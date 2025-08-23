# BIP Explorer

A comprehensive educational directory for Bitcoin Improvement Proposals (BIPs) featuring authentic GitHub data, sophisticated search capabilities, and intelligent explanations.

## Features

- **Comprehensive BIP Database**: Real-time data from Bitcoin's official GitHub repository
- **Advanced Search & Filtering**: Powerful search with filters by status, type, and author
- **Author Profiles**: Explore Bitcoin developers and their contributions
- **Intelligent ELI20 Explanations**: AI-powered summaries for technical concepts
- **Dark Mode Support**: Beautiful dark theme as default
- **Responsive Design**: Optimized for all devices
- **SEO Optimized**: Full meta tags, structured data, and search engine optimization

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI with custom design system
- **Search**: Fuse.js for advanced search capabilities
- **Database**: PostgreSQL with Drizzle ORM (development ready)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Add your OpenAI API key for ELI20 explanations
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Use these build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `client/dist`
   - **Root directory**: `/`
3. Add environment variables in Cloudflare Pages dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key

### Environment Variables

- `OPENAI_API_KEY`: Required for generating ELI20 explanations
- `NODE_ENV`: Set to "production" for production builds

## Project Structure

```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utility libraries
│   └── public/       # Static assets
├── server/           # Express.js backend
├── shared/           # Shared TypeScript schemas
└── README.md
```

## License

MIT License - feel free to use this project for educational purposes.