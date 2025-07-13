import { Response } from 'express';
import { TransferService } from '@/services/transferService';
import { ApiResponse, AuthRequest } from '@/types';
import { 
  addToTransferListValidation, 
  transferFiltersValidation 
} from '@/utils/transferSchemas';

// Export validation middleware
export { addToTransferListValidation, transferFiltersValidation };

export const addPlayerToTransferList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
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
    // After validation, req.query will have the correct types from our zod schema
    const {
      page,
      limit,
      teamName,
      playerName,
      minPrice,
      maxPrice,
      position
    } = req.query as any; // Type assertion since zod validation ensures correct types

    const filters = {
      teamName,
      playerName,
      minPrice,
      maxPrice,
      position
    };

    const result = await TransferService.getTransferMarket(
      filters,
      page,
      limit
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
