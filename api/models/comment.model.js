import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
      trim: true,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      default: null, // For nested comments/replies
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'spam', 'deleted'],
      default: 'approved',
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    likes: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    numberOfDislikes: {
      type: Number,
      default: 0,
    },
    numberOfReplies: {
      type: Number,
      default: 0,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    moderation: {
      isFlagged: {
        type: Boolean,
        default: false,
      },
      flaggedBy: [String],
      flaggedReason: String,
      moderatedBy: String,
      moderatedAt: Date,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total reactions
commentSchema.virtual('totalReactions').get(function() {
  return this.numberOfLikes + this.numberOfDislikes;
});

// Virtual for reaction score
commentSchema.virtual('reactionScore').get(function() {
  return this.numberOfLikes - this.numberOfDislikes;
});

// Pre-save middleware to update reaction counts
commentSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.numberOfLikes = this.likes.length;
  }
  
  if (this.isModified('dislikes')) {
    this.numberOfDislikes = this.dislikes.length;
  }
  
  next();
});

// Index for better query performance
commentSchema.index({ postId: 1, status: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentId: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ 'moderation.isFlagged': 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
