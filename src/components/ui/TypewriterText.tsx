"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
  cursorClassName?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 0,
  speed = 50,
  className = "",
  onComplete,
  cursor = true,
  cursorClassName = "text-yellow-400"
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete?.();
        if (!cursor) {
          setShowCursor(false);
        }
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay, speed, onComplete, cursor]);

  useEffect(() => {
    if (cursor) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          className={`inline-block ${cursorClassName}`}
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0 }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};