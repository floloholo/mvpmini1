import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { ArrowLeft, ArrowRight, Mic } from "lucide-react";

interface OnboardingQuestionProps {
  question: string;
  description?: string;
  onNext: (answer: string) => void;
  onPrevious?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  currentAnswer?: string;
}

const OnboardingQuestion = ({
  question = "What do you want?",
  description = "Tell us about your goals and aspirations.",
  onNext = () => {},
  onPrevious = () => {},
  isFirst = false,
  isLast = false,
  currentAnswer = "",
}: OnboardingQuestionProps) => {
  const [answer, setAnswer] = useState(currentAnswer);
  const [isRecording, setIsRecording] = useState(false);

  const handleNext = () => {
    onNext(answer);
  };

  const toggleRecording = () => {
    // This is a placeholder for speech recognition functionality
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop speech recognition
    // and update the answer state with the transcribed text
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full bg-background">
      <Card className="w-full max-w-[800px] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {question}
          </CardTitle>
          <CardDescription className="text-center mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[150px] text-base"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${isRecording ? "bg-red-100 text-red-500" : ""}`}
                onClick={toggleRecording}
                title="Voice input (coming soon)"
              >
                <Mic
                  className={`h-5 w-5 ${isRecording ? "text-red-500" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className={isFirst ? "invisible" : ""}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!answer.trim()}>
            {isLast ? "Finish" : "Next"}
            {!isLast && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingQuestion;
