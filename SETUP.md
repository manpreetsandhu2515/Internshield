# InternShield — Setup Guide

## Prerequisites
- Node.js 18+
- npm
- Netlify CLI: `npm install -g netlify-cli`
- Firebase account
- Groq account (free at console.groq.com)

---

## 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Firestore Database** (start in test mode)
3. Go to **Project Settings → Service Accounts** → Generate new private key
   - Download the JSON file
   - Copy its content as a single line for `FIREBASE_SERVICE_ACCOUNT`
4. Go to **Project Settings → General** → Your apps → Add Web App
   - Copy the `firebaseConfig` values

---

## 2. Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Create an API key
3. Copy it for `GROQ_API_KEY`

---

## 3. Environment Variables

### Frontend (`.env.local` in project root)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Backend (Netlify Functions — set in Netlify Dashboard)
```
GROQ_API_KEY=gsk_...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

For **local dev**, create `netlify/.env`:
```
GROQ_API_KEY=gsk_...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

---

## 4. Local Development

```bash
# Install frontend deps
npm install

# Install function deps
cd netlify/functions && npm install && cd ../..

# Run with Netlify Dev (proxies functions automatically)
netlify dev
```

Visit http://localhost:8888

---

## 5. Deploy to Netlify

```bash
# Login
netlify login

# Initialize (first time)
netlify init

# Set env vars
netlify env:set GROQ_API_KEY "gsk_..."
netlify env:set FIREBASE_SERVICE_ACCOUNT '{"type":"service_account",...}'

# Deploy
netlify deploy --prod
```

Or just push to GitHub and connect the repo in Netlify Dashboard.

---

## 6. Firestore Security Rules

In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only server (Admin SDK) can write scans
    match /scans/{scanId} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```
