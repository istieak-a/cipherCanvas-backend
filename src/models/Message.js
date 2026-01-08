const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  encryptedContent: {
    type: String,
    required: [true, 'Encrypted content is required'],
    trim: true
  },
  visualSeed: {
    type: String,
    required: [true, 'Visual seed is required'],
    trim: true
  },
  emotionPalette: {
    type: String,
    required: [true, 'Emotion palette is required'],
    trim: true,
    lowercase: true
  },
  hint: {
    type: String,
    trim: true,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  unlocks: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  unlockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ createdAt: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model('Message', messageSchema);
