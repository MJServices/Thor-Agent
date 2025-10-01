"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface WordRevealProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  initialDelay?: number;
}

export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  className = "",
  staggerDelay = 0.1,
  duration = 0.6,
  initialDelay = 0
}) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
      transformOrigin: "center bottom",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={wordVariants}
          style={{ perspective: "1000px" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};