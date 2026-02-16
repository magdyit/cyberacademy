// Vercel Serverless Function - Anthropic API Proxy
export default async function handler(req, res) {
  // Set CORS headers - MUST be set before any response
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Parse request body
    const { model, max_tokens, messages } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'messages array is required and must not be empty' 
      });
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set in environment');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured. Please add ANTHROPIC_API_KEY to Vercel environment variables.' 
      });
    }

    // Log request (without sensitive data)
    console.log('Processing request:', {
      model: model || 'claude-sonnet-4-20250514',
      messageCount: messages.length,
      hasContent: messages[0]?.content ? 'yes' : 'no'
    });

    // Make request to Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 4000,
        messages: messages
      })
    });

    const data = await anthropicResponse.json();

    // If Anthropic API returned an error
    if (!anthropicResponse.ok) {
      console.error('Anthropic API error:', {
        status: anthropicResponse.status,
        error: data.error
      });
      
      return res.status(anthropicResponse.status).json({
        error: 'Anthropic API error',
        message: data.error?.message || 'Unknown error from AI service',
        details: data
      });
    }

    // Success - return the response
    console.log('Success: Generated response');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', {
      message: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      details: 'Check Vercel logs for more information'
    });
  }
}
