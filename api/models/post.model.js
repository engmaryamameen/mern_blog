import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 200,
    },
    excerpt: {
      type: String,
      maxlength: 300,
      default: '',
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
      enum: ['technology', 'programming', 'design', 'business', 'lifestyle', 'tutorial', 'news', 'uncategorized'],
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 20,
    }],
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: {
        type: String,
        maxlength: 60,
      },
      metaDescription: {
        type: String,
        maxlength: 160,
      },
      keywords: [String],
    },
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
    },
    featuredImage: {
      url: String,
      alt: String,
      caption: String,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for reading time calculation
postSchema.virtual('estimatedReadingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Pre-save middleware to calculate reading time and set publishedAt
postSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.readingTime = this.estimatedReadingTime;
  }
  
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
    this.isPublished = true;
  }
  
  next();
});

// Index for better query performance
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ isFeatured: 1, status: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ 'stats.views': -1 });
postSchema.index({ slug: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
