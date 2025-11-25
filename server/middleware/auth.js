import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const checkCredits = (type) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (type === 'resume' && user.credits.resumeGenerations <= 0) {
        return res.status(403).json({ 
          error: 'Insufficient credits',
          message: 'Please upgrade your plan to generate more resumes'
        });
      }
      
      if (type === 'portfolio' && user.credits.portfolios <= 0) {
        return res.status(403).json({ 
          error: 'Insufficient credits',
          message: 'Please upgrade your plan to create more portfolios'
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
};
