import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingQuestion from "@/components/OnboardingQuestion";
import OnboardingProgress from "@/components/OnboardingProgress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface OnboardingAnswer {
  question: string;
  answer: string;
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);

  const questions = [
    {
      question: "What do you want?",
      description: "Tell us about your immediate goals and desires.",
      placeholder: "e.g., I want to be happy, I want to be more productive...",
    },
    {
      question: "What do you really want?",
      description:
        "Dig deeper into your core motivations and long-term aspirations.",
      placeholder: "e.g., I want financial freedom, I want a loving partner...",
    },
    {
      question: "What are your regular commitments?",
      description: "Tell us about your recurring activities and obligations.",
      placeholder:
        "e.g., Mon-Fri 9-5 I have work, Mon/Wed/Fri I go to the gym 7-8:30am...",
    },
  ];

  const handleNext = (answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentStep] = {
      question: questions[currentStep].question,
      answer,
    };
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save answers to backend/storage here
      console.log("Onboarding complete:", updatedAnswers);
      navigate("/"); // Navigate to home page after completion
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentStep]?.answer || "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome to Your Personal Assistant
          </h1>
          <p className="text-center text-muted-foreground">
            Let's get to know you better so we can help optimize your time and
            achieve your goals.
          </p>
        </div>

        <div className="mb-8">
          <OnboardingProgress
            currentStep={currentStep + 1}
            totalSteps={questions.length + 2}
            stepLabels={[
              "Welcome",
              "Desires",
              "Core Values",
              "Commitments",
              "Complete",
            ]}
          />
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingQuestion
            question={currentQuestion.question}
            description={currentQuestion.description}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentStep === 0}
            isLast={currentStep === questions.length - 1}
            currentAnswer={currentAnswer}
          />
        </motion.div>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
