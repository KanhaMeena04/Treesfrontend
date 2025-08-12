import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Username validation rules
    if (username.length < 3) {
      return res.status(400).json({ 
        available: false, 
        error: 'Username must be at least 3 characters long' 
      });
    }
    
    if (username.length > 30) {
      return res.status(400).json({ 
        available: false, 
        error: 'Username must be less than 30 characters' 
      });
    }
    
    // Only allow alphanumeric characters, underscores, and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({ 
        available: false, 
        error: 'Username can only contain letters, numbers, underscores (_), and hyphens (-)' 
      });
    }
    
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    
    res.json({ 
      available: !existingUser,
      username: username
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate password strength
const validatePassword = (password) => {
  const validations = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password)
  };
  
  const isValid = Object.values(validations).every(Boolean);
  
  return {
    isValid,
    validations,
    missing: Object.entries(validations)
      .filter(([_, valid]) => !valid)
      .map(([key]) => key)
  };
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, phone } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'All required fields must be provided' 
      });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet security requirements',
        passwordValidation: passwordValidation
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
      if (existingUser.username === username.toLowerCase()) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }

    // Create new user
    const user = new User({ 
      username: username.toLowerCase(), 
      email: email.toLowerCase(), 
      password, 
      fullName,
      phone: phone || undefined
    });
    
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
        role: user.role
      },
      message: 'Account created successfully!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login with email or username
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }
    
    // Determine if identifier is email or username
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier.toLowerCase() } : { username: identifier.toLowerCase() };
    
    const user = await User.findOne(query);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    await user.updateLastActive();

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
        role: user.role
      },
      message: 'Login successful!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName,
      profileImage: req.user.profileImage,
      bio: req.user.bio,
      role: req.user.role,
      followers: req.user.followers.length,
      following: req.user.following.length
    }
  });
});

// Logout
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;