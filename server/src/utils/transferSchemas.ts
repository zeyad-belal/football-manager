import { z } from 'zod';
import { validateRequest, priceSchema } from './validation';
import { PlayerPosition } from '@/types';

// Zod schema for adding player to transfer list
export const addToTransferListSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  askingPrice: priceSchema
});

// Zod schema for transfer market filters
export const transferFiltersSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a positive integer')
    .transform(Number)
    .optional()
    .default(1),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a positive integer')
    .transform(Number)
    .refine(val => val >= 1 && val <= 50, 'Limit must be between 1 and 50')
    .optional()
    .default(20),
  teamName: z.string().optional(),
  playerName: z.string().optional(),
  minPrice: z.string()
    .regex(/^\d+(\.\d+)?$/, 'Min price must be a valid number')
    .transform(Number)
    .optional(),
  maxPrice: z.string()
    .regex(/^\d+(\.\d+)?$/, 'Max price must be a valid number')
    .transform(Number)
    .optional(),
  position: z.nativeEnum(PlayerPosition).optional()
});

// Validation middleware
export const addToTransferListValidation = validateRequest({
  body: addToTransferListSchema
});

export const transferFiltersValidation = validateRequest({
  query: transferFiltersSchema
});
