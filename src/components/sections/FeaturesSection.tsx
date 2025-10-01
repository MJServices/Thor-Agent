"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { InteractiveCard } from '@/components/lightswind/interactive-card'
import { GlowingCards, GlowingCard } from '@/components/lightswind/glowing-cards'
import { BentoGrid, BentoCard } from '@/components/lightswind/bento-grid'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Brain, Palette, Layers, Zap, Users, Shield, Sparkles, Rocket, Target } from 'lucide-react'

const mainFeatures = [
  {
    icon: Brain,
    title: "AI Intelligence",
    description: "Advanced neural networks that understand your creative vision",
    color: "#ffd700"
  },
  {
    icon: Palette,
    title: "Creative Suite",
    description: "Professional tools for every creative workflow",
    color: "#7c3aed"
  },
  {
    icon: Zap,
    title: "Lightning Speed",
    description: "Optimized performance for seamless creation",
    color: "#ffd700"
  }
]

const bentoFeatures = [
  {
    title: "Multi-Layer Editing",
    description: "Complex compositions with advanced layer management",
    icon: Layers,
    className: "md:col-span-2"
  },
  {
    title: "Team Collaboration",
    description: "Real-time sync across your team",
    icon: Users,
    className: "md:col-span-1"
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade protection for your creative assets",
    icon: Shield,
    className: "md:col-span-1"
  },
  {
    title: "Smart Automation",
    description: "AI-powered workflows that adapt to your style and preferences",
    icon: Sparkles,
    className: "md:col-span-2"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-6 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/20 mb-8"
          >
            <Rocket className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-medium">Powerful Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tight text-center"
          >
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              <ScrollReveal 
                size="xl" 
                align="center" 
                enableBlur={false}
                staggerDelay={0.08}
                duration={0.8}
              >
                To Create Magic
              </ScrollReveal>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the comprehensive toolkit that transforms ideas into stunning reality
          </motion.p>
        </div>

        {/* Main Features - Interactive Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <InteractiveCard
                InteractiveColor={feature.color}
                tailwindBgClass="bg-purple-900/30 backdrop-blur-md"
                className="p-8 h-80 group transition-all duration-500"
              >
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 mb-6 group-hover:scale-110 transition-transform duration-300 golden-glow">
                    <feature.icon className="w-full h-full text-purple-900" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-yellow-100 mb-4 group-hover:text-yellow-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-yellow-100/70 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full golden-glow" />
                  </div>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>

        {/* Bento Grid Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <BentoGrid className="max-w-6xl mx-auto">
            {bentoFeatures.map((feature, index) => (
              <BentoCard
                key={feature.title}
                className={`${feature.className} bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-md transition-all duration-500 group`}
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 mb-6 group-hover:scale-110 transition-transform duration-300 golden-glow">
                    <feature.icon className="w-full h-full text-purple-900" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-yellow-100 mb-3 group-hover:text-yellow-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-yellow-100/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </BentoCard>
            ))}
          </BentoGrid>
        </motion.div>

        {/* Enhanced CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <GlowingCard 
            glowColor="#ffd700"
            className="p-12 max-w-4xl mx-auto bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-md golden-glow"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Target className="w-8 h-8 text-yellow-400" />
              <h3 className="text-3xl font-bold text-yellow-100">
                Ready to Unleash Your Creativity?
              </h3>
            </div>
            <p className="text-yellow-100/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already transforming their ideas into reality with Thor Agent's powerful AI-driven tools.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 px-12 py-4 rounded-full text-lg font-bold shadow-2xl golden-glow transition-all duration-300"
            >
              Start Creating Now
            </motion.button>
          </GlowingCard>
        </motion.div>
      </div>
    </section>
  )
}