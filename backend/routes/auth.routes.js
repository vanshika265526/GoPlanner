import express from 'express';
import { register, login, verifyOTP, resendVerification, getMe, deleteAccount } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/me', authenticate, getMe);
router.delete('/account', authenticate, deleteAccount);

export default router;

