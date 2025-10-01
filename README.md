# Thor Agent - AI Creative Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Thor Agent is a cutting-edge AI-powered creative platform that transforms imagination into stunning visual reality. Built with modern web technologies, it offers an immersive experience for artists, designers, and innovators.

## Features

- 🎨 **AI-Powered Creation**: Advanced neural networks that understand your creative vision
- ⚡ **Lightning Fast Performance**: Optimized for seamless creative workflows
- 🛡️ **Enterprise-Grade Security**: Bank-level protection for your creative assets
- 👥 **Team Collaboration**: Real-time sync across your creative team
- 📱 **Fully Responsive**: Works beautifully on all devices
- 🌟 **Stunning UI/UX**: Modern glassmorphism design with fluid animations

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
- **UI Components**: Custom lightswind component library
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT
- **AI Providers**: Groq, Hugging Face, Transformers.js
- **Vector Storage**: ChromaDB
- **Deployment**: [Vercel](https://vercel.com/)

## Prerequisites

- Node.js 18+ required
- MongoDB database (local or Atlas)
- At least one AI provider API key (Groq or Hugging Face)

## Environment Setup

First, copy the example environment file:

```bash
# Copy the example file to create your local environment file

cp .env.local.example .env.local
```

Then, fill in the required variables in `.env.local`:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret for JWT tokens
- `ADMIN_EMAIL`: The email address for the admin user
- Add at least one AI provider key (either `GROQ_API_KEY` or `HUGGINGFACE_API_KEY`)
- Optional: Add `STABILITY_API_KEY` for image generation
- Optional: Configure vector database (Pinecone/Qdrant) for RAG

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```
src/
├── app/                 # Next.js app directory with pages
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication routes
│   │   ├── chat/        # Chat API endpoint
│   │   ├── image/       # Image generation API endpoint
│   │   └── admin/       # Admin API endpoints
│   ├── admin/           # Admin dashboard
│   ├── chat/            # Chat page
│   ├── contact/         # Contact page
│   ├── features/        # Features page
│   ├── gallery/         # Gallery page
│   ├── pricing/         # Pricing page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable UI components
│   ├── layout/          # Header and navigation components
│   ├── lightswind/      # Custom component library
│   ├── sections/        # Page section components
│   └── ui/              # Generic UI components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and theme configuration
│   ├── ai-providers.ts  # AI provider integrations
│   ├── image-providers.ts # Image generation providers
│   ├── embeddings.ts    # Text embedding utilities
│   ├── vector-db.ts     # Vector database abstraction
│   ├── validation.ts    # Input validation
│   ├── rate-limit.ts    # Rate limiting utilities
│   ├── admin-auth.ts    # Admin authentication
│   ├── auth.ts          # User authentication
│   ├── mongodb.ts       # Database connection
│   ├── theme.ts         # Theme configuration
│   └── utils.ts         # General utilities
├── models/              # MongoDB schemas
│   ├── User.ts          # User model
│   ├── Chat.ts          # Chat model
│   ├── Image.ts         # Image model
│   ├── UsageLog.ts      # Usage logging model
│   └── Settings.ts      # Application settings model
└── types/               # TypeScript type definitions
```

## Key Components

- **Header**: Animated navigation with active state indicator
- **ModernHero**: Interactive hero section with plasma globe background
- **FeaturesSection**: Showcases platform capabilities with interactive cards
- **EnhancedBentoSection**: Displays features in a responsive grid layout
- **ContactSection**: Contact methods and validated form with toast notifications
- **MobileNav**: Responsive mobile navigation with animated menu

## API Endpoints

### Chat Endpoint

- **Method**: POST
- **Path**: `/api/chat`
- **Authentication**: Required (JWT cookie)
- **Request body**: `{ messages: [{ role, content }] }`
- **Response**: `{ success, data: { response, model } }`

### Image Generation Endpoint

- **Method**: POST
- **Path**: `/api/image`
- **Authentication**: Required
- **Request body**: `{ prompt, width?, height? }`
- **Response**: `{ success, data: { imageBase64, provider } }`

### Admin Endpoints

- **Stats**: `GET /api/admin/stats` - Get system statistics
- **Users**: `GET /api/admin/users` - List users, `PATCH /api/admin/users` - Update user, `DELETE /api/admin/users` - Delete user
- **Chats**: `GET /api/admin/chats` - List chat histories
- **Settings**: `GET /api/admin/settings` - Get settings, `POST /api/admin/settings` - Update settings

## Demo Scripts

Test the API endpoints with these curl commands:

```bash
# Login first to get JWT cookie
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"messages":[{"role":"user","content":"Hello, how are you?"}]}'

# Test image generation
curl -X POST http://localhost:3000/api/image \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"prompt":"A beautiful sunset over mountains"}'
```

## Admin Dashboard

Access the admin dashboard at `/admin` (requires admin privileges). The first user with the email specified in `ADMIN_EMAIL` is automatically granted admin access.

Features include:

- User management (promote/demote admins, delete users)
- Chat history viewing
- API usage statistics
- System settings configuration

## AI Providers

The platform supports multiple AI providers with automatic fallback:

1. **Groq** (primary) - Fast inference with Mixtral models
2. **Hugging Face** (secondary) - Access to thousands of models
3. **Local models** (fallback) - Transformers.js for offline operation

Rate limits and fallback behavior ensure consistent performance even when primary providers are unavailable.

## RAG Configuration

Enable Retrieval-Augmented Generation (RAG) in admin settings to enhance AI responses with contextual information.

Vector database options:

- **ChromaDB** (default) - Local or remote vector storage
- **Pinecone** (optional) - Cloud-based vector database
- **Qdrant** (optional) - High-performance vector search engine

Document ingestion for RAG is managed through the admin interface.

## Available Scripts

- `dev` - Runs the app in development mode
- `build` - Builds the app for production
- `start` - Runs the built app in production mode
- `lint` - Runs the linter to check for code issues

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
