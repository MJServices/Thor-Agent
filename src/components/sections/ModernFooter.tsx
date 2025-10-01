"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  ArrowUp,
  Sparkles,
  Zap,
  Palette,
  Shield,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveCard } from "@/components/lightswind/interactive-card";
import { theme } from "@/lib/theme";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Gallery", href: "#gallery" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#api" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  support: [
    { name: "Help Center", href: "#help" },
    { name: "Documentation", href: "#docs" },
    { name: "Community", href: "#community" },
    { name: "Status", href: "#status" },
  ],
  legal: [
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
    { name: "Security", href: "#security" },
    { name: "Cookies", href: "#cookies" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Mail, href: "#", label: "Email" },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Advanced neural networks",
  },
  { icon: Zap, title: "Lightning Fast", description: "Optimized performance" },
  { icon: Palette, title: "Creative Tools", description: "Professional suite" },
  { icon: Shield, title: "Secure", description: "Bank-grade protection" },
];

export function ModernFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="pt-20 pb-10 px-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <InteractiveCard
            InteractiveColor={theme.colors.primary.gold}
            tailwindBgClass="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-xl"
            className="p-8 md:p-12 rounded-3xl border border-yellow-400/20 shadow-2xl"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-100 mb-4">
                  Join Our Creative Community
                </h2>
                <p className="text-yellow-100/80 text-lg mb-6">
                  Subscribe to get exclusive updates, early access to new
                  features, and creative inspiration.
                </p>

                {/* Features Preview */}
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <feature.icon className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-100/90 text-sm">
                        {feature.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-400/30 rounded-xl p-6 text-center"
                  >
                    <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-yellow-100 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-yellow-100/80">
                      You've been subscribed to our newsletter.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-yellow-100 font-medium mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400/50" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 bg-purple-900/30 border border-yellow-400/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 py-3 rounded-xl font-bold shadow-lg golden-glow transition-all duration-300"
                    >
                      Subscribe Now
                    </button>

                    <p className="text-yellow-100/60 text-sm text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center mb-6"
            >
              <Image
                src="/logo.png"
                alt="Thor Agent"
                width={200}
                height={200}
                className="object-contain"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-yellow-100/80 text-lg leading-relaxed mb-8"
            >
              Empowering creators worldwide with AI-powered tools that transform
              imagination into reality. Join thousands of artists, designers,
              and innovators who trust Thor Agent.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-md border border-yellow-400/20 hover:border-yellow-400/40 flex items-center justify-center transition-all duration-300 group shadow-lg"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(
            ([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (categoryIndex + 1) }}
              >
                <h3 className="text-yellow-100 font-semibold text-lg mb-6 capitalize">
                  {category}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-yellow-100/70 hover:text-yellow-300 transition-colors hover:translate-x-1 inline-block transform duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-yellow-400/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-yellow-100/60 text-center md:text-left"
            >
              © {new Date().getFullYear()} Thor Agent. All rights reserved. Made
              with ❤️ for creators worldwide.
            </motion.p>

            <div className="flex items-center gap-4">
              {/* Back to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-yellow-100 font-medium transition-all duration-300 shadow-lg"
              >
                <ArrowUp className="w-4 h-4" />
                Back to Top
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
