import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Filter, 
  MessageCircle, 
  Heart, 
  X, 
  Users, 
  TrendingUp, 
  Settings, 
  MapPin, 
  Calendar,
  Shield,
  Flag,
  UserMinus,
  Lock,
  Unlock,
  Star,
  Camera,
  Video,
  MoreHorizontal,
  Phone,
  Mail,
  Instagram,
  Twitter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Enhanced mock data for users to match with
const mockUsers = [
  {
    id: '1',
    name: 'Emma Wilson',
    age: 24,
    bio: 'Love traveling and photography 📸 Coffee addict and adventure seeker',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    location: 'New York, NY',
    distance: 5,
    interests: ['Travel', 'Photography', 'Coffee', 'Adventure'],
    verified: true,
    lastActive: '2 minutes ago',
    mutualFriends: 3,
    occupation: 'Photographer',
    education: 'NYU',
    height: '5\'6"',
    zodiac: 'Libra'
  },
  {
    id: '2',
    name: 'Alex Chen',
    age: 26,
    bio: 'Fitness enthusiast and dog lover 🐕 Always up for a good workout',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'Los Angeles, CA',
    distance: 8,
    interests: ['Fitness', 'Dogs', 'Hiking', 'Healthy Living'],
    verified: false,
    lastActive: '1 hour ago',
    mutualFriends: 1,
    occupation: 'Personal Trainer',
    education: 'UCLA',
    height: '6\'0"',
    zodiac: 'Capricorn'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    age: 25,
    bio: 'Artist and coffee lover ☕ Creating beauty one brushstroke at a time',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    location: 'Chicago, IL',
    distance: 3,
    interests: ['Art', 'Coffee', 'Music', 'Creativity'],
    verified: true,
    lastActive: 'Online now',
    mutualFriends: 5,
    occupation: 'Art Director',
    education: 'SAIC',
    height: '5\'4"',
    zodiac: 'Pisces'
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    age: 28,
    bio: 'Tech geek by day, musician by night 🎸 Building the future one code at a time',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'San Francisco, CA',
    distance: 12,
    interests: ['Technology', 'Music', 'Coding', 'Gaming'],
    verified: true,
    lastActive: '30 minutes ago',
    mutualFriends: 2,
    occupation: 'Software Engineer',
    education: 'Stanford',
    height: '5\'10"',
    zodiac: 'Aquarius'
  },
  {
    id: '5',
    name: 'Jessica Kim',
    age: 23,
    bio: 'Foodie and travel blogger 🍜 Exploring the world one dish at a time',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    location: 'Seattle, WA',
    distance: 15,
    interests: ['Food', 'Travel', 'Blogging', 'Cooking'],
    verified: false,
    lastActive: '2 hours ago',
    mutualFriends: 0,
    occupation: 'Food Blogger',
    education: 'UW',
    height: '5\'5"',
    zodiac: 'Cancer'
  }
];

// Enhanced mock matches data
const mockMatches = [
  {
    id: '1',
    user: mockUsers[0],
    matchedAt: '2024-01-20T14:30:00Z',
    lastMessage: 'Hey! Loved your photography posts!',
    lastMessageTime: '2024-01-20T16:45:00Z',
    isPinned: true,
    unreadCount: 2,
    chatPin: '1234',
    messages: [
      { id: '1', sender: 'them', text: 'Hey! Loved your photography posts!', time: '2024-01-20T16:45:00Z' },
      { id: '2', sender: 'me', text: 'Thank you! Your travel photos are amazing too!', time: '2024-01-20T17:00:00Z' },
      { id: '3', sender: 'them', text: 'We should plan a photo adventure together!', time: '2024-01-20T17:15:00Z' }
    ]
  },
  {
    id: '2',
    user: mockUsers[2],
    matchedAt: '2024-01-19T10:15:00Z',
    lastMessage: 'Your art is amazing!',
    lastMessageTime: '2024-01-19T18:20:00Z',
    isPinned: false,
    unreadCount: 0,
    chatPin: '5678',
    messages: [
      { id: '1', sender: 'them', text: 'Your art is amazing!', time: '2024-01-19T18:20:00Z' },
      { id: '2', sender: 'me', text: 'Thanks! I love your creative energy', time: '2024-01-19T18:30:00Z' }
    ]
  }
];

export const ArcadePage = () => {
  const [activeTab, setActiveTab] = useState('swipe');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [dislikedUsers, setDislikedUsers] = useState<string[]>([]);
  const [matches, setMatches] = useState(mockMatches);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [chatPin, setChatPin] = useState('');
  const [isChatAuthenticated, setIsChatAuthenticated] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // Filter settings
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [maxDistance, setMaxDistance] = useState([50]);
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtered users based on preferences
  const filteredUsers = mockUsers.filter(user => {
    if (onlyVerified && !user.verified) return false;
    if (user.age < ageRange[0] || user.age > ageRange[1]) return false;
    if (user.distance > maxDistance[0]) return false;
    if (selectedInterests.length > 0 && !selectedInterests.some(interest => user.interests.includes(interest))) return false;
    return true;
  });

  const currentUser = filteredUsers[currentUserIndex];
  const totalUsers = filteredUsers.length;

  // Reset image index when user changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentUserIndex]);

  // Enhanced matching logic
  const checkForMatch = (userId: string) => {
    // Mock: 40% chance of match when liking a user
    if (Math.random() < 0.4) {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        setMatchedUser(user);
        setShowMatchNotification(true);
        
        // Add to matches
        const newMatch = {
          id: Date.now().toString(),
          user: user,
          matchedAt: new Date().toISOString(),
          lastMessage: 'You matched! Start a conversation!',
          lastMessageTime: new Date().toISOString(),
          isPinned: false,
          unreadCount: 1,
          chatPin: Math.floor(1000 + Math.random() * 9000).toString(),
          messages: [
            { id: '1', sender: 'system', text: 'You matched! Start a conversation!', time: new Date().toISOString() }
          ]
        };
        setMatches(prev => [newMatch, ...prev]);
        
        return true;
      }
    }
    return false;
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLikedUsers(prev => [...prev, currentUser.id]);
      const isMatch = checkForMatch(currentUser.id);
      if (isMatch) {
        toast({
          title: 'It\'s a Match! 🎉',
          description: `You and ${currentUser.name} liked each other!`,
          duration: 3000
        });
      } else {
        toast({
          title: 'Profile Liked',
          description: `You liked ${currentUser.name}'s profile`,
          duration: 2000
        });
      }
    } else {
      setDislikedUsers(prev => [...prev, currentUser.id]);
      toast({
        title: 'Profile Passed',
        description: `You passed on ${currentUser.name}'s profile`,
        duration: 1500
      });
    }
    
    // Move to next user
    if (currentUserIndex < totalUsers - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      // Reset to beginning if we've seen all users
      setCurrentUserIndex(0);
      toast({
        title: 'All profiles viewed!',
        description: 'Starting over with fresh suggestions.'
      });
    }
  };

  const nextImage = () => {
    if (currentUser && currentImageIndex < currentUser.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleMatchAction = (action: 'message' | 'follow' | 'continue') => {
    if (action === 'message') {
      const match = matches.find(m => m.user.id === matchedUser.id);
      if (match) {
        setSelectedMatch(match);
        setShowChat(true);
      }
    }
    setShowMatchNotification(false);
  };

  const handleChatPinSubmit = () => {
    if (chatPin === selectedMatch.chatPin) {
      setIsChatAuthenticated(true);
      toast({
        title: 'Chat unlocked!',
        description: 'You can now chat securely.'
      });
    } else {
      toast({
        title: 'Incorrect PIN',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handlePinChat = (matchId: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, isPinned: !match.isPinned }
        : match
    ));
  };

  const handleBlockUser = (userId: string) => {
    setMatches(prev => prev.filter(match => match.user.id !== userId));
    setLikedUsers(prev => prev.filter(id => id !== userId));
    setDislikedUsers(prev => prev.filter(id => id !== userId));
    toast({
      title: 'User blocked',
      description: 'User has been blocked and removed from matches.'
    });
  };

  const handleReportUser = (userId: string) => {
    toast({
      title: 'User reported',
      description: 'Thank you for reporting. We will review this case.'
    });
  };

  const applyFilters = () => {
    setCurrentUserIndex(0);
    setShowFilters(false);
    toast({
      title: 'Filters applied',
      description: 'Your preferences have been updated'
    });
  };

  const resetSwipeHistory = () => {
    setLikedUsers([]);
    setDislikedUsers([]);
    setCurrentUserIndex(0);
    toast({
      title: 'History reset',
      description: 'Starting fresh with all profiles'
    });
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedMatch) {
      const message = {
        id: Date.now().toString(),
        sender: 'me',
        text: newMessage.trim(),
        time: new Date().toISOString()
      };
      
      setSelectedMatch(prev => ({
        ...prev,
        messages: [...prev.messages, message],
        lastMessage: newMessage.trim(),
        lastMessageTime: new Date().toISOString()
      }));
      
      setNewMessage('');
      
      // Update matches list
      setMatches(prev => prev.map(match => 
        match.id === selectedMatch.id 
          ? { ...match, messages: [...match.messages, message], lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
          : match
      ));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Keyboard navigation for swipe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'swipe' && currentUser) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            handleSwipe('left');
            break;
          case 'ArrowRight':
            e.preventDefault();
            handleSwipe('right');
            break;
          case 'ArrowUp':
            e.preventDefault();
            nextImage();
            break;
          case 'ArrowDown':
            e.preventDefault();
            prevImage();
            break;
          case ' ':
            e.preventDefault();
            // Pass without disliking
            if (currentUserIndex < totalUsers - 1) {
              setCurrentUserIndex(currentUserIndex + 1);
              toast({
                title: 'Profile Skipped',
                description: `You skipped ${currentUser.name}'s profile`,
                duration: 1500
              });
            } else {
              setCurrentUserIndex(0);
              toast({
                title: 'All profiles viewed!',
                description: 'Starting over with fresh suggestions.'
              });
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentUser, currentImageIndex]);

  // Auto-advance to next user after a delay if no action taken
  useEffect(() => {
    if (activeTab === 'swipe' && currentUser) {
      const timer = setTimeout(() => {
        if (currentUserIndex === 0) {
          toast({
            title: 'Tip',
            description: 'Use arrow keys or swipe buttons to navigate profiles',
            duration: 3000
          });
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [activeTab, currentUser, currentUserIndex]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Arcade – Matchmaking</h1>
          <p className="text-muted-foreground">Swipe, match, and connect with amazing people</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={resetSwipeHistory}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Discovery Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Gender Preference</Label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                <Slider
                  value={ageRange}
                  onValueChange={setAgeRange}
                  max={60}
                  min={18}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Max Distance: {maxDistance[0]} km</Label>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={100}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Interests</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Travel', 'Photography', 'Fitness', 'Art', 'Gaming', 'Food', 'Music', 'Technology'].map((interest) => (
                    <Button
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedInterests(prev => 
                          prev.includes(interest) 
                            ? prev.filter(i => i !== interest)
                            : [...prev, interest]
                        );
                      }}
                      className="justify-start"
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="onlyVerified"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="onlyVerified">Only show verified profiles</Label>
            </div>
            
            <div className="flex space-x-2">
              <Button className="flex-1" onClick={applyFilters}>
                Apply Preferences
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Profiles Liked</p>
                <p className="text-2xl font-bold">{likedUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Matches</p>
                <p className="text-2xl font-bold">{matches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{Math.round((currentUserIndex / totalUsers) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">{totalUsers - currentUserIndex}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="swipe" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Swipe</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Matches</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Swipe Tab */}
        <TabsContent value="swipe" className="space-y-6">
          <div className="text-center mb-4">
            <Badge variant="outline" className="text-sm">
              Profile {currentUserIndex + 1} of {totalUsers}
            </Badge>
          </div>
          
          {currentUser ? (
            <div className="max-w-md mx-auto">
              {/* Swipe Card */}
              <Card className="overflow-hidden relative shadow-lg">
                <div className="relative">
                  <img
                    src={currentUser.images[currentImageIndex]}
                    alt={currentUser.name}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {currentUser.images.length > 1 && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0"
                        onClick={prevImage}
                        disabled={currentImageIndex === 0}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 left-16 bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0"
                        onClick={nextImage}
                        disabled={currentImageIndex === currentUser.images.length - 1}
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                      
                      {/* Image Counter */}
                      <div className="absolute top-4 left-28 bg-white/80 rounded-full px-2 py-1 text-xs font-medium">
                        {currentImageIndex + 1}/{currentUser.images.length}
                      </div>
                    </>
                  )}
                  
                  {/* User Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <h2 className="text-2xl font-bold">{currentUser.name}, {currentUser.age}</h2>
                      {currentUser.verified && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm opacity-90 mb-2">{currentUser.distance} km away</p>
                    <p className="text-sm opacity-90">{currentUser.location}</p>
                  </div>
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0"
                      onClick={() => handleReportUser(currentUser.id)}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <p className="mb-3">{currentUser.bio}</p>
                  
                  {/* Enhanced User Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{currentUser.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{currentUser.lastActive}</span>
                    </div>
                    {currentUser.occupation && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span>{currentUser.occupation}</span>
                      </div>
                    )}
                    {currentUser.education && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{currentUser.education}</span>
                      </div>
                    )}
                  </div>
                  
                  {currentUser.mutualFriends > 0 && (
                    <div className="mb-3 text-sm text-muted-foreground">
                      <span className="font-medium">{currentUser.mutualFriends} mutual friends</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Swipe Action Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-14 h-14 border-red-500 hover:bg-red-50 hover:border-red-600"
                  onClick={() => handleSwipe('left')}
                  title="Dislike (Left Arrow)"
                >
                  <X className="w-5 h-5 text-red-500" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-14 h-14 border-gray-500 hover:bg-gray-50 hover:border-gray-600"
                  onClick={() => {
                    // Pass without disliking
                    if (currentUserIndex < totalUsers - 1) {
                      setCurrentUserIndex(currentUserIndex + 1);
                      toast({
                        title: 'Profile Skipped',
                        description: `You skipped ${currentUser.name}'s profile`,
                        duration: 1500
                      });
                    } else {
                      setCurrentUserIndex(0);
                      toast({
                        title: 'All profiles viewed!',
                        description: 'Starting over with fresh suggestions.'
                      });
                    }
                  }}
                  title="Pass (Space)"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-14 h-14 border-blue-500 hover:bg-blue-50 hover:border-blue-600"
                  onClick={() => {
                    toast({
                      title: 'Super Like!',
                      description: `You super liked ${currentUser.name}!`,
                      duration: 2000
                    });
                    handleSwipe('right');
                  }}
                  title="Super Like"
                >
                  <Star className="w-5 h-5 text-blue-500" />
                </Button>
                
                <Button
                  size="lg"
                  className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600"
                  onClick={() => handleSwipe('right')}
                  title="Like (Right Arrow)"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Keyboard Shortcuts Info */}
              <div className="text-center mt-4 text-xs text-muted-foreground">
                <p>💡 Use arrow keys: ← → to swipe, ↑ ↓ to browse images, Space to pass</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No more profiles to show</h3>
              <p className="text-muted-foreground mb-4">
                You've seen all available profiles. Check back later for more suggestions!
              </p>
              <Button onClick={resetSwipeHistory}>
                Start Over
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches">
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
                <p className="text-muted-foreground">
                  Start swiping to find your first match!
                </p>
              </div>
            ) : (
              <>
                {/* Matches Summary */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Your Matches ({matches.length})</h3>
                    <p className="text-sm text-muted-foreground">
                      {matches.filter(m => m.isPinned).length} pinned conversations
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMatches(prev => [...prev].sort((a, b) => 
                      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
                    ))}
                  >
                    Sort by Recent
                  </Button>
                </div>
                
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={match.user.avatar} alt={match.user.name} />
                          <AvatarFallback>{match.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{match.user.name}, {match.user.age}</h3>
                            {match.user.verified && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                ✓
                              </Badge>
                            )}
                            {match.isPinned && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{match.lastMessage}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(match.lastMessageTime).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {match.user.occupation || 'Professional'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {match.user.location}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          {match.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {match.unreadCount}
                            </Badge>
                          )}
                          
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePinChat(match.id)}
                              title={match.isPinned ? "Unpin chat" : "Pin chat"}
                            >
                              {match.isPinned ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedMatch(match);
                                setShowChat(true);
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBlockUser(match.user.id)}
                              title="Block user"
                            >
                              <UserMinus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discovery Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Discovery Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Gender Preference</Label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                  <Slider
                    value={ageRange}
                    onValueChange={setAgeRange}
                    max={60}
                    min={18}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Max Distance: {maxDistance[0]} km</Label>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    max={100}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Interests</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Travel', 'Photography', 'Fitness', 'Art', 'Gaming', 'Food', 'Music', 'Technology'].map((interest) => (
                      <Button
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedInterests(prev => 
                            prev.includes(interest) 
                              ? prev.filter(i => i !== interest)
                              : [...prev, interest]
                          );
                        }}
                        className="justify-start"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="onlyVerified"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="onlyVerified">Only show verified profiles</Label>
                </div>
                
                <Button className="w-full" onClick={applyFilters}>
                  Apply Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Privacy Level</Label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Profile</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Notification Preferences</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Matches</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Messages</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Views</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Safety & Security</Label>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Blocked Users ({likedUsers.filter(id => !matches.some(m => m.user.id === id)).length})
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Flag className="w-4 h-4 mr-2" />
                      Report History
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                  </div>
                </div>
                
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Match Notification */}
      {showMatchNotification && matchedUser && (
        <Dialog open={showMatchNotification} onOpenChange={setShowMatchNotification}>
          <DialogContent className="max-w-md mx-auto text-center">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center space-x-2 text-2xl font-bold text-green-600">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                <span>It's a Match!</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-6">
              <div className="relative mb-6">
                <div className="flex justify-center space-x-4">
                  <Avatar className="w-20 h-20 border-4 border-green-500">
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback className="text-lg">You</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>
                  
                  <Avatar className="w-20 h-20 border-4 border-green-500">
                    <AvatarImage src={matchedUser.avatar} alt={matchedUser.name} />
                    <AvatarFallback className="text-lg">{matchedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {matchedUser.name}, {matchedUser.age}
                  {matchedUser.verified && (
                    <Badge variant="secondary" className="ml-2 text-xs px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </h3>
                <p className="text-muted-foreground mb-2">{matchedUser.location}</p>
                <p className="text-sm text-muted-foreground">{matchedUser.bio}</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => handleMatchAction('message')}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chatting
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Show detailed profile
                    toast({
                      title: 'Profile Details',
                      description: `${matchedUser.name} is a ${matchedUser.occupation || 'Professional'} from ${matchedUser.location}`,
                      duration: 4000
                    });
                  }}
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleMatchAction('continue')}
                  className="w-full"
                >
                  Keep Swiping
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Chat Modal */}
      {showChat && selectedMatch && (
        <Dialog open={showChat} onOpenChange={setShowChat}>
          <DialogContent className="max-w-2xl mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedMatch.user.avatar} alt={selectedMatch.user.name} />
                  <AvatarFallback>{selectedMatch.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>Chat with {selectedMatch.user.name}</span>
                {selectedMatch.isPinned && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-6">
              {!isChatAuthenticated ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Secure Chat Access</h3>
                  <p className="text-muted-foreground">
                    Enter the 4-digit PIN to access your secure chat with {selectedMatch.user.name}
                  </p>
                  
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2, 3].map((index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-bold"
                        value={chatPin[index] || ''}
                        onChange={(e) => {
                          const newPin = chatPin.split('');
                          newPin[index] = e.target.value;
                          setChatPin(newPin.join(''));
                          
                          // Auto-focus next input
                          if (e.target.value && index < 3) {
                            const nextInput = e.target.parentElement?.nextElementSibling?.querySelector('input');
                            if (nextInput) nextInput.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleChatPinSubmit}
                    disabled={chatPin.length !== 4}
                    className="w-full"
                  >
                    Unlock Chat
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    PIN: {selectedMatch.chatPin} (for demo purposes)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Secure Chat Active</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your conversation with {selectedMatch.user.name} is now encrypted and secure.
                    </p>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="border rounded-lg p-4 min-h-64 max-h-96 overflow-y-auto">
                    {selectedMatch.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-3 flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.sender === 'me'
                              ? 'bg-blue-500 text-white'
                              : message.sender === 'system'
                              ? 'bg-gray-200 text-gray-700 mx-auto'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowChat(false);
                        setIsChatAuthenticated(false);
                        setChatPin('');
                      }}
                    >
                      Close Chat
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleBlockUser(selectedMatch.user.id)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Block User
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

