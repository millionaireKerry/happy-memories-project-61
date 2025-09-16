import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MessageCircle, 
  Heart, 
  Upload,
  Users,
  Clock
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const DashboardView = ({ onTabChange }: { onTabChange: (tab: string) => void }) => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div 
          className="h-56 md:h-72 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
          <CardContent className="relative h-full flex items-center justify-center text-center p-6">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Welcome to Happy Memories
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Share precious moments with your loved ones
              </p>
              <Button 
                variant="warm" 
                size="lg"
                onClick={() => onTabChange("upload")}
                className="shadow-lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your First Memory
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => onTabChange("upload")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New Photos
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => onTabChange("messages")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Message to Care Team
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => onTabChange("profile")}
          >
            <Heart className="mr-2 h-4 w-4" />
            Update Likes & Dislikes
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => onTabChange("memories")}
          >
            <Camera className="mr-2 h-4 w-4" />
            View Memory Feed
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sarah liked your photo</p>
              <p className="text-xs text-muted-foreground">Garden party memory • 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New message from care team</p>
              <p className="text-xs text-muted-foreground">About afternoon activities • 4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">3 new memories added</p>
              <p className="text-xs text-muted-foreground">Christmas 1985 album • Yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};