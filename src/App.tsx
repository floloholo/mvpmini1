import { Suspense, useEffect, useState } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { supabase, DEV_AUTO_LOGIN } from "./lib/supabase";

// Import pages
import ChatPage from "./pages/chat";
import CalendarPage from "./pages/calendar";
import MePage from "./pages/me";
import AuthPage from "./pages/auth";
import OnboardingPage from "./pages/onboarding";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect based on auth status
  useEffect(() => {
    if (isAuthenticated === null) return; // Still loading

    const path = window.location.pathname;

    // If authenticated and on auth page, redirect to home
    if (isAuthenticated && path === "/auth") {
      navigate("/");
    }

    // If not authenticated and not on auth page, redirect to auth
    // Skip this check during development with auto-login enabled
    if (!isAuthenticated && path !== "/auth" && !DEV_AUTO_LOGIN) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/settings" element={<Navigate to="/me" />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
