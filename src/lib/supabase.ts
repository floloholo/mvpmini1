import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Development bypass flag - set to true to bypass login during development
export const DEV_AUTO_LOGIN = true;

// Function to automatically log in a test user during development
export const autoLoginForDevelopment = async () => {
  if (DEV_AUTO_LOGIN) {
    try {
      // Check if we're already logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) return true; // Already logged in

      // Auto-login with test credentials
      const { error } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      if (error) {
        console.log("Auto-login failed, creating test user...");
        // If login fails, try to create the test user
        const { error: signUpError } = await supabase.auth.signUp({
          email: "test@example.com",
          password: "password123",
          options: {
            data: {
              name: "Test User",
            },
          },
        });

        if (signUpError) {
          console.error("Failed to create test user:", signUpError);
          return false;
        }

        // Try logging in again
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: "test@example.com",
          password: "password123",
        });

        if (retryError) {
          console.error(
            "Failed to log in after creating test user:",
            retryError,
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Auto-login error:", error);
      return false;
    }
  }

  return false;
};
