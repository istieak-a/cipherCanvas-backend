const Message = require('../models/Message');

/**
 * @desc    Create a new message with encrypted content and visual recipe
 * @route   POST /api/messages
 * @access  Private
 */
exports.createMessage = async (req, res) => {
  try {
    const { encryptedContent, visualSeed, emotionPalette, hint } = req.body;

    // Validation
    if (!encryptedContent || !visualSeed || !emotionPalette) {
      return res.status(400).json({
        success: false,
        message: 'Please provide encryptedContent, visualSeed, and emotionPalette'
      });
    }

    // Create message with sender from authenticated user
    const message = await Message.create({
      sender: req.user.id,
      encryptedContent,
      visualSeed,
      emotionPalette,
      hint: hint || ''
    });

    // Populate sender details before sending response
    await message.populate('sender', 'username email');

    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create message',
      error: error.message
    });
  }
};

/**
 * @desc    Get all messages (gallery view)
 * @route   GET /api/messages
 * @access  Public
 */
exports.getGallery = async (req, res) => {
  try {
    // Find all messages, sort by newest first, populate sender info
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('sender', 'username email')
      .select('-__v');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single message by ID
 * @route   GET /api/messages/:id
 * @access  Public
 */
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'username email')
      .select('-__v');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Get message by ID error:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
      error: error.message
    });
  }
};

/**
 * @desc    Like/Unlike a message
 * @route   POST /api/messages/:id/like
 * @access  Private
 */
exports.likeMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const userId = req.user.id;
    const hasLiked = message.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike: Remove user from likedBy array
      message.likedBy = message.likedBy.filter(id => id.toString() !== userId);
      message.likes = Math.max(0, message.likes - 1);
    } else {
      // Like: Add user to likedBy array
      message.likedBy.push(userId);
      message.likes += 1;
    }

    await message.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Message unliked' : 'Message liked',
      data: {
        likes: message.likes,
        liked: !hasLiked
      }
    });
  } catch (error) {
    console.error('Like message error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to like message',
      error: error.message
    });
  }
};

/**
 * @desc    Record an unlock event
 * @route   POST /api/messages/:id/unlock
 * @access  Private
 */
exports.unlockMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const userId = req.user.id;
    const hasUnlocked = message.unlockedBy.includes(userId);

    if (!hasUnlocked) {
      // Record unlock: Add user to unlockedBy array
      message.unlockedBy.push(userId);
      message.unlocks += 1;
      await message.save();
    }

    res.status(200).json({
      success: true,
      message: 'Unlock recorded',
      data: {
        unlocks: message.unlocks,
        unlocked: true
      }
    });
  } catch (error) {
    console.error('Unlock message error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to record unlock',
      error: error.message
    });
  }
};

/**
 * @desc    Get messages by user ID
 * @route   GET /api/messages/user/:userId
 * @access  Public
 */
exports.getMessagesByUser = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'username email')
      .select('-__v');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('Get messages by user error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user messages',
      error: error.message
    });
  }
};
