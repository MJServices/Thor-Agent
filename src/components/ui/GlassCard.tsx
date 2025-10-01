"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'blur' | 'liquid'
  hover?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true 
}: GlassCardProps) {
  const variants = {
    default: "bg-white/10 backdrop-blur-md border border-white/20",
    blur: "bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30",
    liquid: "bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-cyan-500/20 backdrop-blur-2xl border border-white/20"
  }

  return (
    <motion.div
      className={cn(
        "rounded-2xl shadow-2xl",
        variants[variant],
        hover && "hover:bg-white/15 transition-all duration-300",
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}