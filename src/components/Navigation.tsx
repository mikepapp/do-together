import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Search, 
  Users, 
  MessageCircle, 
  User,
  Bell,
  Plus,
  LogOut,
  Settings
 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
  activeChatCount?: number;
  profileImage?: string;
  userName?: string;
  isAuthenticated?: boolean;
  userEmail?: string;
}

const Navigation = ({ 
  activeTab, 
  onTabChange, 
  notificationCount = 0,
  activeChatCount = 0,
  profileImage,
  userName = "User",
  isAuthenticated = false,
  userEmail
}: NavigationProps) => {
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Signed out successfully" });
      window.location.reload();
    } catch (err: any) {
      toast({ title: "Error signing out", description: err.message, variant: "destructive" });
    }
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
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all">
                    <AvatarImage src={profileImage} alt={userName} />
                    <AvatarFallback className="text-sm bg-gradient-primary text-primary-foreground">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onTabChange('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTabChange('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => window.location.assign('/auth')}>
                Login
              </Button>
            )}
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