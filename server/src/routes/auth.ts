import { Router } from 'express';
import { loginOrRegister, getProfile, authValidation } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';

const router = Router();

// POST /api/auth/login-register - Single endpoint for login/register
router.post('/login-register', authValidation, loginOrRegister);

// GET /api/auth/profile - Get user profile
router.get('/profile', authenticate, getProfile);

export default router;
