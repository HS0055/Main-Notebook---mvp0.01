import { NextResponse } from 'next/server';
import { db } from '@/db';
import { layoutPatterns, userLayoutPreferences } from '@/db/schema';
import { nlpLayoutService, NLPLayoutRequest } from '@/lib/nlp/NLPLayoutService';
import { getNLPConfig, validateNLPConfig } from '@/lib/nlp/config';

// Unified AI Layout System - Trainable & Scalable
interface UnifiedRequest {
  prompt: string;
  imageData?: string;
  mode: 'prompt' | 'image' | 'hybrid';
  paperStyle: {
    lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music' | 'calendar';
    lineSpacing: 'narrow' | 'normal' | 'wide';
    marginLine: boolean;
    paperColor: string;
    lineColor: string;
  };
  userId?: string;
  context?: {
    previousLayouts?: string[];
    preferences?: any;
    category?: string;
  };
}

interface UnifiedResponse {
  success: boolean;
  layouts: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    confidence: number;
    svgData: string;
    editableElements: EditableElement[];
    metadata: {
      source: 'generated' | 'template' | 'hybrid';
      popularity: number;
      tags: string[];
      trainingData?: any;
    };
    analysis: {
      detectedContent: string[];
      suggestedStyle: string;
      contentAreas: number;
      complexity: 'simple' | 'medium' | 'complex';
    };
  }>;
  suggestions: string[];
  learning: {
    improved: boolean;
    newPatterns: string[];
    userFeedback?: string;
  };
  processingTime: number;
}

interface EditableElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'date' | 'number' | 'select' | 'slider' | 'color';
  x: number;
  y: number;
  width: number;
  height: number;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    border?: string;
  };
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// AI Training & Learning System
class AILayoutTrainer {
  private static trainingData: Map<string, any> = new Map();
  private static userPatterns: Map<string, any[]> = new Map();

  // Learn from user interactions
  static learnFromUser(userId: string, prompt: string, selectedLayout: any, feedback?: number) {
    const userKey = userId || 'anonymous';
    if (!this.userPatterns.has(userKey)) {
      this.userPatterns.set(userKey, []);
    }
    
    const userData = this.userPatterns.get(userKey)!;
    userData.push({
      prompt,
      selectedLayout: selectedLayout.id,
      feedback: feedback || 5, // Default positive feedback
      timestamp: new Date().toISOString(),
      context: this.extractContext(prompt)
    });
    
    // Keep only last 100 interactions per user
    if (userData.length > 100) {
      userData.splice(0, userData.length - 100);
    }
    
    // Update global training data
    this.updateGlobalTraining(prompt, selectedLayout, feedback);
  }

  // Extract context from prompt
  private static extractContext(prompt: string) {
    const keywords = prompt.toLowerCase().split(' ').filter(word => word.length > 2);
    const categories = this.detectCategories(keywords);
    const complexity = this.assessComplexity(prompt);
    
    return { keywords, categories, complexity };
  }

  // Detect categories from keywords
  private static detectCategories(keywords: string[]): string[] {
    const categoryMap: Record<string, string[]> = {
      productivity: ['bullet', 'journal', 'weekly', 'planner', 'task', 'goal', 'habit'],
      study: ['cornell', 'notes', 'study', 'academic', 'learning', 'exam'],
      creative: ['mood', 'journal', 'art', 'drawing', 'sketch', 'creative'],
      business: ['meeting', 'agenda', 'action', 'project', 'professional'],
      fitness: ['workout', 'exercise', 'nutrition', 'health', 'fitness', 'tracker']
    };
    
    const detected: string[] = [];
    keywords.forEach(keyword => {
      Object.entries(categoryMap).forEach(([category, terms]) => {
        if (terms.some(term => keyword.includes(term) || term.includes(keyword))) {
          if (!detected.includes(category)) {
            detected.push(category);
          }
        }
      });
    });
    
    return detected.length > 0 ? detected : ['general'];
  }

  // Assess prompt complexity
  private static assessComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const words = prompt.split(' ').length;
    const hasMultipleConcepts = prompt.includes('and') || prompt.includes('with') || prompt.includes('+');
    
    if (words <= 3 && !hasMultipleConcepts) return 'simple';
    if (words <= 8 && !hasMultipleConcepts) return 'medium';
    return 'complex';
  }

  // Update global training data
  private static updateGlobalTraining(prompt: string, layout: any, feedback?: number) {
    const key = this.generateTrainingKey(prompt);
    const current = this.trainingData.get(key) || { count: 0, totalFeedback: 0, layouts: [] };
    
    current.count++;
    current.totalFeedback += feedback || 5;
    current.layouts.push(layout.id);
    
    this.trainingData.set(key, current);
  }

  // Generate training key from prompt
  private static generateTrainingKey(prompt: string): string {
    const keywords = prompt.toLowerCase().split(' ').filter(word => word.length > 2);
    return keywords.sort().join('_');
  }

  // Get personalized suggestions based on user history
  static getPersonalizedSuggestions(userId: string, prompt: string): string[] {
    const userKey = userId || 'anonymous';
    const userData = this.userPatterns.get(userKey) || [];
    
    if (userData.length === 0) {
      return this.getDefaultSuggestions(prompt);
    }
    
    // Analyze user preferences
    const preferences = this.analyzeUserPreferences(userData);
    const context = this.extractContext(prompt);
    
    return this.generatePersonalizedSuggestions(preferences, context);
  }

  // Analyze user preferences from history
  private static analyzeUserPreferences(userData: any[]) {
    const categoryCounts: Record<string, number> = {};
    const complexityCounts: Record<string, number> = {};
    const avgFeedback: Record<string, number> = {};
    
    userData.forEach(interaction => {
      const { context, feedback } = interaction;
      
      context.categories.forEach((cat: string) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        avgFeedback[cat] = (avgFeedback[cat] || 0) + feedback;
      });
      
      complexityCounts[context.complexity] = (complexityCounts[context.complexity] || 0) + 1;
    });
    
    // Calculate averages
    Object.keys(avgFeedback).forEach(cat => {
      avgFeedback[cat] = avgFeedback[cat] / categoryCounts[cat];
    });
    
    return {
      favoriteCategories: Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([cat]) => cat),
      preferredComplexity: Object.entries(complexityCounts)
        .sort(([,a], [,b]) => b - a)[0][0],
      categoryRatings: avgFeedback
    };
  }

  // Generate personalized suggestions
  private static generatePersonalizedSuggestions(preferences: any, context: any): string[] {
    const suggestions: string[] = [];
    
    // Suggest based on favorite categories
    preferences.favoriteCategories.forEach((cat: string) => {
      if (!context.categories.includes(cat)) {
        suggestions.push(this.getCategorySuggestion(cat));
      }
    });
    
    // Suggest complexity variations
    if (context.complexity === 'simple') {
      suggestions.push('Try adding more details like "weekly planner with habit tracker and mood journal"');
    } else if (context.complexity === 'complex') {
      suggestions.push('Try a simpler version like "weekly planner" or "mood tracker"');
    }
    
    return suggestions.slice(0, 3);
  }

  // Get category-specific suggestions
  private static getCategorySuggestion(category: string): string {
    const suggestions: Record<string, string> = {
      productivity: 'Try "bullet journal weekly spread with habit tracker"',
      study: 'Try "Cornell note-taking system with mind map section"',
      creative: 'Try "mood tracker with gratitude journal and art space"',
      business: 'Try "meeting notes template with action items and agenda"',
      fitness: 'Try "workout and nutrition tracker with progress charts"'
    };
    
    return suggestions[category] || 'Try a different layout style';
  }

  // Get default suggestions
  private static getDefaultSuggestions(prompt: string): string[] {
    const context = this.extractContext(prompt);
    return this.generatePersonalizedSuggestions({ favoriteCategories: [], preferredComplexity: 'medium' }, context);
  }
}

// Unified Layout Generator
class UnifiedLayoutGenerator {
  // Generate layouts using all available methods
  static async generateLayouts(request: UnifiedRequest): Promise<UnifiedResponse['layouts']> {
    const { prompt, imageData, mode, paperStyle, userId, context } = request;
    
    // Step 1: Analyze the request
    const analysis = this.analyzeRequest(prompt, imageData, mode);
    
    // Step 2: Get personalized suggestions
    const suggestions = AILayoutTrainer.getPersonalizedSuggestions(userId || 'anonymous', prompt);
    
    // Step 3: Generate layouts based on mode
    let layouts: UnifiedResponse['layouts'] = [];
    
    switch (mode) {
      case 'prompt':
        layouts = await this.generateFromPrompt(prompt, paperStyle, analysis);
        break;
      case 'image':
        layouts = await this.generateFromImage(imageData!, paperStyle, analysis);
        break;
      case 'hybrid':
        layouts = await this.generateHybrid(prompt, imageData, paperStyle, analysis);
        break;
    }
    
    // Step 4: Apply personalization
    layouts = this.applyPersonalization(layouts, userId, context);
    
    // Step 5: Sort by confidence and relevance
    layouts = this.sortByRelevance(layouts, prompt, analysis);
    
    return layouts;
  }

  // Analyze the request
  private static analyzeRequest(prompt: string, imageData?: string, mode?: string) {
    const keywords = prompt.toLowerCase().split(' ').filter(word => word.length > 2);
    const categories = AILayoutTrainer['detectCategories'](keywords);
    const complexity = AILayoutTrainer['assessComplexity'](prompt);
    
    return {
      keywords,
      categories,
      complexity,
      hasImage: !!imageData,
      mode
    };
  }

  // Generate layouts from prompt only
  private static async generateFromPrompt(prompt: string, paperStyle: any, analysis: any): Promise<UnifiedResponse['layouts']> {
    const layouts: UnifiedResponse['layouts'] = [];
    
    // Get base patterns from database
    const patterns = await this.getLayoutPatterns(analysis.categories);
    
    // Generate variations
    patterns.forEach((pattern, index) => {
      const confidence = this.calculateConfidence(prompt, pattern, analysis);
      
      layouts.push({
        id: `prompt_${index}_${Date.now()}`,
        name: pattern.name,
        description: pattern.description,
        category: pattern.category,
        confidence,
        svgData: pattern.svgTemplate,
        editableElements: pattern.editableElements,
        metadata: {
          source: 'template',
          popularity: pattern.popularity,
          tags: pattern.tags,
          trainingData: { prompt, analysis }
        },
        analysis: {
          detectedContent: analysis.keywords,
          suggestedStyle: pattern.category,
          contentAreas: pattern.editableElements.length,
          complexity: analysis.complexity
        }
      });
    });
    
    // Generate custom layouts for complex prompts
    if (analysis.complexity === 'complex') {
      const customLayout = this.generateCustomLayout(prompt, paperStyle, analysis);
      layouts.push(customLayout);
    }
    
    return layouts;
  }

  // Generate layouts from image
  private static async generateFromImage(imageData: string, paperStyle: any, analysis: any): Promise<UnifiedResponse['layouts']> {
    // This would integrate with the existing image analysis system
    // For now, return a placeholder
    return [{
      id: `image_${Date.now()}`,
      name: 'AI Image Analysis',
      description: 'Layout generated from image analysis',
      category: 'generated',
      confidence: 0.8,
      svgData: this.generateImageBasedSVG(imageData, paperStyle),
      editableElements: [],
      metadata: {
        source: 'generated',
        popularity: 50,
        tags: ['image', 'analysis'],
        trainingData: { imageData, analysis }
      },
      analysis: {
        detectedContent: ['image'],
        suggestedStyle: 'generated',
        contentAreas: 1,
        complexity: 'medium'
      }
    }];
  }

  // Generate hybrid layouts
  private static async generateHybrid(prompt: string, imageData: string, paperStyle: any, analysis: any): Promise<UnifiedResponse['layouts']> {
    const promptLayouts = await this.generateFromPrompt(prompt, paperStyle, analysis);
    const imageLayouts = await this.generateFromImage(imageData, paperStyle, analysis);
    
    // Combine and enhance
    return [...promptLayouts, ...imageLayouts].map(layout => ({
      ...layout,
      metadata: {
        ...layout.metadata,
        source: 'hybrid' as const
      }
    }));
  }

  // Get layout patterns from database
  private static async getLayoutPatterns(categories: string[]) {
    // This would query the database
    // For now, return predefined patterns
    return this.getPredefinedPatterns(categories);
  }

  // Get predefined patterns (this would be replaced with database queries)
  private static getPredefinedPatterns(categories: string[]) {
    const allPatterns = [
      {
        name: "Bullet Journal Weekly Spread",
        description: "Classic bullet journal weekly layout with task tracking",
        category: "productivity",
        popularity: 95,
        tags: ["productivity", "weekly", "tasks", "bullet journal"],
        svgTemplate: this.generateBulletJournalSVG(),
        editableElements: this.getBulletJournalElements()
      },
      {
        name: "Mood Tracker & Journal",
        description: "Daily mood tracking with journaling space",
        category: "creative",
        popularity: 85,
        tags: ["mood", "journal", "wellness", "daily"],
        svgTemplate: this.generateMoodTrackerSVG(),
        editableElements: this.getMoodTrackerElements()
      },
      {
        name: "Cornell Note-Taking System",
        description: "Classic Cornell method for effective note-taking",
        category: "study",
        popularity: 90,
        tags: ["study", "notes", "cornell", "academic"],
        svgTemplate: this.generateCornellSVG(),
        editableElements: this.getCornellElements()
      }
    ];
    
    // Filter by categories
    if (categories.includes('general')) {
      return allPatterns;
    }
    
    return allPatterns.filter(pattern => 
      categories.some(cat => pattern.category === cat || pattern.tags.includes(cat))
    );
  }

  // Calculate confidence score
  private static calculateConfidence(prompt: string, pattern: any, analysis: any): number {
    let score = 0;
    const promptLower = prompt.toLowerCase();
    const patternText = `${pattern.name} ${pattern.description} ${pattern.tags.join(' ')}`.toLowerCase();
    
    // Keyword matching
    analysis.keywords.forEach((keyword: string) => {
      if (patternText.includes(keyword)) {
        score += 1;
      }
    });
    
    // Category matching
    if (analysis.categories.includes(pattern.category)) {
      score += 2;
    }
    
    // Popularity boost
    score += pattern.popularity / 100;
    
    // Normalize to 0-1
    return Math.min(score / 5, 1);
  }

  // Generate custom layout for complex prompts
  private static generateCustomLayout(prompt: string, paperStyle: any, analysis: any): UnifiedResponse['layouts'][0] {
    return {
      id: `custom_${Date.now()}`,
      name: "AI Custom Layout",
      description: `Custom layout generated for: ${prompt}`,
      category: "generated",
      confidence: 0.7,
      svgData: this.generateCustomSVG(prompt, paperStyle),
      editableElements: this.generateCustomElements(prompt, analysis),
      metadata: {
        source: 'generated',
        popularity: 60,
        tags: ['custom', 'ai-generated'],
        trainingData: { prompt, analysis }
      },
      analysis: {
        detectedContent: analysis.keywords,
        suggestedStyle: 'custom',
        contentAreas: Math.max(3, analysis.keywords.length),
        complexity: analysis.complexity
      }
    };
  }

  // Apply personalization
  private static applyPersonalization(layouts: UnifiedResponse['layouts'], userId?: string, context?: any): UnifiedResponse['layouts'] {
    // This would apply user-specific preferences
    return layouts;
  }

  // Sort by relevance
  private static sortByRelevance(layouts: UnifiedResponse['layouts'], prompt: string, analysis: any): UnifiedResponse['layouts'] {
    return layouts.sort((a, b) => b.confidence - a.confidence);
  }

  // SVG Generation Methods
  private static generateBulletJournalSVG(): string {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
      <rect width='100%' height='100%' fill='#FAF7F0'/>
      <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Weekly Spread</text>
      <rect x='50' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='125' y='90' font-size='16' fill='#666' text-anchor='middle'>Monday</text>
      <rect x='220' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='295' y='90' font-size='16' fill='#666' text-anchor='middle'>Tuesday</text>
      <rect x='390' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='465' y='90' font-size='16' fill='#666' text-anchor='middle'>Wednesday</text>
      <rect x='560' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='635' y='90' font-size='16' fill='#666' text-anchor='middle'>Thursday</text>
      <rect x='730' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='805' y='90' font-size='16' fill='#666' text-anchor='middle'>Friday</text>
      <rect x='900' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='975' y='90' font-size='16' fill='#666' text-anchor='middle'>Saturday</text>
      <rect x='1070' y='70' width='150' height='200' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='1145' y='90' font-size='16' fill='#666' text-anchor='middle'>Sunday</text>
      <rect x='50' y='290' width='1170' height='150' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='60' y='310' font-size='14' fill='#666'>Weekly Notes</text>
      <rect x='50' y='460' width='1170' height='100' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='60' y='480' font-size='14' fill='#666'>Weekly Goals</text>
    </svg>`;
  }

  private static generateMoodTrackerSVG(): string {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
      <rect width='100%' height='100%' fill='#FFF9F0'/>
      <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Daily Mood & Journal</text>
      <rect x='50' y='70' width='800' height='300' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='60' y='90' font-size='14' fill='#666'>How are you feeling today?</text>
      <rect x='50' y='390' width='400' height='150' fill='#E8F5E8' stroke='#E5E5E5' stroke-width='2'/>
      <text x='60' y='410' font-size='14' fill='#666'>Three things I'm grateful for...</text>
      <rect x='470' y='390' width='380' height='150' fill='#E8F0FF' stroke='#E5E5E5' stroke-width='2'/>
      <text x='480' y='410' font-size='14' fill='#666'>Today's goals...</text>
      <rect x='50' y='560' width='100' height='30' fill='none' stroke='#E5E5E5' stroke-width='1'/>
      <text x='60' y='580' font-size='12' fill='#666'>Sleep (hrs)</text>
      <rect x='200' y='560' width='100' height='30' fill='none' stroke='#E5E5E5' stroke-width='1'/>
      <text x='210' y='580' font-size='12' fill='#666'>Water (glasses)</text>
      <rect x='350' y='560' width='100' height='30' fill='none' stroke='#E5E5E5' stroke-width='1'/>
      <text x='360' y='580' font-size='12' fill='#666'>Exercise</text>
    </svg>`;
  }

  private static generateCornellSVG(): string {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
      <rect width='100%' height='100%' fill='#FFFFFF'/>
      <text x='50' y='25' font-size='18' fill='#2C2C2C' font-weight='bold'>Cornell Note-Taking System</text>
      <rect x='50' y='70' width='800' height='400' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='60' y='90' font-size='14' fill='#666'>Main Notes</text>
      <rect x='870' y='70' width='200' height='400' fill='#F8F9FA' stroke='#E5E5E5' stroke-width='2'/>
      <text x='880' y='90' font-size='14' fill='#666'>Cues & Questions</text>
      <rect x='50' y='490' width='1020' height='100' fill='#F8F9FA' stroke='#E5E5E5' stroke-width='2'/>
      <text x='60' y='510' font-size='14' fill='#666'>Summary</text>
    </svg>`;
  }

  private static generateCustomSVG(prompt: string, paperStyle: any): string {
    // Generate a custom SVG based on the prompt
    return `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
      <rect width='100%' height='100%' fill='#FFFFFF'/>
      <text x='50' y='25' font-size='20' fill='#2C2C2C' font-weight='bold'>Custom Layout</text>
      <text x='50' y='50' font-size='14' fill='#666'>Generated for: ${prompt}</text>
      <rect x='50' y='80' width='1100' height='500' fill='none' stroke='#E5E5E5' stroke-width='2'/>
      <text x='60' y='100' font-size='14' fill='#666'>Your custom layout will be generated here</text>
    </svg>`;
  }

  private static generateImageBasedSVG(imageData: string, paperStyle: any): string {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
      <rect width='100%' height='100%' fill='#FFFFFF'/>
      <image href='${imageData}' x='0' y='0' width='100%' height='100%' preserveAspectRatio='xMidYMid meet'/>
    </svg>`;
  }

  // Element Generation Methods
  private static getBulletJournalElements(): EditableElement[] {
    return [
      { id: "week-title", type: "text", x: 50, y: 30, width: 200, height: 30, placeholder: "Week of..." },
      { id: "monday-tasks", type: "textarea", x: 50, y: 80, width: 150, height: 180, placeholder: "Monday tasks..." },
      { id: "tuesday-tasks", type: "textarea", x: 220, y: 80, width: 150, height: 180, placeholder: "Tuesday tasks..." },
      { id: "wednesday-tasks", type: "textarea", x: 390, y: 80, width: 150, height: 180, placeholder: "Wednesday tasks..." },
      { id: "thursday-tasks", type: "textarea", x: 560, y: 80, width: 150, height: 180, placeholder: "Thursday tasks..." },
      { id: "friday-tasks", type: "textarea", x: 730, y: 80, width: 150, height: 180, placeholder: "Friday tasks..." },
      { id: "saturday-tasks", type: "textarea", x: 900, y: 80, width: 150, height: 180, placeholder: "Saturday tasks..." },
      { id: "sunday-tasks", type: "textarea", x: 1070, y: 80, width: 150, height: 180, placeholder: "Sunday tasks..." },
      { id: "notes", type: "textarea", x: 50, y: 300, width: 1170, height: 140, placeholder: "Weekly notes..." },
      { id: "goals", type: "textarea", x: 50, y: 460, width: 1170, height: 80, placeholder: "Weekly goals..." }
    ];
  }

  private static getMoodTrackerElements(): EditableElement[] {
    return [
      { id: "date", type: "date", x: 50, y: 30, width: 150, height: 30 },
      { id: "mood-rating", type: "select", x: 250, y: 30, width: 200, height: 30, options: ["😢", "😔", "😐", "😊", "😄"] },
      { id: "journal", type: "textarea", x: 50, y: 80, width: 800, height: 280, placeholder: "How are you feeling today?" },
      { id: "gratitude", type: "textarea", x: 50, y: 380, width: 400, height: 140, placeholder: "Three things I'm grateful for..." },
      { id: "goals", type: "textarea", x: 470, y: 380, width: 380, height: 140, placeholder: "Today's goals..." },
      { id: "sleep-hours", type: "number", x: 50, y: 540, width: 100, height: 30, placeholder: "8" },
      { id: "water-glasses", type: "number", x: 200, y: 540, width: 100, height: 30, placeholder: "8" },
      { id: "exercise", type: "checkbox", x: 350, y: 540, width: 20, height: 20 }
    ];
  }

  private static getCornellElements(): EditableElement[] {
    return [
      { id: "topic", type: "text", x: 50, y: 30, width: 300, height: 30, placeholder: "Topic: " },
      { id: "date", type: "date", x: 400, y: 30, width: 150, height: 30 },
      { id: "notes", type: "textarea", x: 50, y: 80, width: 800, height: 380, placeholder: "Main notes..." },
      { id: "cues", type: "textarea", x: 870, y: 80, width: 200, height: 380, placeholder: "Cues & Questions..." },
      { id: "summary", type: "textarea", x: 50, y: 480, width: 1020, height: 100, placeholder: "Summary..." }
    ];
  }

  private static generateCustomElements(prompt: string, analysis: any): EditableElement[] {
    // Generate elements based on prompt analysis
    const elements: EditableElement[] = [];
    let y = 80;
    
    analysis.keywords.forEach((keyword: string, index: number) => {
      elements.push({
        id: `custom-${index}`,
        type: "textarea",
        x: 50,
        y: y + (index * 100),
        width: 1100,
        height: 80,
        placeholder: `${keyword} section...`
      });
    });
    
    return elements;
  }
}

// Main API Handler
export async function POST(request: Request): Promise<Response> {
  try {
    const startTime = Date.now();
    
    // Validate NLP configuration
    const nlpConfig = getNLPConfig();
    const configValidation = validateNLPConfig(nlpConfig);
    
    if (!configValidation.valid) {
      console.warn('NLP configuration issues:', configValidation.errors);
    }
    
    // Handle both JSON and FormData requests
    let body: UnifiedRequest;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await request.formData();
      body = {
        prompt: formData.get('prompt') as string || '',
        mode: (formData.get('mode') as any) || 'prompt',
        paperStyle: JSON.parse(formData.get('paperStyle') as string || '{}'),
        userId: formData.get('userId') as string || undefined,
        imageData: formData.get('image') ? 'data:image/jpeg;base64,' + Buffer.from(await (formData.get('image') as File).arrayBuffer()).toString('base64') : undefined
      };
    } else {
      // Handle JSON
      body = await request.json();
    }
    
    if (!body.prompt && !body.imageData) {
      return NextResponse.json({
        success: false,
        error: 'Either prompt or imageData is required'
      }, { status: 400 });
    }

    // Use Advanced NLP System if OpenAI is configured
    if (nlpConfig.openai.apiKey && body.prompt) {
      try {
        const nlpRequest: NLPLayoutRequest = {
          prompt: body.prompt,
          userId: body.userId,
          context: {
            previousLayouts: body.context?.previousLayouts,
            preferences: body.context?.preferences,
            category: body.context?.category
          },
          options: {
            maxResults: 5,
            includeAlternatives: true,
            learningMode: true,
            personalizationLevel: 'medium'
          }
        };

        const nlpResponse = await nlpLayoutService.generateLayouts(nlpRequest);
        
        if (nlpResponse.success && nlpResponse.layouts.length > 0) {
          // Convert NLP response to unified response format
          const unifiedLayouts = nlpResponse.layouts.map(layout => ({
            id: layout.id,
            name: layout.name,
            description: layout.description,
            category: layout.category,
            confidence: layout.metadata.confidence,
            svgData: layout.svgData,
            editableElements: layout.editableElements,
            metadata: {
              source: 'nlp_generated' as const,
              popularity: 0,
              tags: [layout.category],
              trainingData: layout.personalization.learningInsights
            },
            analysis: {
              detectedContent: [layout.category],
              suggestedStyle: layout.context.domainContext,
              contentAreas: layout.editableElements.length,
              complexity: layout.metadata.confidence > 0.8 ? 'complex' as const : 
                         layout.metadata.confidence > 0.6 ? 'medium' as const : 'simple' as const
            }
          }));

          return NextResponse.json({
            success: true,
            layouts: unifiedLayouts,
            suggestions: nlpResponse.suggestions.map(s => s.layoutType),
            learning: {
              improved: true,
              newPatterns: [nlpResponse.insights.intentAnalysis.primaryIntent],
              userFeedback: nlpResponse.insights.recommendations.join(', ')
            },
            processingTime: Date.now() - startTime,
            nlpInsights: {
              intentAnalysis: nlpResponse.insights.intentAnalysis,
              userPatterns: nlpResponse.insights.userPatterns,
              recommendations: nlpResponse.insights.recommendations,
              confidence: nlpResponse.metadata.confidence
            }
          });
        }
      } catch (nlpError) {
        console.error('NLP processing failed, falling back to legacy system:', nlpError);
        // Fall through to legacy system
      }
    }
    
    // Generate layouts using unified system
    const layouts = await UnifiedLayoutGenerator.generateLayouts(body);
    
    // Get personalized suggestions
    const suggestions = AILayoutTrainer.getPersonalizedSuggestions(
      body.userId || 'anonymous', 
      body.prompt || ''
    );
    
    // Check for learning improvements
    const learning = {
      improved: layouts.some(l => l.confidence > 0.8),
      newPatterns: layouts.filter(l => l.metadata.source === 'generated').map(l => l.name)
    };
    
    const response: UnifiedResponse = {
      success: true,
      layouts,
      suggestions,
      learning,
      processingTime: Date.now() - startTime
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unified AI Layout API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process layout request'
    }, { status: 500 });
  }
}

// Learning endpoint for user feedback
export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { userId, prompt, selectedLayout, feedback } = body;
    
    // Learn from user interaction
    AILayoutTrainer.learnFromUser(userId, prompt, selectedLayout, feedback);
    
    return NextResponse.json({
      success: true,
      message: 'Learning data updated'
    });
    
  } catch (error) {
    console.error('Learning API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update learning data'
    }, { status: 500 });
  }
}
