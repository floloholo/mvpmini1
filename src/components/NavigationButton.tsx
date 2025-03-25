import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface NavigationButtonProps {
  icon: React.ElementType;
  to: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
}

const NavigationButton = ({
  icon: Icon,
  to = "/",
  label = "",
  size = "md",
  variant = "primary",
}: NavigationButtonProps) => {
  // Map component size to button size and icon size
  const sizeMap = {
    sm: {
      button: "h-12 w-12",
      icon: 16,
      text: "text-xs",
    },
    md: {
      button: "h-16 w-16",
      icon: 24,
      text: "text-sm",
    },
    lg: {
      button: "h-20 w-20",
      icon: 32,
      text: "text-base",
    },
  };

  // Map variant to button variant
  const variantMap = {
    primary: "default",
    secondary: "secondary",
    ghost: "ghost",
  };

  // Ensure Icon is a valid component
  if (!Icon) {
    console.error("NavigationButton: icon prop is undefined or invalid");
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-1 bg-background">
      <Link to={to} className="flex flex-col items-center">
        <Button
          variant={variantMap[variant] as any}
          className={`${sizeMap[size].button} rounded-full flex items-center justify-center`}
        >
          <Icon size={sizeMap[size].icon} />
        </Button>
        {label && (
          <span className={`mt-1 ${sizeMap[size].text} font-medium`}>
            {label}
          </span>
        )}
      </Link>
    </div>
  );
};

export default NavigationButton;
