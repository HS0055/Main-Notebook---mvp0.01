#!/bin/bash

# 🚀 AI Study Notebook - GitHub Deployment Script
# This script helps you deploy your project to GitHub

echo "🚀 AI Study Notebook - GitHub Deployment"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run 'git init' first."
    exit 1
fi

# Get repository URL from user
echo ""
echo "📝 Please provide your GitHub repository details:"
echo ""

read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name (default: ai-study-notebook): " REPO_NAME

# Set default repository name if empty
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="ai-study-notebook"
fi

# Construct GitHub URL
GITHUB_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "🔗 Repository URL: ${GITHUB_URL}"
echo ""

# Confirm with user
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo ""
echo "📤 Adding remote origin..."
git remote add origin $GITHUB_URL 2>/dev/null || git remote set-url origin $GITHUB_URL

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully deployed to GitHub!"
    echo ""
    echo "🌐 Your repository is now available at:"
    echo "   https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Go to https://vercel.com"
    echo "   2. Import your repository"
    echo "   3. Configure environment variables"
    echo "   4. Deploy!"
    echo ""
    echo "📖 For detailed deployment instructions, see DEPLOYMENT.md"
else
    echo ""
    echo "❌ Failed to push to GitHub. Please check your credentials and try again."
    echo ""
    echo "💡 Make sure you have:"
    echo "   - Created the repository on GitHub"
    echo "   - Set up your GitHub credentials"
    echo "   - Have push access to the repository"
fi
