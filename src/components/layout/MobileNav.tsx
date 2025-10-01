"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Zap, Image, DollarSign, Mail } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Features", href: "/features", icon: Zap },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "Chat", href: "/chat", icon: Mail },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <motion.button
        onClick={toggleMenu}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-purple-900 border border-purple-400/30 text-purple-100 hover:bg-purple-800 transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-80 bg-purple-900 border-l border-purple-500/30 z-[9999]"
              style={{ backgroundColor: "#581c87", height: "100vh" }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Navigation</h2>
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-purple-200" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={toggleMenu}
                          className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-purple-600/30 text-white border border-purple-400/50"
                              : "text-purple-200 hover:bg-purple-500/20 hover:text-white"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-8 border-t border-purple-500/30"
                >
                  <Link
                    href="/signup"
                    onClick={toggleMenu}
                    className="w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 block text-center"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
