"use client"

import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger'
  delay?: number
  duration?: number
  staggerDelay?: number
  once?: boolean
}

const animations = {
  fadeUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  stagger: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  }
}

export function AnimatedSection({
  children,
  className,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  staggerDelay = 0.1,
  once = true
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })

  const animationConfig = animations[animation]

  return (
    <motion.div
      ref={ref}
      initial={animationConfig.initial}
      animate={isInView ? animationConfig.animate : animationConfig.initial}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        staggerChildren: animation === 'stagger' ? staggerDelay : undefined
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// Specialized animated components
export function AnimatedCard({ 
  children, 
  className, 
  index = 0,
  ...props 
}: AnimatedSectionProps & { index?: number }) {
  return (
    <AnimatedSection
      animation="fadeUp"
      delay={index * 0.1}
      className={cn(
        "group transition-all duration-500 hover:scale-105",
        className
      )}
      {...props}
    >
      {children}
    </AnimatedSection>
  )
}

export function AnimatedText({ 
  children, 
  className,
  variant = 'fadeUp',
  ...props 
}: AnimatedSectionProps & { variant?: 'fadeUp' | 'slideLeft' | 'slideRight' }) {
  return (
    <AnimatedSection
      animation={variant}
      duration={0.8}
      className={cn("text-center", className)}
      {...props}
    >
      {children}
    </AnimatedSection>
  )
}

export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.1,
  ...props 
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            initial: { opacity: 0, y: 40 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Glass morphism specific animations
export function GlassReveal({ 
  children, 
  className,
  delay = 0,
  ...props 
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        scale: 0.9,
        backdropFilter: "blur(0px)",
        background: "rgba(45, 27, 78, 0)"
      }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1,
        backdropFilter: "blur(20px)",
        background: "rgba(45, 27, 78, 0.25)"
      } : {}}
      transition={{
        duration: 1,
        delay,
        ease: "easeOut"
      }}
      className={cn(
        "border border-yellow-400/20 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Floating animation for glass elements
export function FloatingElement({ 
  children, 
  className,
  intensity = 'medium',
  ...props 
}: AnimatedSectionProps & { intensity?: 'low' | 'medium' | 'high' }) {
  const floatIntensity = {
    low: { y: [-5, 5, -5], duration: 4 },
    medium: { y: [-10, 10, -10], duration: 6 },
    high: { y: [-15, 15, -15], duration: 8 }
  }

  const config = floatIntensity[intensity]

  return (
    <motion.div
      animate={{
        y: config.y,
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}