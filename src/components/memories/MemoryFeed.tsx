import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share,
  Calendar,
  MapPin,
  Play
} from "lucide-react";

// Import memory images
import memoryGarden from "@/assets/memory-garden.jpg";
import memoryChristmas from "@/assets/memory-christmas.jpg";
import memoryBeach from "@/assets/memory-beach.jpg";
import memoryBike from "@/assets/memory-bike.jpg";
import memoryRoast from "@/assets/memory-roast.jpg";
import memoryWedding from "@/assets/memory-wedding.jpg";
import memoryWorkshop from "@/assets/memory-workshop.jpg";
import memoryTea from "@/assets/memory-tea.jpg";
import memorySports from "@/assets/memory-sports.jpg";
import memoryBedtime from "@/assets/memory-bedtime.jpg";

export const MemoryFeed = () => {
  console.log("MemoryFeed component is rendering");
  const [likedMemories, setLikedMemories] = useState<Set<number>>(new Set());

  // Sample memory data with enhanced Memory Lane features
  const memories = [
    {
      id: 1,
      caption: "Beautiful day in the garden - Mum always loved her roses! 🌹",
      author: "Emma (Daughter)",
      date: "2 days ago",
      memoryDate: "June 15, 2019",
      location: "Sunny Gardens Care Home",
      likes: 12,
      comments: 3,
      image: memoryGarden,
      tags: ["garden", "roses", "happy"],
      hasVoiceNote: true,
      voiceNoteDuration: 15
    },
    {
      id: 2,
      caption: "Christmas 1985 - Dad in his favourite armchair with the grandkids. He was so proud! 🎄",
      author: "Michael (Son)",
      date: "1 week ago",
      memoryDate: "December 25, 1985", 
      location: "Family Home",
      likes: 18,
      comments: 7,
      image: memoryChristmas,
      tags: ["christmas", "family", "memories"],
      hasVoiceNote: false
    },
    {
      id: 3,
      caption: "Beach holiday in Cornwall 1978 - Mum and Dad's favourite spot. They went every summer! 🏖️",
      author: "Sarah (Care Staff)",
      date: "3 days ago",
      memoryDate: "August 10, 1978",
      location: "Cornwall Coast",
      likes: 15,
      comments: 5,
      image: memoryBeach,
      tags: ["holiday", "beach", "cornwall"],
      hasVoiceNote: true,
      voiceNoteDuration: 22
    },
    {
      id: 4,
      caption: "Dad teaching me to ride a bike in 1965. He was so patient and encouraging! 🚲",
      author: "Robert (Son)",
      date: "4 days ago",
      memoryDate: "May 3, 1965",
      location: "Victoria Park",
      likes: 22,
      comments: 8,
      image: memoryBike,
      tags: ["childhood", "learning", "bike"],
      hasVoiceNote: false
    },
    {
      id: 5,
      caption: "Mum's famous Sunday roast - the whole family would gather every week ✨",
      author: "Lisa (Care Staff)",
      date: "5 days ago",
      location: "Family Kitchen",
      likes: 31,
      comments: 12,
      image: memoryRoast,
      tags: ["cooking", "sunday", "tradition"]
    },
    {
      id: 6,
      caption: "Wedding day 1962 - 60 years of love and laughter together 💕",
      author: "Margaret (Daughter)",
      date: "1 week ago",
      location: "St. Mary's Church",
      likes: 45,
      comments: 15,
      image: memoryWedding,
      tags: ["wedding", "love", "anniversary"]
    },
    {
      id: 7,
      caption: "Dad's workshop where he crafted beautiful furniture. Such skilled hands! 🔨",
      author: "James (Grandson)",
      date: "6 days ago",
      location: "Home Workshop",
      likes: 19,
      comments: 6,
      image: memoryWorkshop,
      tags: ["crafts", "woodwork", "skills"]
    },
    {
      id: 8,
      caption: "Afternoon tea with friends at the care home - Mum loves these social moments! ☕",
      author: "Jenny (Care Staff)",
      date: "Yesterday",
      location: "Sunny Gardens Care Home",
      likes: 8,
      comments: 2,
      image: memoryTea,
      tags: ["tea", "friends", "social"]
    },
    {
      id: 9,
      caption: "School sports day 1970 - Dad cheering me on from the sidelines 🏃‍♂️",
      author: "David (Son)",
      date: "1 week ago",
      location: "Primary School",
      likes: 14,
      comments: 4,
      image: memorySports,
      tags: ["school", "sports", "support"]
    },
    {
      id: 10,
      caption: "Mum reading bedtime stories - she had the most soothing voice 📚",
      author: "Anna (Granddaughter)",
      date: "2 weeks ago",
      location: "Childhood Bedroom",
      likes: 27,
      comments: 9,
      image: memoryBedtime,
      tags: ["stories", "bedtime", "voice"]
    }
  ];

  console.log("Memories array length:", memories.length);
  console.log("First memory:", memories[0]);

  const handleLike = (memoryId: number) => {
    setLikedMemories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memoryId)) {
        newSet.delete(memoryId);
      } else {
        newSet.add(memoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Happy Memories Feed</h2>
        <p className="text-muted-foreground">A private space for family and care team to share precious moments</p>
      </div>

      <div className="space-y-6">
        {memories.map((memory, index) => (
          <Card key={memory.id} className="memory-card feed-item overflow-hidden border shadow-sm bg-card">
            {/* Header */}
            <div className="p-4 border-b bg-card/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {memory.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{memory.author}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {memory.date}
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    {memory.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src={memory.image} 
                alt={memory.caption}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Content */}
            <CardContent className="p-4">
              <p className="text-sm mb-3 leading-relaxed">{memory.caption}</p>
              
              {/* Memory Lane Features */}
              <div className="space-y-2 mb-4">
                {memory.memoryDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Memory from {memory.memoryDate}</span>
                  </div>
                )}
                {memory.hasVoiceNote && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    <span>Voice note ({memory.voiceNoteDuration}s)</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${likedMemories.has(memory.id) ? 'text-accent' : ''}`}
                    onClick={() => handleLike(memory.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${likedMemories.has(memory.id) ? 'fill-accent' : ''}`} 
                    />
                    {memory.likes + (likedMemories.has(memory.id) ? 1 : 0)}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {memory.comments}
                  </Button>
                </div>

                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Memories
        </Button>
      </div>
    </div>
  );
};