# 🚀 Deploy AI Study Notebook to GitHub Codespaces

## Quick Deployment Guide

### Step 1: Create Clean Project Archive
```bash
# Create a clean zip without sensitive files
zip -r ai-study-notebook.zip . -x "*.env*" "local.db" "*.log" "node_modules/*" ".git/*" ".next/*"
```

### Step 2: Upload to Codespace
1. Go to your GitHub Codespace
2. Upload the `ai-study-notebook.zip` file
3. Extract it: `unzip ai-study-notebook.zip`
4. Install dependencies: `npm install`

### Step 3: Environment Setup
Create `.env.local` in your Codespace:
```env
# Database (use local SQLite for Codespace)
TURSO_CONNECTION_URL=file:./local.db
TURSO_AUTH_TOKEN=dummy

# OpenAI (optional)
OPENAI_API_KEY=your_key_here

# App URL
NEXT_PUBLIC_APP_URL=https://your-codespace-url
```

### Step 4: Database Setup
```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Step 5: Start Development
```bash
npm run dev
```

## Why This Works
• Removes sensitive data before upload
• Uses local SQLite for easy setup
• Maintains all functionality
• Works in Codespace environment

## Validation
- [ ] App loads without errors
- [ ] Database connections work
- [ ] AI layout generation functions
- [ ] Notebook creation/editing works

## Next Actions
1. Create the zip file
2. Upload to Codespace
3. Follow setup steps
