import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Users, MapPin, Calendar } from "lucide-react";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

interface GroupChatProps {
  activityTitle: string;
  activityLocation: string;
  activityDate: string;
  activityCategory: string;
  members: GroupMember[];
  messages: ChatMessage[];
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (message: string) => void;
}

const GroupChat = ({
  activityTitle,
  activityLocation,
  activityDate,
  activityCategory,
  members,
  messages,
  currentUserId,
  onBack,
  onSendMessage
}: GroupChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      travel: "bg-activity-travel",
      sports: "bg-activity-sports", 
      entertainment: "bg-activity-entertainment",
      food: "bg-activity-food",
      outdoor: "bg-activity-outdoor",
      wellness: "bg-activity-wellness"
    };
    return colors[category.toLowerCase()] || "bg-primary";
  };

  const onlineMembers = members.filter(m => m.status === 'online');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`${getCategoryColor(activityCategory)} text-white border-0`}>
                  {activityCategory}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {onlineMembers.length}/{members.length} online
                </Badge>
              </div>
              <CardTitle className="text-lg">{activityTitle}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {activityLocation}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {activityDate}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'system' ? (
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {message.message}
                  </Badge>
                </div>
              ) : (
                <div className={`flex gap-3 ${message.userId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  {message.userId !== currentUserId && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.userAvatar} alt={message.userName} />
                      <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                        {getInitials(message.userName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] ${message.userId === currentUserId ? 'order-first' : ''}`}>
                    {message.userId !== currentUserId && (
                      <p className="text-xs text-muted-foreground mb-1">{message.userName}</p>
                    )}
                    <div className={`p-3 rounded-lg ${
                      message.userId === currentUserId 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.userId === currentUserId 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  {message.userId === currentUserId && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <Card className="rounded-none border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              variant="gradient" 
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupChat;