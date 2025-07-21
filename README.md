# Meet AI

AI-powered video calling platform with specialized AI agents for tutoring, coaching, and professional development.

## Features

- Real-time video calls with AI agents
- Role-specific AI companions (tutors, coaches, mentors)
- Automatic meeting transcription and analysis
- Multi-device responsive design
- SaaS subscription management

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Shadcn UI
- **Backend**: tRPC, TanStack Query
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **AI**: OpenAI Realtime API
- **Video**: Stream SDK
- **Auth**: Better Auth
- **Payments**: Polar

## Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Stream API credentials

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meet-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure required environment variables:
   ```env
   DATABASE_URL=your_postgres_url
   OPENAI_API_KEY=your_openai_key
   STREAM_API_KEY=your_stream_key
   STREAM_SECRET=your_stream_secret
   BETTER_AUTH_SECRET=your_auth_secret
   POLAR_ACCESS_TOKEN=your_polar_token
   ```

4. **Database setup**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run db:push      # Push database schema
npm run db:studio    # Open Drizzle Studio
```

## Project Structure

```
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities and configurations
│   ├── server/         # tRPC server and database
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── drizzle/           # Database migrations
```

## API Endpoints

- `/api/trpc/*` - tRPC API routes
- `/api/auth/*` - Authentication endpoints
- `/api/webhooks/*` - Webhook handlers

## Development

### Adding New AI Agents

1. Create agent configuration in `src/lib/ai-agents/`
2. Add agent type to `src/types/agents.ts`
3. Update agent selector component

### Database Changes

```bash
npm run db:generate    # Generate migration
npm run db:push        # Apply changes
```

### Testing AI Features

Use the built-in test suite or connect to OpenAI Realtime API playground for debugging.

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```
