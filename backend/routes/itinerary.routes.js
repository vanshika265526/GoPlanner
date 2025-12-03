import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { generateItinerary } from '../controllers/itinerary.controller.js';

const router = express.Router();

// Public route for generating itinerary (no auth required for now)
router.post('/generate', generateItinerary);

// All other routes require authentication
// router.use(authenticate);
// router.put('/:tripId', updateItinerary);
// router.post('/:tripId/activities', addActivity);
// router.delete('/:tripId/activities/:activityId', removeActivity);

export default router;

