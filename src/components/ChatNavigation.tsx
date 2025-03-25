import React from "react";
import { Link } from "react-router-dom";
import { CloudLightning, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ChatNavigationProps {
  onCrisisClick?: () => void;
  onInsightsClick?: () => void;
}

const ChatNavigation = ({
  onCrisisClick = () => {},
  onInsightsClick = () => {},
}: ChatNavigationProps) => {
  return (
    <div className="flex justify-between items-center w-full max-w-[200px] mx-auto mt-4 bg-background">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-red-100 hover:bg-red-200 text-red-600"
              onClick={onCrisisClick}
            >
              <CloudLightning className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Crisis Support</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
              onClick={onInsightsClick}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insights</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ChatNavigation;
