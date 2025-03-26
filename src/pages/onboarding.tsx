import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingQuestion from "@/components/OnboardingQuestion";
import OnboardingProgress from "@/components/OnboardingProgress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase, getCurrentUserId } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface OnboardingAnswer {
  question: string;
  answer: string;
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        setLoading(true);
        const id = await getCurrentUserId();
        setUserId(id);

        if (id) {
          const { data, error } = await supabase
            .from("user_onboarding")
            .select("*")
            .eq("user_id", id)
            .single();

          if (data && !error) {
            // User has already completed onboarding, redirect to home
            if (
              data.what_do_you_want &&
              data.what_do_you_really_want &&
              data.regulars
            ) {
              navigate("/");
              return;
            }

            // User has started but not completed onboarding
            const newAnswers = [];
            if (data.what_do_you_want) {
              newAnswers[0] = {
                question: questions[0].question,
                answer: data.what_do_you_want,
              };
            }
            if (data.what_do_you_really_want) {
              newAnswers[1] = {
                question: questions[1].question,
                answer: data.what_do_you_really_want,
              };
            }
            if (data.regulars) {
              newAnswers[2] = {
                question: questions[2].question,
                answer: data.regulars,
              };
            }

            if (newAnswers.length > 0) {
              setAnswers(newAnswers);
              // Set current step to the next unanswered question
              for (let i = 0; i < questions.length; i++) {
                if (!newAnswers[i] || !newAnswers[i].answer) {
                  setCurrentStep(i);
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [navigate, questions]);

  const saveAnswerToSupabase = async (
    questionIndex: number,
    answer: string,
  ) => {
    if (!userId) return;

    try {
      const updateData: Record<string, string> = {};

      // Map question index to database field
      switch (questionIndex) {
        case 0:
          updateData.what_do_you_want = answer;
          break;
        case 1:
          updateData.what_do_you_really_want = answer;
          break;
        case 2:
          updateData.regulars = answer;
          break;
      }

      // Check if user already has an onboarding record
      const { data } = await supabase
        .from("user_onboarding")
        .select("id")
        .eq("user_id", userId);

      if (data && data.length > 0) {
        // Update existing record
        await supabase
          .from("user_onboarding")
          .update(updateData)
          .eq("user_id", userId);
      } else {
        // Create new record
        await supabase.from("user_onboarding").insert({
          user_id: userId,
          ...updateData,
        });
      }
    } catch (error) {
      console.error("Error saving onboarding answer:", error);
    }
  };

  const handleNext = async (answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentStep] = {
      question: questions[currentStep].question,
      answer,
    };
    setAnswers(updatedAnswers);

    // Save answer to Supabase
    await saveAnswerToSupabase(currentStep, answer);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All answers saved, navigate to home
      navigate("/");
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

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
