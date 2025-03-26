import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Development bypass flag - set to true to bypass login during development
// IMPORTANT: Set this to false before deploying to production
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
        email: "dev@tempotest.com",
        password: "devpassword123",
      });

      if (error) {
        console.log("Auto-login failed, creating test user...");
        // If login fails, try to create the test user
        const { error: signUpError } = await supabase.auth.signUp({
          email: "dev@tempotest.com",
          password: "devpassword123",
          options: {
            data: {
              name: "Dev Test User",
            },
            // Skip email verification for development
            emailRedirectTo: window.location.origin,
          },
        });

        if (signUpError) {
          console.error("Failed to create test user:", signUpError);
          return false;
        }

        // Try logging in again
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: "dev@tempotest.com",
          password: "devpassword123",
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

// Helper function to get the current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id || null;
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};
