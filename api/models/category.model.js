import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
    color: {
      type: String,
      default: '#3B82F6', // Default blue color
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Color must be a valid hex color code'
      }
    },
    icon: {
      type: String,
      default: '📝',
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: String,
      default: null, // For subcategories
    },
    order: {
      type: Number,
      default: 0,
    },
    meta: {
      title: {
        type: String,
        maxlength: 60,
      },
      description: {
        type: String,
        maxlength: 160,
      },
      keywords: [String],
    },
    stats: {
      postsCount: {
        type: Number,
        default: 0,
      },
      viewsCount: {
        type: Number,
        default: 0,
      },
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full category path
categorySchema.virtual('fullPath').get(function() {
  if (this.parentId) {
    return `${this.parentId} > ${this.name}`;
  }
  return this.name;
});

// Index for better query performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ order: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category; 