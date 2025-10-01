"use client";

import React from "react";
import Header from "@/components/layout/Header";
import { ModernFooter } from "@/components/sections/ModernFooter";
import { FloatingElements } from "@/components/ui/FloatingElements";
import { ToastProvider } from "@/components/ui/Toast";
import { motion } from "framer-motion";

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  headerItems?: string[];
  headerColor?: string;
  className?: string;
}

export function PageLayout({
  children,
  showHeader = true,
  headerItems = ["Home", "Features", "Chat", "Pricing", "Contact"],
  headerColor = "#ffd700",
  className = "",
}: PageLayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden">
        <FloatingElements />

        {showHeader && <Header items={headerItems} color={headerColor} />}

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={`relative z-10 pt-20 ${className}`}
        >
          {children}
        </motion.main>

        <ModernFooter />
      </div>
    </ToastProvider>
  );
}
