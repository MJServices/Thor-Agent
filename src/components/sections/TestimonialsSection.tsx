"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ReviewCard } from '@/components/ui/review-card'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GlowingCard } from '@/components/lightswind/glowing-cards'
import { Star, Quote, TrendingUp, Users, Award, Heart } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    Review: "Thor Agent has revolutionized our creative workflow. The AI-powered tools are incredibly intuitive and have cut our design time by 60%. It's like having a senior designer available 24/7.",
    author: "Sarah Chen - Creative Director @ Pixel Studios"
  },
  {
    id: 2,
    Review: "As a freelance artist, Thor Agent gives me the power of an entire creative team. The quality of AI-generated content is simply outstanding.",
    author: "Marcus Rodriguez - Digital Artist @ Freelancer"
  },
  {
    id: 3,
    Review: "We've been using Thor Agent for our marketing campaigns. The results speak for themselves - 300% increase in engagement rates.",
    author: "Emily Watson - Marketing Manager @ TechFlow Inc"
  }
]

const stats = [
  { label: "Happy Creators", value: "50K+", icon: Users },
  { label: "Projects Created", value: "2M+", icon: TrendingUp },
  { label: "Time Saved", value: "10M+ hrs", icon: Award },
  { label: "Satisfaction Rate", value: "99%", icon: Heart }
]

function ShuffleCards() {
  const [positions, setPositions] = useState(["front", "middle", "back"]);

  const handleShuffle = () => {
    const newPositions = [...positions];
    newPositions.unshift(newPositions.pop() as string);
    setPositions(newPositions);
  };

  return (
    <div className="grid place-content-center overflow-hidden px-4 md:px-8 py-16 md:py-24 min-h-[400px] md:min-h-[600px] h-full w-full">
      <div className="relative -ml-[60px] md:-ml-[100px] lg:-ml-[175px] h-[250px] md:h-[450px] w-[200px] md:w-[350px]">
        {testimonials.map((testimonial, index) => (
          <ReviewCard
            key={testimonial.id}
            {...testimonial}
            handleShuffle={handleShuffle}
            position={positions[index]}
          />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-6 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/20 mb-8"
          >
            <Quote className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-medium">Trusted by Creators</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tight text-center"
          >
            <ScrollReveal 
              size="xl" 
              align="center" 
              enableBlur={true}
              staggerDelay={0.1}
              duration={1.0}
            >
              Loved by Creators
            </ScrollReveal>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Worldwide
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of satisfied creators who have transformed their workflow with Thor Agent
          </motion.p>
        </div>

        <ShuffleCards />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 md:mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <GlowingCard 
                glowColor="#ffd700"
                className="p-8 bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-md rounded-2xl overflow-hidden group transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 golden-glow">
                  <stat.icon className="w-full h-full text-purple-900" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-100 mb-2 group-hover:text-yellow-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-yellow-200/70 font-medium">{stat.label}</div>
              </GlowingCard>
            </motion.div>
          ))}
          </motion.div>
        </div>
    </section>
  )
}