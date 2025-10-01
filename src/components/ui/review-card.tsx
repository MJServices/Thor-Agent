"use client";

import * as React from "react";
import { motion } from "framer-motion";

// Define props interface
interface ReviewCardProps {
  handleShuffle: () => void;
  Review: string;
  position: string; 
  id: number | string;
  author: string;
}

export function ReviewCard({
  handleShuffle,
  Review,
  position,
  id,
  author,
}: ReviewCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0,
      }}
      animate={{
        rotate:
          position === "front"
            ? "-6deg"
            : position === "middle"
            ? "0deg"
            : "6deg",
        x:
          position === "front"
            ? "0%"
            : position === "middle"
            ? "33%"
            : "66%",
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e: MouseEvent | PointerEvent | TouchEvent) => {
        if ("clientX" in e) {
          dragRef.current = e.clientX;
        }
      }}
      onDragEnd={(e: MouseEvent | PointerEvent | TouchEvent) => {
        if ("clientX" in e) {
          if (dragRef.current - e.clientX > 150) {
            handleShuffle();
          }
          dragRef.current = 0;
        }
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[250px] md:h-[450px] w-[200px] md:w-[350px] select-none place-content-center space-y-2 md:space-y-6 rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-md p-2 md:p-6 shadow-2xl golden-glow ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <img
        src={`https://i.pravatar.cc/128?img=${id}`}
        alt={`Avatar of ${author}`}
        className="pointer-events-none mx-auto h-16 w-16 md:h-32 md:w-32 rounded-full border-3 border-yellow-400/50 bg-purple-900/20 object-cover golden-glow"
      />
      <span className="text-center text-xs md:text-lg italic text-yellow-100/90 leading-tight md:leading-relaxed line-clamp-3 md:line-clamp-none">
        "{Review}"
      </span>
      <span className="text-center text-xs md:text-sm font-medium text-yellow-400">
        {author}
      </span>
    </motion.div>
  );
}
