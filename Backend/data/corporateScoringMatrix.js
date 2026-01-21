// Corporate Simulation Scoring Matrix
// Each option in every question has specific scores for different leadership parameters:
// BJ = Business Judgment & Long-Term Thinking
// FR = Financial & Credit Risk Acumen
// TC = Talent & Capability Assessment
// RD = Risk Design & Decision Structuring
// GC = Governance & Compliance Orientation
// GT = Market & Execution Understanding

export const corporateScoringMatrix = {
  // Question 1: Distributor Appointment
  1: {
    A: { BJ: 3, FR: 3, TC: 3, RD: 3, GC: 0, GT: 0 },
    B: { BJ: 2, FR: 2, TC: 2, RD: 3, GC: 0, GT: 0 },
    C: { BJ: 3, FR: 1, TC: 1, RD: 1, GC: 0, GT: 0 },
    D: { BJ: 3, FR: 1, TC: 1, RD: 1, GC: 0, GT: 0 }
  },
  
  // Question 2: OD-Heavy Distributor Assessment
  2: {
    A: { BJ: 2, FR: 2, TC: 0, RD: 0, GC: 2, GT: 0 },
    B: { BJ: 1, FR: 1, TC: 0, RD: 0, GC: 1, GT: 0 },
    C: { BJ: 1, FR: 1, TC: 0, RD: 0, GC: 1, GT: 0 },
    D: { BJ: 3, FR: 3, TC: 0, RD: 0, GC: 3, GT: 0 }
  },
  
  // Question 3: Portfolio Conflict Assessment
  3: {
    A: { BJ: 3, FR: 0, TC: 0, RD: 0, GC: 3, GT: 3 },
    B: { BJ: 2, FR: 0, TC: 0, RD: 0, GC: 2, GT: 2 },
    C: { BJ: 1, FR: 0, TC: 0, RD: 0, GC: 1, GT: 1 },
    D: { BJ: 1, FR: 0, TC: 0, RD: 0, GC: 1, GT: 1 }
  },
  
  // Question 4: Distributor Scalability & Succession
  4: {
    A: { BJ: 1, FR: 0, TC: 1, RD: 1, GC: 1, GT: 0 },
    B: { BJ: 2, FR: 0, TC: 2, RD: 3, GC: 2, GT: 0 },
    C: { BJ: 3, FR: 0, TC: 3, RD: 3, GC: 3, GT: 0 },
    D: { BJ: 1, FR: 0, TC: 1, RD: 1, GC: 1, GT: 0 }
  },
  
  // Question 5: Credit Policy & Financial Discipline
  5: {
    A: { BJ: 1, FR: 1, TC: 0, RD: 0, GC: 1, GT: 0 },
    B: { BJ: 1, FR: 1, TC: 0, RD: 0, GC: 1, GT: 0 },
    C: { BJ: 2, FR: 2, TC: 0, RD: 0, GC: 2, GT: 0 },
    D: { BJ: 3, FR: 3, TC: 0, RD: 0, GC: 3, GT: 0 }
  },
  
  // Question 6: Family-Owned Distributor Governance
  6: {
    A: { BJ: 2, FR: 0, TC: 2, RD: 3, GC: 2, GT: 0 },
    B: { BJ: 3, FR: 0, TC: 3, RD: 3, GC: 3, GT: 0 },
    C: { BJ: 3, FR: 0, TC: 3, RD: 3, GC: 3, GT: 0 },
    D: { BJ: 3, FR: 0, TC: 3, RD: 3, GC: 3, GT: 0 }
  },
  
  // Question 7: MT to GT Distribution Transition
  7: {
    A: { BJ: 2, FR: 0, TC: 0, RD: 2, GC: 0, GT: 2 },
    B: { BJ: 1, FR: 0, TC: 0, RD: 1, GC: 0, GT: 1 },
    C: { BJ: 1, FR: 0, TC: 0, RD: 1, GC: 0, GT: 1 },
    D: { BJ: 3, FR: 0, TC: 0, RD: 3, GC: 0, GT: 3 }
  },
  
  // Question 8: Succession Planning & Continuity Risk
  8: {
    A: { BJ: 1, FR: 0, TC: 1, RD: 0, GC: 0, GT: 1 },
    B: { BJ: 3, FR: 0, TC: 3, RD: 0, GC: 0, GT: 3 },
    C: { BJ: 1, FR: 0, TC: 1, RD: 0, GC: 0, GT: 1 },
    D: { BJ: 2, FR: 0, TC: 2, RD: 0, GC: 0, GT: 2 }
  },
  
  // Question 9: Political Influence & Compliance Standards
  9: {
    A: { BJ: 3, FR: 0, TC: 0, RD: 0, GC: 3, GT: 0 },
    B: { BJ: 2, FR: 0, TC: 0, RD: 0, GC: 2, GT: 0 },
    C: { BJ: 1, FR: 0, TC: 0, RD: 0, GC: 1, GT: 0 },
    D: { BJ: 1, FR: 0, TC: 0, RD: 0, GC: 1, GT: 0 }
  },
  
  // Question 10: First-Generation Distributor Development
  10: {
    A: { BJ: 1, FR: 0, TC: 1, RD: 1, GC: 0, GT: 1 },
    B: { BJ: 3, FR: 0, TC: 3, RD: 3, GC: 0, GT: 3 },
    C: { BJ: 2, FR: 0, TC: 2, RD: 2, GC: 0, GT: 2 },
    D: { BJ: 1, FR: 0, TC: 1, RD: 1, GC: 0, GT: 1 }
  }
};

// Scoring level thresholds
export const scoringThresholds = {
  BJ: { high: 25, medium: 15 },  // ≥25: high, 15-24: medium, <15: low
  FR: { high: 7, medium: 5 },     // >7: high, 5-7: medium, <5: low
  TC: { high: 13, medium: 8 },    // >13: high, 8-13: medium, <8: low
  RD: { high: 13, medium: 8 },    // >13: high, 8-13: medium, <8: low
  GC: { high: 17, medium: 10 },   // >17: high, 10-17: medium, <10: low
  GT: { high: 7, medium: 5 }      // >7: high, 5-7: medium, <5: low
};

// Function to determine level based on score
export const getScoreLevel = (parameter, score) => {
  const thresholds = scoringThresholds[parameter];
  if (!thresholds) return 'low';
  
  if (parameter === 'BJ') {
    if (score >= thresholds.high) return 'high';
    if (score >= thresholds.medium) return 'medium';
    return 'low';
  } else {
    // For FR, TC, RD, GC, GT
    if (score > thresholds.high) return 'high';
    if (score >= thresholds.medium) return 'medium';
    return 'low';
  }
};

// Function to calculate parameter scores from user answers
export const calculateParameterScores = (answers) => {
  const scores = {
    BJ: 0,
    FR: 0,
    TC: 0,
    RD: 0,
    GC: 0,
    GT: 0
  };
  
  // Process each answer
  answers.forEach((answer) => {
    const questionId = answer.questionId;
    const topOption = answer.orderedOptions && answer.orderedOptions[0]; // Get the top ranked option
    
    if (topOption && corporateScoringMatrix[questionId]) {
      const optionScores = corporateScoringMatrix[questionId][topOption.id];
      
      if (optionScores) {
        // Add scores from the top option only
        scores.BJ += optionScores.BJ || 0;
        scores.FR += optionScores.FR || 0;
        scores.TC += optionScores.TC || 0;
        scores.RD += optionScores.RD || 0;
        scores.GC += optionScores.GC || 0;
        scores.GT += optionScores.GT || 0;
      }
    }
  });
  
  return scores;
};

// Function to get parameter scores with levels
export const getParameterScoresWithLevels = (answers) => {
  const scores = calculateParameterScores(answers);
  
  return {
    BJ: { score: scores.BJ, level: getScoreLevel('BJ', scores.BJ) },
    FR: { score: scores.FR, level: getScoreLevel('FR', scores.FR) },
    TC: { score: scores.TC, level: getScoreLevel('TC', scores.TC) },
    RD: { score: scores.RD, level: getScoreLevel('RD', scores.RD) },
    GC: { score: scores.GC, level: getScoreLevel('GC', scores.GC) },
    GT: { score: scores.GT, level: getScoreLevel('GT', scores.GT) }
  };
};

// Parameter descriptions
export const parameterDescriptions = {
  BJ: 'Business Judgment & Long-Term Thinking - Strategic decision-making and vision',
  FR: 'Financial & Credit Risk Acumen - Financial analysis and risk management',
  TC: 'Talent & Capability Assessment - People evaluation and development',
  RD: 'Risk Design & Decision Structuring - Framework design and decision architecture',
  GC: 'Governance & Compliance Orientation - Regulatory adherence and ethical standards',
  GT: 'Market & Execution Understanding - Market dynamics and operational execution'
};

export default corporateScoringMatrix;
