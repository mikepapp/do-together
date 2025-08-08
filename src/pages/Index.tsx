import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ActivityCard from "@/components/ActivityCard";
import InterestSelector from "@/components/InterestSelector";
import UserProfile from "@/components/UserProfile";
import ActivityMatcher from "@/components/ActivityMatcher";
import GroupChat from "@/components/GroupChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ActiveChat {
  chatId: string;
  activityTitle: string;
  activityLocation: string;
  activityDate: string;
  activityCategory: string;
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline';
  }>;
  messages: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    message: string;
    timestamp: Date;
    type: 'message' | 'system';
  }>;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/auth', { replace: true });
      else setAuthReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/auth', { replace: true });
      else setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Sample data with chat integration
  const sampleActivities = [
    {
      title: "Weekend Hiking Adventure",
      category: "outdoor",
      location: "Blue Mountains, NSW",
      date: "This Saturday, 8:00 AM",
      participants: 6,
      maxParticipants: 10,
      description: "Join us for a scenic hike through the Blue Mountains. Perfect for intermediate hikers looking to connect with nature lovers.",
      tags: ["hiking", "nature", "fitness", "weekend"],
      liked: false,
      chatId: "chat_hiking_weekend",
      isActive: activeChats.some(chat => chat.chatId === "chat_hiking_weekend")
    },
    {
      title: "Food Tour - Little Italy",
      category: "food",
      location: "Little Italy, NYC",
      date: "Friday, 6:00 PM",
      participants: 8,
      maxParticipants: 12,
      description: "Explore authentic Italian cuisine with fellow food enthusiasts. We'll visit 4-5 local favorites.",
      tags: ["italian food", "walking tour", "evening"],
      liked: true,
      chatId: "chat_food_italy",
      isActive: activeChats.some(chat => chat.chatId === "chat_food_italy")
    },
    {
      title: "Jazz Night & Networking",
      category: "entertainment",
      location: "Blue Note Jazz Club",
      date: "Tonight, 7:30 PM",
      participants: 12,
      maxParticipants: 15,
      description: "Enjoy live jazz music while meeting like-minded professionals in a relaxed atmosphere.",
      tags: ["jazz", "networking", "music", "drinks"],
      liked: false,
      chatId: "chat_jazz_night",
      isActive: activeChats.some(chat => chat.chatId === "chat_jazz_night")
    }
  ];

  const sampleUsers = [
    {
      name: "Sarah Chen",
      age: 28,
      location: "San Francisco, CA",
      bio: "Adventure seeker and food lover. Always looking for new experiences and great company!",
      interests: ["travel", "food", "outdoor"],
      joinedDate: "Mar 2024",
      activitiesJoined: 15,
      connectionsCount: 34,
      commonActivities: ["hiking", "food tours"],
      lastActivity: "Weekend Hiking Adventure"
    },
    {
      name: "Marcus Johnson",
      age: 32,
      location: "Austin, TX",
      bio: "Fitness enthusiast and music lover. Let's explore the city together!",
      interests: ["sports", "entertainment", "wellness"],
      joinedDate: "Jan 2024",
      activitiesJoined: 22,
      connectionsCount: 41,
      commonActivities: ["jazz", "basketball"],
      lastActivity: "Jazz Night & Networking"
    }
  ];

  const handleJoinChat = (chatId: string, activity?: any) => {
    // Check if chat already exists
    const existingChat = activeChats.find(chat => chat.chatId === chatId);
    
    if (!existingChat) {
      // Create new chat
      const newChat: ActiveChat = {
        chatId,
        activityTitle: activity?.title || "Activity Chat",
        activityLocation: activity?.location || "Location TBD",
        activityDate: activity?.date || "Date TBD",
        activityCategory: activity?.category || "general",
        members: [
          { id: "user1", name: "You", status: 'online' },
          { id: "user2", name: "Sarah Chen", status: 'online' },
          { id: "user3", name: "Mike Rodriguez", status: 'offline' },
        ],
        messages: [
          {
            id: "msg1",
            userId: "system",
            userName: "System",
            message: "Welcome to the activity chat! Everyone here is interested in the same activity.",
            timestamp: new Date(Date.now() - 300000),
            type: 'system'
          },
          {
            id: "msg2",
            userId: "user2",
            userName: "Sarah Chen",
            message: "Hey everyone! So excited for this activity! 🎉",
            timestamp: new Date(Date.now() - 120000),
            type: 'message'
          }
        ]
      };
      
      setActiveChats(prev => [...prev, newChat]);
    }
    
    setCurrentChatId(chatId);
    setActiveTab('messages');
  };

  const handleSendMessage = (chatId: string, message: string) => {
    setActiveChats(prev => prev.map(chat => {
      if (chat.chatId === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, {
            id: `msg_${Date.now()}`,
            userId: "user1",
            userName: "You",
            message,
            timestamp: new Date(),
            type: 'message' as const
          }]
        };
      }
      return chat;
    }));
  };

  const handleActivityMatched = (activity: any) => {
    console.log('Activity matched:', activity);
  };

  const renderContent = () => {
    if (showOnboarding) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Welcome to MatchUp!</h1>
              <p className="text-muted-foreground">Let's set up your profile to find perfect activity matches.</p>
            </div>
            
            <InterestSelector
              selectedInterests={selectedInterests}
              onSelectionChange={setSelectedInterests}
              maxSelections={5}
            />
            
            <div className="flex gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowOnboarding(false)}
                className="flex-1"
              >
                Skip for Now
              </Button>
              <Button 
                variant="gradient"
                onClick={() => {
                  setShowOnboarding(false);
                  setActiveTab('search');
                }}
                className="flex-1"
                disabled={selectedInterests.length === 0}
              >
                Start Matching
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'home') {
      return (
        <HeroSection
          onGetStarted={() => setShowOnboarding(true)}
          onExplore={() => setActiveTab('search')}
        />
      );
    }

    if (activeTab === 'search') {
      return (
        <ActivityMatcher
          onActivityMatched={handleActivityMatched}
          onJoinChat={handleJoinChat}
        />
      );
    }

    if (activeTab === 'discover') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Discover Activities</h1>
                <p className="text-muted-foreground">Activities happening near you</p>
              </div>
              <Button variant="gradient">
                <Search className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleActivities.map((activity, index) => (
                <ActivityCard
                  key={index}
                  {...activity}
                  onJoinChat={handleJoinChat}
                  onLike={() => console.log('Like activity:', activity.title)}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'groups') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">People</h1>
                <p className="text-muted-foreground">Connect with people who share your interests</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleUsers.map((user, index) => (
                <UserProfile
                  key={index}
                  {...user}
                  onViewActivities={() => console.log('View activities for:', user.name)}
                  onMessage={() => console.log('Message:', user.name)}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'messages') {
      if (currentChatId) {
        const currentChat = activeChats.find(chat => chat.chatId === currentChatId);
        if (currentChat) {
          return (
            <GroupChat
              activityTitle={currentChat.activityTitle}
              activityLocation={currentChat.activityLocation}
              activityDate={currentChat.activityDate}
              activityCategory={currentChat.activityCategory}
              members={currentChat.members}
              messages={currentChat.messages}
              currentUserId="user1"
              onBack={() => setCurrentChatId(null)}
              onSendMessage={(message) => handleSendMessage(currentChatId, message)}
            />
          );
        }
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Chats</h1>
                <p className="text-muted-foreground">Active conversations from your activities</p>
              </div>
            </div>

            {activeChats.length === 0 ? (
              <Card className="max-w-2xl mx-auto text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">No Active Chats Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Join an activity to start chatting with people who share your interests!
                  </p>
                  <Button variant="gradient" onClick={() => setActiveTab('search')}>
                    Find Activities
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-2xl mx-auto space-y-4">
                {activeChats.map((chat) => (
                  <Card 
                    key={chat.chatId}
                    className="hover:shadow-card transition-all duration-300 cursor-pointer border-0 shadow-sm bg-card/50 backdrop-blur-sm"
                    onClick={() => setCurrentChatId(chat.chatId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{chat.activityTitle}</h3>
                          <p className="text-sm text-muted-foreground">{chat.activityLocation}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {chat.members.filter(m => m.status === 'online').length} online
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-primary/10 text-primary">
                            {chat.messages.length} messages
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {chat.activityDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Coming Soon!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                This feature is currently in development. Check back soon for updates!
              </p>
              <Button variant="outline" onClick={() => setActiveTab('home')}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {!showOnboarding && (
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notificationCount={3}
          activeChatCount={activeChats.length}
          userName="Alex Smith"
        />
      )}
      {renderContent()}
    </div>
  );
};

export default Index;
