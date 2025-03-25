import React from "react";
import { useNavigate } from "react-router-dom";
import SmileyButton from "./SmileyButton";
import { Settings, Calendar, Star } from "lucide-react";
import NavigationButton from "./NavigationButton";

interface HomeProps {
  className?: string;
}

const Home = ({ className = "" }: HomeProps) => {
  const navigate = useNavigate();

  return (
    <div className={`w-full min-h-screen bg-background ${className}`}>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Personal AI Assistant</h1>
        <div className="flex flex-col items-center justify-center gap-8">
          <SmileyButton size="lg" onClick={() => navigate("/chat")} />
          <div className="flex gap-8 mt-4">
            <NavigationButton
              icon={Star}
              to="/me"
              label="Me"
              size="md"
              variant="secondary"
            />
            <NavigationButton
              icon={Calendar}
              to="/calendar"
              label="Calendar"
              size="md"
              variant="secondary"
            />
          </div>
          <div className="absolute top-4 right-4">
            <NavigationButton
              icon={Settings}
              to="/settings"
              size="sm"
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
