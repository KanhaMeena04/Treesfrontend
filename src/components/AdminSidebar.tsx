import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Home,
  Users,
  Shield,
  Video,
  Megaphone,
  BarChart3,
  Bell,
  ChevronDown,
  Menu,
  X,
  Heart,
  Settings,
  Globe
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    hasSubmenu: false
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    hasSubmenu: true,
    submenu: [
      { id: 'all-users', label: 'All Users' },
      { id: 'blocked-users', label: 'Blocked Users' },
      { id: 'activity-logs', label: 'Activity Logs' }
    ]
  },
  {
    id: 'moderation',
    label: 'Content Moderation',
    icon: Shield,
    hasSubmenu: true,
    submenu: [
      { id: 'review-posts', label: 'Review Posts' },
      { id: 'review-reels', label: 'Review Reels' },
      { id: 'review-stories', label: 'Review Stories' },
      { id: 'reported-content', label: 'Reported Content' }
    ]
  },
  {
    id: 'matchmaking',
    label: 'Matchmaking Oversight',
    icon: Heart,
    hasSubmenu: true,
    submenu: [
      { id: 'match-logs', label: 'Match Logs' },
      { id: 'flagged-conversations', label: 'Flagged Conversations' }
    ]
  },
  {
    id: 'livestream',
    label: 'Livestream Controls',
    icon: Video,
    hasSubmenu: true,
    submenu: [
      { id: 'live-streams', label: 'Live Streams' },
      { id: 'scheduled-streams', label: 'Scheduled Streams' },
      { id: 'stream-categories', label: 'Stream Categories' }
    ]
  },
  {
    id: 'psa',
    label: 'PSA Management',
    icon: Megaphone,
    hasSubmenu: true,
    submenu: [
      { id: 'push-announcement', label: 'Push Announcement' },
      { id: 'past-psas', label: 'View Past PSAs' }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    icon: BarChart3,
    hasSubmenu: true,
    submenu: [
      { id: 'engagement-trends', label: 'Engagement Trends' },
      { id: 'top-users', label: 'Top Users' },
      { id: 'top-creators', label: 'Top Creators' },
      { id: 'login-stats', label: 'Login Statistics' }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    hasSubmenu: true,
    submenu: [
      { id: 'send-notification', label: 'Send Notification' },
      { id: 'notification-logs', label: 'Notification Logs' }
    ]
  },
  {
    id: 'settings',
    label: 'Admin Settings',
    icon: Settings,
    hasSubmenu: true,
    submenu: [
      { id: 'admin-users', label: 'Admin Users' },
      { id: 'security', label: 'Security' },
      { id: 'activity-logs-admin', label: 'Activity Logs' }
    ]
  },
  {
    id: 'website',
    label: 'Static Website Management',
    icon: Globe,
    hasSubmenu: true,
    submenu: [
      { id: 'homepage-content', label: 'Homepage Content' },
      { id: 'seo-settings', label: 'SEO Settings' },
      { id: 'banners-management', label: 'Banners & Links' }
    ]
  }
];

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['dashboard']);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleItemClick = (id: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleSubmenu(id);
    } else {
      onSectionChange(id);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-accent/20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/logo.svg" 
                  alt="Treesh" 
                  className="w-8 h-8 text-white"
                />
              </div>
              <h2 className="text-lg font-semibold text-white font-treesh">Admin Panel</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex text-white hover:bg-white/20"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id || 
              (item.submenu && item.submenu.some(sub => activeSection === sub.id));
            const isOpen = openSubmenus.includes(item.id);
            
            return (
              <div key={item.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start h-10 font-inter",
                          collapsed && "px-2",
                          isActive && "bg-primary text-white hover:bg-primary-dark"
                        )}
                        onClick={() => handleItemClick(item.id, item.hasSubmenu)}
                      >
                        <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.hasSubmenu && (
                              <ChevronDown className={cn(
                                "h-4 w-4 transition-transform",
                                isOpen && "rotate-180"
                              )} />
                            )}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                
                {item.hasSubmenu && !collapsed && (
                  <Collapsible open={isOpen}>
                    <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      {item.submenu?.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant={activeSection === subItem.id ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start h-8 text-sm font-inter",
                            activeSection === subItem.id && "bg-accent text-white hover:bg-accent/90"
                          )}
                          onClick={() => onSectionChange(subItem.id)}
                        >
                          {subItem.label}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white hover:bg-primary-dark"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-white border-r border-accent/20 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-accent/20 z-50">
            <div className="p-4 border-b border-accent/20 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/logo.svg" 
                    alt="Treesh" 
                    className="w-8 h-8 text-white"
                  />
                </div>
                <h2 className="text-lg font-semibold text-white font-treesh">Admin Panel</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </aside>
        </>
      )}
    </>
  );
};