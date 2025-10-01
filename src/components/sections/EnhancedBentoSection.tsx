"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { BentoGrid } from '@/components/lightswind/BentoGrid'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Brain, Palette, Zap, Shield, Users, Layers, Sparkles, Rocket } from 'lucide-react'

const bentoCards = [
  {
    icon: Brain,
    title: "AI Intelligence",
    description: "Advanced neural networks that understand your creative vision",
    className: "bg-purple-900/40 border-yellow-400/20 hover:border-yellow-400/40",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-purple-800/20" />
    )
  },
  {
    icon: Palette,
    title: "Creative Suite",
    description: "Professional tools for every creative workflow",
    className: "bg-purple-900/40 border-yellow-400/20 hover:border-yellow-400/40",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-purple-800/20" />
    )
  },
  {
    icon: Zap,
    title: "Lightning Speed",
    description: "Optimized performance for seamless creation",
    className: "bg-purple-900/40 border-yellow-400/20 hover:border-yellow-400/40",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-purple-800/20" />
    )
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security for your creative assets",
    className: "bg-purple-900/40 border-yellow-400/20 hover:border-yellow-400/40",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-purple-800/20" />
    )
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time collaboration with your creative team",
    className: "bg-purple-900/40 border-yellow-400/20 hover:border-yellow-400/40",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-purple-800/20" />
    )
  },
  {
    icon: Layers,
    title: "Advanced Layers",
    description: "Complex compositions with intelligent layer management",
    className: "bg-purple-900/40 border-yellow-400/20 hover:border-yellow-400/40",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-purple-800/20" />
    )
  }
]

export function EnhancedBentoSection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/20 mb-8"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-medium">Powerful Features</span>
          </motion.div>

          <ScrollReveal size="xl" align="center" variant="default">
            Everything You Need to Create
          </ScrollReveal>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the comprehensive toolkit that empowers creators to bring their wildest imaginations to life
          </motion.p>
        </div>

        {/* Enhanced BentoGrid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <BentoGrid 
            cards={bentoCards}
            columns={3}
            className="backdrop-blur-sm"
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 px-12 py-4 rounded-full text-lg font-bold shadow-2xl golden-glow transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              Explore All Features
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}