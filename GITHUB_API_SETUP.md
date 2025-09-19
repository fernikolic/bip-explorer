# GitHub API Rate Limiting Fix

## Problem
Google Search Console was reporting 404 errors for 175+ pages because the GitHub API was returning 403 errors due to rate limiting. Without authentication, GitHub limits API requests to 60 per hour, which is insufficient for the BIP Explorer application.

## Root Cause
- The application fetches BIPs data from GitHub API on startup and periodically
- Without authentication, GitHub API rate limits to 60 requests/hour
- When rate limit is exceeded, API returns 403 errors
- This causes the BIPs data to fail loading
- Without BIPs data, all dynamic routes (BIP pages, author pages, category pages) return 404

## Solution
Added GitHub API authentication to increase rate limits from 60/hour to 5,000/hour.

## Setup Instructions

### 1. Create GitHub Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "BIP Explorer API Access"
4. Select these scopes:
   - `public_repo` (to read public repositories)
5. Generate token and copy it

### 2. Set Environment Variable
Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your token:
```
GITHUB_TOKEN=your_github_token_here
```

### 3. For Production Deployment
Set the `GITHUB_TOKEN` environment variable in your hosting platform:

#### Cloudflare Pages / Wrangler
```bash
npx wrangler pages project create bip-explorer
echo "GITHUB_TOKEN=your_token_here" | npx wrangler pages secret put
```

#### Other Platforms
- **Vercel**: Add in Environment Variables section
- **Netlify**: Add in Site settings → Environment variables
- **Railway**: Add in Variables tab

## Verification
After setting up the token, restart the application. You should see:
- No more "GitHub API returned 403" errors
- BIPs data loads successfully
- All pages resolve correctly instead of 404

## Rate Limits
- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour
- **Current usage**: ~400 requests per cache refresh (every 15 minutes)

This provides sufficient headroom for normal operation and traffic spikes.