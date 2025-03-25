import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MessageSquare, User, Settings } from "lucide-react";
import NavigationButton from "./NavigationButton";

interface HomeNavigationProps {
  className?: string;
}

const HomeNavigation = ({ className = "" }: HomeNavigationProps) => {
  return (
    <div
      className={`w-full flex justify-between items-center p-4 bg-background ${className}`}
    >
      <div className="flex gap-4">
        <NavigationButton
          icon={User}
          to="/me"
          label="Me"
          size="md"
          variant="secondary"
        />
      </div>

      <div className="flex gap-4">
        <NavigationButton
          icon={MessageSquare}
          to="/chat"
          label="Chat"
          size="md"
          variant="secondary"
        />

        <NavigationButton
          icon={Calendar}
          to="/calendar"
          label="Calendar"
          size="md"
          variant="secondary"
        />

        <NavigationButton
          icon={Settings}
          to="/settings"
          label="Settings"
          size="sm"
          variant="ghost"
        />
      </div>
    </div>
  );
};

export default HomeNavigation;
