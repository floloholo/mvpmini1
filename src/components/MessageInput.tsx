import React, { useState } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  enableVoiceInput?: boolean;
}

const MessageInput = ({
  onSendMessage = () => {},
  placeholder = "Type your message here...",
  disabled = false,
  enableVoiceInput = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecording = () => {
    // This would be implemented with actual voice recording functionality
    setIsRecording(!isRecording);
    if (isRecording) {
      // Handle stopping recording and processing voice input
      // This is a placeholder for the actual implementation
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white p-4 border-t border-gray-200 rounded-b-lg shadow-sm">
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[60px] resize-none flex-grow"
        />
        <div className="flex gap-2">
          {enableVoiceInput && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleVoiceRecording}
                    className={`${isRecording ? "bg-red-100 text-red-500" : ""}`}
                    disabled={disabled}
                  >
                    <Mic
                      className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? "Stop recording" : "Start voice input"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSendMessage}
                  disabled={disabled || !message.trim()}
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
