import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['user', 'post', 'comment', 'stream', 'chat', 'reel', 'story'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'reportType'
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    enum: [
      'spam', 'harassment', 'inappropriate_content', 'fake_account',
      'violence', 'hate_speech', 'nudity', 'copyright', 'scam',
      'impersonation', 'self_harm', 'terrorism', 'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  evidence: [{
    type: String,
    url: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed', 'escalated'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  resolution: {
    action: {
      type: String,
      enum: [
        'no_action', 'warning_sent', 'content_removed', 'account_suspended',
        'account_banned', 'content_hidden', 'strike_issued'
      ]
    },
    reason: String,
    notes: String,
    duration: Number // in days for suspensions
  },
  adminNotes: [{
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['content', 'behavior', 'technical', 'legal', 'other'],
    default: 'content'
  },
  severity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  relatedReports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
  autoDetected: {
    type: Boolean,
    default: false
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 1
  }
}, {
  timestamps: true
});

// Indexes for performance
reportSchema.index({ reporter: 1, createdAt: -1 });
reportSchema.index({ targetUser: 1, status: 1 });
reportSchema.index({ status: 1, priority: 1, createdAt: -1 });
reportSchema.index({ assignedTo: 1, status: 1 });
reportSchema.index({ reportType: 1, targetId: 1 });

const moderationLogSchema = new mongoose.Schema({
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'user_warned', 'user_suspended', 'user_banned', 'content_removed',
      'content_approved', 'report_dismissed', 'report_escalated',
      'account_verified', 'account_unverified', 'stream_ended',
      'chat_muted', 'comment_deleted'
    ],
    required: true
  },
  targetType: {
    type: String,
    enum: ['user', 'post', 'comment', 'stream', 'chat', 'report'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  relatedReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  duration: {
    type: Number // in days for suspensions/bans
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

moderationLogSchema.index({ moderator: 1, createdAt: -1 });
moderationLogSchema.index({ targetUser: 1, action: 1, createdAt: -1 });
moderationLogSchema.index({ action: 1, createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);
export const ModerationLog = mongoose.model('ModerationLog', moderationLogSchema);