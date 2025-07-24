import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Calendar, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

const HeroSection = ({ onGetStarted, onExplore }: HeroSectionProps) => {
  const stats = [
    { icon: Users, label: "Active Users", value: "10K+" },
    { icon: Heart, label: "Connections Made", value: "25K+" },
    { icon: Calendar, label: "Activities Created", value: "5K+" },
    { icon: MapPin, label: "Cities", value: "100+" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="People connecting through activities"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            Connect Through
            <br />
            Shared Experiences
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover people who share your passions. From travel adventures to local sports, 
            from food experiences to entertainment - find your tribe and create lasting connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="gradient" 
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-6 h-auto"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={onExplore}
              className="text-lg px-8 py-6 h-auto bg-background/20 backdrop-blur-sm border-white/30 text-foreground hover:bg-background/30"
            >
              Explore Activities
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-background/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-activity-entertainment/30 rounded-full blur-xl animate-pulse delay-500" />
      </div>
    </div>
  );
};

export default HeroSection;