/**
 * Advanced Natural Language Processing System for AI Layout Generation
 * 
 * This system provides:
 * - Semantic intent understanding
 * - Context-aware layout generation
 * - Emotional tone detection
 * - Complexity assessment
 * - Multi-language support
 */

import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export interface ParsedIntent {
  primaryIntent: 'planning' | 'tracking' | 'creative' | 'study' | 'business' | 'fitness' | 'journal' | 'general';
  secondaryIntents: string[];
  complexity: 'simple' | 'medium' | 'complex';
  context: {
    timeFrame?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'ongoing';
    domain?: string;
    urgency?: 'low' | 'medium' | 'high';
    collaboration?: boolean;
  };
  emotionalTone: 'professional' | 'casual' | 'creative' | 'academic' | 'personal';
  entities: {
    dates?: string[];
    topics?: string[];
    people?: string[];
    locations?: string[];
    numbers?: string[];
  };
  layoutRequirements: {
    structure: 'linear' | 'grid' | 'hierarchical' | 'freeform';
    elements: string[];
    interactivity: 'low' | 'medium' | 'high';
    visualStyle: 'minimal' | 'detailed' | 'colorful' | 'professional';
  };
  confidence: number;
}

export interface ContextualSuggestion {
  layoutType: string;
  reasoning: string;
  confidence: number;
  alternatives: string[];
}

export class AdvancedPromptProcessor {
  private static cache: Map<string, ParsedIntent> = new Map();
  private static userHistory: Map<string, any[]> = new Map();

  /**
   * Main entry point for prompt processing
   */
  static async processPrompt(
    prompt: string, 
    userId?: string, 
    context?: any
  ): Promise<ParsedIntent> {
    // Check cache first
    const cacheKey = `${prompt.toLowerCase()}_${userId || 'anonymous'}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Use OpenAI for advanced NLP processing
      const parsedIntent = await this.analyzeWithOpenAI(prompt, userId, context);
      
      // Cache the result
      this.cache.set(cacheKey, parsedIntent);
      
      // Store in user history for learning
      if (userId) {
        this.updateUserHistory(userId, prompt, parsedIntent);
      }
      
      return parsedIntent;
    } catch (error) {
      console.error('OpenAI processing failed, falling back to rule-based:', error);
      const fallbackResult = this.fallbackProcessing(prompt);
      
      // Cache the fallback result
      this.cache.set(cacheKey, fallbackResult);
      
      return fallbackResult;
    }
  }

  /**
   * Advanced analysis using OpenAI GPT-4
   */
  private static async analyzeWithOpenAI(
    prompt: string, 
    userId?: string, 
    context?: any
  ): Promise<ParsedIntent> {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI client not available - no API key provided');
    }

    const systemPrompt = `You are an expert AI assistant that analyzes user prompts for notebook layout generation. 
    
    Your task is to understand the user's intent and provide detailed analysis for creating the perfect notebook layout.
    
    Consider:
    - What the user wants to accomplish
    - The complexity and scope of their request
    - The emotional tone and context
    - Specific entities mentioned
    - Layout requirements and preferences
    
    Respond with a JSON object containing the analysis.`;

    const userPrompt = `Analyze this prompt for notebook layout generation: "${prompt}"
    
    ${userId ? `User ID: ${userId}` : ''}
    ${context ? `Additional context: ${JSON.stringify(context)}` : ''}
    
    Provide a comprehensive analysis including:
    1. Primary intent (planning, tracking, creative, study, business, fitness, journal, general)
    2. Secondary intents
    3. Complexity level (simple, medium, complex)
    4. Context (timeframe, domain, urgency, collaboration)
    5. Emotional tone (professional, casual, creative, academic, personal)
    6. Entities (dates, topics, people, locations, numbers)
    7. Layout requirements (structure, elements, interactivity, visual style)
    8. Confidence score (0-1)`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const rawResponse = JSON.parse(content);
      
      // Transform the response to match our interface
      // Handle various field name formats (spaces, underscores, camelCase)
      const analysis = rawResponse.Analysis || rawResponse.analysis || {};
      
      const parsedResult: ParsedIntent = {
        primaryIntent: analysis['Primary Intent'] || analysis.PrimaryIntent || analysis.primary_intent || 'general',
        secondaryIntents: analysis['Secondary Intents'] || analysis.SecondaryIntents || analysis.secondary_intents || [],
        complexity: analysis['Complexity Level'] || analysis.ComplexityLevel || analysis.complexity_level || 'medium',
        context: {
          timeFrame: analysis.Context?.['Timeframe'] || analysis.Context?.Timeframe || analysis.context?.timeframe || 'ongoing',
          domain: analysis.Context?.['Domain'] || analysis.Context?.Domain || analysis.context?.domain || '',
          urgency: analysis.Context?.['Urgency'] || analysis.Context?.Urgency || analysis.context?.urgency || 'medium',
          collaboration: (analysis.Context?.['Collaboration'] || analysis.Context?.Collaboration || analysis.context?.collaboration) === 'collaborative'
        },
        emotionalTone: analysis['Emotional Tone'] || analysis.EmotionalTone || analysis.emotional_tone || 'casual',
        entities: {
          dates: analysis.Entities?.['Dates'] ? [analysis.Entities['Dates']] : (analysis.Entities?.Dates ? [analysis.Entities.Dates] : (analysis.entities?.dates ? [analysis.entities.dates] : [])),
          topics: analysis.Entities?.['Topics'] ? [analysis.Entities['Topics']] : (analysis.Entities?.Topics ? [analysis.Entities.Topics] : (analysis.entities?.topics ? [analysis.entities.topics] : [])),
          people: analysis.Entities?.['People'] ? [analysis.Entities['People']] : (analysis.Entities?.People ? [analysis.Entities.People] : (analysis.entities?.people ? [analysis.entities.people] : [])),
          locations: analysis.Entities?.['Locations'] ? [analysis.Entities['Locations']] : (analysis.Entities?.Locations ? [analysis.Entities.Locations] : (analysis.entities?.locations ? [analysis.entities.locations] : [])),
          numbers: analysis.Entities?.['Numbers'] ? [analysis.Entities['Numbers']] : (analysis.Entities?.Numbers ? [analysis.Entities.Numbers] : (analysis.entities?.numbers ? [analysis.entities.numbers] : []))
        },
        layoutRequirements: {
          structure: analysis['Layout Requirements']?.['Structure'] || analysis.LayoutRequirements?.Structure || analysis.layout_requirements?.structure || 'linear',
          elements: analysis['Layout Requirements']?.['Elements'] || analysis.LayoutRequirements?.Elements || analysis.layout_requirements?.elements || [],
          interactivity: analysis['Layout Requirements']?.['Interactivity'] || analysis.LayoutRequirements?.Interactivity || analysis.layout_requirements?.interactivity || 'medium',
          visualStyle: analysis['Layout Requirements']?.['Visual Style'] || analysis.LayoutRequirements?.VisualStyle || analysis.layout_requirements?.visual_style || 'minimal'
        },
        confidence: analysis['Confidence Score'] || analysis.ConfidenceScore || analysis.confidence_score || 0.5
      };
      
      return parsedResult;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid response format from OpenAI');
    }
  }

  /**
   * Fallback rule-based processing when OpenAI is unavailable
   */
  private static fallbackProcessing(prompt: string): ParsedIntent {
    const words = prompt.toLowerCase().split(/\s+/);
    
    // Intent detection
    const intentKeywords = {
      planning: ['plan', 'schedule', 'organize', 'arrange', 'prepare', 'weekly', 'daily', 'monthly'],
      tracking: ['track', 'monitor', 'log', 'record', 'progress', 'habit', 'goal'],
      creative: ['creative', 'art', 'draw', 'sketch', 'design', 'brainstorm', 'ideas'],
      study: ['study', 'learn', 'notes', 'academic', 'exam', 'course', 'research'],
      business: ['meeting', 'agenda', 'project', 'business', 'professional', 'work'],
      fitness: ['workout', 'exercise', 'fitness', 'health', 'nutrition', 'training'],
      journal: ['journal', 'diary', 'mood', 'reflection', 'personal', 'thoughts']
    };

    let primaryIntent: ParsedIntent['primaryIntent'] = 'general';
    let maxMatches = 0;

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      const matches = keywords.filter(keyword => 
        words.some(word => word.includes(keyword) || keyword.includes(word))
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        primaryIntent = intent as ParsedIntent['primaryIntent'];
      }
    }

    // Complexity assessment
    const complexity = this.assessComplexity(prompt);
    
    // Emotional tone detection
    const emotionalTone = this.detectEmotionalTone(prompt);
    
    // Context extraction
    const context = this.extractContext(prompt);
    
    // Entities extraction
    const entities = this.extractEntities(prompt);
    
    // Layout requirements
    const layoutRequirements = this.inferLayoutRequirements(primaryIntent, complexity, emotionalTone);

    return {
      primaryIntent,
      secondaryIntents: [],
      complexity,
      context,
      emotionalTone,
      entities,
      layoutRequirements,
      confidence: maxMatches > 0 ? 0.7 : 0.3
    };
  }

  /**
   * Assess prompt complexity
   */
  private static assessComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const words = prompt.split(/\s+/).length;
    const hasMultipleConcepts = /and|with|\+|plus|also|additionally/i.test(prompt);
    const hasSpecificRequirements = /specific|detailed|comprehensive|thorough/i.test(prompt);
    
    if (words <= 3 && !hasMultipleConcepts) return 'simple';
    if (words <= 8 && !hasMultipleConcepts && !hasSpecificRequirements) return 'medium';
    return 'complex';
  }

  /**
   * Detect emotional tone
   */
  private static detectEmotionalTone(prompt: string): ParsedIntent['emotionalTone'] {
    const professionalWords = ['meeting', 'business', 'professional', 'work', 'project', 'agenda'];
    const casualWords = ['fun', 'cool', 'awesome', 'nice', 'simple', 'easy'];
    const creativeWords = ['creative', 'art', 'design', 'beautiful', 'colorful', 'inspiring'];
    const academicWords = ['study', 'research', 'academic', 'course', 'exam', 'learning'];
    const personalWords = ['personal', 'diary', 'journal', 'mood', 'thoughts', 'reflection'];

    const lowerPrompt = prompt.toLowerCase();
    
    if (professionalWords.some(word => lowerPrompt.includes(word))) return 'professional';
    if (casualWords.some(word => lowerPrompt.includes(word))) return 'casual';
    if (creativeWords.some(word => lowerPrompt.includes(word))) return 'creative';
    if (academicWords.some(word => lowerPrompt.includes(word))) return 'academic';
    if (personalWords.some(word => lowerPrompt.includes(word))) return 'personal';
    
    return 'casual';
  }

  /**
   * Extract context information
   */
  private static extractContext(prompt: string): ParsedIntent['context'] {
    const context: ParsedIntent['context'] = {};
    
    // Time frame detection
    if (/daily|day|today/i.test(prompt)) context.timeFrame = 'daily';
    else if (/weekly|week/i.test(prompt)) context.timeFrame = 'weekly';
    else if (/monthly|month/i.test(prompt)) context.timeFrame = 'monthly';
    else if (/yearly|year/i.test(prompt)) context.timeFrame = 'yearly';
    else context.timeFrame = 'ongoing';
    
    // Urgency detection
    if (/urgent|asap|immediately|quick/i.test(prompt)) context.urgency = 'high';
    else if (/soon|later|eventually/i.test(prompt)) context.urgency = 'low';
    else context.urgency = 'medium';
    
    // Collaboration detection
    context.collaboration = /team|group|together|collaborate|share/i.test(prompt);
    
    return context;
  }

  /**
   * Extract entities from prompt
   */
  private static extractEntities(prompt: string): ParsedIntent['entities'] {
    const entities: ParsedIntent['entities'] = {};
    
    // Date extraction (simple regex)
    const dateRegex = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}|today|tomorrow|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi;
    const dates = prompt.match(dateRegex);
    if (dates) entities.dates = dates;
    
    // Number extraction
    const numberRegex = /\b\d+\b/g;
    const numbers = prompt.match(numberRegex);
    if (numbers) entities.numbers = numbers;
    
    // Topic extraction (capitalized words, common topics)
    const topicWords = prompt.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    if (topicWords) entities.topics = topicWords;
    
    return entities;
  }

  /**
   * Infer layout requirements based on intent and context
   */
  private static inferLayoutRequirements(
    intent: ParsedIntent['primaryIntent'],
    complexity: ParsedIntent['complexity'],
    tone: ParsedIntent['emotionalTone']
  ): ParsedIntent['layoutRequirements'] {
    const requirements: ParsedIntent['layoutRequirements'] = {
      structure: 'linear',
      elements: [],
      interactivity: 'medium',
      visualStyle: 'minimal'
    };

    // Structure based on intent
    switch (intent) {
      case 'planning':
        requirements.structure = 'grid';
        requirements.elements = ['calendar', 'tasks', 'notes'];
        break;
      case 'tracking':
        requirements.structure = 'hierarchical';
        requirements.elements = ['progress', 'metrics', 'goals'];
        break;
      case 'creative':
        requirements.structure = 'freeform';
        requirements.elements = ['canvas', 'notes', 'inspiration'];
        break;
      case 'study':
        requirements.structure = 'hierarchical';
        requirements.elements = ['notes', 'questions', 'summary'];
        break;
    }

    // Interactivity based on complexity
    if (complexity === 'complex') requirements.interactivity = 'high';
    else if (complexity === 'simple') requirements.interactivity = 'low';

    // Visual style based on tone
    if (tone === 'creative') requirements.visualStyle = 'colorful';
    else if (tone === 'professional') requirements.visualStyle = 'professional';
    else if (tone === 'academic') requirements.visualStyle = 'detailed';

    return requirements;
  }

  /**
   * Generate contextual suggestions based on parsed intent
   */
  static async generateContextualSuggestions(
    intent: ParsedIntent,
    userId?: string
  ): Promise<ContextualSuggestion[]> {
    const suggestions: ContextualSuggestion[] = [];
    
    // Get user history for personalization
    const userHistory = userId ? this.userHistory.get(userId) || [] : [];
    
    // Generate suggestions based on intent
    switch (intent.primaryIntent) {
      case 'planning':
        suggestions.push({
          layoutType: 'Weekly Planner',
          reasoning: 'Perfect for organizing tasks and events over time',
          confidence: 0.9,
          alternatives: ['Daily Planner', 'Monthly Overview', 'Project Timeline']
        });
        break;
      case 'tracking':
        suggestions.push({
          layoutType: 'Habit Tracker',
          reasoning: 'Ideal for monitoring progress and building consistency',
          confidence: 0.85,
          alternatives: ['Goal Tracker', 'Progress Dashboard', 'Mood Tracker']
        });
        break;
      case 'creative':
        suggestions.push({
          layoutType: 'Creative Journal',
          reasoning: 'Designed for brainstorming and artistic expression',
          confidence: 0.8,
          alternatives: ['Mind Map', 'Sketch Pad', 'Idea Board']
        });
        break;
      case 'study':
        suggestions.push({
          layoutType: 'Cornell Notes',
          reasoning: 'Proven method for effective learning and retention',
          confidence: 0.9,
          alternatives: ['Concept Map', 'Study Guide', 'Flash Cards']
        });
        break;
    }

    // Personalize based on user history
    if (userHistory.length > 0) {
      const userPreferences = this.analyzeUserPreferences(userHistory);
      suggestions.forEach(suggestion => {
        if (userPreferences.preferredLayouts.includes(suggestion.layoutType)) {
          suggestion.confidence += 0.1;
        }
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Update user history for learning
   */
  private static updateUserHistory(userId: string, prompt: string, intent: ParsedIntent) {
    if (!this.userHistory.has(userId)) {
      this.userHistory.set(userId, []);
    }
    
    const history = this.userHistory.get(userId)!;
    history.push({
      prompt,
      intent,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 interactions
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
  }

  /**
   * Analyze user preferences from history
   */
  private static analyzeUserPreferences(history: any[]) {
    const preferences = {
      preferredIntents: [] as string[],
      preferredLayouts: [] as string[],
      averageComplexity: 'medium' as string,
      preferredTone: 'casual' as string
    };

    // Analyze intent preferences
    const intentCounts: Record<string, number> = {};
    const layoutCounts: Record<string, number> = {};
    const complexityCounts: Record<string, number> = {};
    const toneCounts: Record<string, number> = {};

    history.forEach(entry => {
      const { intent } = entry;
      
      intentCounts[intent.primaryIntent] = (intentCounts[intent.primaryIntent] || 0) + 1;
      complexityCounts[intent.complexity] = (complexityCounts[intent.complexity] || 0) + 1;
      toneCounts[intent.emotionalTone] = (toneCounts[intent.emotionalTone] || 0) + 1;
    });

    // Get most common preferences
    preferences.preferredIntents = Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([intent]) => intent);

    preferences.averageComplexity = Object.entries(complexityCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'medium';

    preferences.preferredTone = Object.entries(toneCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'casual';

    return preferences;
  }

  /**
   * Clear cache (useful for testing or memory management)
   */
  static clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return {
      size: this.cache.size,
      userCount: this.userHistory.size
    };
  }
}
