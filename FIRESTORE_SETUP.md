# 🔥 Firestore Database Setup Guide

This guide explains how to set up and use Firestore database for your BIP Explorer ELI5 system.

## 🚀 Quick Start

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "bip-explorer")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (recommended for live apps)
4. Select database location (choose closest to your users)
5. Click "Done"

### 3. Create Service Account
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Copy the entire JSON content

### 4. Configure Environment Variables

```bash
# Firebase Configuration
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'

# OpenAI Configuration (required for ELI5 generation)
export OPENAI_API_KEY="your-openai-api-key"

# Optional: Force Firestore usage
export USE_FIRESTORE="true"
```

### 5. Run ELI5 Generation

```bash
# Check database status
npm run generate-eli5-firestore -- --dashboard

# Generate ELI5 for all BIPs
npm run generate-eli5-firestore

# Start server with Firestore
npm run dev
```

## 📊 Features

### Automated ELI5 Generation
- **Batch Processing**: Generates ELI5 explanations for all BIPs
- **Smart Filtering**: Only processes BIPs that don't have ELI5 yet
- **Rate Limiting**: Respects OpenAI API limits with configurable delays
- **Error Handling**: Continues processing even if some BIPs fail
- **Progress Tracking**: Shows real-time progress and statistics

### Database Management
- **Automatic Initialization**: Creates collections and documents as needed
- **Efficient Queries**: Uses Firestore queries for fast data retrieval
- **Batch Operations**: Uses Firestore batch writes for optimal performance
- **Coverage Tracking**: Monitors ELI5 completion percentage

### Fallback System
- **File Storage Backup**: Automatically falls back to file storage if Firestore fails
- **Graceful Degradation**: System continues working even without Firestore
- **Error Recovery**: Handles network issues and authentication problems

## 🛠️ Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | Yes | - |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Service account JSON key | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key for ELI5 generation | Yes | - |
| `USE_FIRESTORE` | Force Firestore usage | No | auto-detect |
| `ELI5_BATCH_SIZE` | BIPs to process simultaneously | No | 3 |
| `ELI5_DELAY_MS` | Delay between API calls | No | 1000 |
| `ELI5_BATCH_DELAY_MS` | Delay between batches | No | 3000 |

### Firestore Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all BIP data
    match /bips/{bipId} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
    
    // Allow read access to metadata
    match /metadata/{document} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
  }
}
```

## 📋 Commands

### Database Dashboard
```bash
# View database status and statistics
npm run generate-eli5-firestore -- --dashboard
```

### ELI5 Generation
```bash
# Generate ELI5 for missing BIPs only
npm run generate-eli5-firestore

# With custom configuration
ELI5_BATCH_SIZE=5 ELI5_DELAY_MS=2000 npm run generate-eli5-firestore

# Force regeneration of all BIPs (coming soon)
npm run generate-eli5-firestore -- --force
```

### Server Operations
```bash
# Start server with Firestore
FIREBASE_PROJECT_ID="your-project" npm run dev

# Start server with file storage fallback
npm run dev
```

## 🏗️ Database Schema

### BIPs Collection (`/bips/{bip-id}`)
```typescript
interface Bip {
  number: number;           // BIP number (1, 2, 3, etc.)
  title: string;           // BIP title
  authors: string[];       // List of author names
  status: string;          // Draft, Final, Active, etc.
  type: string;           // Standards Track, Informational, etc.
  created: string;        // Creation date
  abstract: string;       // BIP abstract
  content: string;        // Full BIP content
  filename: string;       // Original filename
  githubUrl: string;      // GitHub URL
  layer?: string;         // Protocol layer (optional)
  comments?: string;      // Comments URL (optional)
  eli5?: string;         // ELI5 explanation (generated)
}
```

### Metadata Collection (`/metadata/cache-info`)
```typescript
interface CacheInfo {
  timestamp: number;       // Last cache update timestamp
  lastUpdated: string;     // ISO string of last update
}
```

## 📈 Performance & Costs

### Firestore Usage
- **Reads**: ~1 read per BIP view (cached by client)
- **Writes**: Only during ELI5 generation and BIP updates
- **Storage**: ~100KB for all BIPs and ELI5 content

### Cost Estimation
- **Firestore**: ~$0.10-0.50/month for typical usage
- **OpenAI**: ~$1-2 for one-time ELI5 generation of all BIPs
- **Total**: Very low cost for a fully automated system

## 🔧 Troubleshooting

### Common Issues

#### 1. Firebase Authentication Error
```
Error: Firebase credentials not configured
```
**Solution**: Check that `FIREBASE_SERVICE_ACCOUNT_KEY` is properly set with valid JSON.

#### 2. Permission Denied
```
Error: 7 PERMISSION_DENIED: Missing or insufficient permissions
```
**Solution**: Update Firestore security rules or check service account permissions.

#### 3. Project Not Found
```
Error: Project not found
```
**Solution**: Verify `FIREBASE_PROJECT_ID` matches your Firebase project ID exactly.

#### 4. OpenAI API Issues
```
Error: OpenAI API key not configured
```
**Solution**: Set `OPENAI_API_KEY` environment variable with valid API key.

### Debug Mode
```bash
# Enable detailed logging
DEBUG=firebase:* npm run generate-eli5-firestore

# Check configuration
npm run generate-eli5-firestore -- --dashboard
```

### Manual Database Queries
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and select project
firebase login
firebase use your-project-id

# Query data
firebase firestore:get /bips/bip-1
```

## 🚀 Deployment

### Environment Setup
For production deployment, ensure environment variables are set:

```bash
# Cloudflare Pages environment variables
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
OPENAI_API_KEY=sk-...
USE_FIRESTORE=true
```

### Automated Generation
Set up a scheduled job to keep ELI5 content updated:

```bash
# Add to your CI/CD pipeline
npm run generate-eli5-firestore
```

---

## 🎯 Benefits of Firestore

✅ **Instant Loading**: BIP pages load ELI5 content immediately  
✅ **Scalable**: Handles thousands of BIPs without performance issues  
✅ **Cost Efficient**: Pay only for what you use  
✅ **Automated**: One-time setup, then fully automated  
✅ **Reliable**: Google-managed infrastructure with 99.99% uptime  
✅ **Global**: Fast access from anywhere in the world  

Your BIP Explorer now has enterprise-grade database backing with automated ELI5 generation! 🎉