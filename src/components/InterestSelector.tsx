import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Trophy, 
  Music, 
  UtensilsCrossed, 
  Trees, 
  Heart,
  Camera,
  Book,
  Gamepad2,
  Palette
} from "lucide-react";

interface Interest {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const interests: Interest[] = [
  { id: 'travel', name: 'Travel', icon: <Plane className="h-5 w-5" />, color: 'bg-activity-travel' },
  { id: 'sports', name: 'Sports', icon: <Trophy className="h-5 w-5" />, color: 'bg-activity-sports' },
  { id: 'entertainment', name: 'Entertainment', icon: <Music className="h-5 w-5" />, color: 'bg-activity-entertainment' },
  { id: 'food', name: 'Food & Dining', icon: <UtensilsCrossed className="h-5 w-5" />, color: 'bg-activity-food' },
  { id: 'outdoor', name: 'Outdoor', icon: <Trees className="h-5 w-5" />, color: 'bg-activity-outdoor' },
  { id: 'wellness', name: 'Wellness', icon: <Heart className="h-5 w-5" />, color: 'bg-activity-wellness' },
  { id: 'photography', name: 'Photography', icon: <Camera className="h-5 w-5" />, color: 'bg-primary' },
  { id: 'reading', name: 'Reading', icon: <Book className="h-5 w-5" />, color: 'bg-accent' },
  { id: 'gaming', name: 'Gaming', icon: <Gamepad2 className="h-5 w-5" />, color: 'bg-activity-entertainment' },
  { id: 'arts', name: 'Arts & Crafts', icon: <Palette className="h-5 w-5" />, color: 'bg-activity-wellness' },
];

interface InterestSelectorProps {
  selectedInterests: string[];
  onSelectionChange: (interests: string[]) => void;
  maxSelections?: number;
}

const InterestSelector = ({ 
  selectedInterests, 
  onSelectionChange, 
  maxSelections = 5 
}: InterestSelectorProps) => {
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      onSelectionChange(selectedInterests.filter(id => id !== interestId));
    } else if (selectedInterests.length < maxSelections) {
      onSelectionChange([...selectedInterests, interestId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">What are you interested in?</CardTitle>
        <p className="text-center text-muted-foreground">
          Select up to {maxSelections} activities you'd like to do with others
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            const isDisabled = !isSelected && selectedInterests.length >= maxSelections;
            
            return (
              <Button
                key={interest.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => toggleInterest(interest.id)}
                disabled={isDisabled}
                className={`h-auto p-4 flex-col gap-2 transition-all duration-300 ${
                  isSelected 
                    ? `${interest.color} text-white border-0 shadow-glow` 
                    : 'hover:scale-105'
                }`}
              >
                {interest.icon}
                <span className="text-sm font-medium">{interest.name}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedInterests.map((interestId) => {
            const interest = interests.find(i => i.id === interestId);
            return interest ? (
              <Badge
                key={interestId}
                className={`${interest.color} text-white border-0`}
              >
                {interest.name}
              </Badge>
            ) : null;
          })}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          {selectedInterests.length}/{maxSelections} selected
        </p>
      </CardContent>
    </Card>
  );
};

export default InterestSelector;