import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Lock, Shield, UserX, Edit, Save, X, AlertCircle, CheckCircle, Bookmark, Plus, Crown, Gift, Heart, MessageCircle, Share2, MoreHorizontal, Calendar, MapPin, Globe, Phone, Camera, Video, Music, Star, Eye, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { StoryUpload } from './StoryUpload';
import { PrivacySettings } from './PrivacySettings';
import { PostDetail } from './PostDetail';
import { SavedPosts } from './SavedPosts';
import { StreamerSubscriptionModal } from './StreamerSubscriptionModal';

const mockUser = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  bio: 'Digital creator | Coffee lover ☕',
  avatar: '/placeholder.svg',
  verified: true,
  followers: 1234,
  following: 567,
  posts: 89,
  isPrivate: false,
  email: 'john.doe@example.com',
  location: 'New York, NY',
  website: 'https://johndoe.com',
  phone: '+1 (555) 123-4567',
  subscriptionTier: 'gold',
  isStreamer: true,
  streamerStatus: 'active'
};

interface PostData {
  id: string;
  image: string;
  type: 'post' | 'reel';
  likes: number;
  caption: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: string;
  location?: string;
  comments: any[];
  views?: number;
  shares?: number;
  saves?: number;
}

const mockPosts: PostData[] = [
  { 
    id: '1', 
    image: '/placeholder.svg', 
    type: 'post', 
    likes: 45, 
    caption: 'Beautiful sunset! 🌅',
    user: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: '/placeholder.svg',
      verified: true
    },
    timestamp: '2h ago',
    location: 'Sunset Beach, CA',
    comments: [
      { id: '1', user: 'Alice', text: 'Stunning view! 😍', time: '1h ago' },
      { id: '2', user: 'Bob', text: 'Where is this?', time: '30m ago' }
    ],
    views: 234,
    shares: 12,
    saves: 8
  },
  { 
    id: '2', 
    image: '/placeholder.svg', 
    type: 'reel', 
    likes: 123, 
    caption: 'Quick workout routine 💪',
    user: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: '/placeholder.svg',
      verified: true
    },
    timestamp: '1h ago',
    location: 'Home Gym',
    comments: [
      { id: '1', user: 'Emma', text: 'Great workout! 💪', time: '45m ago' }
    ],
    views: 567,
    shares: 23,
    saves: 15
  },
  { 
    id: '3', 
    image: '/placeholder.svg', 
    type: 'post', 
    likes: 67, 
    caption: 'Coffee time ☕',
    user: {
      name: 'John Doe',
      username: 'johndoe',
      avatar: '/placeholder.svg',
      verified: true
    },
    timestamp: '30m ago',
    location: 'Local Coffee Shop',
    comments: [
      { id: '1', user: 'Sarah', text: 'Coffee is life! ☕', time: '15m ago' }
    ],
    views: 189,
    shares: 5,
    saves: 3
  }
];

const mockFollowers = [
  { id: '1', name: 'Alice Johnson', username: 'alice', avatar: '/placeholder.svg', verified: true, mutual: true, isFollowing: false },
  { id: '2', name: 'Bob Smith', username: 'bob', avatar: '/placeholder.svg', verified: false, mutual: false, isFollowing: false },
  { id: '3', name: 'Emma Wilson', username: 'emma', avatar: '/placeholder.svg', verified: true, mutual: true, isFollowing: false },
  { id: '4', name: 'Michael Brown', username: 'michael', avatar: '/placeholder.svg', verified: false, mutual: true, isFollowing: false },
  { id: '5', name: 'Sarah Davis', username: 'sarah', avatar: '/placeholder.svg', verified: true, mutual: false, isFollowing: false }
];

const mockFollowing = [
  { id: '1', name: 'Alice Johnson', username: 'alice', avatar: '/placeholder.svg', verified: true, mutual: true, isFollowing: true },
  { id: '2', name: 'Bob Smith', username: 'bob', avatar: '/placeholder.svg', verified: false, mutual: false, isFollowing: true },
  { id: '3', name: 'Emma Wilson', username: 'emma', avatar: '/placeholder.svg', verified: true, mutual: true, isFollowing: true },
  { id: '4', name: 'Jessica Lee', username: 'jessica', avatar: '/placeholder.svg', verified: true, mutual: false, isFollowing: true },
  { id: '5', name: 'David Wilson', username: 'david', avatar: '/placeholder.svg', verified: false, mutual: false, isFollowing: true }
];

export const ProfilePage = () => {
  const [user, setUser] = useState(mockUser);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location);
  const [editWebsite, setEditWebsite] = useState(user.website);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [activeTab, setActiveTab] = useState('posts');
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showProfilePictureUpload, setShowProfilePictureUpload] = useState(false);
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showGiftSubscriptionModal, setShowGiftSubscriptionModal] = useState(false);
  const [followers, setFollowers] = useState(mockFollowers);
  const [following, setFollowing] = useState(mockFollowing);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editName.trim()) {
      newErrors.name = 'Name is required';
    } else if (editName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (editName.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    if (editBio.length > 200) {
      newErrors.bio = 'Bio cannot exceed 200 characters';
    }

    if (editWebsite && !isValidUrl(editWebsite)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (editPhone && !isValidPhone(editPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser({
        ...user,
        name: editName.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        website: editWebsite.trim(),
        phone: editPhone.trim(),
        isPrivate
      });

      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFollow = (userId: string) => {
    setFollowers(prev => prev.map(follower => 
      follower.id === userId 
        ? { ...follower, isFollowing: true }
        : follower
    ));
    toast({
      title: 'Followed!',
      description: 'You are now following this user',
    });
  };

  const handleUnfollow = (userId: string) => {
    setFollowing(prev => prev.map(following => 
      following.id === userId 
        ? { ...following, isFollowing: false }
        : following
    ));
    toast({
      title: 'Unfollowed',
      description: 'You have unfollowed this user',
    });
  };

  const handleBlock = (userId: string) => {
    setFollowers(prev => prev.filter(follower => follower.id !== userId));
    setFollowing(prev => prev.filter(following => following.id !== userId));
    toast({
      title: 'User Blocked',
      description: 'User has been blocked successfully',
    });
  };

  const handleReport = (userId: string) => {
    toast({
      title: 'User Reported',
      description: 'Thank you for helping keep our community safe',
    });
  };

  const handlePrivacyChange = (newValue: boolean) => {
    setIsPrivate(newValue);
    toast({
      title: newValue ? 'Account Made Private' : 'Account Made Public',
      description: newValue ? 'Only approved followers can see your content' : 'Your content is now visible to everyone',
    });
  };

  const handleProfilePictureUpdate = (imageData: string) => {
    setUser(prev => ({
      ...prev,
      avatar: imageData
    }));
    toast({
      title: 'Profile Picture Updated!',
      description: 'Your new profile picture has been saved',
    });
  };

  const handleStoryCreate = (storyData: any) => {
    toast({
      title: 'Story Created!',
      description: 'Your story will be visible for 24 hours',
    });
  };

  const handlePrivacySettingsSave = (settings: any) => {
    toast({
      title: 'Privacy Settings Updated!',
      description: 'Your privacy preferences have been saved successfully',
    });
  };

  const handlePostClick = (post: PostData) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleSubscriptionClick = () => {
    setShowSubscriptionModal(true);
  };

  const handleGiftSubscriptionClick = () => {
    setShowGiftSubscriptionModal(true);
  };

  const handleLikePost = (postId: string) => {
    // This would typically update the post in a database
    toast({
      title: 'Post Liked!',
      description: 'You liked this post',
    });
  };

  const handleSavePost = (postId: string) => {
    toast({
      title: 'Post Saved!',
      description: 'Post has been added to your saved items',
    });
  };

  const handleSharePost = (postId: string) => {
    toast({
      title: 'Post Shared!',
      description: 'Post has been shared successfully',
    });
  };

  const handleCommentPost = (postId: string) => {
    // This would typically open a comment input
    toast({
      title: 'Comment Feature',
      description: 'Comment functionality will be implemented here',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.followers}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user.following}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{user.posts}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {user.isStreamer ? '✓' : '-'}
              </div>
              <div className="text-xs text-muted-foreground">Streamer</div>
            </div>
          </div>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">Click on your profile picture to update it</p>
            <div className="flex justify-center space-x-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowProfilePictureUpload(true)}
                className="text-xs"
              >
                <Camera className="w-3 h-3 mr-1" />
                Change Photo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast({
                    title: 'Profile Picture',
                    description: 'Profile picture settings opened',
                  });
                }}
                className="text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar 
                className="w-32 h-32 cursor-pointer hover:opacity-80 hover:ring-4 hover:ring-primary/20 transition-all duration-200" 
                onClick={() => setShowProfilePictureUpload(true)}
                title="Click to change profile picture"
              >
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => setShowProfilePictureUpload(true)}
                title="Edit profile picture"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.verified && <Badge className="bg-blue-500">✓</Badge>}
                {user.isPrivate && <Badge variant="outline">Private</Badge>}
              </div>
              <p className="text-muted-foreground mb-4">@{user.username}</p>
              <div className="mb-4">
                <p className="mb-2">{user.bio}</p>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center md:justify-start gap-6 mb-4">
                <div className="text-center cursor-pointer hover:text-primary transition-colors group" onClick={() => setShowFollowers(true)}>
                  <div className="font-bold group-hover:scale-110 transition-transform">{user.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                  <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to view</div>
                </div>
                <div className="text-center cursor-pointer hover:text-primary transition-colors group" onClick={() => setShowFollowing(true)}>
                  <div className="font-bold group-hover:scale-110 transition-transform">{user.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                  <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Click to view</div>
                </div>
                <div className="text-center cursor-pointer hover:text-primary transition-colors group">
                  <div className="font-bold group-hover:scale-110 transition-transform">{user.posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                  <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">View all</div>
                </div>
                {user.isStreamer && (
                  <div className="text-center">
                    <div className="font-bold text-green-600">✓</div>
                    <div className="text-sm text-muted-foreground">Streamer</div>
                    <div className="text-xs text-green-600">Active</div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                          }}
                          maxLength={50}
                          className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.name && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.name}</span>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground text-right">
                          {editName.length}/50
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editBio}
                          onChange={(e) => {
                            setEditBio(e.target.value);
                            if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
                          }}
                          maxLength={200}
                          rows={3}
                          className={errors.bio ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.bio && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.bio}</span>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground text-right">
                          {editBio.length}/200
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editWebsite}
                          onChange={(e) => {
                            setEditWebsite(e.target.value);
                            if (errors.website) setErrors(prev => ({ ...prev, website: '' }));
                          }}
                          placeholder="https://example.com"
                          className={errors.website ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.website && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.website}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editPhone}
                          onChange={(e) => {
                            setEditPhone(e.target.value);
                            if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          placeholder="+1 (555) 123-4567"
                          className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.phone && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="private"
                          checked={isPrivate}
                          onCheckedChange={handlePrivacyChange}
                        />
                        <Label htmlFor="private">Private Account</Label>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button variant="outline" onClick={() => {
                          setEditName(user.name);
                          setEditBio(user.bio);
                          setEditLocation(user.location);
                          setEditWebsite(user.website);
                          setEditPhone(user.phone);
                          setErrors({});
                        }} className="flex-1">
                          <X className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={isSaving} className="flex-1">
                          {isSaving ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </div>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" onClick={() => setShowFollowers(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  View Followers ({user.followers})
                </Button>

                <Button variant="outline" onClick={() => setShowPrivacySettings(true)}>
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast({
                      title: 'Profile View',
                      description: 'This would open a detailed profile view',
                    });
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Simulate sharing profile
                    if (navigator.share) {
                      navigator.share({
                        title: `${user.name}'s Profile`,
                        text: `Check out ${user.name}'s profile on Treesh!`,
                        url: window.location.href
                      });
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: 'Profile Link Copied!',
                        description: 'Profile link has been copied to clipboard',
                      });
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => setShowStoryUpload(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Story
                </Button>

                {/* Subscription Buttons */}
                <Button 
                  className="bg-primary hover:bg-primary-dark text-white"
                  onClick={handleSubscriptionClick}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleGiftSubscriptionClick}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Gift Sub
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Posts</span>
            <Badge variant="secondary" className="ml-1">{mockPosts.filter(p => p.type === 'post').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Reels</span>
            <Badge variant="secondary" className="ml-1">{mockPosts.filter(p => p.type === 'reel').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Header with Actions */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <h3 className="text-lg font-semibold">
              {activeTab === 'posts' && 'Your Posts'}
              {activeTab === 'reels' && 'Your Reels'}
              {activeTab === 'saved' && 'Saved Content'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'posts' && `Share your moments with ${user.followers} followers`}
              {activeTab === 'reels' && 'Create engaging short videos'}
              {activeTab === 'saved' && 'Your bookmarked content'}
            </p>
          </div>
          <div className="flex space-x-2">
            {activeTab === 'posts' && (
              <Button size="sm" variant="outline" onClick={() => setShowStoryUpload(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            )}
            {activeTab === 'reels' && (
              <Button size="sm" variant="outline" onClick={() => setShowStoryUpload(true)}>
                <Video className="w-4 h-4 mr-2" />
                New Reel
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                toast({
                  title: 'Analytics',
                  description: 'Post analytics and insights opened',
                });
              }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
        
        <TabsContent value="posts" className="mt-6">
          <div className="grid grid-cols-3 gap-2">
            {mockPosts.filter(p => p.type === 'post').map((post) => (
              <div 
                key={post.id} 
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                onClick={() => handlePostClick(post)}
              >
                <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                    <div className="font-medium">{post.likes} likes</div>
                    <div className="text-sm">{post.caption}</div>
                  </div>
                </div>
                {/* Post Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    <Camera className="w-3 h-3 mr-1" />
                    Post
                  </Badge>
                </div>
                {/* Quick Actions */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-6 h-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePost(post.id);
                      }}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-6 h-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSavePost(post.id);
                      }}
                    >
                      <Bookmark className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reels" className="mt-6">
          <div className="grid grid-cols-3 gap-2">
            {mockPosts.filter(p => p.type === 'reel').map((reel) => (
              <div 
                key={reel.id} 
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                onClick={() => handlePostClick(reel)}
              >
                <img src={reel.image} alt="Reel" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                    <div className="font-medium">{reel.likes} likes</div>
                    <div className="text-sm">{reel.caption}</div>
                  </div>
                </div>
                {/* Reel Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    <Video className="w-3 h-3 mr-1" />
                    Reel
                  </Badge>
                </div>
                {/* Quick Actions */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-6 h-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePost(reel.id);
                      }}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-6 h-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSavePost(reel.id);
                      }}
                    >
                      <Bookmark className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <SavedPosts />
        </TabsContent>
      </Tabs>

      {/* Followers Modal */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Followers ({followers.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {followers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No followers yet</p>
                <p className="text-sm">Start sharing content to gain followers!</p>
              </div>
            ) : (
              followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                      <AvatarImage src={follower.avatar} />
                      <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium cursor-pointer hover:text-primary transition-colors">
                          {follower.name}
                        </span>
                        {follower.verified && <Badge className="bg-blue-500 text-xs">✓</Badge>}
                        {follower.mutual && <Badge variant="outline" className="text-xs">Mutual</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">@{follower.username}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={follower.isFollowing ? "default" : "outline"}
                      onClick={() => handleFollow(follower.id)}
                    >
                      {follower.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleBlock(follower.id)}
                      title="Block user"
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Modal */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Following ({following.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {following.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Not following anyone yet</p>
                <p className="text-sm">Discover and follow interesting people!</p>
              </div>
            ) : (
              following.map((followingUser) => (
                <div key={followingUser.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                      <AvatarImage src={followingUser.avatar} />
                      <AvatarFallback>{followingUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium cursor-pointer hover:text-primary transition-colors">
                          {followingUser.name}
                        </span>
                        {followingUser.verified && <Badge className="bg-blue-500 text-xs">✓</Badge>}
                        {followingUser.mutual && <Badge variant="outline" className="text-xs">Mutual</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">@{followingUser.username}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={followingUser.isFollowing ? "default" : "outline"}
                      onClick={() => handleUnfollow(followingUser.id)}
                    >
                      {followingUser.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleReport(followingUser.id)}
                      title="Report user"
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Picture Upload Modal */}
      <ProfilePictureUpload
        isOpen={showProfilePictureUpload}
        onClose={() => setShowProfilePictureUpload(false)}
        onSave={handleProfilePictureUpdate}
        currentAvatar={user.avatar}
      />

      {/* Story Upload Modal */}
      <StoryUpload
        isOpen={showStoryUpload}
        onClose={() => setShowStoryUpload(false)}
        onSave={handleStoryCreate}
      />

      {/* Privacy Settings Modal */}
      <PrivacySettings
        isOpen={showPrivacySettings}
        onClose={() => setShowPrivacySettings(false)}
        onSave={handlePrivacySettingsSave}
        currentSettings={{
          isPrivate: false,
          showOnlineStatus: true,
          allowMessages: true,
          showLocation: true,
          showWebsite: true,
          showPhone: false,
          allowTagging: true,
          allowMentions: true,
          showActivityStatus: true,
          allowStoryViews: true,
        }}
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetail
          isOpen={showPostDetail}
          onClose={() => {
            setShowPostDetail(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
        />
      )}

             {/* Streamer Subscription Modal */}
       <StreamerSubscriptionModal
         isOpen={showSubscriptionModal}
         onClose={() => setShowSubscriptionModal(false)}
         streamerName={user.name}
         streamerId={user.id}
         tiers={[]}
       />

             {/* Gift Subscription Modal */}
       <Dialog open={showGiftSubscriptionModal} onOpenChange={setShowGiftSubscriptionModal}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>Gift Subscription to {user.name}</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <p className="text-muted-foreground">Choose a subscription tier to gift to {user.name}!</p>
             
             <div className="space-y-3">
               <div className="grid grid-cols-1 gap-3">
                 <Button 
                   variant="outline" 
                   className="flex items-center justify-between p-4 h-auto"
                   onClick={() => {
                     toast({
                       title: 'Gold Tier Gift',
                       description: 'You selected Gold Tier ($9.99)',
                     });
                   }}
                 >
                   <div className="flex items-center space-x-3">
                     <Star className="w-6 h-6 text-yellow-500" />
                     <div className="text-left">
                       <div className="font-semibold">Gold Tier</div>
                       <div className="text-sm text-muted-foreground">$9.99/month</div>
                     </div>
                   </div>
                   <Badge variant="outline">Select</Badge>
                 </Button>
                 
                 <Button 
                   variant="outline" 
                   className="flex items-center justify-between p-4 h-auto"
                   onClick={() => {
                     toast({
                       title: 'Diamond Tier Gift',
                       description: 'You selected Diamond Tier ($16.99)',
                     });
                   }}
                 >
                   <div className="flex items-center space-x-3">
                     <Heart className="w-6 h-6 text-red-500" />
                     <div className="text-left">
                       <div className="font-semibold">Diamond Tier</div>
                       <div className="text-sm text-muted-foreground">$16.99/month</div>
                     </div>
                   </div>
                   <Badge variant="outline">Select</Badge>
                 </Button>
                 
                 <Button 
                   variant="outline" 
                   className="flex items-center justify-between p-4 h-auto"
                   onClick={() => {
                     toast({
                       title: 'Chrome Tier Gift',
                       description: 'You selected Chrome Tier ($39.99)',
                     });
                   }}
                 >
                   <div className="flex items-center space-x-3">
                     <MessageCircle className="w-6 h-6 text-blue-500" />
                     <div className="text-left">
                       <div className="font-semibold">Chrome Tier</div>
                       <div className="text-sm text-muted-foreground">$39.99/month</div>
                     </div>
                   </div>
                   <Badge variant="outline">Select</Badge>
                 </Button>
               </div>
             </div>
             
             <div className="pt-4 border-t">
               <Button 
                 className="w-full" 
                 onClick={() => {
                   toast({
                     title: 'Gift Sent!',
                     description: `Gift subscription sent to ${user.name}!`,
                   });
                   setShowGiftSubscriptionModal(false);
                 }}
               >
                 <Gift className="w-4 h-4 mr-2" />
                 Send Gift Subscription
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </div>
  );
};