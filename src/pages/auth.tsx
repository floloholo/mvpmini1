import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { createClient } from "@supabase/supabase-js";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Import the supabase client from our lib
  import { supabase } from "@/lib/supabase";

  const handleAuthSubmit = async (
    data: any,
    mode: "login" | "register" | "verification",
  ) => {
    setIsLoading(true);

    try {
      if (mode === "login") {
        // Handle login
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        // Redirect to home page on successful login
        navigate("/");
      } else if (mode === "register") {
        // Handle registration
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
            },
          },
        });

        if (error) throw error;

        // The verification email will be sent automatically by Supabase
        // The UI will show the verification screen
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // In a real app, you would show an error message to the user
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

        <AuthForm onSubmit={handleAuthSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AuthPage;
