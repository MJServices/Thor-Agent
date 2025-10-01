"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { InteractiveCard } from "@/components/lightswind/interactive-card";
import { ThreeDMarquee, MarqueeImage } from "@/components/ui/3d-marquee";
import { Eye, Heart, Download } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    title: "Digital Landscape",
    category: "AI Art",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    likes: 234,
    views: 1200,
  },
  {
    id: 2,
    title: "Abstract Portrait",
    category: "Portrait",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    likes: 189,
    views: 890,
  },
  {
    id: 3,
    title: "Futuristic City",
    category: "Concept Art",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    likes: 456,
    views: 2100,
  },
  {
    id: 4,
    title: "Cosmic Dreams",
    category: "Space Art",
    image:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop",
    likes: 321,
    views: 1500,
  },
  {
    id: 5,
    title: "Nature Fusion",
    category: "Digital Art",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    likes: 278,
    views: 1100,
  },
  {
    id: 6,
    title: "Neon Dreams",
    category: "Cyberpunk",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    likes: 567,
    views: 2800,
  },
];

export function GallerySection() {
  return (
    <section className="py-6 px-6 relative" id="gallery">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tight text-center"
          >
            Creative
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Explore stunning creations made with Thor Agent by our community of
            artists and designers
          </motion.p>
        </div>

        {/* 3D Marquee Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <ThreeDMarquee
            images={[
              {
                src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
                alt: "AI Landscape",
              },
              {
                src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
                alt: "Abstract Portrait",
              },
              {
                src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
                alt: "Futuristic City",
              },
              {
                src: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop",
                alt: "Cosmic Dreams",
              },
              {
                src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                alt: "Nature Fusion",
              },
              {
                src: "https://images.unsplash.com/photo-1519681393784-d120c3b0aed2?w=400&h=300&fit=crop",
                alt: "Digital Art",
              },
              {
                src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
                alt: "Creative Design",
              },
              {
                src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=300&fit=crop",
                alt: "AI Generated",
              },
              {
                src: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
                alt: "Neon Dreams",
              },
              {
                src: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop",
                alt: "Tech Art",
              },
              {
                src: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&h=300&fit=crop",
                alt: "Cyber Art",
              },
              {
                src: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=300&fit=crop",
                alt: "Space Design",
              },
              {
                src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop",
                alt: "Abstract Space",
              },
              {
                src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop",
                alt: "Galaxy Art",
              },
              {
                src: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop",
                alt: "Digital Landscape",
              },
              {
                src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
                alt: "Future Vision",
              },
            ]}
            cols={4}
          />
        </motion.div>
      </div>
    </section>
  );
}
