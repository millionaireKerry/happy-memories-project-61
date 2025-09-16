import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, addDays, isSameMonth } from "date-fns";
import { 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Bell,
  Image as ImageIcon,
  Megaphone,
  PartyPopper
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: number;
  type: 'announcement' | 'event';
  title: string;
  description: string;
  imageUrl?: string;
  date?: Date;
  time?: string;
  createdAt: Date;
  author: string;
}

export const CommunityView = () => {
  const [userRole] = useState<'family' | 'staff'>('family'); // In real app, from auth
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newPostType, setNewPostType] = useState<'announcement' | 'event'>('announcement');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Sample announcements and events
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      type: 'event',
      title: 'Christmas Carol Service',
      description: 'Join us for our annual Christmas carol service in the main lounge. Families welcome! We\'ll have mince pies and hot chocolate.',
      date: new Date(2024, 11, 20),
      time: '2:00 PM',
      createdAt: new Date(2024, 11, 10),
      author: 'Activities Team'
    },
    {
      id: 2,
      type: 'announcement',
      title: 'New Magic Table Activities',
      description: 'We\'ve added new interactive colouring activities featuring local landmarks and seasonal themes. Perfect for reminiscence sessions!',
      createdAt: new Date(2024, 11, 8),
      author: 'Care Staff'
    },
    {
      id: 3,
      type: 'event',
      title: 'Family Coffee Morning',
      description: 'Monthly family coffee morning in the garden room. Come meet other families and share stories.',
      date: new Date(2024, 11, 15),
      time: '10:00 AM',
      createdAt: new Date(2024, 11, 5),
      author: 'Family Liaison'
    },
    {
      id: 4,
      type: 'announcement', 
      title: 'Memory Photo Competition',
      description: 'Submit your favourite family photos for our memory wall display. Winners will be featured in the Christmas newsletter!',
      createdAt: new Date(2024, 11, 3),
      author: 'Activities Team'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: undefined as Date | undefined,
    eventTime: '',
    imageFile: null as File | null
  });

  const handleCreatePost = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and description.",
        variant: "destructive"
      });
      return;
    }

    if (newPostType === 'event' && (!formData.eventDate || !formData.eventTime)) {
      toast({
        title: "Missing Event Details",
        description: "Please set event date and time.",
        variant: "destructive"
      });
      return;
    }

    const newPost: Announcement = {
      id: Date.now(),
      type: newPostType,
      title: formData.title,
      description: formData.description,
      date: newPostType === 'event' ? formData.eventDate : undefined,
      time: newPostType === 'event' ? formData.eventTime : undefined,
      imageUrl: formData.imageFile ? URL.createObjectURL(formData.imageFile) : undefined,
      createdAt: new Date(),
      author: 'Staff Member' // In real app, from auth
    };

    setAnnouncements(prev => [newPost, ...prev]);

    toast({
      title: `${newPostType === 'event' ? 'Event' : 'Announcement'} Created! 🎉`,
      description: `${formData.title} has been posted to the community feed.`
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      eventDate: undefined,
      eventTime: '',
      imageFile: null
    });
    setIsCreateDialogOpen(false);
  };

  const getEventsForDate = (date: Date) => {
    return announcements.filter(item => 
      item.type === 'event' && 
      item.date && 
      item.date.toDateString() === date.toDateString()
    );
  };

  const upcomingEvents = announcements
    .filter(item => item.type === 'event' && item.date && item.date >= new Date())
    .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Community Hub</h2>
          <p className="text-muted-foreground">
            Stay connected with care home announcements and events
          </p>
        </div>

        {userRole === 'staff' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Post Type Selection */}
                <div className="flex gap-2">
                  <Button
                    variant={newPostType === 'announcement' ? 'default' : 'outline'}
                    onClick={() => setNewPostType('announcement')}
                    className="flex-1"
                  >
                    <Megaphone className="mr-2 h-4 w-4" />
                    Announcement
                  </Button>
                  <Button
                    variant={newPostType === 'event' ? 'default' : 'outline'}
                    onClick={() => setNewPostType('event')}
                    className="flex-1"
                  >
                    <PartyPopper className="mr-2 h-4 w-4" />
                    Event
                  </Button>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={newPostType === 'event' ? 'Event name...' : 'Announcement title...'}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="post-description">Description</Label>
                  <Textarea
                    id="post-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Details about this announcement or event..."
                    rows={3}
                  />
                </div>

                {/* Event-specific fields */}
                {newPostType === 'event' && (
                  <>
                    <div>
                      <Label>Event Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.eventDate ? format(formData.eventDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.eventDate}
                            onSelect={(date) => setFormData(prev => ({ ...prev, eventDate: date }))}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="event-time">Event Time</Label>
                      <Input
                        id="event-time"
                        type="time"
                        value={formData.eventTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                {/* Image Upload */}
                <div>
                  <Label htmlFor="post-image">Image (Optional)</Label>
                  <Input
                    id="post-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                  />
                </div>

                <Button onClick={handleCreatePost} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create {newPostType === 'event' ? 'Event' : 'Announcement'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
                <p className="text-muted-foreground">
                  Check back later for updates from the care team
                </p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={item.type === 'event' ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {item.type === 'event' ? (
                          <PartyPopper className="h-3 w-3" />
                        ) : (
                          <Megaphone className="h-3 w-3" />
                        )}
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(item.createdAt, 'MMM d')} • {item.author}
                    </p>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  
                  {item.date && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(item.date, 'PPP')}
                      </div>
                      {item.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {item.imageUrl && (
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Event Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full pointer-events-auto"
                  components={{
                    DayContent: ({ date }) => {
                      const events = getEventsForDate(date);
                      return (
                        <div className="relative w-full h-full">
                          <span>{date.getDate()}</span>
                          {events.length > 0 && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      );
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PartyPopper className="h-5 w-5 text-accent" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-6">
                      <PartyPopper className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No upcoming events</p>
                    </div>
                  ) : (
                    upcomingEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {event.date && format(event.date, 'MMM d')}
                            {event.time && ` at ${event.time}`}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};