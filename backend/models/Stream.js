import mongoose from 'mongoose';

const streamSchema = new mongoose.Schema({
  streamer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['gaming', 'music', 'talk', 'education', 'fitness', 'cooking', 'art', 'other'],
    required: true
  },
  thumbnail: {
    type: String
  },
  streamKey: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['live', 'ended', 'scheduled', 'cancelled'],
    default: 'scheduled'
  },
  viewers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentViewers: {
    type: Number,
    default: 0
  },
  maxViewers: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0 // in seconds
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  },
  chat: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      enum: ['❤️', '👍', '😂', '😮', '😢', '😡']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRecorded: {
    type: Boolean,
    default: false
  },
  recordingUrl: {
    type: String
  },
  tags: [String],
  language: {
    type: String,
    default: 'en'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'spam', 'harassment', 'violence', 'copyright', 'other']
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  moderationFlags: [{
    type: {
      type: String,
      enum: ['inappropriate_content', 'spam', 'harassment', 'technical_issue']
    },
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
streamSchema.index({ streamer: 1, status: 1 });
streamSchema.index({ category: 1, status: 1, createdAt: -1 });
streamSchema.index({ status: 1, currentViewers: -1 });

export default mongoose.model('Stream', streamSchema);