import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ChatSmiley from "./ChatSmiley";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Button } from "./ui/button";
import { Cloud, HelpCircle } from "lucide-react";

interface ChatInterfaceProps {
  initialMessages?: Array<{
    id: string;
    content: string;
    type: "user" | "ai";
    timestamp: Date;
  }>;
  onSendMessage?: (message: string) => void;
  enableVoiceInput?: boolean;
}

const ChatInterface = ({
  initialMessages = [
    {
      id: "1",
      content: "Hello! How can I help you manage your time today?",
      type: "ai" as const,
      timestamp: new Date(Date.now() - 60000 * 5),
    },
  ],
  onSendMessage = () => {},
  enableVoiceInput = false,
}: ChatInterfaceProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (message: string) => {
    // Add user message to the chat
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      type: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Call the provided onSendMessage callback
    onSendMessage(message);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content:
          "I've received your message and I'm processing it. How else can I assist you today?",
        type: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCrisisClick = () => {
    // Navigate to crisis page (placeholder for now)
    console.log("Navigate to crisis page");
    // navigate("/crisis");
  };

  const handleInsightsClick = () => {
    // Navigate to insights page (placeholder for now)
    console.log("Navigate to insights page");
    // navigate("/insights");
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <Button
          variant="outline"
          size="icon"
          onClick={handleCrisisClick}
          className="rounded-full"
        >
          <Cloud className="h-5 w-5" />
        </Button>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ChatSmiley size={80} isAnimating={!isTyping} />
        </motion.div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleInsightsClick}
          className="rounded-full"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-grow overflow-hidden">
        <MessageList messages={messages} />
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        placeholder="Type your message here..."
        disabled={isTyping}
        enableVoiceInput={enableVoiceInput}
      />
    </div>
  );
};

export default ChatInterface;
