# Thor Agent - Development Guidelines

## Code Quality Standards

### File Structure & Naming
- **Components**: PascalCase with `.tsx` extension (e.g., `MetricCard.tsx`, `Layout.tsx`)
- **Hooks**: kebab-case with `use-` prefix (e.g., `use-mobile.tsx`)
- **Types**: kebab-case for files, PascalCase for interfaces (e.g., `index.ts` containing `Metric`, `User`)
- **Utilities**: kebab-case (e.g., `utils.ts`)

### Import Organization
```typescript
// External libraries first
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Internal components and utilities
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Types last
import { Metric, ChartConfig } from '@/types'
```

### Component Architecture Patterns

#### 1. Client Component Declaration
- All interactive components start with `"use client"` directive
- Consistent across 100% of analyzed components

#### 2. Interface Definitions
```typescript
interface ComponentProps {
  // Required props first
  data: DataType
  onAction: (id: string) => void
  
  // Optional props with defaults
  className?: string
  variant?: 'default' | 'outline'
}
```

#### 3. Component Structure Template
```typescript
const ComponentName: React.FC<ComponentProps> = ({ 
  requiredProp, 
  optionalProp = defaultValue 
}) => {
  // State declarations
  const [state, setState] = useState(initialValue)
  
  // Effects and handlers
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // Animation variants (if using Framer Motion)
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
  
  return (
    <motion.div variants={variants}>
      {/* Component JSX */}
    </motion.div>
  )
}
```

## Animation & Interaction Standards

### Framer Motion Usage
- **Consistent Animation Patterns**: All components use similar motion variants
- **Staggered Animations**: Index-based delays (`delay: index * 0.1`)
- **Standard Transitions**: `duration: 0.5, ease: "easeOut"`
- **Hover Effects**: Scale and translate transforms (`scale: 1.02, y: -4`)

### Animation Variants Pattern
```typescript
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  }
}
```

## Styling & Design System

### Tailwind CSS Conventions
- **Semantic Color System**: Uses CSS variables (`hsl(var(--primary))`)
- **Consistent Spacing**: `p-6`, `space-x-3`, `gap-6` patterns
- **Responsive Design**: `md:grid-cols-2`, `lg:grid-cols-4` breakpoints
- **Custom Classes**: `hover-lift` for consistent hover effects

### Component Styling Pattern
```typescript
className={cn(
  "base-classes here",
  conditionalClass && "conditional-classes",
  className // Allow prop override
)}
```

### Color Usage Standards
- **Primary Actions**: `bg-primary text-primary-foreground`
- **Muted Text**: `text-muted-foreground`
- **Interactive Elements**: `hover:bg-accent hover:text-accent-foreground`
- **Borders**: `border-border`

## State Management Patterns

### Local State
- Use `useState` for component-specific state
- Initialize with appropriate default values
- Group related state when beneficial

### Effect Patterns
```typescript
// Cleanup pattern
useEffect(() => {
  const timer = setInterval(() => {
    // Timer logic
  }, interval)
  
  return () => clearInterval(timer)
}, [dependencies])

// Responsive behavior
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024)
  }
  
  handleResize()
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

## TypeScript Standards

### Interface Design
- **Comprehensive Types**: All data structures fully typed
- **Union Types**: Use for controlled variants (`'up' | 'down' | 'stable'`)
- **Optional Properties**: Mark with `?` when appropriate
- **Generic Interfaces**: For reusable components

### Type Organization
```typescript
// Base interfaces
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

// Component-specific interfaces
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut'
  data: ChartData
  options?: any
}
```

## Performance Optimization

### Dynamic Imports
```typescript
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })
```

### Loading States
- Implement loading states for async operations
- Use skeleton screens or loading indicators
- Stagger component loading with delays

### Animation Performance
- Use `transform` properties for animations
- Implement `will-change` optimizations via CSS
- Batch DOM updates when possible

## Accessibility Standards

### Component Accessibility
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation support
- Maintain color contrast ratios

### Interactive Elements
```typescript
<button
  onClick={handleClick}
  className="focus-visible:outline-none focus-visible:ring-2"
  aria-label="Descriptive label"
>
  Content
</button>
```

## Error Handling & Validation

### Component Error Boundaries
- Implement error boundaries for critical components
- Provide fallback UI for failed states
- Log errors appropriately

### Data Validation
- Validate props at component boundaries
- Handle undefined/null values gracefully
- Provide meaningful error messages