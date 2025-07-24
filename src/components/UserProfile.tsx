import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Users, MessageCircle, UserPlus } from "lucide-react";

interface UserProfileProps {
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  profileImage?: string;
  joinedDate: string;
  activitiesJoined: number;
  connectionsCount: number;
  commonActivities?: string[];
  lastActivity?: string;
  onViewActivities?: () => void;
  onMessage?: () => void;
}

const UserProfile = ({
  name,
  age,
  location,
  bio,
  interests,
  profileImage,
  joinedDate,
  activitiesJoined,
  connectionsCount,
  commonActivities = [],
  lastActivity,
  onViewActivities,
  onMessage
}: UserProfileProps) => {
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getInterestColor = (interest: string) => {
    const colors: { [key: string]: string } = {
      travel: "bg-activity-travel",
      sports: "bg-activity-sports", 
      entertainment: "bg-activity-entertainment",
      food: "bg-activity-food",
      outdoor: "bg-activity-outdoor",
      wellness: "bg-activity-wellness"
    };
    return colors[interest.toLowerCase()] || "bg-primary";
  };

  return (
    <Card className="hover:shadow-card transition-all duration-300 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20 ring-4 ring-primary/10">
            <AvatarImage src={profileImage} alt={name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-primary text-primary-foreground">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{name}, {age}</CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{location}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-center">{bio}</p>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {interests.slice(0, 4).map((interest, index) => (
            <Badge
              key={index}
              className={`${getInterestColor(interest)} text-white border-0`}
            >
              {interest}
            </Badge>
          ))}
          {interests.length > 4 && (
            <Badge variant="secondary">
              +{interests.length - 4} more
            </Badge>
          )}
        </div>

        {commonActivities.length > 0 && (
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-sm font-medium text-center mb-2">Common Activities</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {commonActivities.map((activity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 py-4 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
            </div>
            <p className="text-sm text-muted-foreground">Joined</p>
            <p className="font-semibold">{joinedDate}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-sm text-muted-foreground">Activities</p>
            <p className="font-semibold">{activitiesJoined}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <UserPlus className="h-4 w-4" />
            </div>
            <p className="text-sm text-muted-foreground">Connections</p>
            <p className="font-semibold">{connectionsCount}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={onViewActivities}
          >
            <Users className="h-4 w-4 mr-2" />
            View Activities
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onMessage}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;