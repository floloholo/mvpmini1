import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SmileyButtonProps {
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  className?: string;
}

const SmileyButton = ({
  size = "lg",
  onClick,
  className,
}: SmileyButtonProps) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-40 h-40",
    xl: "w-52 h-52",
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/chat");
    }
  };

  return (
    <motion.button
      className={cn(
        "rounded-full bg-yellow-400 flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-all duration-300 focus:outline-none",
        sizeClasses[size],
        className,
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label="Open chat"
    >
      <div className="flex flex-col items-center justify-center">
        {/* Eyes */}
        <div className="flex space-x-8 mb-2">
          <div className="w-5 h-5 bg-black rounded-full"></div>
          <div className="w-5 h-5 bg-black rounded-full"></div>
        </div>

        {/* Smile */}
        <div className="w-16 h-8 border-b-4 border-black rounded-b-full"></div>
      </div>
    </motion.button>
  );
};

export default SmileyButton;
