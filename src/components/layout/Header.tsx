import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, MessageCircle, Settings, Heart, User, LogOut, Palette } from "lucide-react";

interface HeaderProps {
  onNavigate?: (tab: string) => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-accent fill-accent/20" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Happy Memories
                </h1>
                <p className="text-xs text-muted-foreground">Social-Ability</p>
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => onNavigate?.('messages')}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-background"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuItem className="flex-col items-start p-4">
                  <div className="font-semibold text-sm">New memory uploaded</div>
                  <div className="text-xs text-muted-foreground mt-1">Sarah added "Garden visit with Mum" - 2 hours ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-4">
                  <div className="font-semibold text-sm">Message from care team</div>
                  <div className="text-xs text-muted-foreground mt-1">"Thank you for the lovely photos!" - 1 day ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-4">
                  <div className="font-semibold text-sm">Memory session scheduled</div>
                  <div className="text-xs text-muted-foreground mt-1">Tomorrow at 2:00 PM - 2 days ago</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Palette className="mr-2 h-4 w-4" />
                  Appearance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.('help')}>
                  <Heart className="mr-2 h-4 w-4" />
                  How to Use
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                FM
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};