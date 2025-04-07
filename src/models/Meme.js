// models/Meme.js
import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Meme = mongoose.models.Meme || mongoose.model('Meme', memeSchema);
export default Meme;