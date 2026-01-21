import mongoose from 'mongoose';

const corporateSimulationResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  simulationName: {
    type: String,
    required: true,
    default: 'Leadership & Management Simulation'
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  maxPossibleMarks: {
    type: Number,
    required: true,
    default: 100
  },
  percentageScore: {
    type: Number,
    required: true,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    required: true,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 10
  },
  answers: [{
    questionId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    orderedOptions: [{
      id: String,
      text: String,
      order: Number
    }],
    reasoning: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      required: true
    },
    reasoningPoints: {
      type: Number,
      default: 0
    },
    accuracyPerOption: {
      type: Map,
      of: {
        accuracy: Number,
        userPosition: Number,
        correctPosition: Number,
        marks: Number
      }
    },
    totalAccuracy: {
      type: Number,
      required: true
    },
    timeTaken: {
      type: Number,
      required: true
    },
    isAutoSubmitted: {
      type: Boolean,
      default: false
    }
  }],
  completedAt: {
    type: Date,
    default: Date.now
  },
  // Leadership assessment parameters
  leadershipScores: {
    BJ: {
      score: { type: Number, default: 0 },
      level: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
    },
    FR: {
      score: { type: Number, default: 0 },
      level: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
    },
    TC: {
      score: { type: Number, default: 0 },
      level: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
    },
    RD: {
      score: { type: Number, default: 0 },
      level: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
    },
    GC: {
      score: { type: Number, default: 0 },
      level: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
    },
    GT: {
      score: { type: Number, default: 0 },
      level: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
    }
  },
  // AI-analyzed reasoning scores based on strategic reasoning quality
  reasoningScores: {
    BJ: { type: Number, default: 0 },
    FR: { type: Number, default: 0 },
    TC: { type: Number, default: 0 },
    RD: { type: Number, default: 0 },
    GC: { type: Number, default: 0 },
    GT: { type: Number, default: 0 }
  },
  reasoningAnalysis: {
    type: String,
    default: ''
  },
  alignmentScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add index for faster queries
corporateSimulationResultSchema.index({ student: 1, completedAt: -1 });

const CorporateSimulationResult = mongoose.model('CorporateSimulationResult', corporateSimulationResultSchema);

export default CorporateSimulationResult;
