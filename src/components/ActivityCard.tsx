import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar, Heart, MessageCircle } from "lucide-react";

interface ActivityCardProps {
  title: string;
  category: string;
  location: string;
  date: string;
  participants: number;
  maxParticipants?: number;
  description: string;
  tags: string[];
  image?: string;
  liked?: boolean;
  isActive?: boolean;
  chatId?: string;
  onJoinChat?: (chatId: string) => void;
  onLike?: () => void;
}

const ActivityCard = ({
  title,
  category,
  location,
  date,
  participants,
  maxParticipants = 10,
  description,
  tags,
  image,
  liked = false,
  isActive = false,
  chatId,
  onJoinChat,
  onLike
}: ActivityCardProps) => {
  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      travel: "bg-activity-travel",
      sports: "bg-activity-sports", 
      entertainment: "bg-activity-entertainment",
      food: "bg-activity-food",
      outdoor: "bg-activity-outdoor",
      wellness: "bg-activity-wellness"
    };
    return colors[cat.toLowerCase()] || "bg-primary";
  };

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getCategoryColor(category)} text-white border-0`}>
                {category}
              </Badge>
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onLike}
            className={`${liked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {date}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {participants}/{maxParticipants} participants
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          variant={isActive ? "secondary" : "activity"} 
          className="w-full"
          onClick={() => chatId && onJoinChat?.(chatId)}
          disabled={!chatId}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {isActive ? "Active Chat" : "Join Chat"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;