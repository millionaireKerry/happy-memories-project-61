import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Plus,
  Users,
  Clock,
  Star
} from "lucide-react";

export const MessagesView = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Care Team - Morning Shift",
      participants: ["Sarah (Nurse)", "Mike (Care Assistant)"],
      lastMessage: "We'll set up the memory session at 2pm today!",
      timestamp: "10 minutes ago",
      unread: 2,
      type: "group"
    },
    {
      id: 2,
      name: "Emma (Daughter)",
      participants: ["Emma"],
      lastMessage: "Thank you for sharing those lovely garden photos",
      timestamp: "2 hours ago",
      unread: 0,
      type: "family"
    },
    {
      id: 3,
      name: "Care Coordinator",
      participants: ["Lisa (Coordinator)"],
      lastMessage: "Monthly care plan review scheduled for next week",
      timestamp: "1 day ago",
      unread: 1,
      type: "staff"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah (Nurse)",
      content: "Good morning! We've prepared a lovely memory session for this afternoon. The new photos from the garden party look wonderful!",
      timestamp: "9:30 AM",
      isOwn: false,
      type: "text"
    },
    {
      id: 2,
      sender: "You",
      content: "That's fantastic! Mum always loved looking at family photos. The garden party ones should bring back lovely memories.",
      timestamp: "9:45 AM",
      isOwn: true,
      type: "text"
    },
    {
      id: 3,
      sender: "Mike (Care Assistant)",
      content: "We'll set up the memory session at 2pm today! Should we focus on the garden and family themes?",
      timestamp: "10:15 AM",
      isOwn: false,
      type: "text"
    },
    {
      id: 4,
      sender: "You",
      content: "Perfect timing! Yes, garden and family photos are her favourites. She always talks about her rose garden.",
      timestamp: "10:20 AM",
      isOwn: true,
      type: "text"
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Messages</h2>
        <p className="text-muted-foreground">Secure communication with family and care team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 cursor-pointer transition-colors border-b border-border/50 hover:bg-muted/50 ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {conversation.type === 'group' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          conversation.name.charAt(0)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm truncate">{conversation.name}</p>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {conversation.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-3 flex flex-col">
          {/* Header */}
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {currentConversation?.type === 'group' ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    currentConversation?.name.charAt(0)
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{currentConversation?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentConversation?.participants.join(", ")}
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {!message.isOwn && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {message.sender}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp}
                    </p>
                  </div>
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8 order-1 mr-2 mt-auto">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {message.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 min-h-[80px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                variant="gradient" 
                size="lg"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="memory-card">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Care Team Updates</h4>
            <p className="text-sm text-muted-foreground">Get daily updates about activities and care</p>
          </CardContent>
        </Card>
        
        <Card className="memory-card">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Family Group</h4>
            <p className="text-sm text-muted-foreground">Connect with other family members</p>
          </CardContent>
        </Card>
        
        <Card className="memory-card">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Memory Requests</h4>
            <p className="text-sm text-muted-foreground">Staff can request specific themed photos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};