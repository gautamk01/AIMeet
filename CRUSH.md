# Codebase Guidelines for Agentic Coding

## Essential Commands
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Typecheck**: `tsc --noEmit`
- **Test**: Use `npm run test` (add test scripts as needed)
- **Single Test**: `npm test -- <test-file-path>`
- **DB Push**: `npm run db:push`
- **DB Studio**: `npm run db:studio`

## Code Style
- **Language**: TypeScript with strict mode enabled
- **Framework**: Next.js 15+ with App Router
- **UI Library**: Tailwind CSS with shadcn-inspired components
- **State Management**: React hooks and TanStack Query for data fetching
- **Backend**: tRPC for API routes
- **Database**: Drizzle ORM with Neon Postgres serverless
- **Authentication**: Better Auth

## Naming Conventions
- Files: kebab-case
- Components: PascalCase (.tsx)
- Functions/Variables: camelCase
- Types/Interfaces: PascalCase with 'T' prefix optional
- Constants: UPPER_SNAKE_CASE

## Imports
- Absolute imports using '@/' alias
- Explicit imports over namespace imports
- Group imports: External libraries, then internal modules

## Error Handling
- Try-catch blocks for async operations
- Error boundaries for React components
- Zod for validation
- Toast notifications with sonner for user-facing errors

## Component Structure
- Use 'ui' directory for reusable components
- Use 'views' for page-specific components
- Prefer compound components pattern
- Use class-variance-authority (cva) for styling variants

## Database Schema
- Define in src/db/schema.ts using Drizzle ORM syntax
- Use descriptive table and column names
- Include relations where appropriate