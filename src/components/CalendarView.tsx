import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import AIToggle from "@/components/AIToggle";
import TimeBlockSuggestion from "@/components/TimeBlockSuggestion";
import { motion } from "framer-motion";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CalendarDays,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

interface CalendarViewProps {
  events?: CalendarEvent[];
  suggestions?: TimeBlockSuggestion[];
  onAddEvent?: (event: Partial<CalendarEvent>) => void;
  onAcceptSuggestion?: (suggestion: TimeBlockSuggestion) => void;
  onRejectSuggestion?: (suggestion: TimeBlockSuggestion) => void;
}

const CalendarView = ({
  events = [
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
      date: addDays(new Date(), 1),
      color: "bg-purple-100 border-purple-300",
    },
  ],
  suggestions = [
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
  ],
  onAddEvent = () => {},
  onAcceptSuggestion = () => {},
  onRejectSuggestion = () => {},
}: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [showAISuggestions, setShowAISuggestions] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  // Get days for the current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter events for the selected date or week
  const filteredEvents = events.filter((event) => {
    if (viewMode === "day") {
      return isSameDay(event.date, selectedDate);
    } else {
      return weekDays.some((day) => isSameDay(event.date, day));
    }
  });

  // Filter suggestions for the selected date
  const filteredSuggestions = showAISuggestions
    ? suggestions.filter((suggestion) =>
        isSameDay(suggestion.date, selectedDate),
      )
    : [];

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => addDays(prev, 7));
  };

  const handleGoToToday = () => {
    setSelectedDate(new Date());
    setCurrentWeek(new Date());
  };

  const handleToggleAI = (enabled: boolean) => {
    setShowAISuggestions(enabled);
  };

  const handleAcceptSuggestion = (suggestion: TimeBlockSuggestion) => {
    onAcceptSuggestion(suggestion);
  };

  const handleRejectSuggestion = (suggestion: TimeBlockSuggestion) => {
    onRejectSuggestion(suggestion);
  };

  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    date: new Date(),
    isRegular: false,
  });
  const [isRecording, setIsRecording] = useState(false);

  const handleAddEvent = () => {
    if (newEvent.title) {
      onAddEvent(newEvent);
      setShowEventModal(false);
      setNewEvent({
        title: "",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        date: selectedDate,
        isRegular: false,
      });
    }
  };

  const toggleVoiceRecording = () => {
    // This would be implemented with actual voice recording functionality
    setIsRecording(!isRecording);
    if (isRecording) {
      // In a real implementation, this would process the voice input
      // and update the newEvent state with the transcribed details
      setIsRecording(false);
    }
  };

  // Time slots for the day view
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const amPm = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${amPm}`;
  });

  return (
    <div className="flex flex-col h-full w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                viewMode === "day" && "bg-primary text-primary-foreground",
              )}
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                viewMode === "week" && "bg-primary text-primary-foreground",
              )}
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <AIToggle
            enabled={showAISuggestions}
            onChange={handleToggleAI}
            className="shadow-sm"
          />
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(currentWeek, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToToday}
              className="ml-2"
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Today
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Calendar sidebar */}
        <div className="w-64 mr-4 flex flex-col overflow-hidden">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="border rounded-md"
          />

          {showAISuggestions && (
            <div className="mt-6 flex-1 overflow-hidden flex flex-col">
              <h3 className="text-lg font-medium mb-3">AI Suggestions</h3>
              <ScrollArea className="flex-1 overflow-auto">
                <div className="space-y-3 pr-4">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion) => (
                      <TimeBlockSuggestion
                        key={suggestion.id}
                        title={suggestion.title}
                        description={suggestion.description}
                        startTime={suggestion.startTime}
                        endTime={suggestion.endTime}
                        date={format(suggestion.date, "EEEE, MMM d")}
                        onAccept={() => handleAcceptSuggestion(suggestion)}
                        onReject={() => handleRejectSuggestion(suggestion)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No suggestions for this date
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Calendar main view */}
        <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
          {viewMode === "day" ? (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="bg-gray-50 p-3 border-b flex-shrink-0">
                <h3 className="text-lg font-medium">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h3>
              </div>
              <ScrollArea className="flex-1 overflow-auto">
                <div className="min-h-[1440px]">
                  {timeSlots.map((timeSlot, index) => {
                    const eventsAtTime = filteredEvents.filter((event) => {
                      const [hour] = timeSlot.split(":");
                      const [eventHour] = event.startTime.split(":");
                      return parseInt(hour) === parseInt(eventHour);
                    });

                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex border-b min-h-[60px] relative",
                          index >= 9 && index < 18 ? "bg-gray-50" : "bg-white", // Highlight working hours
                        )}
                      >
                        <div className="w-16 py-2 px-2 text-xs text-gray-500 border-r">
                          {timeSlot}
                        </div>
                        <div className="flex-1 p-1 relative">
                          {eventsAtTime.map((event) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn(
                                "p-2 rounded-md border text-sm mb-1",
                                event.color || "bg-blue-100 border-blue-300",
                              )}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div className="text-xs flex items-center">
                                <Clock size={12} className="mr-1" />
                                {event.startTime} - {event.endTime}
                                {event.isRegular && (
                                  <span className="ml-2 text-xs bg-gray-200 px-1 rounded">
                                    Regular
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="grid grid-cols-7 bg-gray-50 border-b flex-shrink-0">
                {weekDays.map((day, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 text-center border-r last:border-r-0",
                      isSameDay(day, new Date()) && "bg-blue-50",
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-sm font-medium">
                      {format(day, "EEE")}
                    </div>
                    <div
                      className={cn(
                        "w-8 h-8 mx-auto flex items-center justify-center rounded-full",
                        isSameDay(day, selectedDate) &&
                          "bg-primary text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>
              <ScrollArea className="flex-1 overflow-auto">
                <div className="min-h-[1440px]">
                  {timeSlots.map((timeSlot, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex border-b min-h-[60px]",
                        index >= 9 && index < 18 ? "bg-gray-50" : "bg-white", // Highlight working hours
                      )}
                    >
                      <div className="w-16 py-2 px-2 text-xs text-gray-500 border-r">
                        {timeSlot}
                      </div>
                      <div className="flex-1 grid grid-cols-7">
                        {weekDays.map((day, dayIndex) => {
                          const dayEvents = events.filter((event) => {
                            const [hour] = timeSlot.split(":");
                            const [eventHour] = event.startTime.split(":");
                            return (
                              isSameDay(event.date, day) &&
                              parseInt(hour) === parseInt(eventHour)
                            );
                          });

                          return (
                            <div
                              key={dayIndex}
                              className="border-r last:border-r-0 p-1 relative"
                            >
                              {dayEvents.map((event) => (
                                <motion.div
                                  key={event.id}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={cn(
                                    "p-1 rounded-md border text-xs mb-1",
                                    event.color ||
                                      "bg-blue-100 border-blue-300",
                                  )}
                                >
                                  <div className="font-medium truncate">
                                    {event.title}
                                  </div>
                                  <div className="text-xs flex items-center">
                                    <Clock size={10} className="mr-1" />
                                    {event.startTime
                                      .replace(" AM", "")
                                      .replace(" PM", "")}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
        onClick={() => setShowEventModal(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 flex-shrink-0">
              <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
            </div>

            <ScrollArea className="flex-1 overflow-auto px-6">
              <div className="space-y-4 pb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event Title
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="Enter event title"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleVoiceRecording}
                      className={`${isRecording ? "bg-red-100 text-red-500" : ""}`}
                    >
                      <Mic
                        className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={newEvent.startTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={newEvent.endTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={newEvent.date}
                      onSelect={(date) =>
                        date && setNewEvent({ ...newEvent, date })
                      }
                      className="border-0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRegular"
                    checked={newEvent.isRegular}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, isRegular: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="isRegular" className="text-sm font-medium">
                    Recurring Event
                  </label>
                </div>

                {newEvent.isRegular && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Recurrence Pattern
                    </label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>

                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">
                        Repeat on days
                      </label>
                      <div className="flex gap-1">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-primary/10"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md resize-none h-20"
                    placeholder="Add notes"
                  ></textarea>
                </div>
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 p-6 border-t flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowEventModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEvent} disabled={!newEvent.title}>
                Add Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
