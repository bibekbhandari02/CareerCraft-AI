import Analytics from '../models/Analytics.js';
import mongoose from 'mongoose';

export const trackEvent = async (userId, eventType, metadata = {}, req = null) => {
  try {
    // Ensure userId is an ObjectId
    const userObjectId = userId instanceof mongoose.Types.ObjectId 
      ? userId 
      : new mongoose.Types.ObjectId(userId);
    
    const analyticsData = {
      userId: userObjectId,
      eventType,
      metadata,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || 'unknown',
      userAgent: req?.headers?.['user-agent'] || 'unknown'
    };

    // Add resource IDs if present (also ensure they're ObjectIds)
    if (metadata.resumeId) {
      analyticsData.resumeId = metadata.resumeId instanceof mongoose.Types.ObjectId
        ? metadata.resumeId
        : new mongoose.Types.ObjectId(metadata.resumeId);
    }
    if (metadata.portfolioId) {
      analyticsData.portfolioId = metadata.portfolioId instanceof mongoose.Types.ObjectId
        ? metadata.portfolioId
        : new mongoose.Types.ObjectId(metadata.portfolioId);
    }

    const result = await Analytics.create(analyticsData);
    return result;
  } catch (error) {
    console.error('Analytics tracking error:', error.message);
    // Don't throw - analytics shouldn't break the app
  }
};

export const getUserAnalytics = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  // Convert userId to ObjectId if it's a string
  const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  const analytics = await Analytics.aggregate([
    {
      $match: {
        userId: userObjectId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 }
      }
    }
  ]);

  return analytics.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
};

export const getResumeAnalytics = async (resumeId) => {
  const analytics = await Analytics.aggregate([
    {
      $match: { resumeId: resumeId }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        lastEvent: { $max: '$createdAt' }
      }
    }
  ]);

  return {
    views: analytics.find(a => a._id === 'resume_view')?.count || 0,
    downloads: analytics.find(a => a._id === 'resume_download')?.count || 0,
    lastViewed: analytics.find(a => a._id === 'resume_view')?.lastEvent,
    lastDownloaded: analytics.find(a => a._id === 'resume_download')?.lastEvent
  };
};

export const getPortfolioAnalytics = async (portfolioId) => {
  const analytics = await Analytics.aggregate([
    {
      $match: { portfolioId: portfolioId }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        lastEvent: { $max: '$createdAt' }
      }
    }
  ]);

  return {
    views: analytics.find(a => a._id === 'portfolio_view')?.count || 0,
    lastViewed: analytics.find(a => a._id === 'portfolio_view')?.lastEvent
  };
};

export const getDashboardStats = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  // Convert userId to ObjectId if it's a string
  const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  const [totalStats, dailyStats] = await Promise.all([
    // Total counts
    Analytics.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]),
    // Daily breakdown
    Analytics.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            eventType: '$eventType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ])
  ]);

  return {
    total: totalStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    daily: dailyStats
  };
};
