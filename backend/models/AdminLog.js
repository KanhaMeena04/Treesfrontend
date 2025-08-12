import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  target: {
    type: {
      type: String,
      enum: ['user', 'post', 'stream', 'report', 'match']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  details: String,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes
adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });
adminLogSchema.index({ createdAt: -1 });

export default mongoose.model('AdminLog', adminLogSchema);