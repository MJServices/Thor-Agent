"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassMorphismProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'card' | 'button' | 'header'
  glowIntensity?: 'low' | 'medium' | 'high'
  animated?: boolean
}

const variants = {
  default: "bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-md border border-yellow-400/20",
  card: "bg-gradient-to-br from-purple-900/30 to-purple-800/15 backdrop-blur-lg border border-yellow-400/15 hover:border-yellow-400/30",
  button: "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 font-bold",
  header: "bg-gradient-to-r from-purple-900/50 to-purple-800/30 backdrop-blur-xl border-b border-yellow-400/20"
}

const glowStyles = {
  low: "shadow-lg shadow-yellow-400/10",
  medium: "shadow-xl shadow-yellow-400/20 golden-glow",
  high: "shadow-2xl shadow-yellow-400/30 golden-glow"
}

export function GlassMorphism({ 
  children, 
  className, 
  variant = 'default', 
  glowIntensity = 'medium',
  animated = true 
}: GlassMorphismProps) {
  const Component = animated ? motion.div : 'div'
  
  const animationProps = animated ? {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {}

  return (
    <Component
      className={cn(
        variants[variant],
        glowStyles[glowIntensity],
        "transition-all duration-500",
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  )
}

// Specialized components for common use cases
export function GlassCard({ children, className, ...props }: Omit<GlassMorphismProps, 'variant'>) {
  return (
    <GlassMorphism variant="card" className={cn("rounded-2xl p-6", className)} {...props}>
      {children}
    </GlassMorphism>
  )
}

export function GlassButton({ children, className, ...props }: Omit<GlassMorphismProps, 'variant'>) {
  return (
    <GlassMorphism variant="button" className={cn("px-8 py-4 rounded-full", className)} {...props}>
      {children}
    </GlassMorphism>
  )
}

export function GlassHeader({ children, className, ...props }: Omit<GlassMorphismProps, 'variant'>) {
  return (
    <GlassMorphism variant="header" className={cn("px-6 py-4", className)} {...props}>
      {children}
    </GlassMorphism>
  )
}