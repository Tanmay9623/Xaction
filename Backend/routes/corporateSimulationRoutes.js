import express from 'express';
import CorporateSimulationResult from '../models/corporateSimulationResultModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { calculateParameterScores, getScoreLevel } from '../data/corporateScoringMatrix.js';
import { analyzeStrategicReasoning } from '../services/geminiAIService.js';

const router = express.Router();

// Submit corporate simulation result
router.post('/submit', protect, async (req, res) => {
  try {
    const {
      simulationName,
      score,
      maxPossibleMarks,
      percentageScore,
      averageAccuracy,
      totalQuestions,
      answers
    } = req.body;

    // Calculate leadership parameter scores from answers
    const parameterScores = calculateParameterScores(answers);
    
    // Determine levels for each parameter
    const leadershipScores = {
      BJ: {
        score: parameterScores.BJ,
        level: getScoreLevel('BJ', parameterScores.BJ)
      },
      FR: {
        score: parameterScores.FR,
        level: getScoreLevel('FR', parameterScores.FR)
      },
      TC: {
        score: parameterScores.TC,
        level: getScoreLevel('TC', parameterScores.TC)
      },
      RD: {
        score: parameterScores.RD,
        level: getScoreLevel('RD', parameterScores.RD)
      },
      GC: {
        score: parameterScores.GC,
        level: getScoreLevel('GC', parameterScores.GC)
      },
      GT: {
        score: parameterScores.GT,
        level: getScoreLevel('GT', parameterScores.GT)
      }
    };

    console.log('Calculated Leadership Scores:', leadershipScores);
    console.log('📝 Answers with reasoning:', answers.map(a => ({
      title: a.title,
      hasReasoning: !!a.reasoning,
      reasoningLength: a.reasoning ? a.reasoning.length : 0,
      reasoningPreview: a.reasoning ? a.reasoning.substring(0, 50) + '...' : 'NONE'
    })));

    const result = await CorporateSimulationResult.create({
      student: req.user._id,
      simulationName,
      score,
      maxPossibleMarks,
      percentageScore,
      averageAccuracy,
      totalQuestions,
      answers,
      leadershipScores,
      completedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Corporate simulation result saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error saving corporate simulation result:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save corporate simulation result',
      error: error.message
    });
  }
});

// Get all corporate simulation results for a student
router.get('/my-results', protect, async (req, res) => {
  try {
    const results = await CorporateSimulationResult.find({ student: req.user._id })
      .sort({ completedAt: -1 })
      .populate('student', 'name email');

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching corporate simulation results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch corporate simulation results',
      error: error.message
    });
  }
});

// Get latest corporate simulation result for a student
router.get('/latest', protect, async (req, res) => {
  try {
    const result = await CorporateSimulationResult.findOne({ student: req.user._id })
      .sort({ completedAt: -1 })
      .populate('student', 'name email');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No corporate simulation results found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching latest corporate simulation result:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest corporate simulation result',
      error: error.message
    });
  }
});

// Get specific corporate simulation result by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const result = await CorporateSimulationResult.findById(req.params.id)
      .populate('student', 'name email');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Corporate simulation result not found'
      });
    }

    // Check if the result belongs to the requesting user
    if (result.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this result'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching corporate simulation result:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch corporate simulation result',
      error: error.message
    });
  }
});

// Analyze strategic reasoning with AI
router.post('/analyze-reasoning/:id', protect, async (req, res) => {
  try {
    const result = await CorporateSimulationResult.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Corporate simulation result not found'
      });
    }

    // Check if the result belongs to the requesting user
    if (result.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this result'
      });
    }

    console.log('Starting AI analysis for result:', req.params.id);

    // Analyze strategic reasoning with AI
    const aiAnalysis = await analyzeStrategicReasoning(result.answers, result.leadershipScores);

    console.log('AI Analysis Result:', aiAnalysis);

    if (aiAnalysis.success) {
      // Update the result with AI analysis
      result.reasoningScores = aiAnalysis.data.reasoningScores;
      result.reasoningAnalysis = aiAnalysis.data.analysis;
      result.alignmentScore = aiAnalysis.data.alignmentScore;
      await result.save();

      console.log('AI analysis saved successfully');
    }

    res.status(200).json({
      success: true,
      data: {
        reasoningScores: result.reasoningScores,
        reasoningAnalysis: result.reasoningAnalysis,
        alignmentScore: result.alignmentScore,
        leadershipScores: result.leadershipScores,
        aiSuccess: aiAnalysis.success
      }
    });
  } catch (error) {
    console.error('Error analyzing reasoning:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze reasoning',
      error: error.message
    });
  }
});

export default router;
