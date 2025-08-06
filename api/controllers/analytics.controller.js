import Analytics from '../models/analytics.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Track page view or user action
export const trackEvent = async (req, res, next) => {
  try {
    const {
      type,
      postId,
      page,
      action,
      searchQuery,
      duration,
      metadata
    } = req.body;

    const sessionId = req.sessionID || req.headers['x-session-id'] || 'anonymous';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const referrer = req.headers.referer || null;

    const analyticsData = {
      type,
      userId: req.user ? req.user.id : null,
      sessionId,
      postId,
      page,
      action,
      searchQuery,
      userAgent,
      ipAddress,
      referrer,
      duration,
      metadata,
      device: {
        type: getDeviceType(userAgent),
        browser: getBrowser(userAgent),
        os: getOS(userAgent),
      },
      location: await getLocationFromIP(ipAddress),
    };

    const analytics = new Analytics(analyticsData);
    await analytics.save();

    // Update post stats if it's a post view
    if (type === 'post_view' && postId) {
      await Post.findByIdAndUpdate(postId, {
        $inc: { 'stats.views': 1 }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics dashboard data (admin only)
export const getDashboardStats = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You can only access admin analytics'));
    }

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Page views
    const totalViews = await Analytics.countDocuments({ type: 'page_view' });
    const viewsLast30Days = await Analytics.countDocuments({
      type: 'page_view',
      timestamp: { $gte: last30Days }
    });
    const viewsLast7Days = await Analytics.countDocuments({
      type: 'page_view',
      timestamp: { $gte: last7Days }
    });
    const viewsLast24Hours = await Analytics.countDocuments({
      type: 'page_view',
      timestamp: { $gte: last24Hours }
    });

    // Post views
    const postViews = await Analytics.countDocuments({ type: 'post_view' });
    const postViewsLast30Days = await Analytics.countDocuments({
      type: 'post_view',
      timestamp: { $gte: last30Days }
    });

    // User actions
    const userActions = await Analytics.countDocuments({ type: 'user_action' });
    const searches = await Analytics.countDocuments({ type: 'search' });

    // Top posts by views
    const topPosts = await Analytics.aggregate([
      { $match: { type: 'post_view' } },
      { $group: { _id: '$postId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Top pages
    const topPages = await Analytics.aggregate([
      { $match: { type: 'page_view' } },
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Device breakdown
    const deviceStats = await Analytics.aggregate([
      { $match: { type: 'page_view' } },
      { $group: { _id: '$device.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Country breakdown
    const countryStats = await Analytics.aggregate([
      { $match: { type: 'page_view', 'location.country': { $exists: true } } },
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Daily views for the last 30 days
    const dailyViews = await Analytics.aggregate([
      {
        $match: {
          type: 'page_view',
          timestamp: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalViews,
          viewsLast30Days,
          viewsLast7Days,
          viewsLast24Hours,
          postViews,
          postViewsLast30Days,
          userActions,
          searches
        },
        topPosts,
        topPages,
        deviceStats,
        countryStats,
        dailyViews
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get post-specific analytics
export const getPostAnalytics = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You can only access admin analytics'));
    }

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Post views over time
    const viewsOverTime = await Analytics.aggregate([
      {
        $match: {
          type: 'post_view',
          postId,
          timestamp: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User engagement
    const engagement = await Analytics.aggregate([
      {
        $match: {
          postId,
          type: 'user_action',
          action: { $in: ['like', 'comment', 'share'] }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    // Referrer sources
    const referrers = await Analytics.aggregate([
      {
        $match: {
          type: 'post_view',
          postId,
          referrer: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        viewsOverTime,
        engagement,
        referrers
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function getDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile')) return 'mobile';
  if (ua.includes('tablet')) return 'tablet';
  return 'desktop';
}

function getBrowser(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  if (ua.includes('opera')) return 'Opera';
  return 'Unknown';
}

function getOS(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('ios')) return 'iOS';
  return 'Unknown';
}

async function getLocationFromIP(ipAddress) {
  // This is a simplified version. In production, you'd use a service like MaxMind or IP-API
  // For now, we'll return null to avoid external dependencies
  return null;
} 