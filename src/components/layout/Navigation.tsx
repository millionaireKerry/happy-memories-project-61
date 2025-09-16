import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Upload, 
  MessageSquare, 
  Heart,
  Users,
  Camera,
  Calendar,
  HelpCircle,
  FolderOpen
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "memories", label: "Memories", icon: Camera },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "resources", label: "Resources", icon: FolderOpen },
    { id: "booking", label: "Book Projector", icon: Calendar },
    { id: "community", label: "Community", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Likes & Dislikes", icon: Heart },
    { id: "help", label: "How to Use", icon: HelpCircle },
  ];

  return (
    <Card className="p-2 mb-6">
      <nav className="flex flex-wrap gap-2 justify-center md:justify-start">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "gradient" : "ghost"}
              size="sm"
              className={`flex items-center gap-2 ${
                isActive ? "shadow-lg" : ""
              }`}
              onClick={() => {
                console.log("Navigation clicked, changing to:", item.id);
                onTabChange(item.id);
              }}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </Card>
  );
};