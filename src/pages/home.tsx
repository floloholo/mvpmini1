import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import SmileyButton from "@/components/SmileyButton";
import HomeNavigation from "@/components/HomeNavigation";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
      <Helmet>
        <title>Home | Personal AI Assistant</title>
      </Helmet>

      <HomeNavigation className="mb-4" />

      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Your Personal Assistant
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Your AI companion for time management, reflection, and personal
            growth
          </p>
        </motion.div>

        <div className="relative">
          <SmileyButton size="xl" />

          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-24 mt-8">
            {/* Me Button */}
            <Link to="/me">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center shadow-md hover:bg-indigo-400 transition-colors">
                  <User className="text-white" size={24} />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">
                  Me
                </span>
              </motion.div>
            </Link>

            {/* Calendar Button */}
            <Link to="/calendar">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-md hover:bg-emerald-400 transition-colors">
                  <Calendar className="text-white" size={24} />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">
                  Calendar
                </span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      <footer className="p-6 text-center text-gray-500 text-sm">
        <p>Your personal AI time management & reflection assistant</p>
      </footer>
    </div>
  );
};

export default HomePage;
