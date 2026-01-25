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
      })) : []
    })).filter(r => r.reasoning.trim().length > 0);

    // Pre-validation: Check if reasoning is just copy-paste of options
    let isCopyPaste = false;
    let copyPasteCount = 0;
    
    for (const r of reasoningTexts) {
      const reasoningLower = r.reasoning.toLowerCase().replace(/[^a-z0-9]/g, '');
      let matchCount = 0;
      
      for (const opt of r.rankedOptions) {
        const optionLower = opt.text.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Check if significant portion of option text appears in reasoning
        if (reasoningLower.includes(optionLower.substring(0, Math.min(20, optionLower.length)))) {
          matchCount++;
        }
      }
      
      // If reasoning contains 3+ options text, likely copy-paste
      if (matchCount >= 3) {
        copyPasteCount++;
      }
    }
    
    // If most answers are copy-paste, return zero scores immediately
    if (copyPasteCount >= reasoningTexts.length * 0.7) {
      console.log('⚠️ Detected copy-paste reasoning in', copyPasteCount, 'out of', reasoningTexts.length, 'answers');
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
          analysis: 'Reasoning appears to be copy-pasted option text rather than genuine explanation of ranking decisions. No credit given.',
          alignmentScore: 0
        }
      };
    }

    console.log('📊 Total answers received:', answers.length);
    console.log('📝 Answers with reasoning:', reasoningTexts.length);
    console.log('🔍 Copy-paste detected in:', copyPasteCount, 'answers');
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
- **Contradiction**: User ranked option X as #1 BUT reasoning argues AGAINST it or supports different option → ALL SCORES = 0
- Example: User puts "Delay appointment" as #1, but reasoning says "We should act quickly and not delay" → Score = 0

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

User's Ranking Choice (1st to last):
${r.rankedOptions.map((opt, idx) => `  ${opt.rank}. ${opt.text} ${idx === 0 ? '← THEIR TOP CHOICE (Must support this!)' : ''}`).join('\n')}

User's Reasoning Text: "${r.reasoning}"

Score Received: ${r.actualScore}

**CRITICAL CHECKS:**
1. Is reasoning EXACT copy from UI options with no explanation? (If yes = 0)
2. Is reasoning random/meaningless text like "20 a", "asdfsdf", "!!!"? (If yes = 0)
3. Does reasoning SUPPORT their #1 choice or argue AGAINST it? (If against = contradiction = 0)
4. Does reasoning explain WHY option ranked #1 was chosen over others? (If no = 0)
5. Does reasoning match their ranking order or contradict it? (If contradict = 0)
6. Is it genuine original explanation or just generic/filler text? (If generic = 0)
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
