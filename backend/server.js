// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined')); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Contact form rate limiting (more restrictive)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 contact form submissions per hour
  message: 'Too many contact form submissions, please try again later.'
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teddy-portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

// Analytics Schema for tracking portfolio views
const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['page_view', 'project_click', 'contact_view', 'resume_download'],
    required: true
  },
  page: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// Utility function to get client IP
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.headers['x-forwarded-for']?.split(',')[0] ||
         'unknown';
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Teddy Anangwe Portfolio API is running',
    timestamp: new Date().toISOString()
  });
});

// Get portfolio stats
app.get('/api/stats', async (req, res) => {
  try {
    const [totalViews, totalContacts, recentViews] = await Promise.all([
      Analytics.countDocuments({ type: 'page_view' }),
      Contact.countDocuments(),
      Analytics.countDocuments({ 
        type: 'page_view',
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.json({
      totalViews,
      totalContacts,
      recentViews,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio statistics' });
  }
});

// Track analytics
app.post('/api/analytics', async (req, res) => {
  try {
    const { type, page, metadata } = req.body;
    
    if (!type || !page) {
      return res.status(400).json({ error: 'Type and page are required' });
    }

    const analyticsData = new Analytics({
      type,
      page,
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent') || 'unknown',
      metadata: metadata || {}
    });

    await analyticsData.save();
    res.status(201).json({ message: 'Analytics tracked successfully' });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: 'Failed to track analytics' });
  }
});

// Contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          subject: !subject ? 'Subject is required' : null,
          message: !message ? 'Message is required' : null
        }
      });
    }

    // Create contact entry
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent') || 'unknown'
    });

    await contact.save();

    // Track analytics
    await Analytics.create({
      type: 'contact_view',
      page: 'contact-form',
      ipAddress: getClientIP(req),
      userAgent: req.get('User-Agent') || 'unknown',
      metadata: { contactId: contact._id }
    });

    res.status(201).json({ 
      message: 'Thank you for your message! I\'ll get back to you soon.',
      contactId: contact._id
    });

    // Log successful contact submission
    console.log(`📧 New contact from ${name} (${email}): ${subject}`);

  } catch (error) {
    console.error('Contact Error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }

    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Get recent contacts (for admin dashboard - you can secure this later)
app.get('/api/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-ipAddress -userAgent'); // Hide sensitive data

    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Contacts Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get portfolio projects (static data, could be from DB later)
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: "Fintech Accounts & Transaction Management System",
      description: "A comprehensive financial management system built with modern web technologies, featuring real-time transaction processing and secure account management.",
      technologies: ["Angular 19", "JavaScript", "React", "SpringBoot"],
      period: "January 2025 - February 2025",
      type: "Full Stack Application",
      liveLink: "https://fintech-demo.teddyanangwe.com", // Replace with actual links
      githubLink: "https://github.com/Scylla8434/fintech-system",
      image: "/images/fintech-preview.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Loan Management System",
      description: "Advanced loan processing and management platform with automated approval workflows and comprehensive reporting capabilities.",
      technologies: ["Angular 19", "JavaScript", "React", "SpringBoot"],
      period: "February 2025 - March 2025",
      type: "Enterprise Solution",
      liveLink: "https://loans-demo.teddyanangwe.com",
      githubLink: "https://github.com/Scylla8434/loan-management",
      image: "/images/loans-preview.jpg",
      featured: true
    },
    {
      id: 3,
      title: "eSecurity System",
      description: "Robust security management platform with real-time monitoring, vulnerability assessment capabilities, and comprehensive reporting.",
      technologies: ["ReactJs", "MySQL", "Spring Boot", "Git", "Trello", "MS Azure"],
      period: "January 2023 - March 2023",
      type: "Security Platform",
      liveLink: "https://esecurity-demo.teddyanangwe.com",
      githubLink: "https://github.com/Scylla8434/esecurity-system",
      image: "/images/esecurity-preview.jpg",
      featured: true
    },
    {
      id: 4,
      title: "House Rental System",
      description: "Modern property management solution featuring property listings, tenant management, and automated rental processes.",
      technologies: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      period: "April 2023 - June 2023",
      type: "Web Application",
      liveLink: "https://rentals-demo.teddyanangwe.com",
      githubLink: "https://github.com/Scylla8434/house-rental",
      image: "/images/rentals-preview.jpg",
      featured: false
    },
    {
      id: 5,
      title: "eShopping Portal",
      description: "Full-featured e-commerce platform with secure payment processing, inventory management, and user-friendly shopping experience.",
      technologies: ["PHP", "Laravel", "MySQL", "Bootstrap"],
      period: "July 2021 - September 2021",
      type: "E-commerce Platform",
      liveLink: "https://shop-demo.teddyanangwe.com",
      githubLink: "https://github.com/Scylla8434/eshopping-portal",
      image: "/images/shop-preview.jpg",
      featured: false
    }
  ];

  const featured = req.query.featured === 'true';
  const filteredProjects = featured ? projects.filter(p => p.featured) : projects;

  res.json(filteredProjects);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🚀 Teddy Anangwe Portfolio API
🌐 Server running on port ${PORT}
📝 Environment: ${process.env.NODE_ENV || 'development'}
🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
⏰ Started at: ${new Date().toISOString()}
  `);
});