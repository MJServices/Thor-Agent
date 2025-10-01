import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "../../lib/utils";
export const InteractiveCard = ({
  children,
  className,
  InteractiveColor = "#07eae6ff",
  borderRadius = "48px",
  rotationFactor = 0.4,
  transitionDuration = 0.3,
  transitionEasing = "easeInOut",
  tailwindBgClass = "bg-transparent backdrop-blur-md",
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateXTrans = useTransform(
    y,
    [0, 1],
    [rotationFactor * 15, -rotationFactor * 15]
  );
  const rotateYTrans = useTransform(
    x,
    [0, 1],
    [-rotationFactor * 15, rotationFactor * 15]
  );
  const handlePointerMove = (e) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const px = (e.clientX - bounds.left) / bounds.width;
    const py = (e.clientY - bounds.top) / bounds.height;
    x.set(px);
    y.set(py);
  };
  const xPercentage = useTransform(x, (val) => `${val * 100}%`);
  const yPercentage = useTransform(y, (val) => `${val * 100}%`);
  const interactiveBackground = useMotionTemplate`radial-gradient(circle at ${xPercentage} ${yPercentage}, ${InteractiveColor} 0%, transparent 80%)`;
  return _jsx(motion.div, {
    ref: cardRef,
    onPointerMove: handlePointerMove,
    onPointerEnter: () => setIsHovered(true),
    onPointerLeave: () => setIsHovered(false),
    style: {
      perspective: 1000,
      borderRadius,
    },
    className: "relative w-full",
    children: _jsxs(motion.div, {
      style: {
        rotateX: rotateXTrans,
        rotateY: rotateYTrans,
        transformStyle: "preserve-3d",
        transition: `transform ${transitionDuration}s ${transitionEasing}`,
        borderRadius,
      },
      className: "w-full h-full overflow-hidden shadow-lg",
      children: [
        _jsx(motion.div, {
          className: "absolute inset-0 z-0 overflow-hidden",
          style: {
            background: interactiveBackground,
            transition: `opacity ${transitionDuration}s ${transitionEasing}`,
            opacity: isHovered ? 0.6 : 0,
            pointerEvents: "none",
            borderRadius,
          },
        }),
        _jsx("div", {
          className: cn(
            "relative z-10 w-full h-full overflow-hidden",
            tailwindBgClass,
            className,
            "text-foreground"
          ),
          style: {
            borderRadius,
          },
          children: children,
        }),
      ],
    }),
  });
};
