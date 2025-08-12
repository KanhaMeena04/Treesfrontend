import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Star, 
  Heart, 
  MessageCircle, 
  Users, 
  Calendar, 
  CreditCard, 
  Gift,
  Plus,
  Settings,
  Play,
  Eye,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock subscription data
  const activeSubscriptions = [
    {
      id: '1',
      streamer: {
        name: 'Sarah Johnson',
        username: 'sarah_streams',
        avatar: '/placeholder.svg',
        verified: true
      },
      tier: 'gold',
      price: 9.99,
      status: 'active',
      startDate: '2024-01-15',
      nextBilling: '2024-02-15',
      benefits: ['Access to stream', 'Standard emojis', 'Priority chat', 'Exclusive content access']
    },
    {
      id: '2',
      streamer: {
        name: 'Mike Chen',
        username: 'mike_gaming',
        avatar: '/placeholder.svg',
        verified: true
      },
      tier: 'diamond',
      price: 16.99,
      status: 'active',
      startDate: '2024-01-10',
      nextBilling: '2024-02-10',
      benefits: ['Exclusive streams', 'Premium emojis', 'Badge beside name', 'Direct messaging', 'Advanced features']
    }
  ];

  const subscriptionTiers = [
    {
      id: 'gold',
      name: 'Gold Tier',
      price: 9.99,
      color: 'bg-yellow-500',
      icon: Star,
      features: [
        'Access to stream',
        'Standard emojis',
        'Priority chat',
        'Exclusive content access'
      ],
      popular: false
    },
    {
      id: 'diamond',
      name: 'Diamond Tier',
      price: 16.99,
      color: 'bg-red-500',
      icon: Heart,
      features: [
        'Exclusive streams',
        'Premium emojis',
        'Badge beside name',
        'Direct messaging',
        'Advanced features'
      ],
      popular: true
    },
    {
      id: 'chrome',
      name: 'Chrome Tier',
      price: 39.99,
      color: 'bg-blue-500',
      icon: Crown,
      features: [
        'Chrome-only exclusive streams',
        'All premium features',
        'VIP access',
        'Early content',
        'Custom emotes'
      ],
      popular: false
    }
  ];

  const handleManageSubscription = (subscriptionId: string) => {
    toast({
      title: 'Manage Subscription',
      description: 'Opening subscription management...',
    });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription will end at the next billing cycle.',
      });
    }
  };

  const handleSubscribe = (tierId: string) => {
    toast({
      title: 'Subscribe',
      description: `Opening subscription form for ${tierId} tier...`,
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'gold':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'diamond':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'chrome':
        return <Crown className="w-5 h-5 text-blue-500" />;
      default:
        return <Crown className="w-5 h-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'diamond':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'chrome':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Active Subscriptions Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5" />
            <span>Active Subscriptions</span>
            <Badge variant="secondary">{activeSubscriptions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSubscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Crown className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Active Subscriptions</h3>
              <p className="mb-4">Subscribe to your favorite streamers to unlock exclusive content and features.</p>
              <Button onClick={() => setActiveTab('discover')}>
                <Plus className="w-4 h-4 mr-2" />
                Discover Streamers
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSubscriptions.map((subscription) => (
                <div key={subscription.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={subscription.streamer.avatar} />
                        <AvatarFallback>{subscription.streamer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{subscription.streamer.name}</h4>
                          {subscription.streamer.verified && (
                            <Badge className="bg-blue-500 text-xs">✓</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{subscription.streamer.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {getTierIcon(subscription.tier)}
                        <Badge className={getTierColor(subscription.tier)}>
                          {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Tier
                        </Badge>
                      </div>
                      <p className="text-lg font-bold">${subscription.price}/month</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Next Billing</p>
                      <p className="font-medium">{new Date(subscription.nextBilling).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Benefits:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {subscription.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleManageSubscription(subscription.id)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelSubscription(subscription.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('discover')}>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Discover Streamers</h3>
            <p className="text-sm text-muted-foreground">Find new creators to support</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('history')}>
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Subscription History</h3>
            <p className="text-sm text-muted-foreground">View your past subscriptions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('billing')}>
          <CardContent className="p-6 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Billing & Payment</h3>
            <p className="text-sm text-muted-foreground">Manage payment methods</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDiscover = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Discover Amazing Streamers</h2>
        <p className="text-muted-foreground">Support your favorite creators and unlock exclusive content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <Card key={tier.id} className={`relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                <tier.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle>{tier.name}</CardTitle>
              <div className="text-3xl font-bold">${tier.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(tier.id)}
              >
                Subscribe to {tier.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Gift Subscriptions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Surprise your friends with a subscription to their favorite streamer!
          </p>
          <Button variant="outline">
            <Gift className="w-4 h-4 mr-2" />
            Send Gift Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Subscription History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Subscription History</h3>
            <p>Your subscription history will appear here once you start subscribing to streamers.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Billing & Payment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
            <p>Add and manage your payment methods for subscriptions.</p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Subscriptions</h1>
        <p className="text-muted-foreground">Manage your streamer subscriptions and discover new creators</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Crown className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Discover</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          {renderDiscover()}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {renderHistory()}
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {renderBilling()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
