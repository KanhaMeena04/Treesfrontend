import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Ban, UserCheck, Search, Filter } from 'lucide-react';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  status: 'active' | 'blocked' | 'suspended';
  posts: number;
  followers: number;
  joinedAt: string;
  lastActive: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    username: 'alice',
    email: 'alice@example.com',
    status: 'active',
    posts: 45,
    followers: 1234,
    joinedAt: '2023-01-15',
    lastActive: '2024-01-20'
  },
  {
    id: '2',
    name: 'Bob Smith',
    username: 'bob',
    email: 'bob@example.com',
    status: 'blocked',
    posts: 23,
    followers: 567,
    joinedAt: '2023-03-22',
    lastActive: '2024-01-18'
  },
  {
    id: '3',
    name: 'Carol Davis',
    username: 'carol',
    email: 'carol@example.com',
    status: 'suspended',
    posts: 78,
    followers: 2341,
    joinedAt: '2022-11-08',
    lastActive: '2024-01-19'
  }
];

const mockActivityLogs = [
  {
    id: '1',
    user: 'Alice Johnson',
    action: 'Posted new content',
    timestamp: '2024-01-20 14:30',
    details: 'Uploaded a new photo'
  },
  {
    id: '2',
    user: 'Bob Smith',
    action: 'Account blocked',
    timestamp: '2024-01-20 10:15',
    details: 'Violated community guidelines'
  }
];

interface AdminUserManagementProps {
  section: 'all-users' | 'blocked-users' | 'activity-logs';
}

export const AdminUserManagement = ({ section }: AdminUserManagementProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'blocked': return 'destructive';
      case 'suspended': return 'secondary';
      default: return 'outline';
    }
  };

  const renderUserTable = (users: User[]) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {section === 'all-users' ? 'All Users' : 
             section === 'blocked-users' ? 'Blocked Users' : 'User Activity'}
          </span>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8 w-64" />
            </div>
            <Select>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.posts}</TableCell>
                <TableCell>{user.followers.toLocaleString()}</TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" title="View Profile">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {user.status === 'active' ? (
                      <Button size="sm" variant="outline" title="Block User">
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" title="Unblock User">
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderActivityLogs = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivityLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  if (section === 'activity-logs') {
    return renderActivityLogs();
  }

  const filteredUsers = section === 'blocked-users' 
    ? mockUsers.filter(user => user.status === 'blocked')
    : mockUsers;

  return renderUserTable(filteredUsers);
};