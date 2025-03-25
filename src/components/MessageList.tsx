import React, { useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";

type MessageType = "user" | "ai";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

interface MessageListProps {
  messages?: Message[];
  className?: string;
}

const MessageList = ({
  messages = [
    {
      id: "1",
      content: "Hello! How can I help you manage your time today?",
      type: "ai" as MessageType,
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: "2",
      content: "I need to schedule a meeting for tomorrow afternoon.",
      type: "user" as MessageType,
      timestamp: new Date(Date.now() - 60000 * 4),
    },
    {
      id: "3",
      content:
        "I see you have free time between 2-4pm tomorrow. Would you like me to schedule your meeting then?",
      type: "ai" as MessageType,
      timestamp: new Date(Date.now() - 60000 * 3),
    },
    {
      id: "4",
      content:
        "Yes, that works perfectly. Can you also remind me about my dentist appointment next week?",
      type: "user" as MessageType,
      timestamp: new Date(Date.now() - 60000 * 2),
    },
    {
      id: "5",
      content:
        "I've added your meeting for tomorrow at 2pm. And yes, I see your dentist appointment is scheduled for next Tuesday at 10am. I'll make sure to remind you.",
      type: "ai" as MessageType,
      timestamp: new Date(Date.now() - 60000),
    },
  ],
  className = "",
}: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`w-full h-full bg-gray-50 ${className}`}>
      <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex ${message.type === "user" ? "flex-row-reverse" : "flex-row"} items-start max-w-[80%]`}
              >
                {message.type === "ai" && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=assistant"
                      alt="AI Assistant"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                {message.type === "user" && (
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      alt="User"
                    />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${message.type === "user" ? "bg-blue-500 text-white" : "bg-white border border-gray-200"} shadow-sm`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-400"} text-right`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
