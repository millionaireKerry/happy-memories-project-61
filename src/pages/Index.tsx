import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { MemoryFeed } from "@/components/memories/MemoryFeed";
import { UploadView } from "@/components/upload/UploadView";
import { BookingView } from "@/components/booking/BookingView";
import { CommunityView } from "@/components/community/CommunityView";
import { MessagesView } from "@/components/messages/MessagesView";
import { ProfileView } from "@/components/profile/ProfileView";
import { ResourcesView } from "@/components/resources/ResourcesView";
import { HowToView } from "@/components/help/HowToView";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('happy-memories-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowWelcome(true);
    }
  }, []);

  const renderActiveView = () => {
    console.log("Current active tab:", activeTab);
    switch (activeTab) {
      case "dashboard":
        return <DashboardView onTabChange={setActiveTab} />;
      case "memories":
        console.log("Rendering MemoryFeed - should show memories now");
        const memoryComponent = <MemoryFeed />;
        console.log("MemoryFeed component created:", memoryComponent);
        return memoryComponent;
      case "upload":
        return <UploadView />;
      case "resources":
        return <ResourcesView />;
      case "booking":
        return <BookingView />;
      case "community":
        return <CommunityView />;
      case "messages":
        return <MessagesView />;
      case "profile":
        return <ProfileView />;
      case "help":
        return <HowToView />;
      default:
        return <DashboardView onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header onNavigate={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderActiveView()}
      </main>

      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
    </div>
  );
};

export default Index;
