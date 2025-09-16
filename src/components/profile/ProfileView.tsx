import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  X,
  Plus,
  Music,
  Utensils,
  Palette,
  MapPin,
  Users,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProfileView = () => {
  const [newLike, setNewLike] = useState("");
  const [newDislike, setNewDislike] = useState("");
  const { toast } = useToast();

  const [likes, setLikes] = useState([
    { id: 1, category: "food", text: "Chocolate cake", icon: Utensils },
    { id: 2, category: "music", text: "Frank Sinatra", icon: Music },
    { id: 3, category: "activity", text: "Garden walks", icon: MapPin },
    { id: 4, category: "people", text: "Visits from grandchildren", icon: Users },
    { id: 5, category: "food", text: "Cup of tea at 3pm", icon: Utensils },
    { id: 6, category: "music", text: "Classical music during meals", icon: Music },
    { id: 7, category: "activity", text: "Looking at old photo albums", icon: Palette },
    { id: 8, category: "time", text: "Morning sunshine in the conservatory", icon: Clock },
  ]);

  const [dislikes, setDislikes] = useState([
    { id: 1, category: "food", text: "Spicy food", icon: Utensils },
    { id: 2, category: "activity", text: "Loud environments", icon: Music },
    { id: 3, category: "time", text: "Being rushed during meals", icon: Clock },
    { id: 4, category: "activity", text: "Crowded spaces", icon: Users },
  ]);

  const categories = [
    { id: "food", label: "Food & Drink", icon: Utensils, color: "bg-green-100 text-green-800" },
    { id: "music", label: "Music & Entertainment", icon: Music, color: "bg-purple-100 text-purple-800" },
    { id: "activity", label: "Activities", icon: Palette, color: "bg-blue-100 text-blue-800" },
    { id: "people", label: "Social", icon: Users, color: "bg-pink-100 text-pink-800" },
    { id: "time", label: "Routines", icon: Clock, color: "bg-orange-100 text-orange-800" },
    { id: "place", label: "Places", icon: MapPin, color: "bg-teal-100 text-teal-800" },
  ];

  const addLike = () => {
    if (newLike.trim()) {
      const newItem = {
        id: Date.now(),
        category: "activity",
        text: newLike.trim(),
        icon: Heart
      };
      setLikes(prev => [...prev, newItem]);
      setNewLike("");
      toast({
        title: "Like added! 💝",
        description: "Care staff will be notified of this preference.",
      });
    }
  };

  const addDislike = () => {
    if (newDislike.trim()) {
      const newItem = {
        id: Date.now(),
        category: "activity",
        text: newDislike.trim(),
        icon: X
      };
      setDislikes(prev => [...prev, newItem]);
      setNewDislike("");
      toast({
        title: "Preference noted",
        description: "Care staff will be aware to avoid this.",
      });
    }
  };

  const removeLike = (id: number) => {
    setLikes(prev => prev.filter(item => item.id !== id));
  };

  const removeDislike = (id: number) => {
    setDislikes(prev => prev.filter(item => item.id !== id));
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[2];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Likes & Dislikes</h2>
        <p className="text-muted-foreground">Help care staff provide personalised care by sharing preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Likes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-accent fill-accent/20" />
              Things They Love
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Like */}
            <div className="flex gap-2">
              <Input
                placeholder="Add something they enjoy..."
                value={newLike}
                onChange={(e) => setNewLike(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLike()}
                className="flex-1"
              />
              <Button variant="warm" onClick={addLike}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Likes List */}
            <div className="space-y-2">
              {likes.map((item) => {
                const category = getCategoryInfo(item.category);
                const Icon = category.icon;
                
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 group hover:bg-secondary/50 transition-colors">
                    <div className={`h-8 w-8 rounded-full ${category.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm">{item.text}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeLike(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dislikes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <X className="h-5 w-5 text-destructive" />
              Things to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Dislike */}
            <div className="flex gap-2">
              <Input
                placeholder="Add something to avoid..."
                value={newDislike}
                onChange={(e) => setNewDislike(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDislike()}
                className="flex-1"
              />
              <Button variant="outline" onClick={addDislike}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Dislikes List */}
            <div className="space-y-2">
              {dislikes.map((item) => {
                const category = getCategoryInfo(item.category);
                const Icon = category.icon;
                
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20 group hover:bg-destructive/10 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm">{item.text}</span>
                    <Badge variant="outline" className="text-xs border-destructive/30">
                      {category.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeDislike(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preference Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="text-center p-3 rounded-lg bg-muted/30">
                  <div className={`h-10 w-10 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium">{category.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Care Staff</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-2">
            <Heart className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <p><strong>Likes:</strong> Use these to plan activities, choose music, or start conversations</p>
          </div>
          <div className="flex gap-2">
            <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p><strong>Dislikes:</strong> Avoid these to prevent distress and ensure comfort</p>
          </div>
          <div className="flex gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p><strong>Regular Updates:</strong> Family members can add new preferences as they think of them</p>
          </div>
        </CardContent>
      </Card>

      {/* Feedback & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Support & Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={() => {
              const email = 'app-feedback@social-ability.co.uk';
              const subject = 'Happy Memories App Feedback';
              const body = 'Hello,\n\nI would like to share feedback about the Happy Memories app:\n\n';
              window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="w-full"
          >
            Send Us Your Feedback
          </Button>
          
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Part of the Happiness Programme
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Powered by Social-Ability
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};