import express from 'express';
import { auth } from '../middleware/auth.js';
import Match from '../models/Match.js';
import Message from '../models/Message.js';
import { io } from '../server.js';

const router = express.Router();

// Get chat messages for a match
router.get('/:matchId/messages', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const match = await Match.findById(req.params.matchId);
    if (!match || !match.users.includes(req.user.id)) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    const messages = await Message.find({
      match: req.params.matchId,
      isDeleted: false
    })
    .populate('sender', 'username profileImage')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    // Mark messages as read
    await Message.updateMany({
      match: req.params.matchId,
      receiver: req.user.id,
      isRead: false
    }, {
      isRead: true,
      readAt: new Date()
    });
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/:matchId/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const match = await Match.findById(req.params.matchId);
    if (!match || !match.users.includes(req.user.id)) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    if (match.status !== 'matched') {
      return res.status(400).json({ error: 'Cannot send message to unmatched user' });
    }
    
    const receiver = match.users.find(id => id.toString() !== req.user.id);
    
    const message = new Message({
      match: req.params.matchId,
      sender: req.user.id,
      receiver,
      content
    });
    
    await message.save();
    
    // Update match with last message
    match.lastMessage = {
      sender: req.user.id,
      text: content.text || 'Media',
      timestamp: new Date()
    };
    match.chatStarted = true;
    await match.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profileImage');
    
    // Emit to socket
    io.to(`user_${receiver}`).emit('new_message', populatedMessage);
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's chat list
router.get('/conversations', auth, async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user.id,
      status: 'matched',
      chatStarted: true
    })
    .populate('users', 'username profileImage')
    .sort({ updatedAt: -1 });
    
    const conversations = await Promise.all(matches.map(async (match) => {
      const otherUser = match.users.find(user => user._id.toString() !== req.user.id);
      
      const unreadCount = await Message.countDocuments({
        match: match._id,
        receiver: req.user.id,
        isRead: false
      });
      
      return {
        _id: match._id,
        user: otherUser,
        lastMessage: match.lastMessage,
        unreadCount,
        updatedAt: match.updatedAt
      };
    }));
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete message
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    message.isDeleted = true;
    await message.save();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block user
router.post('/:matchId/block', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    
    if (!match || !match.users.includes(req.user.id)) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    const otherUserId = match.users.find(id => id.toString() !== req.user.id);
    
    // Add to blocked users
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { blockedUsers: otherUserId }
    });
    
    // Delete the match
    await Match.findByIdAndDelete(req.params.matchId);
    
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;