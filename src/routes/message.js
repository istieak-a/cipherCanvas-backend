const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createMessage, 
  getGallery, 
  getMessageById, 
  likeMessage, 
  unlockMessage,
  getMessagesByUser 
} = require('../controllers/messageController');

// @route   POST /api/messages
// @desc    Create a new encrypted message with visual recipe
// @access  Private (requires authentication)
router.post('/', protect, createMessage);

// @route   GET /api/messages
// @desc    Get all messages for gallery view
// @access  Public
router.get('/', getGallery);

// @route   GET /api/messages/user/:userId
// @desc    Get all messages by a specific user
// @access  Public
router.get('/user/:userId', getMessagesByUser);

// @route   GET /api/messages/:id
// @desc    Get a single message by ID
// @access  Public
router.get('/:id', getMessageById);

// @route   POST /api/messages/:id/like
// @desc    Like or unlike a message
// @access  Private
router.post('/:id/like', protect, likeMessage);

// @route   POST /api/messages/:id/unlock
// @desc    Record an unlock event
// @access  Private
router.post('/:id/unlock', protect, unlockMessage);

module.exports = router;
