"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { WordReveal } from '@/components/ui/WordReveal'
import { TypewriterText } from '@/components/ui/TypewriterText'
import { InteractiveCard } from '@/components/lightswind/interactive-card'
import { Check, Star, Zap } from 'lucide-react'

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started with AI creation",
    features: [
      "5 AI generations per day",
      "Basic editing tools",
      "Community gallery access",
      "Standard resolution exports",
      "Email support"
    ],
    popular: false,
    glowColor: "#ffd700"
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious creators and professionals",
    features: [
      "Unlimited AI generations",
      "Advanced editing suite",
      "Priority processing",
      "4K resolution exports",
      "Commercial license",
      "Priority support",
      "Custom styles & models"
    ],
    popular: true,
    glowColor: "#ffd700"
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and large organizations",
    features: [
      "Everything in Pro",
      "Team collaboration tools",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Advanced analytics",
      "White-label options"
    ],
    popular: false,
    glowColor: "#ffd700"
  }
]

export function PricingSection() {
  return (
    <section className="py-6 px-6 relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/20 mb-8"
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-medium">Pricing Plans</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tight text-center"
          >
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Creative Journey
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Flexible pricing plans designed to grow with your creative needs
          </motion.p>
        </div>

        {/* Enhanced Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative w-full max-w-sm"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-purple-900 px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg golden-glow">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <InteractiveCard
                InteractiveColor="#ffd700"
                tailwindBgClass="bg-purple-900/40 backdrop-blur-md"
                className={`p-6 md:p-8 h-full group transition-all duration-500 ${plan.popular ? 'ring-2 ring-yellow-400/50' : ''}`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-yellow-100 mb-2 group-hover:text-yellow-300 transition-colors">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-yellow-100 group-hover:text-yellow-300 transition-colors">{plan.price}</span>
                    {plan.price !== "Free" && (
                      <span className="text-yellow-100/60 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-yellow-100/70">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Check className="w-3 h-3 text-purple-900" />
                      </div>
                      <span className="text-yellow-100/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 shadow-2xl golden-glow'
                      : 'bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30 border border-yellow-400/30'
                  }`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </motion.button>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <InteractiveCard
            InteractiveColor="#ffd700"
            tailwindBgClass="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-md"
            className="p-6 md:p-8 max-w-4xl mx-auto golden-glow"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-100">30-Day Money Back Guarantee</h3>
            </div>
            <p className="text-yellow-100/70 text-lg">
              Try Thor Agent risk-free. If you're not completely satisfied, we'll refund your money within 30 days.
            </p>
          </InteractiveCard>
        </motion.div>
      </div>
    </section>
  )
}