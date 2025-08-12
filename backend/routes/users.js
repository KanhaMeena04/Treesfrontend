import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, bio, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, profileImage },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/Unfollow user
router.post('/:id/follow', authenticate, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(req.params.id);
    
    if (isFollowing) {
      currentUser.following.pull(req.params.id);
      targetUser.followers.pull(req.user._id);
    } else {
      currentUser.following.push(req.params.id);
      targetUser.followers.push(req.user._id);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);
    res.json({ following: !isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block user
router.post('/:id/block', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isBlocked = user.blockedUsers.includes(req.params.id);
    
    if (isBlocked) {
      user.blockedUsers.pull(req.params.id);
    } else {
      user.blockedUsers.push(req.params.id);
    }

    await user.save();
    res.json({ blocked: !isBlocked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;