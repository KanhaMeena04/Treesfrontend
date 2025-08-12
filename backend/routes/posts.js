import express from 'express';
import { auth } from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// Get feed posts
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = await User.findById(req.user.id);
    
    const posts = await Post.find({
      $or: [
        { author: { $in: user.following } },
        { author: req.user.id }
      ],
      type: 'post',
      isApproved: true
    })
    .populate('author', 'username profileImage isVerified')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stories
router.get('/stories', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const stories = await Post.find({
      author: { $in: [...user.following, req.user.id] },
      type: 'story',
      expiresAt: { $gt: new Date() }
    })
    .populate('author', 'username profileImage')
    .sort({ createdAt: -1 });
    
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reels
router.get('/reels', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reels = await Post.find({
      type: 'reel',
      isApproved: true
    })
    .populate('author', 'username profileImage isVerified')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    res.json(reels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, type = 'post' } = req.body;
    
    const post = new Post({
      author: req.user.id,
      content,
      type,
      expiresAt: type === 'story' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined
    });
    
    await post.save();
    await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.postsCount': 1 } });
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username profileImage isVerified');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    
    await post.save();
    res.json({ liked: !isLiked, likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    post.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date()
    });
    
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('comments.user', 'username profileImage');
    
    res.json(populatedPost.comments[populatedPost.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.postsCount': -1 } });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;