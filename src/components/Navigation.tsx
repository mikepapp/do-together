import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Search, 
  Users, 
  MessageCircle, 
  User,
  Bell,
  Plus
 } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
  activeChatCount?: number;
  profileImage?: string;
  userName?: string;
}

const Navigation = ({ 
  activeTab, 
  onTabChange, 
  notificationCount = 0,
  activeChatCount = 0,
  profileImage,
  userName = "User"
}: NavigationProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'discover', icon: Plus, label: 'Discover' },
    { id: 'groups', icon: Users, label: 'People' },
    { id: 'messages', icon: MessageCircle, label: 'Chats', badge: activeChatCount },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MU</span>
            </div>
            <span className="font-bold text-xl bg-gradient-hero bg-clip-text text-transparent">
              MatchUp
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              onClick={() => onTabChange(item.id)}
              className="flex items-center gap-2 relative"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <Badge className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </Button>
          ))}
          </div>

          {/* Right side - Notifications & Profile */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.assign('/auth')}>
              Login
            </Button>
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={profileImage} alt={userName} />
              <AvatarFallback className="text-sm bg-gradient-primary text-primary-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border/50">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center gap-1 h-auto p-2 relative"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-primary">
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;