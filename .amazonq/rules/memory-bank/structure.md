# Thor Agent - Project Structure

## Directory Organization

### Core Application (`src/`)
- **`app/`** - Next.js 14 App Router structure
  - `layout.tsx` - Root layout with global providers
  - `page.tsx` - Main dashboard page
  - `globals.css` - Global styles and Tailwind imports
  - `favicon.ico` - Application icon

### Component Architecture (`src/components/`)
- **`ui/`** - Base UI components (Radix UI + Tailwind)
  - `button.tsx`, `card.tsx`, `input.tsx`, `avatar.tsx` - Foundational elements
- **`layout/`** - Application structure components
  - `Layout.tsx` - Main layout wrapper
  - `Header.tsx` - Top navigation and branding
  - `Sidebar.tsx` - Navigation sidebar
- **`dashboard/`** - Dashboard-specific components
  - `Chart.tsx` - ECharts visualization wrapper
  - `MetricCard.tsx` - Key performance indicator display
  - `ProgressBar.tsx` - Progress visualization
- **`common/`** - Shared utility components
  - `Error.tsx` - Error boundary and display
  - `Loading.tsx` - Loading states and spinners

### Utilities & Configuration
- **`hooks/`** - Custom React hooks
  - `use-mobile.tsx` - Responsive breakpoint detection
- **`lib/`** - Utility functions
  - `utils.ts` - Common helper functions and class merging
- **`types/`** - TypeScript type definitions
  - `index.ts` - Shared type definitions

### Static Assets (`public/`)
- SVG icons: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`

## Architectural Patterns

### Component Hierarchy
```
Layout (Root)
├── Header (Navigation)
├── Sidebar (Menu)
└── Main Content
    ├── Dashboard Components
    ├── Chart Visualizations
    └── Metric Cards
```

### Design System
- **Base Layer**: Radix UI primitives for accessibility
- **Styling Layer**: Tailwind CSS with custom configuration
- **Animation Layer**: Framer Motion for interactions
- **State Management**: React hooks and context patterns

### File Naming Conventions
- Components: PascalCase (e.g., `MetricCard.tsx`)
- Hooks: kebab-case with `use-` prefix (e.g., `use-mobile.tsx`)
- Utilities: kebab-case (e.g., `utils.ts`)
- Types: kebab-case (e.g., `index.ts`)