import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '@/types';

// Utility function to create validation middleware
export const validateRequest = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body if schema provided
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query if schema provided
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        req.query = parsedQuery as any;
      }

      // Validate params if schema provided
      if (schema.params) {
        const parsedParams = schema.params.parse(req.params);
        req.params = parsedParams as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: 'Validation failed',
          error: error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
        };
        res.status(400).json(response);
      } else {
        const response: ApiResponse = {
          success: false,
          message: 'Validation error',
          error: error instanceof Error ? error.message : 'Unknown validation error'
        };
        res.status(400).json(response);
      }
    }
  };
};

// Helper function to normalize email
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Custom email validation with normalization
export const emailSchema = z.string()
  .email('Please provide a valid email')
  .transform(normalizeEmail);

// Custom password validation
export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters long');

// Custom positive number validation
export const positiveNumberSchema = z.number()
  .positive('Must be a positive number')
  .or(z.string().regex(/^\d+(\.\d+)?$/, 'Must be a valid number').transform(Number));

// Custom optional positive integer validation
export const optionalPositiveIntSchema = z.string()
  .regex(/^\d+$/, 'Must be a positive integer')
  .transform(Number)
  .optional();

// Custom price validation
export const priceSchema = z.number()
  .min(1, 'Price must be at least 1')
  .or(z.string().regex(/^\d+(\.\d+)?$/, 'Must be a valid price').transform(Number));
