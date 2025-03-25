import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ChatInterface from "../components/ChatInterface";
import ChatNavigation from "../components/ChatNavigation";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you manage your time today?",
      type: "ai",
      timestamp: new Date(Date.now() - 60000 * 5),
    },
  ]);

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        type: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    // This is a placeholder for actual AI response generation
    if (
      userMessage.toLowerCase().includes("schedule") ||
      userMessage.toLowerCase().includes("meeting")
    ) {
      return "I've noted your schedule request. Would you like me to add this to your calendar?";
    } else if (
      userMessage.toLowerCase().includes("feel") ||
      userMessage.toLowerCase().includes("mood")
    ) {
      return "Thank you for sharing how you're feeling. Would you like to reflect more on this or would you prefer some suggestions to improve your mood?";
    } else {
      return "I've processed your message. Is there anything specific about your time management or reflections you'd like to discuss?";
    }
  };

  const handleCrisisClick = () => {
    // This would navigate to a crisis support page in a real implementation
    console.log("Navigating to crisis support page");
    // navigate('/crisis');
  };

  const handleInsightsClick = () => {
    // This would navigate to an insights page in a real implementation
    console.log("Navigating to insights page");
    // navigate('/insights');
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-sm flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Chat</h1>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            initialMessages={messages}
            onSendMessage={handleSendMessage}
            enableVoiceInput={true}
          />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <ChatNavigation
            onCrisisClick={handleCrisisClick}
            onInsightsClick={handleInsightsClick}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
