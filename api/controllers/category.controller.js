import Category from '../models/category.model.js';
import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You can only create categories as admin'));
    }

    const { name, description, color, icon, image, parentId, order, meta } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      $or: [{ name }, { slug }] 
    });

    if (existingCategory) {
      return next(errorHandler(400, 'Category already exists'));
    }

    const newCategory = new Category({
      name,
      slug,
      description,
      color,
      icon,
      image,
      parentId,
      order,
      meta
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: savedCategory
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const { featured, active, parentId } = req.query;
    
    let query = {};
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (active === 'true') {
      query.isActive = true;
    }
    
    if (parentId) {
      query.parentId = parentId;
    }

    const categories = await Category.find(query)
      .sort({ order: 1, name: 1 })
      .populate('parentId', 'name slug');

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const category = await Category.findOne({ slug, isActive: true })
      .populate('parentId', 'name slug');

    if (!category) {
      return next(errorHandler(404, 'Category not found'));
    }

    // Get posts in this category
    const posts = await Post.find({ 
      category: category.name, 
      status: 'published',
      isPublished: true 
    })
    .select('title slug excerpt image createdAt readingTime stats')
    .sort({ publishedAt: -1 })
    .limit(10);

    res.status(200).json({
      success: true,
      data: {
        category,
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You can only update categories as admin'));
    }

    const { id } = req.params;
    const updateData = req.body;

    // If name is being updated, generate new slug
    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parentId', 'name slug');

    if (!updatedCategory) {
      return next(errorHandler(404, 'Category not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You can only delete categories as admin'));
    }

    const { id } = req.params;

    // Check if category has posts
    const category = await Category.findById(id);
    if (!category) {
      return next(errorHandler(404, 'Category not found'));
    }

    const postsCount = await Post.countDocuments({ category: category.name });
    if (postsCount > 0) {
      return next(errorHandler(400, `Cannot delete category with ${postsCount} posts. Please reassign posts first.`));
    }

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({ parentId: id });
    if (subcategoriesCount > 0) {
      return next(errorHandler(400, `Cannot delete category with ${subcategoriesCount} subcategories. Please delete subcategories first.`));
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get category hierarchy
export const getCategoryHierarchy = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 });

    // Build hierarchy
    const buildHierarchy = (items, parentId = null) => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item.toObject(),
          children: buildHierarchy(items, item._id.toString())
        }));
    };

    const hierarchy = buildHierarchy(categories);

    res.status(200).json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    next(error);
  }
};

// Get category statistics
export const getCategoryStats = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You can only access category stats as admin'));
    }

    const stats = await Category.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: 'name',
          foreignField: 'category',
          as: 'posts'
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          postsCount: { $size: '$posts' },
          totalViews: {
            $sum: '$posts.stats.views'
          },
          totalLikes: {
            $sum: '$posts.stats.likes'
          },
          totalComments: {
            $sum: '$posts.stats.comments'
          }
        }
      },
      {
        $sort: { postsCount: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}; 