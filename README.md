# HumanizeAI

A web app that transforms AI-generated text into natural, human-sounding writing using Claude AI.

## Deploy to Vercel (Free)

### Step 1 — Upload to GitHub
1. Go to github.com → click "New repository"
2. Name it `humanizeai` → click "Create repository"
3. Click "uploading an existing file" → drag all these project files in → click "Commit changes"

### Step 2 — Deploy on Vercel
1. Go to vercel.com → Sign up with your GitHub account
2. Click "Add New Project" → select your `humanizeai` repo → click "Import"
3. Before clicking Deploy, click "Environment Variables"
4. Add: Name = `ANTHROPIC_API_KEY` | Value = your Anthropic API key
5. Click "Deploy" → wait ~1 minute → your site is live!

### Step 3 — Your live URL
Vercel gives you a URL like: `https://humanizeai.vercel.app`
Share it with anyone — they can use it instantly, your API key stays hidden.

## Local Development
```
npm install
cp .env.example .env.local
# Add your API key to .env.local
npm run dev
```
Open http://localhost:3000
