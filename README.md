# 🧠 AI-Powered Study Notebook

A revolutionary notebook application with advanced AI-powered layout generation, featuring sophisticated Natural Language Processing (NLP) capabilities and intelligent template creation.

## ✨ Features

### 🎯 **Advanced AI Layout Generation**
- **OpenAI GPT-4 Integration**: Semantic understanding of user prompts
- **Intent Detection**: Automatically detects planning, creative, study, business, fitness, and journal intents
- **Context-Aware Generation**: Adapts layouts based on user context, time, and preferences
- **Multiple Layout Styles**: Minimalist, detailed, and creative variations
- **Real-time Learning**: Improves with each user interaction

### 📝 **Smart Notebook Features**
- **Editable SVG Layouts**: Interactive elements that users can customize
- **Multiple Paper Styles**: Ruled, dotted, grid, and custom paper types
- **Template System**: Pre-built templates for common use cases
- **Study Mode**: Specialized mode for academic and learning purposes
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### 🧠 **NLP-Powered Intelligence**
- **Semantic Understanding**: Goes beyond keyword matching to understand user intent
- **Complexity Assessment**: Automatically determines layout complexity based on user needs
- **Emotional Tone Detection**: Adapts to professional, casual, creative, or academic tones
- **Entity Extraction**: Identifies dates, topics, people, locations, and numbers
- **Personalization**: Learns from user preferences and behavior patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional, for advanced NLP features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-study-notebook.git
   cd ai-study-notebook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   # Database (Turso/SQLite)
   TURSO_CONNECTION_URL=your_turso_url
   TURSO_AUTH_TOKEN=your_turso_token
   
   # OpenAI (optional, for advanced NLP)
   OPENAI_API_KEY=your_openai_api_key
   
   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form handling and validation

### **Backend**
- **Next.js API Routes**: Serverless API endpoints
- **Drizzle ORM**: Type-safe database operations
- **Turso/SQLite**: Lightweight, scalable database
- **OpenAI API**: Advanced NLP capabilities

### **AI System**
- **Advanced Prompt Processor**: Intent detection and analysis
- **Semantic Layout Matcher**: Intelligent layout retrieval
- **Context-Aware Generator**: Personalized layout creation
- **Learning System**: Continuous improvement from user feedback

## 📊 Database Schema

### **Core Tables**
- `notebooks`: User notebooks with metadata
- `pages`: Individual notebook pages
- `layout_patterns`: AI training data for layouts
- `user_layout_preferences`: User learning and preferences

### **Key Features**
- **Foreign Key Constraints**: Data integrity
- **Cascade Deletes**: Clean data management
- **JSON Fields**: Flexible metadata storage
- **Indexing**: Optimized query performance

## 🧪 AI Layout Generation

### **How It Works**

1. **Prompt Analysis**: GPT-4 analyzes user input for intent, complexity, and context
2. **Semantic Matching**: Finds relevant layouts from the database
3. **Context Generation**: Creates personalized layouts based on user history
4. **Layout Ranking**: Combines and ranks results by relevance
5. **Response**: Returns multiple diverse, intelligent layouts

### **Example Prompts**

```bash
# Planning
"I need a weekly planner for my work projects"
→ Generates: Smart Planner, Weekly Planner, Meeting Notes, Project Timeline

# Creative
"Design a creative brainstorming template for new product ideas"
→ Generates: Creative Canvas, Creative Brainstorm, Mind Map layouts

# Study
"I want a comprehensive study guide for my upcoming exam"
→ Generates: Study Guide, Flashcard layouts, Note-taking templates

# Personal
"Create a mood journal for tracking my daily emotions"
→ Generates: Mood Tracker, Daily Journal, Reflection layouts
```

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Drizzle Studio

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── notebook/          # Notebook interface
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── notebook/          # Notebook-specific components
│   ├── ui/                # Reusable UI components
│   └── landing/           # Landing page components
├── lib/                   # Utility libraries
│   ├── nlp/               # AI/NLP system
│   ├── db/                # Database configuration
│   └── utils/             # Helper functions
└── scripts/               # Build and utility scripts
```

## 🌟 Key Features in Detail

### **1. Advanced NLP System**
- **Intent Detection**: Identifies user goals and requirements
- **Complexity Analysis**: Determines appropriate layout complexity
- **Context Awareness**: Considers time, domain, and social context
- **Entity Extraction**: Understands dates, topics, and relationships
- **Learning Loop**: Improves recommendations over time

### **2. Intelligent Layout Generation**
- **Multiple Styles**: Minimalist, detailed, and creative variations
- **Semantic Matching**: Finds relevant layouts beyond keyword matching
- **Personalization**: Adapts to individual user preferences
- **Real-time Generation**: Creates layouts on-demand
- **Quality Scoring**: Ranks layouts by relevance and quality

### **3. Interactive Notebook Interface**
- **Editable Elements**: Text, textarea, date, number, select inputs
- **Real-time Updates**: Instant saving and synchronization
- **Responsive Design**: Works on all device sizes
- **Paper Styles**: Multiple paper types and customizations
- **Template System**: Pre-built layouts for common use cases

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect to GitHub**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure Environment Variables**
   ```env
   TURSO_CONNECTION_URL=your_production_turso_url
   TURSO_AUTH_TOKEN=your_production_turso_token
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

3. **Deploy**
   - Vercel will automatically deploy on every push to main

### **Other Platforms**

The app can be deployed to any platform that supports Next.js:
- **Netlify**: Static site generation
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform
- **AWS**: Amplify or EC2

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing the GPT-4 API for advanced NLP capabilities
- **Next.js Team**: For the amazing React framework
- **Drizzle Team**: For the excellent TypeScript ORM
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations and transitions

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/ai-study-notebook/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-study-notebook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-study-notebook/discussions)

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI GPT-4**