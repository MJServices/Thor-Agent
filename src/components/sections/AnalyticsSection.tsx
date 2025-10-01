"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { GlowingCards, GlowingCard } from '@/components/lightswind/glowing-cards'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { BarChart3, TrendingUp, Users, Clock, Target, Zap } from 'lucide-react'

const analyticsData = [
  {
    title: "Performance Metrics",
    description: "Real-time insights into your creative workflow",
    icon: BarChart3,
    stats: [
      { label: "Projects Created", value: "1,247", change: "+23%" },
      { label: "Time Saved", value: "156h", change: "+45%" },
      { label: "Quality Score", value: "94%", change: "+12%" }
    ],
    glowColor: "#ffd700"
  },
  {
    title: "User Engagement",
    description: "Track how users interact with your content",
    icon: Users,
    stats: [
      { label: "Active Users", value: "12.4K", change: "+18%" },
      { label: "Session Duration", value: "24m", change: "+8%" },
      { label: "Return Rate", value: "78%", change: "+15%" }
    ],
    glowColor: "#ffd700"
  },
  {
    title: "Productivity Insights",
    description: "Optimize your creative process with AI insights",
    icon: TrendingUp,
    stats: [
      { label: "Efficiency Gain", value: "340%", change: "+67%" },
      { label: "Error Reduction", value: "89%", change: "+23%" },
      { label: "Output Quality", value: "96%", change: "+11%" }
    ],
    glowColor: "#ffd700"
  }
]

export function AnalyticsSection() {
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
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-medium">Data-Driven Insights</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tight text-center"
          >
            Analytics &
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Performance
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Get deep insights into your creative workflow and optimize your productivity with AI-powered analytics
          </motion.p>
        </div>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {analyticsData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="w-full max-w-sm"
            >
              <GlowingCard 
                glowColor={item.glowColor}
                className="p-8 h-full group bg-purple-900/40 backdrop-blur-md border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                      <item.icon className="w-6 h-6 text-purple-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-100 group-hover:text-yellow-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-yellow-100/70 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-4">
                    {item.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center justify-between">
                        <span className="text-yellow-200/80 text-sm">{stat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-100 font-semibold">{stat.value}</span>
                          <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="pt-4 border-t border-yellow-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-100/70 text-sm">Overall Performance</span>
                      <span className="text-yellow-100 text-sm font-medium">
                        {Math.floor(Math.random() * 20) + 80}%
                      </span>
                    </div>
                    <div className="w-full bg-yellow-400/20 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}
                        transition={{ delay: index * 0.2, duration: 1 }}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </GlowingCard>
            </motion.div>
          ))}
        </div>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Target, label: "Accuracy Rate", value: "99.2%", color: "text-green-400" },
            { icon: Zap, label: "Processing Speed", value: "2.3s", color: "text-blue-400" },
            { icon: Clock, label: "Uptime", value: "99.9%", color: "text-yellow-400" },
            { icon: TrendingUp, label: "Growth Rate", value: "+127%", color: "text-yellow-400" }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-purple-900/30 backdrop-blur-md border border-yellow-400/20"
            >
              <metric.icon className={`w-8 h-8 mx-auto mb-3 ${metric.color} group-hover:scale-110 transition-transform duration-300`} />
              <div className="text-2xl font-bold text-yellow-100 mb-1 group-hover:text-yellow-300 transition-colors">{metric.value}</div>
              <div className="text-yellow-200/70 text-sm">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}