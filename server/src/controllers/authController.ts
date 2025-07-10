import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '@/models/User';
import { TeamService } from '@/services/teamService';
import { generateToken } from '@/utils/jwt';
import { ApiResponse, AuthRequest } from '@/types';

export const authValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const loginOrRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: errors.array().map(err => err.msg).join(', ')
      };
      res.status(400).json(response);
      return;
    }

    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - login
      const isPasswordValid = await (user as any).comparePassword(password);
      
      if (!isPasswordValid) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid credentials'
        };
        res.status(401).json(response);
        return;
      }

      const token = generateToken({ id: user._id, email: user.email });
      
      // Get user's team if exists
      let team = null;
      if (user.teamId) {
        team = await TeamService.getTeamWithPlayers(user.teamId);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            teamId: user.teamId
          },
          team,
          token
        }
      };

      res.json(response);
    } else {
      // User doesn't exist - register
      user = new User({ email, password });
      await user.save();

      const token = generateToken({ id: user._id, email: user.email });

      // Start team creation process (async)
      TeamService.createTeamForUser((user._id as any).toString())
        .catch(error => console.error('Team creation failed:', error));

      const response: ApiResponse = {
        success: true,
        message: 'Registration successful. Your team is being created.',
        data: {
          user: {
            id: user._id,
            email: user.email,
            teamId: null
          },
          team: null,
          token
        }
      };

      res.status(201).json(response);
    }
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found'
      };
      res.status(404).json(response);
      return;
    }

    let team = null;
    if (user.teamId) {
      team = await TeamService.getTeamWithPlayers(user.teamId);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          teamId: user.teamId
        },
        team
      }
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to get profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};
