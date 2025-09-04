#!/bin/bash

# 🚀 Upload to GitHub Codespace Script
# This script helps you upload your AI Study Notebook to GitHub

echo "🚀 AI Study Notebook - Upload to GitHub"
echo "========================================"

# Create a clean zip file without sensitive data
echo "📦 Creating clean project archive..."

# Remove any existing zip
rm -f ai-study-notebook-clean.zip

# Create zip excluding sensitive files
zip -r ai-study-notebook-clean.zip . \
  -x "*.env*" \
  -x "local.db" \
  -x "*.log" \
  -x "node_modules/*" \
  -x ".git/*" \
  -x ".next/*" \
  -x "*.backup" \
  -x "*.tmp"

echo "✅ Clean archive created: ai-study-notebook-clean.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub Codespace"
echo "2. Upload the 'ai-study-notebook-clean.zip' file"
echo "3. Extract it in your Codespace"
echo "4. Run 'npm install' to install dependencies"
echo "5. Set up your environment variables"
echo ""
echo "🌐 Your app will be available at the Codespace URL!"
