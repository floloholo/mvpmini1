import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smile } from "lucide-react";

interface ChatSmileyProps {
  isAnimating?: boolean;
  size?: number;
  color?: string;
  pulseColor?: string;
  onClick?: () => void;
}

const ChatSmiley = ({
  isAnimating = true,
  size = 120,
  color = "#FFD700",
  pulseColor = "#FFF4B8",
  onClick = () => {},
}: ChatSmileyProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Animation variants for the smiley
  const smileyVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: [0, 5, -5, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
        },
      },
    },
    pressed: {
      scale: 0.9,
    },
  };

  // Pulse animation variants
  const pulseVariants = {
    idle: {
      scale: 1,
      opacity: 0.5,
    },
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        repeat: Infinity,
        duration: 2,
      },
    },
  };

  // Set animation state based on isAnimating prop
  useEffect(() => {
    if (!isAnimating) {
      setIsHovered(false);
      setIsPressed(false);
    }
  }, [isAnimating]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Pulse background */}
      {isAnimating && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 1.2,
            height: size * 1.2,
            backgroundColor: pulseColor,
          }}
          variants={pulseVariants}
          initial="idle"
          animate="pulse"
        />
      )}

      {/* Smiley face */}
      <motion.div
        className="relative flex items-center justify-center rounded-full bg-background cursor-pointer z-10"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
        variants={smileyVariants}
        initial="idle"
        animate={isPressed ? "pressed" : isHovered ? "hover" : "idle"}
        onHoverStart={() => isAnimating && setIsHovered(true)}
        onHoverEnd={() => isAnimating && setIsHovered(false)}
        onTapStart={() => isAnimating && setIsPressed(true)}
        onTap={() => {
          if (isAnimating) {
            setIsPressed(false);
            onClick();
          }
        }}
        onTapCancel={() => isAnimating && setIsPressed(false)}
      >
        <Smile
          size={size * 0.6}
          className="text-white stroke-2"
          strokeLinecap="round"
        />
      </motion.div>
    </div>
  );
};

export default ChatSmiley;
