# CyberSec Academy Backend

Backend proxy for the CyberSec Academy application that handles Anthropic API requests.

## 🚀 Quick Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# Login to Vercel
vercel login

# Deploy the backend
vercel --prod
```

### Step 3: Add Your API Key
After deployment:
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (starts with `sk-ant-`)
   - **Environment**: Production
5. Click **Save**
6. Go to **Deployments** → Click the three dots on your latest deployment → **Redeploy**

### Step 4: Update Your Frontend
After deployment, Vercel will give you a URL like: `https://your-project.vercel.app`

Update your frontend HTML file to use this URL instead of the Anthropic API:

Find this line in your HTML:
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
```

Replace it with:
```javascript
const response = await fetch('https://YOUR-PROJECT.vercel.app/api/analyze', {
```

**Important**: Remove the API key headers from the frontend since the backend will handle authentication.

## 📁 Files Included

- `api/analyze.js` - Serverless function that proxies requests to Anthropic
- `vercel.json` - Vercel configuration
- `package.json` - Node.js dependencies
- `README.md` - This file

## 🔒 Security

- Your API key is stored securely in Vercel environment variables
- Never exposed to the frontend
- CORS headers allow requests from any domain (you can restrict this in production)

## 🛠️ Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally
vercel dev
```

Your API will be available at: `http://localhost:3000/api/analyze`

## 📝 API Endpoint

**POST** `/api/analyze`

**Request Body:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4000,
  "messages": [
    {
      "role": "user",
      "content": "Your content here"
    }
  ]
}
```

**Response:**
Returns the Anthropic API response directly.

## ⚠️ Important Notes

1. **Keep your API key secure** - Never commit it to Git
2. **Monitor usage** - Check your Anthropic dashboard for API usage
3. **Set rate limits** - Consider adding rate limiting in production
4. **Restrict CORS** - Update the `Access-Control-Allow-Origin` header to your domain only

## 🆘 Troubleshooting

**Error: API key not set**
- Make sure you added `ANTHROPIC_API_KEY` to Vercel environment variables
- Redeploy after adding the variable

**Error: CORS blocked**
- Check that the CORS headers in `api/analyze.js` match your frontend domain

**Error: 401 Unauthorized**
- Verify your API key is correct
- Check that the key has the necessary permissions

## 📞 Support

For issues with:
- Vercel deployment: https://vercel.com/docs
- Anthropic API: https://docs.anthropic.com
