import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { User } from '@/models/User';
import { AuthRequest } from '@/types';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
      return;
    }
    
    req.user = {
      id: (user._id as any).toString(),
      email: user.email
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};
