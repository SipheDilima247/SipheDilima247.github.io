require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validator = require('validator');
const { addSubscriber, getSubscriber, getAllSubscribers } = require('./db');
const { sendWelcomeEmail } = require('./email');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || 'http://localhost').split(','),
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Check if already subscribed
    const existing = await getSubscriber(email);
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'This email is already subscribed' 
      });
    }

    // Add to database
    const subscriber = await addSubscriber(email);

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for a welcome message.',
      email: email 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ 
        success: false, 
        message: 'This email is already subscribed' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'An error occurred. Please try again later.' 
    });
  }
});

// Get all subscribers (for admin purposes - add authentication in production)
app.get('/api/subscribers', async (req, res) => {
  try {
    // Add authentication here in production
    const subscribers = await getAllSubscribers();
    res.json({ 
      success: true, 
      count: subscribers.length,
      subscribers 
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching subscribers' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nexus Consensus server running on http://localhost:${PORT}`);
  console.log(`📧 Subscribe endpoint: POST http://localhost:${PORT}/api/subscribe`);
});
