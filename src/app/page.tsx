"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import { ModernHero } from "@/components/sections/ModernHero";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { EnhancedBentoSection } from "@/components/sections/EnhancedBentoSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { GallerySection } from "@/components/sections/GallerySection";

import { PricingSection } from "@/components/sections/PricingSection";
import { AnalyticsSection } from "@/components/sections/AnalyticsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ModernFooter } from "@/components/sections/ModernFooter";
import { FloatingElements } from "@/components/ui/FloatingElements";
import { ToastProvider } from "@/components/ui/Toast";

export default function HomePage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden">
        {/* Floating Background Elements */}
        <FloatingElements />

        {/* Header */}
        <Header
          items={["Home", "Features", "Chat", "Pricing", "Contact"]}
          color="#ffd700"
        />

        {/* Main Content */}
        <motion.main
          id="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 pt-20"
          role="main"
        >
          <div id="home">
            <ModernHero />
          </div>

          <div id="features">
            <FeaturesSection />
          </div>

          <div>
            <TestimonialsSection />
          </div>

          <div id="gallery">
            <GallerySection />
          </div>

          <div id="pricing">
            <PricingSection />
          </div>

          <div>
            <AnalyticsSection />
          </div>

          <div>
            <FAQSection />
          </div>

          <div id="contact">
            <ContactSection />
          </div>
        </motion.main>

        {/* Footer */}
        <ModernFooter />
      </div>
    </ToastProvider>
  );
}
