import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ActivityCard from "@/components/ActivityCard";
import InterestSelector from "@/components/InterestSelector";
import UserProfile from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Sample data
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
      liked: false
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
      liked: true
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
      liked: false
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
      isConnected: false
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
      isConnected: true
    }
  ];

  const renderContent = () => {
    if (showOnboarding) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Welcome to ActivityConnect!</h1>
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
                  setActiveTab('discover');
                }}
                className="flex-1"
                disabled={selectedInterests.length === 0}
              >
                Continue
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
          onExplore={() => setActiveTab('discover')}
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
                <p className="text-muted-foreground">Find your next adventure and connect with amazing people</p>
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
                  onJoin={() => console.log('Join activity:', activity.title)}
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
                <h1 className="text-3xl font-bold mb-2">Groups & People</h1>
                <p className="text-muted-foreground">Connect with people who share your interests</p>
              </div>
              <Button variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleUsers.map((user, index) => (
                <UserProfile
                  key={index}
                  {...user}
                  onConnect={() => console.log('Connect with:', user.name)}
                  onMessage={() => console.log('Message:', user.name)}
                />
              ))}
            </div>
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
          userName="Alex Smith"
        />
      )}
      {renderContent()}
    </div>
  );
};

export default Index;
