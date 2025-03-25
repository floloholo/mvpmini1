import React from "react";
import { motion } from "framer-motion";
import { Calendar, Star, Settings } from "lucide-react";
import SmileyButton from "./SmileyButton";
import { NavigationButton } from "./NavigationButton";

interface DashboardProps {
  className?: string;
}

const Dashboard = ({ className = \"\" }: DashboardProps) => {
  return (
    <motion.div
      className={`w-full h-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Settings button in top right */}
      <div className=\"absolute top-4 right-4\">
        <NavigationButton 
          icon={<Settings />} 
          to=\"/settings\" 
          label=\"Settings\" 
        />
      </div>

      {/* Main content with central smiley and navigation options */}
      <div className=\"flex flex-col items-center justify-center flex-grow\">
        <motion.div
          className=\"relative\"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            type: \"spring\", 
            stiffness: 100 
          }}
        >
          {/* Central Smiley Button */}
          <SmileyButton />
          
          {/* Navigation buttons positioned around the smiley */}
          <div className=\"absolute -bottom-20 -left-20\">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <NavigationButton 
                icon={<Star />} 
                to=\"/me\" 
                label=\"Me\" 
              />
            </motion.div>
          </div>
          
          <div className=\"absolute -bottom-20 -right-20\">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <NavigationButton 
                icon={<Calendar />} 
                to=\"/calendar\" 
                label=\"Calendar\" 
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Welcome message */}
        <motion.div 
          className=\"mt-32 text-center\"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h1 className=\"text-3xl font-bold text-gray-800 mb-2\">Welcome back!</h1>
          <p className=\"text-gray-600\">Tap the smiley to start chatting</p>
        </motion.div>
      </div>
      
      {/* Footer with version info */}
      <div className=\"mt-auto pt-4 text-center text-gray-400 text-xs\">
        <p>Personal AI Assistant v0.1</p>
      </div>
    </motion.div>
  );
};

export default Dashboard;