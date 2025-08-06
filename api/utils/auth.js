import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { errorHandler } from './error.js';

// Generate JWT token with enhanced security
export const generateToken = (userId, isAdmin = false) => {
  const payload = {
    id: userId,
    isAdmin,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    algorithm: 'HS256',
    issuer: 'tech-blog-pro',
    audience: 'tech-blog-users',
  });
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  const payload = {
    id: userId,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', {
    algorithm: 'HS256',
    issuer: 'tech-blog-pro',
    audience: 'tech-blog-users',
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', {
      algorithms: ['HS256'],
      issuer: 'tech-blog-pro',
      audience: 'tech-blog-users',
    });
    return decoded;
  } catch (error) {
    throw errorHandler(401, 'Invalid or expired token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', {
      algorithms: ['HS256'],
      issuer: 'tech-blog-pro',
      audience: 'tech-blog-users',
    });
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw errorHandler(401, 'Invalid or expired refresh token');
  }
};

// Hash password with enhanced security
export const hashPassword = async (password) => {
  const saltRounds = 12; // Increased from default 10 for better security
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate secure random string
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomArray[i] % chars.length);
  }
  
  return result;
};

// Rate limiting helper
export const createRateLimiter = (windowMs, max, message) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    if (requests.has(key)) {
      requests.set(key, requests.get(key).filter(timestamp => timestamp > windowStart));
    } else {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    
    if (userRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    userRequests.push(now);
    next();
  };
};

// CSRF protection middleware
export const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  
  const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;
  
  if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed'
    });
  }
  
  next();
};

// Generate CSRF token
export const generateCSRFToken = () => {
  return generateSecureToken(32);
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score,
    isStrong: score >= 4,
    checks,
    feedback: getPasswordFeedback(checks)
  };
};

// Get password feedback
const getPasswordFeedback = (checks) => {
  const feedback = [];
  
  if (!checks.length) feedback.push('Password must be at least 8 characters long');
  if (!checks.lowercase) feedback.push('Include at least one lowercase letter');
  if (!checks.uppercase) feedback.push('Include at least one uppercase letter');
  if (!checks.numbers) feedback.push('Include at least one number');
  if (!checks.special) feedback.push('Include at least one special character (@$!%*?&)');
  
  return feedback;
};

// Session management
export const createSession = (req, userId) => {
  req.session.userId = userId;
  req.session.createdAt = Date.now();
  req.session.csrfToken = generateCSRFToken();
  
  return req.session;
};

// Destroy session
export const destroySession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Check if user is authenticated
export const isAuthenticated = (req) => {
  return req.user && req.user.id;
};

// Check if user is admin
export const isAdmin = (req) => {
  return req.user && req.user.isAdmin;
};

// Check if user is verified
export const isVerified = (req) => {
  return req.user && req.user.isVerified;
};

// Check if user is active
export const isActive = (req) => {
  return req.user && req.user.isActive;
}; 