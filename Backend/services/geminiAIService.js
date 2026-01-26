import axios from 'axios';

const HF_BASE_URL = 'https://router.huggingface.co/v1';
const DEFAULT_MODEL = 'meta-llama/Llama-3.1-8B-Instruct:novita';

export async function analyzeStrategicReasoning(answers, leadershipScores) {
  try {
    const HF_API_KEY = process.env.HF_API_KEY;
    
    console.log('🔑 Hugging Face API Key Check:', HF_API_KEY ? `Loaded (${HF_API_KEY.substring(0, 15)}...)` : '❌ NOT FOUND');
    
    if (!HF_API_KEY) {
      throw new Error('HF_API_KEY environment variable is not set');
    }

    // Collect all strategic reasons with their ranking choices
    const reasoningTexts = answers.map((ans, idx) => ({
      questionNumber: idx + 1,
      title: ans.title,
      reasoning: ans.reasoning || '',
      actualScore: ans.score,
      rankedOptions: ans.orderedOptions ? ans.orderedOptions.map(opt => ({
        text: opt.text,
        rank: opt.order,
        points: 0  // Points not stored in orderedOptions
      })) : [],
      topChoice: ans.orderedOptions && ans.orderedOptions.length > 0 
        ? ans.orderedOptions.find(opt => opt.order === 1)?.text || ans.orderedOptions[0].text
        : ''
    })).filter(r => r.reasoning.trim().length > 0);

    // Enhanced Pre-validation: Check if reasoning matches top choice or is just copy-paste
    let isCopyPaste = false;
    let copyPasteCount = 0;
    let contradictionCount = 0;
    let duplicateCount = 0;
    
    // Check 0: Detect if same reasoning is used for multiple questions (lazy copy-paste)
    const reasoningFrequency = {};
    for (const r of reasoningTexts) {
      // More aggressive normalization: remove numbers, newlines, extra spaces
      const normalized = r.reasoning
        .trim()
        .toLowerCase()
        .replace(/[\n\r\t]+/g, ' ')  // Replace newlines/tabs with space
        .replace(/\d+/g, '')          // Remove all numbers
        .replace(/\s+/g, ' ')         // Normalize multiple spaces to single space
        .trim();
      
      if (!reasoningFrequency[normalized]) {
        reasoningFrequency[normalized] = { count: 0, questions: [] };
      }
      reasoningFrequency[normalized].count++;
      reasoningFrequency[normalized].questions.push(r.questionNumber);
    }
    
    // Count how many questions use duplicated reasoning
    let duplicateGroups = [];
    for (const [text, data] of Object.entries(reasoningFrequency)) {
      if (data.count > 1) {
        duplicateCount += data.count;
        duplicateGroups.push({ questions: data.questions, count: data.count, preview: text.substring(0, 50) });
      }
    }
    
    // Debug log to see what's happening
    console.log('🔍 Duplicate Analysis:', {
      totalQuestions: reasoningTexts.length,
      uniqueReasoningCount: Object.keys(reasoningFrequency).length,
      duplicateCount,
      duplicateGroups: duplicateGroups.length > 0 ? duplicateGroups : 'None'
    });
    
    // If same reasoning used for 50%+ of questions, it's lazy copy-paste
    if (duplicateCount >= reasoningTexts.length * 0.5) {
      console.log('🚫 DUPLICATE REASONING DETECTED - RETURNING ZERO SCORES:', {
        duplicateCount,
        totalQuestions: reasoningTexts.length,
        percentage: Math.round((duplicateCount / reasoningTexts.length) * 100) + '%',
        duplicateGroups
      });
      return {
        success: true,
        data: {
          reasoningScores: {
            BJ: 0,
            FR: 0,
            TC: 0,
            RD: 0,
            GC: 0,
            GT: 0
          },
          analysis: `Identical reasoning text detected across ${duplicateCount} out of ${reasoningTexts.length} questions. Each question requires unique strategic reasoning explaining your specific ranking choices for that scenario. Using the same generic text for multiple questions shows lack of genuine analysis.`,
          alignmentScore: 0
        }
      };
    }
    
    for (const r of reasoningTexts) {
      const reasoningLower = r.reasoning.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const topChoiceLower = r.topChoice.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      
      // Check 1: Is reasoning just the option text copied?
      let matchCount = 0;
      let hasExactMatch = false;
      
      for (const opt of r.rankedOptions) {
        const optionLower = opt.text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const optionWords = opt.text.toLowerCase().split(/\s+/);
        
        // Check if significant portion of option text appears in reasoning
        if (reasoningLower.includes(optionLower.substring(0, Math.min(30, optionLower.length)))) {
          matchCount++;
        }
        
        // Check if reasoning is EXACTLY the option text (90%+ similarity)
        const wordsInReasoning = optionWords.filter(word => 
          word.length > 3 && reasoningLower.includes(word)
        ).length;
        if (wordsInReasoning >= optionWords.length * 0.9) {
          hasExactMatch = true;
        }
      }
      
      // If reasoning contains 3+ options text or has exact match, likely copy-paste
      if (matchCount >= 3 || hasExactMatch) {
        copyPasteCount++;
      }
      
      // Check 2: Does reasoning contradict the top choice?
      // Look for keywords that suggest they're arguing for a DIFFERENT option
      const topChoiceWords = topChoiceLower.split(/\s+/).filter(w => w.length > 3);
      const topChoiceKeywords = topChoiceWords.filter(w => 
        reasoningLower.includes(w)
      ).length;
      
      // If reasoning barely mentions top choice (< 20% of keywords), likely contradiction
      if (topChoiceKeywords < topChoiceWords.length * 0.2 && topChoiceWords.length > 0) {
        contradictionCount++;
      }
    }
    
    // If most answers are copy-paste or contradictory, return zero scores immediately
    if (copyPasteCount >= reasoningTexts.length * 0.6 || contradictionCount >= reasoningTexts.length * 0.5) {
      console.log('⚠️ Detected issues:', {
        copyPaste: copyPasteCount,
        contradictions: contradictionCount,
        duplicates: duplicateCount,
        total: reasoningTexts.length
      });
      return {
        success: true,
        data: {
          reasoningScores: {
            BJ: 0,
            FR: 0,
            TC: 0,
            RD: 0,
            GC: 0,
            GT: 0
          },
          analysis: copyPasteCount > contradictionCount 
            ? 'Strategic reasoning appears to be copy-pasted from options without genuine explanation. The reasoning must explain WHY you chose your top option, not just repeat the option text.' 
            : 'Strategic reasoning does not support your top choices. Your reasoning should clearly explain why you ranked your #1 option first.',
          alignmentScore: 0
        }
      };
    }

    console.log('📊 Total answers received:', answers.length);
    console.log('📝 Answers with reasoning:', reasoningTexts.length);
    console.log('🔍 Copy-paste detected in:', copyPasteCount, 'answers');
    console.log('🔄 Duplicate reasoning detected in:', duplicateCount, 'answers');
    console.log('💬 Reasoning texts:', reasoningTexts.map(r => ({
      q: r.questionNumber,
      text: r.reasoning.substring(0, 60) + '...',
      hasRankings: r.rankedOptions.length > 0
    })));

    if (reasoningTexts.length === 0) {
      return {
        success: false,
        data: {
          reasoningScores: {
            BJ: 0,
            FR: 0,
            TC: 0,
            RD: 0,
            GC: 0,
            GT: 0
          },
          analysis: 'No strategic reasoning provided.',
          alignmentScore: 0
        }
      };
    }

    // Build the prompt
    const prompt = `
You are an expert leadership assessment analyzer. Your job is to determine if the user's reasoning text GENUINELY EXPLAINS their ranking decisions.

**CRITICAL VALIDATION CHECKS:**
1. Is the reasoning just copy-pasted from UI (exact option text with no explanation)? → Score = 0
2. Is the reasoning random/meaningless text (like "asdfsdf", "123456", repetitive characters)? → Score = 0
3. Does reasoning CONTRADICT their ranking choices (argues for opposite)? → Score = 0
4. Does reasoning explain WHY they ranked options in that specific order? → Required for any score > 0
5. Does reasoning show understanding of tradeoffs between options? → Required for medium/high scores
6. Is the reasoning original thinking or just repeating what was already shown? → Must be original

**ZERO SCORE RULES (MOST IMPORTANT):**
- **Copy-paste from UI**: If reasoning is just the option text copied exactly with NO explanation → ALL SCORES = 0
- **Random text**: Any meaningless characters, numbers, keyboard spam (aaa, 123, qwerty, etc.) → ALL SCORES = 0
- **CONTRADICTION (CRITICAL)**: User ranked option X as #1 BUT reasoning argues AGAINST it or supports different option → ALL SCORES = 0
- **Example 1**: User puts "Delay appointment" as #1, but reasoning says "We should act quickly and not delay" → Score = 0, Analysis MUST include word "contradiction"
- **Example 2**: User puts "Fire the manager" as #1, but reasoning says "Training and development is the best approach" → Score = 0, Analysis MUST include word "contradiction"
- **Example 3**: User puts "Immediate action" as #1, but reasoning says "We should wait and assess" → Score = 0, Analysis MUST include word "contradiction"

**CRITICAL CONTRADICTION CHECK:**
For EACH question, compare the #1 ranked option text with the reasoning:
- If reasoning argues for the OPPOSITE action (e.g., delay vs immediate, fire vs train, wait vs act) → ZERO SCORES
- If reasoning supports a DIFFERENT option that was ranked lower → ZERO SCORES
- If reasoning doesn't mention or explain why the #1 option was chosen → ZERO SCORES
- In your analysis, YOU MUST USE THE WORD "contradiction" or "contradicts" when this happens!

**Actual Leadership Scores Received (from ranking choices):**
- BJ (Business Judgment): ${leadershipScores.BJ.score}/30
- FR (Financial Risk): ${leadershipScores.FR.score}/10
- TC (Talent Assessment): ${leadershipScores.TC.score}/18
- RD (Risk Design): ${leadershipScores.RD.score}/18
- GC (Governance): ${leadershipScores.GC.score}/24
- GT (Market Execution): ${leadershipScores.GT.score}/18

**Decisions & Strategic Reasoning Provided:**
${reasoningTexts.map(r => `
Question ${r.questionNumber}: ${r.title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 USER'S TOP CHOICE (MUST BE SUPPORTED):
"${r.topChoice}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Ranking Order (1st to last):
${r.rankedOptions.map((opt, idx) => `  ${opt.rank}. ${opt.text} ${idx === 0 ? '← #1 CHOICE (reasoning MUST explain why THIS option!)' : ''}`).join('\n')}

📝 User's Strategic Reasoning:
"${r.reasoning}"

Actual Score Received: ${r.actualScore}

**CRITICAL VALIDATION CHECKS (Apply in order):**
1. ❌ Is reasoning EXACT copy of option text "${r.topChoice}" with no explanation added? → Score = 0
2. ❌ Is reasoning random/meaningless: "20 a", "asdfsdf", "!!!", keyboard spam? → Score = 0
3. ❌ **CONTRADICTION CHECK**: Does reasoning argue for the OPPOSITE of "${r.topChoice}"? → Score = 0, Analysis MUST say "contradiction"
4. ❌ **OPPOSITE ACTION CHECK**: Does reasoning support a different option instead of "${r.topChoice}"? → Score = 0, Analysis MUST say "contradiction"
5. ❌ Does reasoning fail to mention or explain why "${r.topChoice}" was chosen? → Score = 0
6. ❌ Is reasoning generic ("good choice", "best option") that could apply to ANY ranking? → Score = 0
7. ✅ Does reasoning specifically explain WHY "${r.topChoice}" was ranked #1? → Continue scoring
8. ✅ Does reasoning show trade-off analysis comparing "${r.topChoice}" vs other options? → Higher score

**Contradiction Detection Examples:**
- Top choice: "Delay appointment" | Reasoning: "act immediately" or "quick action needed" → CONTRADICTION = 0
- Top choice: "Fire manager" | Reasoning: "provide training" or "coaching approach" → CONTRADICTION = 0
- Top choice: "Strict policy" | Reasoning: "flexible approach" or "case by case" → CONTRADICTION = 0
`).join('\n---\n')}

**STRICT SCORING RULES - READ CAREFULLY:**

**AUTOMATIC ZERO SCENARIOS (Give 0 for ALL dimensions):**
- Reasoning is EXACT copy-paste from UI options with NO explanation added
- Reasoning is random/meaningless text: "aaa", "123456", "qwerty", "asdfsdf", keyboard spam
- Reasoning is just numbers or characters with no actual words: "20 a", "xyz 123", ".....", "!!!!"
- Reasoning CONTRADICTS their ranking (argues for opposite of what they chose)
- Reasoning supports a lower-ranked option instead of their top choice
- Reasoning argues AGAINST the option they ranked #1
- Reasoning doesn't explain the ranking order at all
- Reasoning is generic statements not specific to their choices ("good choice", "best option")
- Reasoning could apply to ANY ranking order (means it's not explaining THEIR choice)
- Reasoning is just copy-pasted option text visible in UI without any personal explanation

**VERY LOW SCORES (0-20% of max):**
- Reasoning mentions some concepts but doesn't explain why they ranked in that order
- Reasoning lists facts but doesn't show decision-making logic
- Reasoning doesn't connect to the specific options they selected

**LOW-MEDIUM SCORES (21-50% of max):**
- Reasoning partially explains why some options were ranked higher/lower
- Missing explanation for some ranking decisions
- Shows some understanding but incomplete

**MEDIUM-HIGH SCORES (51-75% of max):**
- Reasoning explains most ranking decisions with rationale
- Shows understanding of tradeoffs between options
- Connects reasoning to specific option characteristics

**HIGH SCORES (76-100% of max):**
- Reasoning clearly explains WHY each option was ranked in that position
- Demonstrates strategic thinking about option tradeoffs
- Shows deep understanding connecting choices to leadership dimensions
- Original analytical thinking (not copy-paste)

**Leadership Dimensions - Only score if reasoning explains ranking logic:**

**CRITICAL RULE: Your reasoning score CANNOT EXCEED their actual option score!**
- If they scored BJ=19 from choices, your max reasoning score for BJ = 19
- If they scored FR=6 from choices, your max reasoning score for FR = 6
- Reasoning score = How well they EXPLAINED what they already DID

1. **BJ - Business Judgment** (Max: 30, **Actual: ${leadershipScores.BJ.score}** ← DO NOT EXCEED THIS)
   Does reasoning explain ranking choices based on strategic thinking, long-term impact, business value?
   
2. **FR - Financial Risk** (Max: 10, **Actual: ${leadershipScores.FR.score}** ← DO NOT EXCEED THIS)
   Does reasoning explain ranking choices based on financial implications, cost-benefit, risk assessment?
   
3. **TC - Talent Assessment** (Max: 18, **Actual: ${leadershipScores.TC.score}** ← DO NOT EXCEED THIS)
   Does reasoning explain ranking choices based on people impact, team dynamics, capability needs?
   
4. **RD - Risk Design** (Max: 18, **Actual: ${leadershipScores.RD.score}** ← DO NOT EXCEED THIS)
   Does reasoning explain ranking choices based on risk mitigation, decision structure, frameworks?
   
5. **GC - Governance** (Max: 24, **Actual: ${leadershipScores.GC.score}** ← DO NOT EXCEED THIS)
   Does reasoning explain ranking choices based on ethics, compliance, policy adherence?
   
6. **GT - Market Execution** (Max: 18, **Actual: ${leadershipScores.GT.score}** ← DO NOT EXCEED THIS)
   Does reasoning explain ranking choices based on market fit, execution feasibility, operations?

**Output Format (JSON only):**
{
  "reasoningScores": {
    "BJ": <number 0-30>,
    "FR": <number 0-10>,
    "TC": <number 0-18>,
    "RD": <number 0-18>,
    "GC": <number 0-24>,
    "GT": <number 0-18>
  },
  "analysis": "<State if reasoning explains choices or is just copy-paste/generic. Be harsh if reasoning is poor.>",
  "alignmentScore": <number 0-100: How well reasoning EXPLAINS their ranking order. NOT based on quiz score.>
}
 (Copy-paste):
Reasoning: "Conduct thorough background checks, Implement performance metrics, Establish formal contracts, Review credentials"
Analysis: This is just copy-pasted option text. Doesn't explain WHY they ranked in this order. ALL SCORES = 0.

Example 2 - ZERO SCORE (Contradiction - CRITICAL):
User's #1 choice: "Delay appointment and attach market to adjacent distributor"
Reasoning: "We need to act fast and appoint immediately without any delays to capture market opportunities"
Analysis: **CONTRADICTION DETECTED** - Reasoning argues for IMMEDIATE action but user chose DELAY as top option. This is opposite/contradictory. ALL SCORES = 0.

Example 3 - ZERO SCORE (Wrong option support):
User ranked: #1 "Fire manager", #2 "Give warning", #3 "Training", #4 "Ignore"
Reasoning: "I believe training and development is the best approach because people can improve with guidance"
Analysis: **CONTRADICTION** - Reasoning supports "Training" (ranked #3) but user ranked "Fire manager" as #1. Reasoning doesn't match actual choice. ALL SCORES = 0.

Example 4 - ZERO SCORE (Garbage):
Reasoning: "aaaa aaaa aaaa" or "good option best choice nice decision"
Analysis: Garbage text or generic filler. ALL SCORES = 0.

Example 5 - LOW SCORE (Generic):
Reasoning: "I think governance is important and financial analysis matters too."
Analysis: Generic statement, doesn't explain their specific ranking order. Scores ≤ 20%.

Example 6 - GOOD SCORE (Correct explanation):
User ranked: #1 "Background checks", #2 "Performance metrics", #3 "Contracts", #4 "Credentials"
Reasoning: "I ranked background checks first because preventing bad hires saves long-term costs (FR+BJ). Put performance metrics second for ongoing monitoring (TC+RD). Contracts third for legal protection (GC). Credentials last as they're easily verified."
Analysis: Clearly explains WHY each option was ranked in that position. Reasoning MATCHES and SUPPORTS their actual choices
Example 4 - GOOD SCORE:
Reasoning: "I ranked background checks first because preventing bad hires saves long-term costs (FR+BJ). Put performance metrics second for ongoing monitoring (TC+RD). Contracts third for legal protection (GC). Credentials last as they're easily verified."
Analysis: Clearly explains WHY each option was ranked in that position. High scores (70-90%).

Example 5 - SCORE CAPPING:
If actual scores are: BJ=15, FR=5, TC=8, RD=10, GC=12, GT=7
Then reasoning scores CANNOT exceed these. Even if reasoning is perfect:
- Max BJ reasoning score = 15 (not 30, not 20, exactly 15 or less)
- Max FR reasoning score = 5 (not 10, not 7, exactly 5 or less)
You are scoring how well they EXPLAINED their performance, not creating new performance.
`;

    // Call Hugging Face Inference API
    console.log('🤖 Calling Hugging Face API with model:', DEFAULT_MODEL);
    
    const response = await axios.post(
      `${HF_BASE_URL}/chat/completions`,
      {
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert leadership assessment analyzer. Analyze strategic reasoning and return ONLY valid JSON with no additional text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    // Extract the response text
    const aiResponse = response.data.choices[0].message.content;
    
    console.log('✅ Hugging Face Raw Response:', aiResponse);
    
    // Parse JSON from response
    let jsonText = aiResponse.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const result = JSON.parse(jsonText);
    
    // Validate the result structure
    if (!result.reasoningScores || !result.analysis || typeof result.alignmentScore !== 'number') {
      throw new Error('Invalid AI response structure');
    }
    
    // CRITICAL CHECK: If AI detected generic/copy-paste reasoning, force all scores to ZERO
    const analysisLower = result.analysis.toLowerCase();
    const genericKeywords = [
      'mostly generic',
      'generally poor',
      'reasoning is poor',
      'lacks original thinking',
      'copy-paste',
      'copy paste',
      'copypaste',
      'copied from',
      'does not provide clear explanation',
      'no actual explanation',
      'no explanation',
      'generic and',
      'lacks genuine',
      'not genuine',
      'appears to be generic',
      'meaningless text',
      'random text',
      'keyboard spam',
      'just repeating',
      'simply repeating',
      'from ui options',
      'from options'
    ];
    
    const contradictionKeywords = [
      'contradiction',
      'contradicts',
      'contradictory',
      'argues against',
      'opposite',
      'does not support',
      'doesnt support',
      'conflicts with',
      'inconsistent with'
    ];
    
    const hasGenericIssue = genericKeywords.some(keyword => analysisLower.includes(keyword));
    const hasContradiction = contradictionKeywords.some(keyword => analysisLower.includes(keyword));
    
    // Also check if alignment score is very low (< 25)
    const hasLowAlignment = result.alignmentScore < 25;
    
    if (hasGenericIssue || hasContradiction || hasLowAlignment) {
      console.log('🚫 AI DETECTED POOR/CONTRADICTORY REASONING - Forcing all scores to ZERO:', {
        hasGenericIssue,
        hasContradiction,
        hasLowAlignment,
        alignmentScore: result.alignmentScore,
        matchedGeneric: genericKeywords.filter(k => analysisLower.includes(k)),
        matchedContradiction: contradictionKeywords.filter(k => analysisLower.includes(k))
      });
      return {
        success: true,
        data: {
          reasoningScores: {
            BJ: 0,
            FR: 0,
            TC: 0,
            RD: 0,
            GC: 0,
            GT: 0
          },
          analysis: result.analysis,
          alignmentScore: 0
        }
      };
    }
    
    // CRITICAL FIX: Cap AI reasoning scores to never exceed actual option scores
    // You can't explain something better than you actually did it!
    const maxScores = {
      BJ: leadershipScores.BJ.score,  // Actual score from options
      FR: leadershipScores.FR.score,
      TC: leadershipScores.TC.score,
      RD: leadershipScores.RD.score,
      GC: leadershipScores.GC.score,
      GT: leadershipScores.GT.score
    };
    
    let cappedScores = { ...result.reasoningScores };
    let wasCapped = false;
    
    for (const dimension in cappedScores) {
      if (cappedScores[dimension] > maxScores[dimension]) {
        console.log(`⚠️ Capping ${dimension}: AI gave ${cappedScores[dimension]} but actual score is ${maxScores[dimension]}`);
        cappedScores[dimension] = maxScores[dimension];
        wasCapped = true;
      }
    }
    
    // Update result with capped scores
    result.reasoningScores = cappedScores;
    
    // If scores were capped, update alignment score to be lower
    if (wasCapped) {
      result.alignmentScore = Math.min(result.alignmentScore, 50);
      result.analysis = result.analysis + ' Note: Reasoning scores capped to actual performance - you cannot explain better than you performed.';
    }
    
    console.log('✅ Hugging Face Final Result (after capping):', result);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    const status = error.response?.status;
    const errorMsg = error.response?.data?.error || error.message;
    
    console.error('❌ Hugging Face AI Analysis Error:', {
      status,
      message: errorMsg,
      model: DEFAULT_MODEL
    });
    
    if (status === 401 || status === 403) {
      console.error('🔐 Authentication failed. Check HF_API_KEY.');
    } else if (status === 404) {
      console.error('🔍 Model not found or not available via Inference Providers.');
    } else if (status === 429) {
      console.error('⏱️ Rate limit exceeded. Try again later.');
    }
    
    // Return default scores if AI fails
    return {
      success: false,
      data: {
        reasoningScores: {
          BJ: 0,
          FR: 0,
          TC: 0,
          RD: 0,
          GC: 0,
          GT: 0
        },
        analysis: 'AI analysis unavailable. Please try again later.',
        alignmentScore: 0
      },
      error: error.message
    };
  }
}
