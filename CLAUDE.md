# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BIAN POC is a Next.js 14 application implementing Clean Architecture to explore and manage BIAN (Banking Industry Architecture Network) capabilities for Banorte. The project uses TypeScript, Material-UI, and follows strict architectural patterns.

## Development Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Node.js >= 18.0.0 and yarn >= 1.22.0 required
```

## Architecture

The project implements **Clean Architecture** with clear separation of concerns:

### Core Layer (`src/core/`)
- **Domain**: Business entities, value objects, and interfaces (ports)
  - `entities/`: Core business entities (Capability, SubCapability, Functionality, Project)
  - `value-objects/`: Immutable value objects (CapabilityId, CategoryType, BianVersion)
  - `ports/`: Repository interfaces and contracts
- **Application**: Use cases and business logic
  - `use-cases/`: Application services organized by feature (search, navigation, project)

### Infrastructure Layer (`src/infrastructure/`)
- Repository implementations
- External service integrations
- Data access and persistence

### Presentation Layer (`src/presentation/` and `src/app/`)
- React components and UI logic
- Next.js pages using App Router
- Custom hooks for state management

### Shared (`src/shared/`)
- Common types, constants, and utilities

## Key Technologies & Setup

- **Framework**: Next.js 14.0.4 with App Router
- **UI Library**: Material-UI v5 with Emotion styling
- **Styling**: Tailwind CSS + MUI custom theme (Banorte branding)
- **TypeScript**: Strict mode enabled with path aliases
- **State Management**: React Hooks + Context API
- **AI Integration**: OpenAI API
- **File Processing**: PDF parsing, CSV export, file uploads

## TypeScript Configuration

Path aliases are configured for clean imports:
- `@/*` → `./src/*`
- `@/core/*` → `./src/core/*`
- `@/infrastructure/*` → `./src/infrastructure/*`
- `@/presentation/*` → `./src/presentation/*`
- `@/shared/*` → `./src/shared/*`

## BIAN Framework Context

The application manages BIAN capabilities across these categories:
- **CE**: Customer Engagement
- **PD**: Product Development
- **OP**: Operations
- **RM**: Risk Management
- **FM**: Financial Management
- **CM**: Compliance Management
- **IT**: Information Technology

## Development Patterns

- **Entity Pattern**: Business entities with behavior methods (see `Capability.ts`)
- **Repository Pattern**: Interfaces in domain, implementations in infrastructure
- **Use Case Pattern**: Each feature has dedicated use case classes
- **Value Objects**: Immutable objects for domain concepts
- **Clean Architecture**: Dependency inversion with ports/adapters

## Code Conventions

- **Naming**: camelCase for variables, PascalCase for components and classes
- **Imports**: Use absolute imports with configured path aliases
- **Types**: Interfaces for object shapes, types for unions
- **Architecture**: Respect layer boundaries - domain should not depend on infrastructure

## Current Implementation Status

✅ **Completed**: Clean Architecture foundation, domain entities, basic use cases, MUI theming, repository pattern
🔄 **In Progress**: Advanced search, project management, export functionality, OpenAI integration
🎯 **Planned**: Authentication, persistent database, real-time collaboration, REST API