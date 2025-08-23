# Bitcoin Improvement Proposals (BIP) Directory

## Overview

This is a comprehensive web application that serves as an educational resource for Bitcoin Improvement Proposals (BIPs). The application fetches BIP data from the official Bitcoin GitHub repository, parses the content, and presents it through a clean, searchable interface. Users can browse all BIPs, search by various criteria, view detailed BIP information, and explore author profiles. The application is designed to help users understand how Bitcoin evolves through community-driven technical specifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with support for BIP details, author profiles, and 404 pages
- **State Management**: TanStack Query (React Query) for server state management, caching, and data synchronization
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interface components
- **Styling**: Tailwind CSS with custom Bitcoin-themed color scheme and responsive design patterns
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for the REST API layer
- **Data Fetching**: GitHub API integration to fetch BIP files from the official Bitcoin repository
- **Content Processing**: Custom MediaWiki and Markdown parsers to extract BIP metadata and content
- **Caching Strategy**: In-memory storage with configurable cache duration (1 hour) to reduce API calls
- **API Design**: RESTful endpoints for BIPs, authors, and statistics with proper error handling

### Data Storage Solutions
- **Primary Storage**: Memory-based storage implementation for development and testing
- **Database Ready**: Drizzle ORM configured with PostgreSQL schema for production deployment
- **Caching**: Timestamp-based cache invalidation with automatic refresh from GitHub API

### Key Features
- **Search & Filtering**: Full-text search using Fuse.js with filtering by status, type, and sorting options
- **BIP Parsing**: Robust content extraction from MediaWiki and Markdown formats with metadata normalization
- **Author Analytics**: Automatic author extraction and contribution tracking across all BIPs
- **Statistics Dashboard**: Real-time statistics including total BIPs, status distribution, and contributor counts
- **Responsive Design**: Mobile-first approach with adaptive layouts and touch-friendly interfaces

### External Dependencies

- **GitHub API**: Primary data source for fetching BIP files from `https://api.github.com/repos/bitcoin/bips`
- **Neon Database**: PostgreSQL hosting service (configured but not actively used in current implementation)
- **Font Services**: Google Fonts for typography (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Replit Platform**: Development environment integration with custom error handling and banner scripts
- **Search Library**: Fuse.js for fuzzy search capabilities across BIP content
- **UI Dependencies**: Extensive Radix UI component library for accessible interface elements
- **Date Handling**: date-fns library for consistent date formatting and manipulation