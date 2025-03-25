import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * Component to protect routes that require authentication
 * Can be used to either require auth or redirect away if already authenticated
 */
const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const isAuthenticated = !!data.session;

      if (requireAuth && !isAuthenticated) {
        // Redirect to login if auth is required but user is not authenticated
        navigate("/auth");
      } else if (!requireAuth && isAuthenticated) {
        // Redirect to home if auth is not required but user is already authenticated
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, requireAuth]);

  return <>{children}</>;
};

export default AuthGuard;
