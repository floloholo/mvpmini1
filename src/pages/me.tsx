import React, { useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";
import ProfileSection from "../components/ProfileSection";
import { Link } from "react-router-dom";

const MePage = () => {
  // Mock data for profile sections - in a real app, this would come from an API or state management
  const [profileData, setProfileData] = useState({
    desires: {
      title: "What do you want?",
      description: "Your primary desires and goals",
      content: "I want to be happy and have a balanced life.",
    },
    deeperDesires: {
      title: "What do you really want?",
      description: "Your deeper motivations and aspirations",
      content:
        "I want financial freedom, a loving partner, and to make a positive impact on the world.",
    },
    regularCommitments: {
      title: "What are your regulars?",
      description: "Your recurring commitments and activities",
      content:
        "Monday - Friday 9-5 I have work\nMonday, Wednesday, and Friday I go to the gym 7-8:30am\nSaturday mornings I have a language class 10-12pm",
    },
  });

  // Handle saving updated content for each section
  const handleSaveSection = (
    section: keyof typeof profileData,
    content: string,
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        content,
      },
    }));
    // In a real app, you would also save this to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Me</h1>
        </div>

        {/* Profile sections */}
        <div className="space-y-6">
          <ProfileSection
            title={profileData.desires.title}
            description={profileData.desires.description}
            content={profileData.desires.content}
            onSave={(content) => handleSaveSection("desires", content)}
          />

          <ProfileSection
            title={profileData.deeperDesires.title}
            description={profileData.deeperDesires.description}
            content={profileData.deeperDesires.content}
            onSave={(content) => handleSaveSection("deeperDesires", content)}
          />

          <ProfileSection
            title={profileData.regularCommitments.title}
            description={profileData.regularCommitments.description}
            content={profileData.regularCommitments.content}
            onSave={(content) =>
              handleSaveSection("regularCommitments", content)
            }
          />
        </div>

        {/* Journal button (stretch goal) */}
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-6 py-2"
            onClick={() => alert("Journal feature coming soon!")}
          >
            <BookOpen className="h-5 w-5" />
            <span>View Conversation History</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MePage;
