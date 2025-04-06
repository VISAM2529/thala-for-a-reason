// models/Submission.js
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  // User information
  userInfo: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    imageUrl: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return v === null || /^(https?:\/\/).+$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  },
  
  // Content details
  content: {
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    userExplanation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    systemExplanation: {
      type: String,
      required: true
    }
  },
  
  // Verification details
  verification: {
    isThala: {
      type: Boolean,
      required: true,
      default: false
    },
    verificationMethod: {
      type: String,
      enum: ['sum', 'length', 'special_case','unknown'],
      required: true
    },
    verifiedAt: {
      type: Date,
      required: true
    }
  },
  
  // Engagement statistics
  stats: {
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    likedBy: [{ type: String }], // Store userId as string
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    shares: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // System metadata
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'flagged', 'archived'],
      default: 'published'
    }
  }
});

// Update the updatedAt field on save
submissionSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});
delete mongoose.models.Submission
export default mongoose.models.Submission || 
       mongoose.model('Submission', submissionSchema);