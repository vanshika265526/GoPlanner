import { sendContactEmail } from '../services/emailService.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, issueType } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      });
    }

    // Send email
    await sendContactEmail({
      name,
      email,
      subject,
      message,
      issueType
    });

    res.status(200).json({
      status: 'success',
      message: 'Your message has been sent successfully. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to send message. Please try again later.'
    });
  }
};

