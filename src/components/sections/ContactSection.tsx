"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { InteractiveCard } from "@/components/lightswind/interactive-card";
import { GlowingCard } from "@/components/lightswind/glowing-cards";
import { BentoGrid, BentoCard } from "@/components/lightswind/bento-grid";
import { EnhancedButton } from "@/components/ui/EnhancedButton";
import { useToast } from "@/components/ui/Toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  AlertCircle,
  MessageCircle,
  Calendar,
  Headphones,
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch via email",
    value: "hello@thoragent.com",
    action: "Send Email",
    color: "#ffd700",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team",
    value: "+1 (555) 123-4567",
    action: "Call Now",
    color: "#7c3aed",
  },
  {
    icon: Calendar,
    title: "Book a Demo",
    description: "Schedule a personalized demo",
    value: "30-minute session",
    action: "Book Now",
    color: "#ffd700",
  },
  {
    icon: Headphones,
    title: "Live Support",
    description: "Chat with our support team",
    value: "Available 24/7",
    action: "Start Chat",
    color: "#7c3aed",
  },
];

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors below",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast({
        type: "success",
        title: "Message Sent!",
        message: "We'll get back to you within 24 hours",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      showToast({
        type: "error",
        title: "Failed to Send",
        message: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-6 px-6 relative" id="contact">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/20 mb-8"
          >
            <MessageCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-medium">Get In Touch</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black mb-8 tracking-tight text-center"
          >
            Let's Create
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Something Amazing
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Ready to transform your creative process? Let's discuss how Thor
            Agent can help you achieve your goals.
          </motion.p>
        </div>

        {/* Contact Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <BentoGrid className="max-w-6xl mx-auto">
            {contactMethods.map((method, index) => (
              <BentoCard
                key={method.title}
                className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-md border border-yellow-400/10 hover:border-yellow-400/30 transition-all duration-500 group cursor-pointer"
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 mb-6 group-hover:scale-110 transition-transform duration-300 golden-glow">
                    <method.icon className="w-full h-full text-purple-900" />
                  </div>

                  <h3 className="text-xl font-bold text-yellow-100 mb-2 group-hover:text-yellow-300 transition-colors">
                    {method.title}
                  </h3>

                  <p className="text-yellow-100/70 mb-3">
                    {method.description}
                  </p>

                  <p className="text-yellow-300 font-semibold mb-6">
                    {method.value}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-auto bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-purple-900 px-6 py-3 rounded-full font-bold transition-all duration-300 golden-glow"
                  >
                    {method.action}
                  </motion.button>
                </div>
              </BentoCard>
            ))}
          </BentoGrid>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-[70vw] mx-auto"
        >
          <InteractiveCard
            InteractiveColor="#ffd700"
            tailwindBgClass="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-md"
            className="w-full mx-auto border border-yellow-400/20 golden-glow px-6 py-8 sm:px-8 md:px-12 md:py-12"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-yellow-100 mb-4">
                Send Us a Message
              </h3>
              <p className="text-yellow-100/70">
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Grid for Name + Email */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-yellow-100 font-semibold mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl bg-purple-900/30 border text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
                      errors.name ? "border-red-400/50" : "border-yellow-400/30"
                    }`}
                    placeholder="Your full name"
                    required
                  />
                  {errors.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </motion.div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-yellow-100 font-semibold mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl bg-purple-900/30 border text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
                      errors.email
                        ? "border-red-400/50"
                        : "border-yellow-400/30"
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Company + Subject */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-yellow-100 font-semibold mb-3">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-purple-900/30 border border-yellow-400/30 text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-yellow-100 font-semibold mb-3">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl bg-purple-900/30 border text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
                      errors.subject
                        ? "border-red-400/50"
                        : "border-yellow-400/30"
                    }`}
                    placeholder="What's this about?"
                    required
                  />
                  {errors.subject && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-yellow-100 font-semibold mb-3">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-5 py-4 rounded-xl bg-purple-900/30 border text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm resize-none transition-all duration-300 ${
                    errors.message
                      ? "border-red-400/50"
                      : "border-yellow-400/30"
                  }`}
                  placeholder="Tell us about your project and how we can help..."
                  required
                />
                {errors.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </motion.div>
                )}
              </div>

              {/* Button */}
              <div className="text-center pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 disabled:from-yellow-600 disabled:to-yellow-500 text-purple-900 px-10 py-4 rounded-full text-lg font-bold shadow-2xl golden-glow transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-purple-900/30 border-t-purple-900 rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </InteractiveCard>
        </motion.div>
      </div>
    </section>
  );
}
