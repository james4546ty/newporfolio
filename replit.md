# Personal Portfolio Website - Atharv Bhosale

## Overview

This is a modern, responsive personal portfolio website for a software developer built using React with TypeScript, Express.js backend, and PostgreSQL database. The application showcases a dark-themed, Apple-inspired design with smooth animations and professional presentation of skills, projects, certifications, and contact information.

The portfolio serves as a comprehensive showcase of technical abilities, featuring sections for about information, project galleries, professional certifications, hackathon participation, and an integrated contact form with real-time form processing.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming
- **UI Components**: Shadcn/ui component library providing accessible, customizable components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express session handling with PostgreSQL storage
- **Development**: Hot reload with middleware integration for seamless development experience

### Deployment Strategy
- **Environment**: Replit with autoscale deployment target
- **Database**: PostgreSQL 16 with Neon serverless driver for cloud compatibility
- **Build Process**: Vite for client bundling, esbuild for server bundling
- **Static Assets**: Served through Express with development/production mode switching

## Key Components

### User Interface Components
- **Navigation**: Fixed navigation bar with smooth scroll-to-section functionality and mobile responsiveness
- **Hero Section**: Animated hero section with gradient text effects and call-to-action buttons
- **About Section**: Skills showcase with animated skill tags and personal information display
- **Projects Gallery**: Interactive project cards with hover effects, technology tags, and external links
- **Certifications**: Professional certification display with company branding and verification links
- **Contact Form**: Integrated Formspree contact form with real-time validation and success/error handling

### Backend Components
- **Storage Interface**: Abstracted storage layer with in-memory implementation for user management
- **Route Registration**: Modular route handling system with API prefix organization
- **Middleware**: Request logging, error handling, and development tooling integration
- **Vite Integration**: Development server integration with HMR and asset serving

## Data Flow

### Client-Side Data Flow
1. **Component Initialization**: React components mount with initial state and effect hooks
2. **User Interactions**: Form submissions, navigation clicks, and scroll events trigger state updates
3. **API Communication**: TanStack Query manages HTTP requests with caching and error handling
4. **State Updates**: Component re-renders based on prop changes and hook dependencies
5. **Animation Triggers**: Intersection Observer API drives scroll-based animations

### Server-Side Data Flow
1. **Request Processing**: Express middleware handles incoming HTTP requests
2. **Route Matching**: Request routing through registered API endpoints
3. **Storage Operations**: Database operations through Drizzle ORM abstraction layer
4. **Response Generation**: JSON responses with appropriate HTTP status codes
5. **Error Handling**: Centralized error handling with status code mapping

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **drizzle-orm**: Type-safe database operations
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Comprehensive accessibility-focused UI primitives
- **class-variance-authority**: Utility for component variant management
- **clsx & tailwind-merge**: CSS class composition utilities
- **lucide-react**: Modern icon library

### Development Dependencies
- **typescript**: Static type checking
- **vite**: Build tool and development server
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development

### External Services
- **Formspree**: Third-party contact form processing service
- **Google Fonts**: Web font delivery (Inter font family)
- **Unsplash**: Stock photography for project imagery

## Deployment Strategy

### Development Environment
- **Local Development**: Vite development server with HMR on port 5000
- **Database**: Local PostgreSQL instance with Drizzle migrations
- **Environment Variables**: DATABASE_URL for database connection configuration
- **Hot Reload**: Full-stack hot reload with client and server restart capabilities

### Production Environment
- **Build Process**: Multi-stage build with client and server bundling
- **Asset Optimization**: Vite handles asset optimization and code splitting
- **Database Migration**: Drizzle Kit handles schema synchronization
- **Deployment Target**: Replit autoscale with containerized deployment

### Configuration Management
- **Environment Detection**: NODE_ENV-based configuration switching
- **Port Configuration**: Configurable port binding with external port mapping
- **Database Configuration**: URL-based database connection with credential management
- **CORS Handling**: Development vs production CORS policy configuration

## Changelog
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.