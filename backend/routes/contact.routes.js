import express from 'express';
import { submitContactForm } from '../controllers/contact.controller.js';

const router = express.Router();

// Contact form route (public, no authentication required)
router.post('/', submitContactForm);

export default router;

