import React from "react";
import { Progress } from "@/components/ui/progress";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const OnboardingProgress = ({
  currentStep = 1,
  totalSteps = 5,
  stepLabels = ["Welcome", "Desires", "Core Values", "Commitments", "Complete"],
}: OnboardingProgressProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto bg-background p-4 rounded-lg shadow-sm">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {progressPercentage.toFixed(0)}%
        </span>
      </div>

      <Progress value={progressPercentage} className="h-2 mb-4" />

      <div className="flex justify-between mt-2">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${index < currentStep ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-4 h-4 rounded-full mb-1 ${index < currentStep ? "bg-primary" : index === currentStep ? "border-2 border-primary bg-background" : "bg-muted"}`}
            />
            <span className="text-xs whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingProgress;
