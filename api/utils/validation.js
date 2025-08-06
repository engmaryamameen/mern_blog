import { errorHandler } from './error.js';

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Username validation
export const validateUsername = (username) => {
  // 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

// Slug validation
export const validateSlug = (slug) => {
  // Lowercase, alphanumeric, hyphens only
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
};

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Sanitize HTML content
export const sanitizeHtml = (html) => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Validate image URL
export const validateImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Validate hex color
export const validateHexColor = (color) => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

// Validate pagination parameters
export const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum))
  };
};

// Validate date range
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw errorHandler(400, 'Invalid date format');
  }
  
  if (start > end) {
    throw errorHandler(400, 'Start date must be before end date');
  }
  
  return { start, end };
};

// Validate search query
export const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    throw errorHandler(400, 'Search query is required');
  }
  
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    throw errorHandler(400, 'Search query must be at least 2 characters');
  }
  
  if (trimmedQuery.length > 100) {
    throw errorHandler(400, 'Search query too long');
  }
  
  return trimmedQuery;
};

// Validate file upload
export const validateFileUpload = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    throw errorHandler(400, 'File is required');
  }
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw errorHandler(400, `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    throw errorHandler(400, `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
  }
  
  return true;
};

// Validate user input for XSS prevention
export const sanitizeUserInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/[<>]/g, '')
    .trim();
};

// Validate MongoDB ObjectId
export const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Validate category name
export const validateCategoryName = (name) => {
  if (!name || typeof name !== 'string') {
    throw errorHandler(400, 'Category name is required');
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    throw errorHandler(400, 'Category name must be at least 2 characters');
  }
  
  if (trimmedName.length > 50) {
    throw errorHandler(400, 'Category name too long');
  }
  
  return trimmedName;
};

// Validate post content
export const validatePostContent = (content) => {
  if (!content || typeof content !== 'string') {
    throw errorHandler(400, 'Post content is required');
  }
  
  const trimmedContent = content.trim();
  if (trimmedContent.length < 10) {
    throw errorHandler(400, 'Post content must be at least 10 characters');
  }
  
  if (trimmedContent.length > 50000) {
    throw errorHandler(400, 'Post content too long');
  }
  
  return sanitizeHtml(trimmedContent);
};

// Validate comment content
export const validateCommentContent = (content) => {
  if (!content || typeof content !== 'string') {
    throw errorHandler(400, 'Comment content is required');
  }
  
  const trimmedContent = content.trim();
  if (trimmedContent.length < 1) {
    throw errorHandler(400, 'Comment content cannot be empty');
  }
  
  if (trimmedContent.length > 1000) {
    throw errorHandler(400, 'Comment content too long');
  }
  
  return sanitizeHtml(trimmedContent);
}; 