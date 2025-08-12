import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Smartphone, 
  Download, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  
  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate content creator and streamer',
    language: 'en',
    timezone: 'UTC-5'
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
    allowFriendRequests: true,
    showActivityStatus: false,
    allowAnalytics: true,
    allowCookies: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    newFollowers: true,
    newMessages: true,
    liveStreams: true,
    subscriptionUpdates: true,
    marketingEmails: false
  });

  // App Settings
  const [appSettings, setAppSettings] = useState({
    theme: 'system',
    autoPlay: true,
    dataSaver: false,
    downloadQuality: 'high',
    soundEffects: true,
    hapticFeedback: true
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Settings Saved',
        description: `${section} settings have been updated successfully.`,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: 'Account Deletion',
        description: 'Account deletion request submitted. You will receive a confirmation email.',
        variant: 'destructive'
      });
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={accountSettings.fullName}
                onChange={(e) => setAccountSettings({...accountSettings, fullName: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={accountSettings.username}
                onChange={(e) => setAccountSettings({...accountSettings, username: e.target.value})}
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={accountSettings.email}
                onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={accountSettings.phone}
                onChange={(e) => setAccountSettings({...accountSettings, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={accountSettings.bio}
              onChange={(e) => setAccountSettings({...accountSettings, bio: e.target.value})}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={accountSettings.language} onValueChange={(value) => setAccountSettings({...accountSettings, language: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={accountSettings.timezone} onValueChange={(value) => setAccountSettings({...accountSettings, timezone: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                  <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                  <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="UTC+0">UTC</SelectItem>
                  <SelectItem value="UTC+1">Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={() => handleSaveSettings('Account')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Account Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Control who can see your profile</p>
              </div>
              <Select value={privacySettings.profileVisibility} onValueChange={(value) => setPrivacySettings({...privacySettings, profileVisibility: value})}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                </div>
                <Switch
                  checked={privacySettings.showOnlineStatus}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showOnlineStatus: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Messages</Label>
                  <p className="text-sm text-muted-foreground">Receive messages from other users</p>
                </div>
                <Switch
                  checked={privacySettings.allowMessages}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, allowMessages: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Friend Requests</Label>
                  <p className="text-sm text-muted-foreground">Receive friend requests from others</p>
                </div>
                <Switch
                  checked={privacySettings.allowFriendRequests}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, allowFriendRequests: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Activity Status</Label>
                  <p className="text-sm text-muted-foreground">Display your recent activity</p>
                </div>
                <Switch
                  checked={privacySettings.showActivityStatus}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showActivityStatus: checked})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics & Cookies</Label>
                  <p className="text-sm text-muted-foreground">Help improve the app with analytics</p>
                </div>
                <Switch
                  checked={privacySettings.allowAnalytics}
                  onCheckedChange={(checked) => setPrivacySettings({...privacySettings, allowAnalytics: checked})}
                />
              </div>
            </div>

          </div>

          <Button 
            onClick={() => handleSaveSettings('Privacy')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Privacy Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Notification Types</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>New Followers</Label>
                  <p className="text-sm text-muted-foreground">When someone follows you</p>
                </div>
                <Switch
                  checked={notificationSettings.newFollowers}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newFollowers: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>New Messages</Label>
                  <p className="text-sm text-muted-foreground">When you receive a message</p>
                </div>
                <Switch
                  checked={notificationSettings.newMessages}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newMessages: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Live Streams</Label>
                  <p className="text-sm text-muted-foreground">When followed streamers go live</p>
                </div>
                <Switch
                  checked={notificationSettings.liveStreams}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, liveStreams: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Subscription Updates</Label>
                  <p className="text-sm text-muted-foreground">Updates about your subscriptions</p>
                </div>
                <Switch
                  checked={notificationSettings.subscriptionUpdates}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, subscriptionUpdates: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Promotional content and updates</p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={() => handleSaveSettings('Notification')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>App Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <Select value={appSettings.theme} onValueChange={(value) => setAppSettings({...appSettings, theme: value})}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-play Videos</Label>
                <p className="text-sm text-muted-foreground">Automatically play videos in feed</p>
              </div>
              <Switch
                checked={appSettings.autoPlay}
                onCheckedChange={(checked) => setAppSettings({...appSettings, autoPlay: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Data Saver</Label>
                <p className="text-sm text-muted-foreground">Reduce data usage</p>
              </div>
              <Switch
                checked={appSettings.dataSaver}
                onCheckedChange={(checked) => setAppSettings({...appSettings, dataSaver: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Download Quality</Label>
                <p className="text-sm text-muted-foreground">Quality for downloaded content</p>
              </div>
              <Select value={appSettings.downloadQuality} onValueChange={(value) => setAppSettings({...appSettings, downloadQuality: value})}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play app sound effects</p>
              </div>
              <Switch
                checked={appSettings.soundEffects}
                onCheckedChange={(checked) => setAppSettings({...appSettings, soundEffects: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Haptic Feedback</Label>
                <p className="text-sm text-muted-foreground">Vibrate on interactions</p>
              </div>
              <Switch
                checked={appSettings.hapticFeedback}
                onCheckedChange={(checked) => setAppSettings({...appSettings, hapticFeedback: checked})}
              />
            </div>
          </div>

          <Button 
            onClick={() => handleSaveSettings('App')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save App Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="w-full"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>App</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          {renderAccountSettings()}
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {renderPrivacySettings()}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {renderNotificationSettings()}
        </TabsContent>

        <TabsContent value="app" className="space-y-6">
          {renderAppSettings()}
          <Separator className="my-8" />
          {renderDangerZone()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
