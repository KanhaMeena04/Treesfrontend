# Database Structure

## MongoDB Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  phone: String (unique),
  password: String (hashed, required),
  profileImage: String (URL),
  bio: String,
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  role: String (enum: ['user', 'admin', 'moderator'], default: 'user'),
  followers: [ObjectId] (refs: User),
  following: [ObjectId] (refs: User),
  blockedUsers: [ObjectId] (refs: User),
  interests: [String],
  location: {
    city: String,
    country: String,
    coordinates: [Number] // [longitude, latitude]
  },
  preferences: {
    gender: String (enum: ['male', 'female', 'other']),
    ageRange: {
      min: Number,
      max: Number
    },
    maxDistance: Number
  },
  stats: {
    postsCount: Number (default: 0),
    followersCount: Number (default: 0),
    followingCount: Number (default: 0)
  },
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User, required),
  content: {
    text: String,
    media: [{
      type: String (enum: ['image', 'video']),
      url: String,
      thumbnail: String
    }]
  },
  type: String (enum: ['post', 'story', 'reel'], required),
  likes: [ObjectId] (refs: User),
  comments: [{
    user: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  shares: [{
    user: ObjectId (ref: User),
    createdAt: Date
  }],
  views: [{
    user: ObjectId (ref: User),
    viewedAt: Date
  }],
  isApproved: Boolean (default: true),
  isReported: Boolean (default: false),
  reportCount: Number (default: 0),
  expiresAt: Date, // for stories
  createdAt: Date,
  updatedAt: Date
}
```

### Streams Collection
```javascript
{
  _id: ObjectId,
  streamer: ObjectId (ref: User, required),
  title: String (required),
  description: String,
  category: String (enum: ['gaming', 'music', 'talk', 'education', 'other']),
  thumbnail: String,
  streamUrl: String,
  isLive: Boolean (default: false),
  viewers: [ObjectId] (refs: User),
  maxViewers: Number (default: 0),
  totalViews: Number (default: 0),
  duration: Number, // in seconds
  chat: [{
    user: ObjectId (ref: User),
    message: String,
    timestamp: Date
  }],
  reactions: [{
    user: ObjectId (ref: User),
    type: String (enum: ['like', 'love', 'laugh', 'wow']),
    timestamp: Date
  }],
  startedAt: Date,
  endedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Matches Collection
```javascript
{
  _id: ObjectId,
  users: [ObjectId] (refs: User, required), // exactly 2 users
  status: String (enum: ['pending', 'matched', 'rejected'], default: 'pending'),
  initiator: ObjectId (ref: User, required),
  swipes: [{
    user: ObjectId (ref: User),
    action: String (enum: ['like', 'pass']),
    timestamp: Date
  }],
  chatStarted: Boolean (default: false),
  lastMessage: {
    sender: ObjectId (ref: User),
    text: String,
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  match: ObjectId (ref: Match, required),
  sender: ObjectId (ref: User, required),
  receiver: ObjectId (ref: User, required),
  content: {
    text: String,
    media: {
      type: String (enum: ['image', 'video', 'audio']),
      url: String
    }
  },
  isRead: Boolean (default: false),
  readAt: Date,
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: User, required),
  sender: ObjectId (ref: User),
  type: String (enum: ['like', 'comment', 'follow', 'match', 'message', 'psa'], required),
  title: String (required),
  message: String (required),
  data: {
    postId: ObjectId,
    matchId: ObjectId,
    userId: ObjectId
  },
  isRead: Boolean (default: false),
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Reports Collection
```javascript
{
  _id: ObjectId,
  reporter: ObjectId (ref: User, required),
  reported: {
    type: String (enum: ['user', 'post', 'stream', 'message'], required),
    id: ObjectId (required)
  },
  reason: String (enum: ['spam', 'harassment', 'inappropriate', 'fake', 'other'], required),
  description: String,
  status: String (enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending'),
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  action: String (enum: ['warning', 'content_removed', 'user_suspended', 'no_action']),
  createdAt: Date,
  updatedAt: Date
}
```

### PSAs Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  media: {
    type: String (enum: ['image', 'video']),
    url: String
  },
  targetAudience: {
    gender: String (enum: ['all', 'male', 'female']),
    location: String,
    ageRange: {
      min: Number,
      max: Number
    }
  },
  isActive: Boolean (default: true),
  scheduledFor: Date,
  expiresAt: Date,
  stats: {
    views: Number (default: 0),
    clicks: Number (default: 0),
    interactions: Number (default: 0)
  },
  createdBy: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

### AdminLogs Collection
```javascript
{
  _id: ObjectId,
  admin: ObjectId (ref: User, required),
  action: String (required),
  target: {
    type: String (enum: ['user', 'post', 'stream', 'report']),
    id: ObjectId
  },
  details: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

## Indexes

### Users Collection Indexes
- `{ email: 1 }` (unique)
- `{ username: 1 }` (unique)
- `{ phone: 1 }` (unique, sparse)
- `{ location.coordinates: "2dsphere" }` (geospatial)
- `{ lastActive: -1 }`

### Posts Collection Indexes
- `{ author: 1, createdAt: -1 }`
- `{ type: 1, createdAt: -1 }`
- `{ expiresAt: 1 }` (TTL for stories)
- `{ isApproved: 1, isReported: 1 }`

### Streams Collection Indexes
- `{ streamer: 1, createdAt: -1 }`
- `{ isLive: 1, category: 1 }`
- `{ totalViews: -1 }`

### Matches Collection Indexes
- `{ users: 1, status: 1 }`
- `{ initiator: 1, createdAt: -1 }`

### Messages Collection Indexes
- `{ match: 1, createdAt: -1 }`
- `{ sender: 1, receiver: 1 }`
- `{ receiver: 1, isRead: 1 }`

### Notifications Collection Indexes
- `{ recipient: 1, createdAt: -1 }`
- `{ recipient: 1, isRead: 1 }`

### Reports Collection Indexes
- `{ status: 1, createdAt: -1 }`
- `{ reporter: 1, createdAt: -1 }`

### PSAs Collection Indexes
- `{ isActive: 1, scheduledFor: 1 }`
- `{ expiresAt: 1 }` (TTL)

### AdminLogs Collection Indexes
- `{ admin: 1, createdAt: -1 }`
- `{ action: 1, createdAt: -1 }`