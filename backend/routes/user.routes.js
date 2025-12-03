import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
// Import user controllers when created
// import { updateProfile, updatePreferences } from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// router.put('/profile', updateProfile);
// router.put('/preferences', updatePreferences);

export default router;

