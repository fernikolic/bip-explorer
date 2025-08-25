# Production Deployment Setup

## Cloudflare Pages Environment Variables

Set these environment variables in your Cloudflare Pages dashboard:

### Required for Categories to Work:
```
NODE_ENV=production
USE_FIRESTORE=true
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_SERVICE_ACCOUNT_KEY=your-service-account-json
```

### Firebase Setup:
1. Go to Firebase Console: https://console.firebase.google.com
2. Create a new project or use existing
3. Enable Firestore database
4. Go to Project Settings > Service accounts
5. Generate new private key (downloads JSON file)
6. Add the JSON content as FIREBASE_SERVICE_ACCOUNT_KEY environment variable
7. Set FIREBASE_PROJECT_ID to your project ID

## Environment Variables Setup:
1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to Settings > Environment variables
4. Add the variables above
5. Deploy again

This will ensure:
- Categories work properly with persistent storage
- Data persists between serverless function invocations
- Production matches localhost functionality exactly