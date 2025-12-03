import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createTrip,
  getMyTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  getPublicTrips
} from '../controllers/trip.controller.js';

const router = express.Router();

// Public route
router.get('/public', getPublicTrips);

// All other routes require authentication
router.use(authenticate);

router.route('/')
  .get(getMyTrips)
  .post(createTrip);

router.route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

export default router;

