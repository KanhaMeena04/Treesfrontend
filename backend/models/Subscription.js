import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tier: {
    type: String,
    enum: ['gold', 'diamond', 'chrome'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'paused'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'wallet'],
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  isGifted: {
    type: Boolean,
    default: false
  },
  giftedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  giftMessage: String
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ subscriber: 1, creator: 1 });
subscriptionSchema.index({ creator: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Get subscription benefits
subscriptionSchema.methods.getBenefits = function() {
  const benefits = {
    gold: ['stream_access', 'standard_emojis', 'priority_chat', 'exclusive_content'],
    diamond: ['stream_access', 'exclusive_streams', 'premium_emojis', 'badge', 'direct_messaging', 'advanced_features'],
    chrome: ['stream_access', 'exclusive_streams', 'premium_emojis', 'badge', 'chrome_exclusive', 'vip_access', 'early_content', 'custom_emotes']
  };
  return benefits[this.tier] || [];
};

export default mongoose.model('Subscription', subscriptionSchema);