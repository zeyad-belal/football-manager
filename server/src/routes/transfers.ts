import { Router } from 'express';
import {
  addPlayerToTransferList,
  removePlayerFromTransferList,
  getTransferMarket,
  buyPlayer,
  addToTransferListValidation,
  transferFiltersValidation
} from '@/controllers/transferController';
import { authenticate } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/transfers/list - Add player to transfer list
router.post('/list', addToTransferListValidation, addPlayerToTransferList);

// DELETE /api/transfers/list/:playerId - Remove player from transfer list
router.delete('/list/:playerId', removePlayerFromTransferList);

// GET /api/transfers/market - Get transfer market with filters
router.get('/market', transferFiltersValidation, getTransferMarket);

// POST /api/transfers/buy/:playerId - Buy a player
router.post('/buy/:playerId', buyPlayer);

export default router;
