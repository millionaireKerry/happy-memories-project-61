import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, ProjectorIcon, Heart } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingScreens = [
  {
    title: "Welcome to the new Happy Memories!",
    description: "We've added exciting new features to make your visits even more special.",
    icon: Heart,
    color: "text-accent"
  },
  {
    title: "Book the Projector for Your Visits",
    description: "Reserve the projector to share photos and videos during your time together.",
    icon: ProjectorIcon,
    color: "text-primary"
  },
  {
    title: "Check the Community Calendar",
    description: "Stay updated with events, activities, and important announcements.",
    icon: Calendar,
    color: "text-secondary-foreground"
  }
];

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const nextScreen = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const prevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('happy-memories-onboarding-seen', 'true');
    onClose();
  };

  const currentScreenData = onboardingScreens[currentScreen];
  const Icon = currentScreenData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <Card className="border-0 shadow-none">
          <CardContent className="p-6 text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
              <Icon className={`w-8 h-8 ${currentScreenData.color}`} />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                {currentScreenData.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {currentScreenData.description}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center space-x-2">
              {onboardingScreens.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentScreen 
                      ? 'bg-primary w-6' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="ghost"
                onClick={prevScreen}
                disabled={currentScreen === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                onClick={nextScreen}
                className="flex items-center gap-2"
              >
                {currentScreen === onboardingScreens.length - 1 ? 'Get Started' : 'Next'}
                {currentScreen < onboardingScreens.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>

            {/* Skip option */}
            {currentScreen === 0 && (
              <Button
                variant="ghost"
                onClick={handleFinish}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Skip tour
              </Button>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};