"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  as?: 'div' | 'section' | 'main' | 'article'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
}

const paddingClasses = {
  none: '',
  sm: 'px-4 py-8 md:px-6 md:py-12',
  md: 'px-6 py-12 md:px-8 md:py-16',
  lg: 'px-6 py-16 md:px-8 md:py-24',
  xl: 'px-6 py-20 md:px-8 md:py-32',
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = '7xl',
  padding = 'lg',
  animated = false,
  as = 'div'
}: ResponsiveContainerProps) {
  const Component = animated ? motion[as] : as
  
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, margin: "-100px" }
  } : {}

  return (
    <Component
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  )
}

// Specialized containers for common layouts
export function SectionContainer({ children, className, ...props }: Omit<ResponsiveContainerProps, 'as'>) {
  return (
    <ResponsiveContainer 
      as="section" 
      className={cn("relative", className)} 
      {...props}
    >
      {children}
    </ResponsiveContainer>
  )
}

export function ContentContainer({ children, className, ...props }: Omit<ResponsiveContainerProps, 'as' | 'maxWidth'>) {
  return (
    <ResponsiveContainer 
      as="div" 
      maxWidth="4xl"
      className={cn("prose prose-invert max-w-none", className)} 
      {...props}
    >
      {children}
    </ResponsiveContainer>
  )
}

export function HeroContainer({ children, className, ...props }: Omit<ResponsiveContainerProps, 'as' | 'padding'>) {
  return (
    <ResponsiveContainer 
      as="section" 
      padding="xl"
      className={cn("min-h-screen flex items-center justify-center", className)} 
      {...props}
    >
      {children}
    </ResponsiveContainer>
  )
}