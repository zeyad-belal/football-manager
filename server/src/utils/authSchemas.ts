import { z } from 'zod';
import { validateRequest, emailSchema, passwordSchema } from './validation';

// Zod schema for auth validation
export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

// Validation middleware
export const authValidation = validateRequest({
  body: authSchema
});
