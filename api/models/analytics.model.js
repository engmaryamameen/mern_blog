import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['page_view', 'post_view', 'user_action', 'search', 'error'],
    },
    userId: {
      type: String,
      default: null, // Anonymous users
    },
    sessionId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      default: null,
    },
    page: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      default: null, // e.g., 'like', 'comment', 'share', 'search'
    },
    searchQuery: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      default: null,
    },
    device: {
      type: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet'],
        default: 'desktop',
      },
      browser: String,
      os: String,
      screen: {
        width: Number,
        height: Number,
      },
    },
    location: {
      country: String,
      region: String,
      city: String,
      timezone: String,
    },
    duration: {
      type: Number, // Time spent on page in seconds
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true 
  }
);

// Index for better query performance
analyticsSchema.index({ type: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ postId: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1 });
analyticsSchema.index({ 'location.country': 1 });
analyticsSchema.index({ 'device.type': 1 });

// TTL index to automatically delete old analytics data (keep for 1 year)
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics; 