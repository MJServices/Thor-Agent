# Thor Agent - Technology Stack

## Core Technologies
- **Framework**: Next.js 14.2.33 with App Router
- **Runtime**: React 18 with TypeScript 5
- **Language**: TypeScript for type safety and developer experience

## UI & Styling
- **Component Library**: Radix UI primitives (@radix-ui/react-*)
  - Avatar, Dialog, Dropdown Menu, Slot, Toast components
- **Styling**: Tailwind CSS 3.3.0 with custom configuration
- **Animations**: Framer Motion 10.16.16 for smooth interactions
- **Icons**: Lucide React 0.294.0 for consistent iconography
- **Utilities**: 
  - `clsx` 2.0.0 for conditional classes
  - `tailwind-merge` 2.2.0 for class merging
  - `class-variance-authority` 0.7.0 for component variants

## Data Visualization
- **Charts**: ECharts 5.4.3 with React wrapper (echarts-for-react 3.0.2)
- **Responsive Design**: Custom hooks for mobile detection

## Development Tools
- **Linting**: ESLint 8 with Next.js configuration
- **Styling**: PostCSS 8 with Autoprefixer 10.0.1
- **Type Checking**: TypeScript with Next.js type definitions

## Build System
- **Bundler**: Next.js built-in Turbopack (development) / Webpack (production)
- **CSS Processing**: Tailwind CSS with PostCSS pipeline
- **Font Optimization**: Next.js font optimization with Geist font family

## Development Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Configuration Files
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `postcss.config.mjs` - PostCSS processing
- `components.json` - UI component configuration

## Dependencies Overview
- **Production**: 17 dependencies focused on UI, visualization, and framework
- **Development**: 8 dependencies for build tools and type definitions
- **Bundle Size**: Optimized with tree-shaking and Next.js optimizations