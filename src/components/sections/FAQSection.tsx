"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GlowingCard } from '@/components/lightswind/glowing-cards'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: "What is Thor Agent and how does it work?",
    answer: "Thor Agent is an AI-powered creative platform that helps artists, designers, and creators generate stunning visuals from text prompts. Our advanced neural networks understand context and style to produce professional-quality content in seconds."
  },
  {
    question: "Can I use Thor Agent for commercial projects?",
    answer: "Yes! With our Pro and Enterprise plans, you get full commercial licensing rights. You can use all generated content for client work, marketing materials, and any commercial purposes without restrictions."
  },
  {
    question: "How does the AI understand my creative vision?",
    answer: "Our AI is trained on millions of high-quality images and understands artistic styles, composition, lighting, and color theory. You can guide it with detailed prompts, style references, and even upload inspiration images."
  },
  {
    question: "Is there a limit to how many images I can generate?",
    answer: "Free users get 5 generations per day. Pro users enjoy unlimited generations, while Enterprise users get additional features like priority processing and custom model training."
  },
  {
    question: "Can I collaborate with my team on Thor Agent?",
    answer: "Absolutely! Our collaboration features allow real-time sharing, commenting, and version control. Team members can work together seamlessly, with role-based permissions and project management tools."
  },
  {
    question: "What file formats and resolutions are supported?",
    answer: "We support all major formats including PNG, JPG, SVG, and PDF. Resolutions range from web-optimized 512px to print-ready 4K and beyond. Pro users can also export in RAW formats for maximum editing flexibility."
  },
  {
    question: "How secure is my data and generated content?",
    answer: "Security is our top priority. All data is encrypted in transit and at rest. We use enterprise-grade security measures, and you retain full ownership of your generated content. We never use your data to train our models without explicit consent."
  },
  {
    question: "Do you offer API access for developers?",
    answer: "Yes! Our RESTful API allows developers to integrate Thor Agent's capabilities into their own applications. Enterprise users get full API access with comprehensive documentation and dedicated support."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/20 mb-8"
          >
            <HelpCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-medium">Got Questions?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tight text-center"
          >
            Frequently Asked
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to know about Thor Agent
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlowingCard 
                glowColor="#ffd700"
                className="bg-purple-900/40 backdrop-blur-md border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between group"
                >
                  <h3 className="text-lg font-semibold text-yellow-100 group-hover:text-yellow-300 transition-colors">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-yellow-100/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlowingCard>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <GlowingCard 
            glowColor="#ffd700"
            className="p-12 max-w-4xl mx-auto bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-md golden-glow"
          >
            <h3 className="text-2xl font-bold text-yellow-100 mb-4">
              Still have questions?
            </h3>
            <p className="text-yellow-100/80 mb-6">
              Our support team is here to help you get the most out of Thor Agent
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 px-8 py-3 rounded-full font-bold shadow-2xl golden-glow transition-all duration-300"
            >
              Contact Support
            </motion.button>
          </GlowingCard>
        </motion.div>
      </div>
    </section>
  )
}