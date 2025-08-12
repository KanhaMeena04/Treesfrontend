import { AdminUserManagement } from './AdminUserManagement';
import { AdminContentModeration } from './AdminContentModeration';
import { AdminLivestreamControls } from './AdminLivestreamControls';
import { AdminPSAManagement } from './AdminPSAManagement';
import { AdminReportsAnalytics } from './AdminReportsAnalytics';
import { AdminNotifications } from './AdminNotifications';
import { AdminMatchmakingOversight } from './AdminMatchmakingOversight';
import { AdminSettings } from './AdminSettings';
import { AdminAnalyticsReports } from './AdminAnalyticsReports';
import { AdminStaticWebsiteManagement } from './AdminStaticWebsiteManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Video, Heart, TrendingUp, Bell } from 'lucide-react';

interface AdminContentProps {
  activeSection: string;
}

const DashboardOverview = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45,231</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,543</div>
          <p className="text-xs text-muted-foreground">+8.2% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89,432</div>
          <p className="text-xs text-muted-foreground">+12.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Streams</CardTitle>
          <Video className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">+3.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23,891</div>
          <p className="text-xs text-muted-foreground">+18.7% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reels</CardTitle>
          <Video className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45,672</div>
          <p className="text-xs text-muted-foreground">+25.3% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+15.3% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reports Pending</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">-5.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const AdminContent = ({ activeSection }: AdminContentProps) => {
  switch (activeSection) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'all-users':
    case 'blocked-users':
    case 'activity-logs':
      return <AdminUserManagement />;
    case 'review-posts':
    case 'review-reels':
    case 'review-stories':
    case 'reported-content':
      return <AdminContentModeration />;
    case 'match-logs':
    case 'flagged-conversations':
      return <AdminMatchmakingOversight />;
    case 'live-streams':
    case 'scheduled-streams':
    case 'stream-categories':
      return <AdminLivestreamControls />;
    case 'push-announcement':
    case 'past-psas':
      return <AdminPSAManagement />;
    case 'engagement-trends':
    case 'top-users':
    case 'top-creators':
    case 'login-stats':
      return <AdminAnalyticsReports />;
    case 'send-notification':
    case 'notification-logs':
      return <AdminNotifications />;
    case 'admin-users':
    case 'security':
    case 'activity-logs-admin':
      return <AdminSettings />;
    case 'homepage-content':
    case 'seo-settings':
    case 'banners-management':
      return <AdminStaticWebsiteManagement />;
    default:
      return <DashboardOverview />;
  }
};