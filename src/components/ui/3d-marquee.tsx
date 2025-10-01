"use client";

import { motion } from "framer-motion";
import React from "react";

export interface MarqueeImage {
  src: string;
  alt: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

export interface ThreeDMarqueeProps {
  images: MarqueeImage[];
  className?: string;
  cols?: number; // default is 4
  onImageClick?: (image: MarqueeImage, index: number) => void;
}

export const ThreeDMarquee: React.FC<ThreeDMarqueeProps> = ({
  images,
  className = "",
  cols = 4,
  onImageClick,
}) => {
  // Clone the image list twice
  const duplicatedImages = [...images, ...images];

  const groupSize = Math.ceil(duplicatedImages.length / cols);
  const imageGroups = Array.from({ length: cols }, (_, index) =>
    duplicatedImages.slice(index * groupSize, (index + 1) * groupSize)
  );

  const handleImageClick = (image: MarqueeImage, globalIndex: number) => {
    if (onImageClick) {
      onImageClick(image, globalIndex);
    } else if (image.href) {
      window.open(image.href, image.target || "_self");
    }
  };

  return (
    <section
      className={`mx-auto block h-[700px] md:h-[800px] lg:h-[900px] 
        overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-md border border-yellow-400/20 ${className}`}
    >
      <div
        className="flex w-full h-full items-center justify-center"
        style={{
          transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg)",
        }}
      >
        <div className="w-full overflow-hidden scale-90 md:scale-95 lg:scale-100">
          <div
            className={`relative grid h-full w-full origin-center 
              grid-cols-4 gap-3 md:gap-4 lg:gap-6 transform 
              `}
          >
            {imageGroups.map((imagesInGroup, idx) => (
              <motion.div
                key={`column-${idx}`}
                animate={{ y: idx % 2 === 0 ? 150 : -150 }}
                transition={{
                  duration: idx % 2 === 0 ? 12 : 18,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8 relative"
              >
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-yellow-400/30 to-purple-500/30" />
                {imagesInGroup.map((image, imgIdx) => {
                  const globalIndex = idx * groupSize + imgIdx;
                  const isClickable = image.href || onImageClick;

                  return (
                    <div key={`img-${imgIdx}`} className="relative group">
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400/30 to-purple-500/30" />
                      <motion.div
                        whileHover={{ y: -15, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="relative"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          width={970}
                          height={700}
                          className={`aspect-[970/700] w-full max-w-[200px] md:max-w-[220px] lg:max-w-[260px] rounded-2xl object-cover 
                            bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-md 
                            border border-yellow-400/20 shadow-2xl hover:shadow-yellow-400/20 
                            transition-all duration-500 golden-glow group-hover:border-yellow-400/40 ${
                            isClickable ? "cursor-pointer" : ""
                          }`}
                          onClick={() => handleImageClick(image, globalIndex)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};