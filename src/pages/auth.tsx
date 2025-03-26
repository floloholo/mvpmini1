import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuthSubmit = async (
    data: any,
    mode: "login" | "register" | "verification",
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === "login") {
        // Handle login
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        // Redirect to home page on successful login
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/");
      } else if (mode === "register") {
        // Handle registration
        const { error, data: signUpData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              created_at: new Date().toISOString(),
            },
            // In development, we can skip email verification
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (signUpData.user && !signUpData.session) {
          // Email confirmation required
          toast({
            title: "Registration successful",
            description: "Please check your email to confirm your account.",
          });
        } else {
          // Auto-confirmed (development mode)
          toast({
            title: "Registration successful",
            description:
              "Your account has been created and you're now logged in.",
          });
          navigate("/onboarding");
        }
      } else if (mode === "verification") {
        // Handle verification (if needed in the future)
        // This would be for password reset or other verification flows
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage(
        error.message || "An error occurred during authentication",
      );
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Time Assistant
          </h1>
          <p className="text-muted-foreground">
            Your personal AI time management companion
          </p>
        </div>

        {errorMessage && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <AuthForm onSubmit={handleAuthSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AuthPage;
