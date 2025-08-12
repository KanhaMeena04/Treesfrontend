import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, MessageSquare, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [newPost, setNewPost] = useState({ content: '', platform: '', image: '' });
  
  const stats = [
    { label: 'Total Posts', value: '1,234', icon: MessageSquare, color: 'bg-primary' },
    { label: 'Active Users', value: '5,678', icon: Users, color: 'bg-accent' },
    { label: 'Engagement Rate', value: '8.2%', icon: TrendingUp, color: 'bg-primary-dark' },
    { label: 'Analytics', value: '92%', icon: BarChart3, color: 'bg-primary' },
  ];

  const recentPosts = [
    { id: 1, author: 'John Doe', content: 'Amazing sunset today!', platform: 'instagram', status: 'published' },
    { id: 2, author: 'Jane Smith', content: 'New product launch coming soon...', platform: 'twitter', status: 'scheduled' },
    { id: 3, author: 'Mike Johnson', content: 'Thanks for all the support!', platform: 'facebook', status: 'draft' },
  ];

  const handleCreatePost = () => {
    console.log('Creating post:', newPost);
    setNewPost({ content: '', platform: '', image: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-dark">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.svg" 
              alt="Treesh" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-8 h-8 rounded-full flex items-center justify-center hidden overflow-hidden">
              <img src="/logo.svg" alt="Treesh Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-white font-treesh">Admin Panel</h2>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
            ×
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="dashboard" className="font-opensans">Dashboard</TabsTrigger>
              <TabsTrigger value="posts" className="font-opensans">Posts</TabsTrigger>
              <TabsTrigger value="users" className="font-opensans">Users</TabsTrigger>
              <TabsTrigger value="analytics" className="font-opensans">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 font-opensans">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 font-opensans">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-full ${stat.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-treesh">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 font-opensans">{post.author}</p>
                          <p className="text-sm text-gray-600 truncate font-opensans">{post.content}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                          <span className="text-xs text-gray-500 font-opensans">{post.platform}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="posts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create New Post</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="min-h-[100px]"
                  />
                  <div className="flex space-x-4">
                    <Select value={newPost.platform} onValueChange={(value) => setNewPost({...newPost, platform: value})}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Image URL (optional)"
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                  <Button onClick={handleCreatePost} className="w-full">
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">User management features coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;