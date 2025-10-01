"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveCard } from "@/components/lightswind/interactive-card";
import {
  GlowingCards,
  GlowingCard,
} from "@/components/lightswind/glowing-cards";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import PlasmaGlobe from "@/components/ui/plasma-globe";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Palette,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function ModernHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (window.innerWidth / 2 - e.clientX) * 0.02,
        y: (window.innerHeight / 2 - e.clientY) * 0.02,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStartCreating = () => {
    if (loading) return;

    if (user) {
      router.push("/chat");
    } else {
      router.push("/signin");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-8 pb-20 relative overflow-hidden">
      {/* <FloatingParticles count={30} /> */}

      {/* Plasma Globe Background */}
       {/*<div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        }}
      >
        <PlasmaGlobe speed={1.2} intensity={1.5} />
      </div> */}

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-100">AI-Powered Creation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6"
            style={{
              fontFamily: "Inter, system-ui, -apple-system, sans-serif",
              textShadow: "0 0 40px rgba(124, 58, 237, 0.3)",
            }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent block">
              Create
            </span>
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent block">
              Beyond
            </span>
            <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent block h-20 md:h-28">
              Reality
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-yellow-100/80 leading-relaxed max-w-lg"
          >
            Transform your imagination into stunning visuals with our AI-powered
            creative platform. Design, create, and innovate like never before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              onClick={handleStartCreating}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 px-8 py-4 rounded-full text-lg font-semibold group shadow-lg golden-glow disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : user
                ? "Continue Creating"
                : "Start Creating"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400/50 text-yellow-100 hover:bg-yellow-500/20 px-8 py-4 rounded-full text-lg backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Content - Enhanced Interactive Cards */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="grid grid-cols-1 gap-6 max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <InteractiveCard
                InteractiveColor="#ffd700"
                tailwindBgClass="bg-purple-900/40 backdrop-blur-md"
                className="p-6 h-48 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center golden-glow">
                    <Brain className="w-6 h-6 text-purple-900" />
                  </div>
                  <h3 className="text-yellow-100 font-semibold text-lg">
                    AI Intelligence
                  </h3>
                </div>
                <p className="text-yellow-100/80 text-sm leading-relaxed">
                  Advanced neural networks that understand context and generate
                  stunning visuals from your ideas.
                </p>
              </InteractiveCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <InteractiveCard
                InteractiveColor="#ffd700"
                tailwindBgClass="bg-purple-900/40 backdrop-blur-md"
                className="p-6 h-48 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center golden-glow">
                    <Palette className="w-6 h-6 text-purple-900" />
                  </div>
                  <h3 className="text-yellow-100 font-semibold text-lg">
                    Creative Tools
                  </h3>
                </div>
                <p className="text-yellow-100/80 text-sm leading-relaxed">
                  Professional-grade editing suite with intuitive controls for
                  seamless creative workflow.
                </p>
              </InteractiveCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <InteractiveCard
                InteractiveColor="#ffd700"
                tailwindBgClass="bg-purple-900/40 backdrop-blur-md"
                className="p-6 h-48 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center golden-glow">
                    <Shield className="w-6 h-6 text-purple-900" />
                  </div>
                  <h3 className="text-yellow-100 font-semibold text-lg">
                    Secure Platform
                  </h3>
                </div>
                <p className="text-yellow-100/80 text-sm leading-relaxed">
                  Enterprise-grade security ensures your creative work remains
                  protected and confidential.
                </p>
              </InteractiveCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
