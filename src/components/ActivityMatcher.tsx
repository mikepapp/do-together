import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search,
  Loader2,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface MatchedActivity {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  chatId: string;
}

interface ActivityMatcherProps {
  onActivityMatched: (activity: MatchedActivity) => void;
  onJoinChat: (chatId: string, activity: MatchedActivity) => void;
}

const ActivityMatcher = ({ onActivityMatched, onJoinChat }: ActivityMatcherProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchedActivities, setMatchedActivities] = useState<MatchedActivity[]>([]);

  // Simulated activity data - in real app this would come from your database
  const sampleMatches: MatchedActivity[] = [
    {
      id: "1",
      title: "Morning Hiking Group",
      category: "outdoor",
      location: "Central Park, NYC",
      date: "Tomorrow, 7:00 AM",
      description: "Early morning hike with energetic people. Perfect for starting the day right!",
      participants: [
        { id: "u1", name: "Sarah M." },
        { id: "u2", name: "Mike L." },
        { id: "u3", name: "Emma K." }
      ],
      chatId: "chat_hiking_001"
    },
    {
      id: "2", 
      title: "Coffee & Code Meetup",
      category: "food",
      location: "Downtown Coffee, SF",
      date: "Today, 2:00 PM",
      description: "Casual coding session over great coffee. Bring your laptop and ideas!",
      participants: [
        { id: "u4", name: "Alex R." },
        { id: "u5", name: "Jordan P." },
        { id: "u6", name: "Casey W." },
        { id: "u7", name: "Taylor S." }
      ],
      chatId: "chat_coffee_002"
    },
    {
      id: "3",
      title: "Weekend Basketball Game",
      category: "sports", 
      location: "City Sports Center",
      date: "Saturday, 10:00 AM",
      description: "Friendly basketball game. All skill levels welcome - just bring energy!",
      participants: [
        { id: "u8", name: "Marcus J." },
        { id: "u9", name: "Lisa T." },
        { id: "u10", name: "David H." }
      ],
      chatId: "chat_basketball_003"
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API search delay
    setTimeout(() => {
      // Filter matches based on search query and location
      const filtered = sampleMatches.filter(activity => 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (location && activity.location.toLowerCase().includes(location.toLowerCase()))
      );
      
      setMatchedActivities(filtered);
      setIsSearching(false);
    }, 1500);
  };

  const handleJoinActivity = async (activity: MatchedActivity) => {
    try {
      const { data, error } = await supabase.functions.invoke('search-and-join', {
        body: {
          activity_type: activity.category,
          params: { location: activity.location, date: activity.date },
          max_size: 6,
        },
      });
      if (error) throw error;
      onActivityMatched(activity);
      onJoinChat(data?.group_id || activity.chatId, activity);
    } catch (err: any) {
      toast({ title: 'Could not join chat', description: err.message, variant: 'destructive' });
    }
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Activity Match</h1>
          <p className="text-muted-foreground">
            Search for activities and get instantly connected with people who share your interests
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What would you like to do?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="hiking, coffee, basketball, travel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button 
              variant="gradient" 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="w-full"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finding Matches...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find Activity Matches
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {isSearching && (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
              <h3 className="text-lg font-semibold mb-2">Searching for matches...</h3>
              <p className="text-muted-foreground">We're finding people who want to do the same activity!</p>
            </CardContent>
          </Card>
        )}

        {matchedActivities.length > 0 && !isSearching && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Perfect Matches Found!</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {matchedActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-card transition-all duration-300 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge className={`${getCategoryColor(activity.category)} text-white border-0 mb-2`}>
                          {activity.category}
                        </Badge>
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{activity.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {activity.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {activity.date}
                      </div>
                    </div>

                    {/* Participants */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Users className="h-4 w-4" />
                        {activity.participants.length} people already joined
                      </div>
                      <div className="flex -space-x-2">
                        {activity.participants.slice(0, 4).map((participant) => (
                          <Avatar key={participant.id} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {activity.participants.length > 4 && (
                          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">+{activity.participants.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="activity" 
                      className="w-full"
                      onClick={() => handleJoinActivity(activity)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Chat Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {matchedActivities.length === 0 && !isSearching && searchQuery && (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-4">
                Try a different search term or location. You can also create your own activity!
              </p>
              <Button variant="outline">
                Create New Activity
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivityMatcher;