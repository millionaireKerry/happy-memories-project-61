import { Card } from "@/components/ui/card";
import { 
  Home, 
  Upload, 
  MessageSquare, 
  Heart,
  Camera,
  HelpCircle
} from "lucide-react";

export const HowToView = () => {
  const menuItems = [
    {
      icon: Home,
      title: "Dashboard",
      description: "Your main hub - see recent activity, quick stats, and get started with key features"
    },
    {
      icon: Camera,
      title: "Memories",
      description: "Browse and interact with the private Instagram-style feed of happy memories and photos"
    },
    {
      icon: Upload,
      title: "Upload",
      description: "Add new photos and memories with captions to share with family and care staff"
    },
    {
      icon: MessageSquare,
      title: "Messages",
      description: "Secure messaging between family members and care home staff for updates and coordination"
    },
    {
      icon: Heart,
      title: "Likes & Dislikes",
      description: "Manage resident preferences, interests, and personal information for better care planning"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold gradient-text">How to Use Happy Memories</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome to your Happy Memories app! Here's a quick guide to help you navigate and make the most of each feature.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">Navigation Menu Guide</h2>
        <div className="grid gap-6 md:gap-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Start by exploring the <strong>Dashboard</strong> to get an overview of recent activity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Use <strong>Upload</strong> to add your first happy memory with a meaningful caption</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Check the <strong>Memories</strong> feed to see all shared photos in a beautiful gallery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Stay connected through <strong>Messages</strong> with family and care staff</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Update <strong>Likes & Dislikes</strong> to help care staff provide personalised care</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};