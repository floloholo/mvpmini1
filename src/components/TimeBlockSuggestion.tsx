import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Check, X, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface TimeBlockSuggestionProps {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

const TimeBlockSuggestion = ({
  title = "Meditation Session",
  description = "Take some time to clear your mind and focus on your breathing.",
  startTime = "10:00 AM",
  endTime = "10:30 AM",
  date = "Today",
  onAccept = () => console.log("Suggestion accepted"),
  onReject = () => console.log("Suggestion rejected"),
}: TimeBlockSuggestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <Card className="overflow-hidden border-2 border-blue-100 bg-white shadow-md">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1" />
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock size={16} />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>

          <div className="mb-3 flex items-center space-x-1 text-sm text-gray-500">
            <Calendar size={16} />
            <span>{date}</span>
          </div>

          <p className="mb-4 text-gray-600">{description}</p>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="flex items-center space-x-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <X size={16} />
              <span>Decline</span>
            </Button>
            <Button
              size="sm"
              onClick={onAccept}
              className="flex items-center space-x-1 bg-green-600 text-white hover:bg-green-700"
            >
              <Check size={16} />
              <span>Accept</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TimeBlockSuggestion;
