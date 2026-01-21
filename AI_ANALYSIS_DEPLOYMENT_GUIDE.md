# AI Strategic Reasoning Analysis - Deployment Guide

## Overview
This feature uses Google Gemini AI to analyze strategic reasoning quality in corporate simulation quizzes and compare it with actual performance.

## Architecture

### Backend Components
1. **Model Extension** (`models/corporateSimulationResultModel.js`)
   - Added `reasoningScores` - AI-analyzed scores for each capability (BJ, FR, TC, RD, GC, GT)
   - Added `reasoningAnalysis` - AI-generated analysis text
   - Added `alignmentScore` - Score showing alignment between reasoning and performance

2. **AI Service** (`services/geminiAIService.js`)
   - Integrates with Google Gemini Pro API
   - Analyzes strategic reasoning across all scenarios
   - Compares reasoning quality with actual quiz scores
   - Returns structured scores for visualization

3. **API Route** (`routes/corporateSimulationRoutes.js`)
   - POST `/api/corporate-simulation/analyze-reasoning/:id`
   - Triggers AI analysis for a specific result
   - Updates database with AI scores

### Frontend Components
1. **Self Management Spider Graph**
   - Displays AI-analyzed reasoning quality scores
   - Uses same dimensions as Self Assessment (BJ, FR, TC, RD, GC, GT)
   - Normalized to 0-5 scale for comparison

2. **Combined Comparison Graph**
   - Overlays both Self Assessment and Self Management
   - Shows alignment between actions and reasoning
   - Helps identify gaps in understanding vs execution

## Environment Variables

### Required on Render
```env
OPENAI_API_KEY=your_google_gemini_api_key_here
```

**Note:** The variable is named `OPENAI_API_KEY` but contains a Google Gemini API key. This is intentional for deployment consistency.

### Local Development
Add to `Backend/.env`:
```env
OPENAI_API_KEY=AIzaSyAFvA-29qX5_0poU_itk3v7LWvkLTZVFFA
```

## Deployment Steps on Render

### 1. Set Environment Variable
- Go to your Render dashboard
- Navigate to your service
- Go to "Environment" tab
- Add new environment variable:
  - **Key:** `OPENAI_API_KEY`
  - **Value:** Your Google Gemini API key
- Click "Save Changes"

### 2. Deploy
- Render will automatically redeploy with the new environment variable
- Or manually trigger deployment from the dashboard

### 3. Verify
- Check deployment logs for successful startup
- Test the AI analysis endpoint
- Verify spider graphs display correctly

## API Key Security

### Production Best Practices
✅ **DO:**
- Store API key in environment variables only
- Use Render's encrypted environment variable storage
- Rotate keys periodically
- Monitor API usage for anomalies

❌ **DON'T:**
- Hardcode API keys in source code
- Commit API keys to version control
- Share API keys in documentation
- Use development keys in production

### Key Rotation Process
1. Generate new API key from Google Cloud Console
2. Update `OPENAI_API_KEY` on Render
3. Service automatically restarts with new key
4. Revoke old key after verification

## API Usage & Limits

### Google Gemini Pro API
- **Free tier:** 60 requests per minute
- **Token limits:** ~30,000 tokens per request
- **Response time:** Usually 2-5 seconds

### Cost Optimization
- AI analysis runs only on quiz completion
- Results are cached in database
- No repeated analysis for same result

## Monitoring

### Success Indicators
- `reasoningScores` populated in database
- `alignmentScore` calculated (0-100)
- `reasoningAnalysis` text generated
- Spider graphs display data

### Error Handling
- API failures fallback to default scores
- User experience unaffected by AI failures
- Errors logged for monitoring
- Retry logic can be added if needed

## Testing

### Manual Test Flow
1. Complete a corporate simulation quiz
2. Provide strategic reasoning (20-100 words)
3. Submit quiz
4. Wait 2-5 seconds for AI analysis
5. View Leadership Assessment Profile
6. Verify both spider graphs display
7. Check combined comparison graph

### API Test
```bash
# Get auth token first
TOKEN="your_jwt_token_here"

# Submit quiz result
curl -X POST http://localhost:5000/api/corporate-simulation/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ ... quiz data ... }'

# Trigger AI analysis
curl -X POST http://localhost:5000/api/corporate-simulation/analyze-reasoning/RESULT_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### Issue: AI analysis returns zero scores
**Cause:** API key not set or invalid
**Solution:** Verify `OPENAI_API_KEY` in environment variables

### Issue: Request timeout
**Cause:** Gemini API slow or unavailable
**Solution:** Increase timeout in `geminiAIService.js` or implement retry logic

### Issue: Invalid JSON response
**Cause:** AI returned non-JSON text
**Solution:** Parser handles markdown code blocks, check logs for raw response

### Issue: Spider graph not displaying
**Cause:** Frontend not receiving reasoningScores
**Solution:** Check network tab, verify API response includes reasoningScores

## Future Enhancements

### Potential Improvements
1. **Caching:** Cache AI responses to reduce API calls
2. **Batch Processing:** Analyze multiple results in one API call
3. **Historical Comparison:** Track reasoning improvement over time
4. **Personalized Feedback:** Generate specific recommendations
5. **Multi-language Support:** Analyze reasoning in different languages

### Scalability Considerations
- Implement queue system for AI analysis
- Use Redis for caching AI responses
- Add rate limiting for API protection
- Consider OpenAI as alternative provider

## Support

### Resources
- Google Gemini API Docs: https://ai.google.dev/docs
- Gemini Pricing: https://ai.google.dev/pricing
- API Key Management: https://makersuite.google.com/app/apikey

### Contact
For issues or questions about this feature, contact the development team.
