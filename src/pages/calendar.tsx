import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CalendarView from "@/components/CalendarView";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  isRegular?: boolean;
  color?: string;
}

interface TimeBlockSuggestion {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: Date;
}

const CalendarPage = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Work",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      date: new Date(),
      isRegular: true,
      color: "bg-blue-100 border-blue-300",
    },
    {
      id: "2",
      title: "Gym",
      startTime: "07:00 AM",
      endTime: "08:30 AM",
      date: new Date(),
      isRegular: true,
      color: "bg-green-100 border-green-300",
    },
    {
      id: "3",
      title: "Dinner with friends",
      startTime: "07:00 PM",
      endTime: "09:00 PM",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      color: "bg-purple-100 border-purple-300",
    },
  ]);

  const [suggestions, setSuggestions] = useState<TimeBlockSuggestion[]>([
    {
      id: "s1",
      title: "Meditation Session",
      description:
        "Take some time to clear your mind and focus on your breathing.",
      startTime: "06:00 PM",
      endTime: "06:30 PM",
      date: new Date(),
    },
    {
      id: "s2",
      title: "Reading Time",
      description:
        "Spend some time reading that book you mentioned wanting to finish.",
      startTime: "08:30 PM",
      endTime: "09:30 PM",
      date: new Date(),
    },
    {
      id: "s3",
      title: "Morning Journaling",
      description: "Write down your thoughts and set intentions for the day.",
      startTime: "06:30 AM",
      endTime: "07:00 AM",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  ]);

  const handleAddEvent = (eventData: Partial<CalendarEvent>) => {
    // In a real app, this would open a form to create a new event
    toast({
      title: "Add New Event",
      description:
        "This would open a form to add a new event to your calendar.",
    });
  };

  const handleAcceptSuggestion = (suggestion: TimeBlockSuggestion) => {
    // Add the suggestion to events
    const newEvent: CalendarEvent = {
      id: `e${Date.now()}`,
      title: suggestion.title,
      startTime: suggestion.startTime,
      endTime: suggestion.endTime,
      date: suggestion.date,
      color: "bg-indigo-100 border-indigo-300",
    };

    setEvents([...events, newEvent]);

    // Remove the suggestion from the list
    setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));

    toast({
      title: "Suggestion Accepted",
      description: `Added "${suggestion.title}" to your calendar.`,
      variant: "default",
    });
  };

  const handleRejectSuggestion = (suggestion: TimeBlockSuggestion) => {
    // Remove the suggestion from the list
    setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));

    toast({
      title: "Suggestion Declined",
      description: `Removed "${suggestion.title}" from suggestions.`,
      variant: "destructive",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        </div>

        <Card className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="h-[calc(100vh-180px)]">
            <CalendarView
              events={events}
              suggestions={suggestions}
              onAddEvent={handleAddEvent}
              onAcceptSuggestion={handleAcceptSuggestion}
              onRejectSuggestion={handleRejectSuggestion}
            />
          </div>
        </Card>
      </div>
      <Toaster />
    </motion.div>
  );
};

export default CalendarPage;
