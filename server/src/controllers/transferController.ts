import { Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { TransferService } from '@/services/transferService';
import { ApiResponse, AuthRequest, PlayerPosition } from '@/types';

export const addToTransferListValidation = [
  body('playerId')
    .notEmpty()
    .withMessage('Player ID is required'),
  body('askingPrice')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Asking price must be a positive number')
];

export const transferFiltersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('minPrice')
    .optional()
    .isNumeric()
    .withMessage('Min price must be a number'),
  query('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Max price must be a number'),
  query('position')
    .optional()
    .isIn(Object.values(PlayerPosition))
    .withMessage('Invalid position')
];

export const addPlayerToTransferList = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { playerId, askingPrice } = req.body;
    const userId = req.user!.id;

    await TransferService.addPlayerToTransferList(playerId, askingPrice, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Player added to transfer list successfully'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add player to transfer list'
    };
    res.status(400).json(response);
  }
};

export const removePlayerFromTransferList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playerId } = req.params;
    const userId = req.user!.id;

    await TransferService.removePlayerFromTransferList(playerId, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Player removed from transfer list successfully'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove player from transfer list'
    };
    res.status(400).json(response);
  }
};

export const getTransferMarket = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const {
      page = 1,
      limit = 20,
      teamName,
      playerName,
      minPrice,
      maxPrice,
      position
    } = req.query;

    const filters = {
      teamName: teamName as string,
      playerName: playerName as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      position: position as PlayerPosition
    };

    const result = await TransferService.getTransferMarket(
      filters,
      Number(page),
      Number(limit)
    );

    const response: ApiResponse = {
      success: true,
      message: 'Transfer market retrieved successfully',
      data: result
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get transfer market'
    };
    res.status(500).json(response);
  }
};

export const buyPlayer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playerId } = req.params;
    const userId = req.user!.id;

    await TransferService.buyPlayer(playerId, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Player purchased successfully'
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to buy player'
    };
    res.status(400).json(response);
  }
};
