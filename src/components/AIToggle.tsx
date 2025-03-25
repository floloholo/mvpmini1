import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { BrainCog } from "lucide-react";

interface AIToggleProps {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

const AIToggle = ({
  enabled = false,
  onChange = () => {},
  label = "AI Suggestions",
  description = "Enable AI to suggest optimal time blocks for your schedule",
  className,
}: AIToggleProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggleChange = (checked: boolean) => {
    setIsEnabled(checked);
    onChange(checked);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 rounded-lg bg-white",
        className,
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            isEnabled
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <BrainCog size={20} />
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">{label}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggleChange}
            className="ml-2"
          />
        </div>
      </div>
    </div>
  );
};

export default AIToggle;
