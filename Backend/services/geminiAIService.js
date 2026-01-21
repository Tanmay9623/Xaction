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

    // Collect all strategic reasons
    const reasoningTexts = answers.map((ans, idx) => ({
      questionNumber: idx + 1,
      title: ans.title,
      reasoning: ans.reasoning || '',
      actualScore: ans.score
    })).filter(r => r.reasoning.trim().length > 0);

    console.log('📊 Total answers received:', answers.length);
    console.log('📝 Answers with reasoning:', reasoningTexts.length);
    console.log('💬 Reasoning texts:', reasoningTexts.map(r => ({
      q: r.questionNumber,
      text: r.reasoning.substring(0, 60) + '...'
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
You are an expert leadership assessment analyzer. Analyze the following strategic reasoning texts from a leadership simulation quiz.

**Task:** 
1. Analyze all the Strategic Reasons provided across all decision-making scenarios
2. Compare the reasoning quality with the actual scores received for each capability
3. Assign scores (0-30 for BJ, 0-10 for FR, 0-18 for TC, 0-18 for RD, 0-24 for GC, 0-18 for GT) based on how well the strategic reasoning demonstrates understanding of each leadership dimension

**Actual Leadership Scores Received:**
- BJ (Business Judgment): ${leadershipScores.BJ.score}/30
- FR (Financial Risk): ${leadershipScores.FR.score}/10
- TC (Talent Assessment): ${leadershipScores.TC.score}/18
- RD (Risk Design): ${leadershipScores.RD.score}/18
- GC (Governance): ${leadershipScores.GC.score}/24
- GT (Market Execution): ${leadershipScores.GT.score}/18

**Strategic Reasoning Provided:**
${reasoningTexts.map(r => `
Question ${r.questionNumber}: ${r.title}
Strategic Reason: ${r.reasoning}
Score Received: ${r.actualScore}
`).join('\n')}

**Leadership Dimensions to Evaluate:**
1. **BJ - Business Judgment & Long-Term Thinking** (Max: 30)
   Evaluate: Does the reasoning show strategic thinking, long-term planning, business acumen?
   
2. **FR - Financial & Credit Risk Acumen** (Max: 10)
   Evaluate: Does the reasoning demonstrate financial awareness, risk assessment, cost-benefit analysis?
   
3. **TC - Talent & Capability Assessment** (Max: 18)
   Evaluate: Does the reasoning show people skills, talent evaluation, team dynamics understanding?
   
4. **RD - Risk Design & Decision Structuring** (Max: 18)
   Evaluate: Does the reasoning show structured thinking, risk mitigation, decision frameworks?
   
5. **GC - Governance & Compliance Orientation** (Max: 24)
   Evaluate: Does the reasoning demonstrate ethical thinking, compliance awareness, policy understanding?
   
6. **GT - Market & Execution Understanding** (Max: 18)
   Evaluate: Does the reasoning show market awareness, execution capability, operational thinking?

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
  "analysis": "<Brief 2-3 sentence analysis comparing reasoning quality with actual performance. Highlight major discrepancies.>",
  "alignmentScore": <number 0-100 representing how well reasoning aligns with actual scores>
}

**Important:** 
- Return ONLY valid JSON with no additional text
- Score the reasoning quality based on how well they EXPLAINED their thinking
- The alignmentScore should be high if reasoning quality matches actual performance
- If reasoning is weak but actual score is high, alignment is low (indicating lucky guesses)
- If reasoning is strong but actual score is low, alignment is also low (indicating knowledge without execution)
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
    
    console.log('✅ Hugging Face Parsed Result:', result);
    
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
