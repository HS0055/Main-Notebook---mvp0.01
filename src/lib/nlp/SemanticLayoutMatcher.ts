/**
 * Semantic Layout Matcher for AI Layout Generation
 * 
 * This system provides:
 * - Semantic similarity matching between prompts and layouts
 * - Context-aware layout retrieval
 * - Multi-dimensional scoring
 * - Learning from user feedback
 */

import { ParsedIntent } from './AdvancedPromptProcessor';

export interface LayoutMatch {
  layoutId: string;
  name: string;
  category: string;
  description: string;
  svgTemplate: string;
  editableElements: any[];
  similarityScore: number;
  confidenceScore: number;
  reasoning: string;
  tags: string[];
  popularity: number;
}

export interface SemanticSearchResult {
  matches: LayoutMatch[];
  totalMatches: number;
  searchTime: number;
  suggestions: string[];
  alternativeQueries: string[];
}

export class SemanticLayoutMatcher {
  private static layoutEmbeddings: Map<string, number[]> = new Map();
  private static userFeedback: Map<string, number> = new Map();
  private static searchHistory: Map<string, any[]> = new Map();

  /**
   * Find semantically similar layouts based on parsed intent
   */
  static async findSimilarLayouts(
    intent: ParsedIntent,
    userId?: string,
    limit: number = 10
  ): Promise<SemanticSearchResult> {
    const startTime = Date.now();
    
    try {
      // Get all available layouts from database
      const allLayouts = await this.getAllLayouts();
      
      // Calculate semantic similarity for each layout
      const matches = await Promise.all(
        allLayouts.map(async (layout) => {
          const similarityScore = await this.calculateSemanticSimilarity(intent, layout);
          const confidenceScore = this.calculateConfidenceScore(intent, layout, similarityScore);
          const reasoning = this.generateReasoning(intent, layout, similarityScore);
          
          return {
            layoutId: layout.id.toString(),
            name: layout.name,
            category: layout.category,
            description: layout.description,
            svgTemplate: layout.svgTemplate,
            editableElements: layout.editableElements,
            similarityScore,
            confidenceScore,
            reasoning,
            tags: layout.tags,
            popularity: layout.popularity
          } as LayoutMatch;
        })
      );

      // Sort by combined score (similarity + confidence + popularity)
      const sortedMatches = matches
        .filter(match => match.similarityScore > 0.3) // Filter out very low similarity
        .sort((a, b) => {
          const scoreA = this.calculateCombinedScore(a, userId);
          const scoreB = this.calculateCombinedScore(b, userId);
          return scoreB - scoreA;
        })
        .slice(0, limit);

      // Generate suggestions and alternative queries
      const suggestions = this.generateSuggestions(intent, sortedMatches);
      const alternativeQueries = this.generateAlternativeQueries(intent);

      // Store search history for learning
      if (userId) {
        this.storeSearchHistory(userId, intent, sortedMatches);
      }

      return {
        matches: sortedMatches,
        totalMatches: sortedMatches.length,
        searchTime: Date.now() - startTime,
        suggestions,
        alternativeQueries
      };

    } catch (error) {
      console.error('Error in semantic layout matching:', error);
      return {
        matches: [],
        totalMatches: 0,
        searchTime: Date.now() - startTime,
        suggestions: [],
        alternativeQueries: []
      };
    }
  }

  /**
   * Calculate semantic similarity between intent and layout
   */
  private static async calculateSemanticSimilarity(
    intent: ParsedIntent,
    layout: any
  ): Promise<number> {
    let similarityScore = 0;
    let totalWeight = 0;

    // 1. Intent-Category Matching (40% weight)
    const categoryMatch = this.matchIntentToCategory(intent.primaryIntent, layout.category);
    similarityScore += categoryMatch * 0.4;
    totalWeight += 0.4;

    // 2. Keyword Similarity (25% weight)
    const keywordSimilarity = this.calculateKeywordSimilarity(intent, layout);
    similarityScore += keywordSimilarity * 0.25;
    totalWeight += 0.25;

    // 3. Complexity Matching (15% weight)
    const complexityMatch = this.matchComplexity(intent.complexity, layout);
    similarityScore += complexityMatch * 0.15;
    totalWeight += 0.15;

    // 4. Emotional Tone Matching (10% weight)
    const toneMatch = this.matchEmotionalTone(intent.emotionalTone, layout);
    similarityScore += toneMatch * 0.1;
    totalWeight += 0.1;

    // 5. Layout Requirements Matching (10% weight)
    const requirementsMatch = this.matchLayoutRequirements(intent.layoutRequirements, layout);
    similarityScore += requirementsMatch * 0.1;
    totalWeight += 0.1;

    return totalWeight > 0 ? similarityScore / totalWeight : 0;
  }

  /**
   * Match intent to layout category
   */
  private static matchIntentToCategory(intent: string, category: string): number {
    const intentCategoryMap: Record<string, string[]> = {
      planning: ['productivity', 'business'],
      tracking: ['productivity', 'fitness', 'study'],
      creative: ['creative'],
      study: ['study', 'academic'],
      business: ['business', 'productivity'],
      fitness: ['fitness', 'health'],
      journal: ['creative', 'personal'],
      general: ['productivity', 'study', 'creative']
    };

    const mappedCategories = intentCategoryMap[intent] || ['general'];
    return mappedCategories.includes(category) ? 1.0 : 0.3;
  }

  /**
   * Calculate keyword similarity using multiple methods
   */
  private static calculateKeywordSimilarity(intent: ParsedIntent, layout: any): number {
    // Extract keywords from intent entities and context
    const intentKeywords = [
      ...(intent.entities.topics || []),
      ...(intent.entities.dates || []),
      ...(intent.secondaryIntents || []),
      intent.context.domain || '',
      intent.context.timeFrame || ''
    ].filter(Boolean).map(k => String(k).toLowerCase());

    // Get layout keywords
    const layoutKeywords = [
      ...(layout.keywords || []),
      ...(layout.tags || []),
      layout.name.toLowerCase(),
      layout.description.toLowerCase()
    ].filter(Boolean);

    // Calculate Jaccard similarity
    const intentSet = new Set(intentKeywords);
    const layoutSet = new Set(layoutKeywords);
    
    const intersection = new Set([...intentSet].filter(x => layoutSet.has(x)));
    const union = new Set([...intentSet, ...layoutSet]);
    
    const jaccardSimilarity = intersection.size / union.size;

    // Calculate semantic similarity using word embeddings (simplified)
    const semanticSimilarity = this.calculateWordEmbeddingSimilarity(intentKeywords, layoutKeywords);

    // Combine both methods
    return (jaccardSimilarity * 0.6) + (semanticSimilarity * 0.4);
  }

  /**
   * Simplified word embedding similarity calculation
   */
  private static calculateWordEmbeddingSimilarity(intentWords: string[], layoutWords: string[]): number {
    // This is a simplified version - in production, you'd use actual word embeddings
    const semanticGroups = {
      time: ['daily', 'weekly', 'monthly', 'yearly', 'today', 'tomorrow', 'schedule'],
      planning: ['plan', 'organize', 'schedule', 'arrange', 'prepare', 'goal'],
      tracking: ['track', 'monitor', 'log', 'record', 'progress', 'habit'],
      creative: ['creative', 'art', 'design', 'draw', 'sketch', 'brainstorm'],
      study: ['study', 'learn', 'notes', 'academic', 'research', 'exam'],
      business: ['meeting', 'agenda', 'project', 'professional', 'work'],
      fitness: ['workout', 'exercise', 'fitness', 'health', 'nutrition']
    };

    let totalSimilarity = 0;
    let comparisons = 0;

    for (const intentWord of intentWords) {
      for (const layoutWord of layoutWords) {
        // Check if words are in the same semantic group
        for (const [group, words] of Object.entries(semanticGroups)) {
          if (words.includes(intentWord) && words.includes(layoutWord)) {
            totalSimilarity += 1.0;
            comparisons++;
            break;
          }
        }
        
        // Check for partial matches
        if (intentWord.includes(layoutWord) || layoutWord.includes(intentWord)) {
          totalSimilarity += 0.5;
          comparisons++;
        }
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  /**
   * Match complexity levels
   */
  private static matchComplexity(intentComplexity: string, layout: any): number {
    // Infer layout complexity from number of editable elements
    const elementCount = layout.editableElements?.length || 0;
    let layoutComplexity: string;
    
    if (elementCount <= 3) layoutComplexity = 'simple';
    else if (elementCount <= 8) layoutComplexity = 'medium';
    else layoutComplexity = 'complex';

    if (intentComplexity === layoutComplexity) return 1.0;
    if (Math.abs(this.complexityToNumber(intentComplexity) - this.complexityToNumber(layoutComplexity)) === 1) {
      return 0.7; // Adjacent complexity levels
    }
    return 0.3; // Very different complexity levels
  }

  /**
   * Convert complexity to number for comparison
   */
  private static complexityToNumber(complexity: string): number {
    switch (complexity) {
      case 'simple': return 1;
      case 'medium': return 2;
      case 'complex': return 3;
      default: return 2;
    }
  }

  /**
   * Match emotional tone
   */
  private static matchEmotionalTone(intentTone: string, layout: any): number {
    const toneLayoutMap: Record<string, string[]> = {
      professional: ['business', 'productivity'],
      casual: ['creative', 'personal'],
      creative: ['creative', 'art'],
      academic: ['study', 'academic'],
      personal: ['creative', 'journal']
    };

    const mappedCategories = toneLayoutMap[intentTone] || ['general'];
    return mappedCategories.includes(layout.category) ? 1.0 : 0.5;
  }

  /**
   * Match layout requirements
   */
  private static matchLayoutRequirements(requirements: any, layout: any): number {
    let matchScore = 0;
    let totalChecks = 0;

    // Check structure match
    const structureMatch = this.matchStructure(requirements.structure, layout);
    matchScore += structureMatch;
    totalChecks++;

    // Check element requirements
    const elementMatch = this.matchElements(requirements.elements, layout);
    matchScore += elementMatch;
    totalChecks++;

    // Check interactivity level
    const interactivityMatch = this.matchInteractivity(requirements.interactivity, layout);
    matchScore += interactivityMatch;
    totalChecks++;

    return totalChecks > 0 ? matchScore / totalChecks : 0;
  }

  /**
   * Match structure requirements
   */
  private static matchStructure(requiredStructure: string, layout: any): number {
    // Infer layout structure from SVG template
    const svgContent = layout.svgTemplate || '';
    
    if (requiredStructure === 'grid' && svgContent.includes('rect')) return 1.0;
    if (requiredStructure === 'hierarchical' && svgContent.includes('text')) return 1.0;
    if (requiredStructure === 'freeform' && svgContent.includes('path')) return 1.0;
    if (requiredStructure === 'linear' && svgContent.includes('line')) return 1.0;
    
    return 0.5; // Default match
  }

  /**
   * Match element requirements
   */
  private static matchElements(requiredElements: string[], layout: any): number {
    // Ensure requiredElements is an array
    if (!Array.isArray(requiredElements)) {
      requiredElements = [];
    }
    
    const layoutElements = layout.editableElements?.map((el: any) => el.type) || [];
    
    const matches = requiredElements.filter(req => 
      layoutElements.some((layoutEl: string) => 
        layoutEl.includes(req) || req.includes(layoutEl)
      )
    ).length;

    return requiredElements.length > 0 ? matches / requiredElements.length : 0.5;
  }

  /**
   * Match interactivity level
   */
  private static matchInteractivity(requiredLevel: string, layout: any): number {
    const elementCount = layout.editableElements?.length || 0;
    let layoutLevel: string;
    
    if (elementCount <= 2) layoutLevel = 'low';
    else if (elementCount <= 6) layoutLevel = 'medium';
    else layoutLevel = 'high';

    if (requiredLevel === layoutLevel) return 1.0;
    if (Math.abs(this.interactivityToNumber(requiredLevel) - this.interactivityToNumber(layoutLevel)) === 1) {
      return 0.7;
    }
    return 0.3;
  }

  /**
   * Convert interactivity to number
   */
  private static interactivityToNumber(level: string): number {
    switch (level) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 2;
    }
  }

  /**
   * Calculate confidence score
   */
  private static calculateConfidenceScore(intent: ParsedIntent, layout: any, similarityScore: number): number {
    let confidence = similarityScore;

    // Boost confidence for high popularity layouts
    if (layout.popularity > 80) confidence += 0.1;
    else if (layout.popularity > 50) confidence += 0.05;

    // Boost confidence for exact category matches
    if (intent.primaryIntent === layout.category) confidence += 0.1;

    // Boost confidence for high intent confidence
    confidence += intent.confidence * 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Generate reasoning for the match
   */
  private static generateReasoning(intent: ParsedIntent, layout: any, similarityScore: number): string {
    const reasons: string[] = [];

    if (intent.primaryIntent === layout.category) {
      reasons.push(`Perfect match for ${intent.primaryIntent} intent`);
    }

    if (similarityScore > 0.8) {
      reasons.push('High semantic similarity');
    } else if (similarityScore > 0.6) {
      reasons.push('Good semantic similarity');
    }

    if (layout.popularity > 80) {
      reasons.push('Highly popular layout');
    }

    if (intent.complexity === 'complex' && layout.editableElements?.length > 8) {
      reasons.push('Matches complexity requirements');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'General layout match';
  }

  /**
   * Calculate combined score for ranking
   */
  private static calculateCombinedScore(match: LayoutMatch, userId?: string): number {
    let score = (match.similarityScore * 0.5) + (match.confidenceScore * 0.3) + (match.popularity / 100 * 0.2);

    // Apply user feedback if available
    if (userId) {
      const userFeedbackScore = this.userFeedback.get(`${userId}_${match.layoutId}`) || 0.5;
      score = (score * 0.8) + (userFeedbackScore * 0.2);
    }

    return score;
  }

  /**
   * Generate suggestions based on search results
   */
  private static generateSuggestions(intent: ParsedIntent, matches: LayoutMatch[]): string[] {
    const suggestions: string[] = [];

    if (matches.length === 0) {
      suggestions.push('Try a more specific prompt');
      suggestions.push('Consider different layout categories');
      return suggestions;
    }

    if (matches[0].similarityScore < 0.7) {
      suggestions.push('Try refining your prompt for better matches');
    }

    if (intent.complexity === 'simple' && matches.some(m => m.editableElements.length > 5)) {
      suggestions.push('Consider simpler layouts for your needs');
    }

    if (intent.context.timeFrame && !matches.some(m => m.name.toLowerCase().includes(intent.context.timeFrame!))) {
      suggestions.push(`Try searching for "${intent.context.timeFrame}" specific layouts`);
    }

    return suggestions;
  }

  /**
   * Generate alternative queries
   */
  private static generateAlternativeQueries(intent: ParsedIntent): string[] {
    const alternatives: string[] = [];

    // Generate alternatives based on intent
    switch (intent.primaryIntent) {
      case 'planning':
        alternatives.push('weekly planner', 'daily schedule', 'project timeline');
        break;
      case 'tracking':
        alternatives.push('habit tracker', 'progress log', 'goal tracker');
        break;
      case 'creative':
        alternatives.push('creative journal', 'brainstorming template', 'idea board');
        break;
      case 'study':
        alternatives.push('study notes', 'cornell notes', 'exam prep');
        break;
    }

    // Add time-based alternatives
    if (intent.context.timeFrame) {
      alternatives.push(`${intent.context.timeFrame} ${intent.primaryIntent}`);
    }

    return alternatives.slice(0, 3);
  }

  /**
   * Store search history for learning
   */
  private static storeSearchHistory(userId: string, intent: ParsedIntent, matches: LayoutMatch[]) {
    if (!this.searchHistory.has(userId)) {
      this.searchHistory.set(userId, []);
    }

    const history = this.searchHistory.get(userId)!;
    history.push({
      intent,
      matches: matches.map(m => ({ id: m.layoutId, score: m.similarityScore })),
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 searches
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
  }

  /**
   * Record user feedback for learning
   */
  static recordUserFeedback(userId: string, layoutId: string, feedback: number) {
    const key = `${userId}_${layoutId}`;
    this.userFeedback.set(key, feedback);
  }

  /**
   * Get all layouts from database (placeholder - implement with actual DB call)
   */
  private static async getAllLayouts(): Promise<any[]> {
    // This should be replaced with actual database query
    // For now, return diverse and interesting mock layouts
    return [
      {
        id: 1,
        name: "Weekly Planner",
        category: "productivity",
        description: "A comprehensive weekly planning layout",
        keywords: ["weekly", "planning", "tasks", "schedule"],
        tags: ["productivity", "planning", "weekly"],
        svgTemplate: "<svg>Weekly planner template</svg>",
        editableElements: [
          { id: "title", type: "text", x: 50, y: 30, width: 200, height: 30 },
          { id: "tasks", type: "textarea", x: 50, y: 80, width: 500, height: 200 }
        ],
        popularity: 85
      },
      {
        id: 2,
        name: "Mood Tracker",
        category: "creative",
        description: "A layout for tracking daily moods and emotions",
        keywords: ["mood", "tracking", "emotions", "daily"],
        tags: ["creative", "tracking", "mood"],
        svgTemplate: "<svg>Mood tracker template</svg>",
        editableElements: [
          { id: "date", type: "date", x: 50, y: 30, width: 150, height: 30 },
          { id: "mood", type: "select", x: 50, y: 80, width: 200, height: 30 }
        ],
        popularity: 70
      },
      {
        id: 3,
        name: "Project Timeline",
        category: "business",
        description: "A visual timeline for project management",
        keywords: ["project", "timeline", "business", "management"],
        tags: ["business", "project", "timeline"],
        svgTemplate: "<svg>Project timeline template</svg>",
        editableElements: [
          { id: "project-name", type: "text", x: 50, y: 30, width: 300, height: 30 },
          { id: "milestones", type: "textarea", x: 50, y: 80, width: 600, height: 300 }
        ],
        popularity: 80
      },
      {
        id: 4,
        name: "Study Guide",
        category: "study",
        description: "A comprehensive study guide with flashcards",
        keywords: ["study", "education", "flashcards", "notes"],
        tags: ["study", "education", "academic"],
        svgTemplate: "<svg>Study guide template</svg>",
        editableElements: [
          { id: "subject", type: "text", x: 50, y: 30, width: 200, height: 30 },
          { id: "notes", type: "textarea", x: 50, y: 80, width: 500, height: 200 },
          { id: "flashcards", type: "textarea", x: 50, y: 300, width: 500, height: 200 }
        ],
        popularity: 75
      },
      {
        id: 5,
        name: "Fitness Tracker",
        category: "fitness",
        description: "A layout for tracking workouts and nutrition",
        keywords: ["fitness", "workout", "nutrition", "health"],
        tags: ["fitness", "health", "tracking"],
        svgTemplate: "<svg>Fitness tracker template</svg>",
        editableElements: [
          { id: "date", type: "date", x: 50, y: 30, width: 150, height: 30 },
          { id: "workout", type: "textarea", x: 50, y: 80, width: 300, height: 150 },
          { id: "nutrition", type: "textarea", x: 400, y: 80, width: 300, height: 150 }
        ],
        popularity: 65
      },
      {
        id: 6,
        name: "Creative Brainstorm",
        category: "creative",
        description: "A mind map style layout for brainstorming ideas",
        keywords: ["creative", "brainstorm", "ideas", "mindmap"],
        tags: ["creative", "brainstorm", "ideas"],
        svgTemplate: "<svg>Brainstorm template</svg>",
        editableElements: [
          { id: "central-idea", type: "text", x: 300, y: 200, width: 200, height: 30 },
          { id: "branch-1", type: "textarea", x: 100, y: 100, width: 150, height: 80 },
          { id: "branch-2", type: "textarea", x: 500, y: 100, width: 150, height: 80 },
          { id: "branch-3", type: "textarea", x: 100, y: 300, width: 150, height: 80 },
          { id: "branch-4", type: "textarea", x: 500, y: 300, width: 150, height: 80 }
        ],
        popularity: 60
      },
      {
        id: 7,
        name: "Daily Journal",
        category: "journal",
        description: "A reflective daily journal layout",
        keywords: ["journal", "daily", "reflection", "personal"],
        tags: ["journal", "personal", "reflection"],
        svgTemplate: "<svg>Daily journal template</svg>",
        editableElements: [
          { id: "date", type: "date", x: 50, y: 30, width: 150, height: 30 },
          { id: "gratitude", type: "textarea", x: 50, y: 80, width: 500, height: 100 },
          { id: "reflection", type: "textarea", x: 50, y: 200, width: 500, height: 200 },
          { id: "goals", type: "textarea", x: 50, y: 420, width: 500, height: 100 }
        ],
        popularity: 70
      },
      {
        id: 8,
        name: "Meeting Notes",
        category: "business",
        description: "A structured layout for meeting notes and action items",
        keywords: ["meeting", "notes", "business", "action"],
        tags: ["business", "meeting", "notes"],
        svgTemplate: "<svg>Meeting notes template</svg>",
        editableElements: [
          { id: "meeting-title", type: "text", x: 50, y: 30, width: 300, height: 30 },
          { id: "attendees", type: "textarea", x: 50, y: 80, width: 300, height: 60 },
          { id: "agenda", type: "textarea", x: 50, y: 160, width: 500, height: 150 },
          { id: "action-items", type: "textarea", x: 50, y: 330, width: 500, height: 150 }
        ],
        popularity: 80
      }
    ];
  }

  /**
   * Get search statistics
   */
  static getSearchStats() {
    return {
      totalSearches: Array.from(this.searchHistory.values()).reduce((sum, history) => sum + history.length, 0),
      uniqueUsers: this.searchHistory.size,
      totalFeedback: this.userFeedback.size
    };
  }
}
