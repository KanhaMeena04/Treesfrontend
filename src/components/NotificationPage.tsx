import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, UserPlus, Megaphone, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const mockNotifications = [
  {
    id: '1',
    type: 'like',
    user: { name: 'Alice Johnson', avatar: '/placeholder.svg' },
    content: 'liked your post',
    timestamp: '2m ago',
    read: false
  },
  {
    id: '2',
    type: 'match',
    user: { name: 'Bob Smith', avatar: '/placeholder.svg' },
    content: 'You have a new match!',
    timestamp: '1h ago',
    read: false
  },
  {
    id: '3',
    type: 'comment',
    user: { name: 'Emma Wilson', avatar: '/placeholder.svg' },
    content: 'commented on your post: "Amazing photo!"',
    timestamp: '3h ago',
    read: true
  },
  {
    id: '4',
    type: 'psa',
    user: { name: 'Admin', avatar: '/placeholder.svg' },
    content: 'New community guidelines are now in effect',
    timestamp: '1d ago',
    read: true
  },
  {
    id: '5',
    type: 'follow',
    user: { name: 'John Doe', avatar: '/placeholder.svg' },
    content: 'started following you',
    timestamp: '2d ago',
    read: true
  }
];

const notificationSettings = {
  likes: true,
  comments: true,
  matches: true,
  follows: true,
  psa: true,
  messages: true
};

export const NotificationPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState(notificationSettings);
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter(n => !n.read).length
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'match':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'psa':
        return <Megaphone className="w-4 h-4 text-orange-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="likes">Likes</Label>
                  <Switch
                    id="likes"
                    checked={settings.likes}
                    onCheckedChange={(value) => updateSetting('likes', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="comments">Comments</Label>
                  <Switch
                    id="comments"
                    checked={settings.comments}
                    onCheckedChange={(value) => updateSetting('comments', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="matches">Matches</Label>
                  <Switch
                    id="matches"
                    checked={settings.matches}
                    onCheckedChange={(value) => updateSetting('matches', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="follows">New Followers</Label>
                  <Switch
                    id="follows"
                    checked={settings.follows}
                    onCheckedChange={(value) => updateSetting('follows', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="psa">PSA Announcements</Label>
                  <Switch
                    id="psa"
                    checked={settings.psa}
                    onCheckedChange={(value) => updateSetting('psa', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="messages">Messages</Label>
                  <Switch
                    id="messages"
                    checked={settings.messages}
                    onCheckedChange={(value) => updateSetting('messages', value)}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="unread" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread" className="space-y-2">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No unread notifications</p>
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map((notification) => (
              <Card
                key={notification.id}
                className="cursor-pointer hover:bg-gray-50 border-l-4 border-l-primary"
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium">{notification.user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {notification.content}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer hover:bg-gray-50 ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={notification.user.avatar} />
                    <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <span className={`font-medium ${
                        !notification.read ? 'text-primary' : ''
                      }`}>
                        {notification.user.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {notification.content}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};