import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ChatSmiley from "./ChatSmiley";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Button } from "./ui/button";
import { Cloud, HelpCircle, Loader2 } from "lucide-react";
import { sendMessageToDeepseek } from "../lib/deepseek";
import { supabase, getCurrentUserId } from "../lib/supabase";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

interface DeepseekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  initialMessages?: Array<Message>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Load previous messages from Supabase
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const userId = await getCurrentUserId();

        if (userId) {
          const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true })
            .limit(50);

          if (data && !error && data.length > 0) {
            const formattedMessages = data.map((msg) => ({
              id: msg.id,
              content: msg.content,
              type: msg.type as "user" | "ai",
              timestamp: new Date(msg.created_at),
            }));

            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error("Error loading chat messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Save message to Supabase
  const saveMessageToSupabase = async (message: Message) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      await supabase.from("chat_messages").insert({
        id: message.id,
        user_id: userId,
        content: message.content,
        type: message.type,
        created_at: message.timestamp.toISOString(),
      });
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  };

  // Convert chat messages to DeepSeek format for API
  const getDeepseekMessages = (): DeepseekMessage[] => {
    return messages.map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content,
    }));
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to the chat
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      type: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveMessageToSupabase(userMessage);
    setIsTyping(true);

    // Call the provided onSendMessage callback
    onSendMessage(message);

    try {
      // Get previous messages for context (excluding the one we just added)
      const previousMessages = getDeepseekMessages();

      // Call DeepSeek API
      const aiResponseContent = await sendMessageToDeepseek(
        message,
        previousMessages,
      );

      // Add AI response to chat
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        type: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      saveMessageToSupabase(aiResponse);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Add error message
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        type: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
      saveMessageToSupabase(errorResponse);
    } finally {
      setIsTyping(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full bg-gray-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          Loading your conversation...
        </p>
      </div>
    );
  }

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
