/**
 * Main NLP Layout Service
 * 
 * This service integrates all NLP components:
 * - Advanced Prompt Processing
 * - Semantic Layout Matching
 * - Context-Aware Layout Generation
 * - Learning and Adaptation
 */

import { AdvancedPromptProcessor, ParsedIntent, ContextualSuggestion } from './AdvancedPromptProcessor';
import { SemanticLayoutMatcher, SemanticSearchResult, LayoutMatch } from './SemanticLayoutMatcher';
import { ContextAwareLayoutGenerator, ContextualLayout, UserContext } from './ContextAwareLayoutGenerator';

export interface NLPLayoutRequest {
  prompt: string;
  userId?: string;
  context?: {
    previousLayouts?: string[];
    preferences?: any;
    category?: string;
    sessionData?: any;
  };
  options?: {
    maxResults?: number;
    includeAlternatives?: boolean;
    learningMode?: boolean;
    personalizationLevel?: 'low' | 'medium' | 'high';
  };
}

export interface NLPLayoutResponse {
  success: boolean;
  layouts: ContextualLayout[];
  suggestions: ContextualSuggestion[];
  searchResults: SemanticSearchResult;
  insights: {
    intentAnalysis: ParsedIntent;
    userPatterns: any;
    recommendations: string[];
    learningInsights: any;
  };
  metadata: {
    processingTime: number;
    confidence: number;
    cacheHit: boolean;
    modelVersion: string;
  };
  error?: string;
}

export class NLPLayoutService {
  private static instance: NLPLayoutService;
  private static cache: Map<string, NLPLayoutResponse> = new Map();
  private static learningData: Map<string, any> = new Map();

  /**
   * Singleton pattern
   */
  static getInstance(): NLPLayoutService {
    if (!this.instance) {
      this.instance = new NLPLayoutService();
      // Initialize static properties if they're not already initialized
      if (!this.cache) {
        this.cache = new Map();
      }
      if (!this.learningData) {
        this.learningData = new Map();
      }
    }
    return this.instance;
  }

  /**
   * Main entry point for NLP-powered layout generation
   */
  async generateLayouts(request: NLPLayoutRequest): Promise<NLPLayoutResponse> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      if (this.cache && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)!;
        cached.metadata.cacheHit = true;
        return cached;
      }

      // Step 1: Advanced Prompt Processing
      const intentAnalysis = await this.processPrompt(request);
      
      // Step 2: Semantic Layout Matching
      const searchResults = await this.findSemanticMatches(intentAnalysis, request);
      
      // Step 3: Context-Aware Layout Generation
      const contextualLayouts = await this.generateContextualLayouts(intentAnalysis, request);
      
      // Step 4: Generate Suggestions
      const suggestions = await this.generateSuggestions(intentAnalysis, request);
      
      // Step 5: Generate Insights
      const insights = await this.generateInsights(intentAnalysis, request);
      
      // Step 6: Combine and rank results
      const finalLayouts = this.combineAndRankLayouts(contextualLayouts, searchResults.matches, request);
      
      // Create response
      const response: NLPLayoutResponse = {
        success: true,
        layouts: finalLayouts,
        suggestions,
        searchResults,
        insights,
        metadata: {
          processingTime: Date.now() - startTime,
          confidence: this.calculateOverallConfidence(intentAnalysis, finalLayouts),
          cacheHit: false,
          modelVersion: '1.0.0'
        }
      };

      // Cache the result
      if (this.cache) {
        this.cache.set(cacheKey, response);
      }
      
      // Update learning data
      if (request.options?.learningMode !== false) {
        this.updateLearningData(request, response);
      }

      return response;

    } catch (error) {
      console.error('NLP Layout Service Error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return {
        success: false,
        layouts: [],
        suggestions: [],
        searchResults: {
          matches: [],
          totalMatches: 0,
          searchTime: Date.now() - startTime,
          suggestions: [],
          alternativeQueries: []
        },
        insights: {
          intentAnalysis: {} as ParsedIntent,
          userPatterns: {},
          recommendations: [],
          learningInsights: {}
        },
        metadata: {
          processingTime: Date.now() - startTime,
          confidence: 0,
          cacheHit: false,
          modelVersion: '1.0.0'
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process prompt using advanced NLP
   */
  private async processPrompt(request: NLPLayoutRequest): Promise<ParsedIntent> {
    return await AdvancedPromptProcessor.processPrompt(
      request.prompt,
      request.userId,
      request.context
    );
  }

  /**
   * Find semantic matches using the semantic matcher
   */
  private async findSemanticMatches(
    intent: ParsedIntent,
    request: NLPLayoutRequest
  ): Promise<SemanticSearchResult> {
    return await SemanticLayoutMatcher.findSimilarLayouts(
      intent,
      request.userId,
      request.options?.maxResults || 10
    );
  }

  /**
   * Generate contextual layouts
   */
  private async generateContextualLayouts(
    intent: ParsedIntent,
    request: NLPLayoutRequest
  ): Promise<ContextualLayout[]> {
    const layouts: ContextualLayout[] = [];
    
    // Generate primary contextual layout
    const primaryLayout = await ContextAwareLayoutGenerator.generateContextualLayout(
      intent,
      request.userId,
      request.context?.sessionData
    );
    
    layouts.push(primaryLayout);
    
    // Generate alternative layouts if requested
    if (request.options?.includeAlternatives) {
      const alternatives = await this.generateAlternativeLayouts(intent, request);
      layouts.push(...alternatives);
    }
    
    return layouts;
  }

  /**
   * Generate alternative layouts
   */
  private async generateAlternativeLayouts(
    intent: ParsedIntent,
    request: NLPLayoutRequest
  ): Promise<ContextualLayout[]> {
    const alternatives: ContextualLayout[] = [];
    
    // Generate variations with different complexity levels
    if (intent.complexity !== 'simple') {
      const simpleIntent = { ...intent, complexity: 'simple' as const };
      const simpleLayout = await ContextAwareLayoutGenerator.generateContextualLayout(
        simpleIntent,
        request.userId,
        request.context?.sessionData
      );
      alternatives.push(simpleLayout);
    }
    
    if (intent.complexity !== 'complex') {
      const complexIntent = { ...intent, complexity: 'complex' as const };
      const complexLayout = await ContextAwareLayoutGenerator.generateContextualLayout(
        complexIntent,
        request.userId,
        request.context?.sessionData
      );
      alternatives.push(complexLayout);
    }
    
    // Generate variation with different emotional tone
    if (intent.emotionalTone !== 'casual') {
      const casualIntent = { ...intent, emotionalTone: 'casual' as const };
      const casualLayout = await ContextAwareLayoutGenerator.generateContextualLayout(
        casualIntent,
        request.userId,
        request.context?.sessionData
      );
      alternatives.push(casualLayout);
    }
    
    return alternatives.slice(0, 2); // Limit to 2 alternatives
  }

  /**
   * Generate contextual suggestions
   */
  private async generateSuggestions(
    intent: ParsedIntent,
    request: NLPLayoutRequest
  ): Promise<ContextualSuggestion[]> {
    return await AdvancedPromptProcessor.generateContextualSuggestions(intent, request.userId);
  }

  /**
   * Generate insights and recommendations
   */
  private async generateInsights(
    intent: ParsedIntent,
    request: NLPLayoutRequest
  ): Promise<NLPLayoutResponse['insights']> {
    const userPatterns = await this.analyzeUserPatterns(request.userId);
    const recommendations = await this.generateRecommendations(intent, userPatterns);
    const learningInsights = await this.generateLearningInsights(request.userId, intent);
    
    return {
      intentAnalysis: intent,
      userPatterns,
      recommendations,
      learningInsights
    };
  }

  /**
   * Analyze user patterns
   */
  private async analyzeUserPatterns(userId?: string): Promise<any> {
    if (!userId) {
      return { message: 'No user data available' };
    }
    
    // This would integrate with the user context system
    return {
      totalInteractions: 0,
      preferredCategories: [],
      averageComplexity: 'medium',
      mostActiveTime: 'morning'
    };
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(intent: ParsedIntent, userPatterns: any): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Recommend based on intent
    switch (intent.primaryIntent) {
      case 'planning':
        recommendations.push('Try a weekly planner for better organization');
        recommendations.push('Consider a project timeline for complex planning');
        break;
      case 'tracking':
        recommendations.push('Use a habit tracker for consistent progress');
        recommendations.push('Try a goal tracker for long-term objectives');
        break;
      case 'creative':
        recommendations.push('Explore mind mapping layouts for brainstorming');
        recommendations.push('Try a creative journal for inspiration');
        break;
      case 'study':
        recommendations.push('Use Cornell notes for effective learning');
        recommendations.push('Try flashcards for memorization');
        break;
    }
    
    // Recommend based on complexity
    if (intent.complexity === 'simple' && userPatterns.averageComplexity === 'complex') {
      recommendations.push('You might enjoy more detailed layouts');
    }
    
    return recommendations.slice(0, 3);
  }

  /**
   * Generate learning insights
   */
  private async generateLearningInsights(userId?: string, intent?: ParsedIntent): Promise<any> {
    if (!userId) {
      return { message: 'Learning insights require user identification' };
    }
    
    return {
      userGrowth: 'New user - building profile',
      patternRecognition: 'Learning user preferences',
      suggestions: 'Try different layout types to improve recommendations'
    };
  }

  /**
   * Combine and rank layouts from different sources
   */
  private combineAndRankLayouts(
    contextualLayouts: ContextualLayout[],
    semanticMatches: LayoutMatch[],
    request: NLPLayoutRequest
  ): ContextualLayout[] {
    const allLayouts: ContextualLayout[] = [];
    
    // Add contextual layouts
    allLayouts.push(...contextualLayouts);
    
    // Convert semantic matches to contextual layouts
    const convertedMatches = semanticMatches.map(match => this.convertMatchToContextualLayout(match));
    allLayouts.push(...convertedMatches);
    
    // Remove duplicates based on layout ID
    const uniqueLayouts = allLayouts.filter((layout, index, self) => 
      index === self.findIndex(l => l.id === layout.id)
    );
    
    // Rank by combined score
    const rankedLayouts = uniqueLayouts.sort((a, b) => {
      const scoreA = this.calculateLayoutScore(a, request);
      const scoreB = this.calculateLayoutScore(b, request);
      return scoreB - scoreA;
    });
    
    // Apply personalization level
    const personalizationLevel = request.options?.personalizationLevel || 'medium';
    const maxResults = request.options?.maxResults || 5;
    
    let finalLayouts = rankedLayouts;
    
    if (personalizationLevel === 'high') {
      // Keep more personalized results
      finalLayouts = rankedLayouts.slice(0, maxResults);
    } else if (personalizationLevel === 'low') {
      // Mix personalized and general results
      const personalized = rankedLayouts.slice(0, Math.ceil(maxResults / 2));
      const general = rankedLayouts.slice(Math.ceil(maxResults / 2), maxResults);
      finalLayouts = [...personalized, ...general];
    } else {
      // Medium personalization
      finalLayouts = rankedLayouts.slice(0, maxResults);
    }
    
    return finalLayouts;
  }

  /**
   * Convert semantic match to contextual layout
   */
  private convertMatchToContextualLayout(match: LayoutMatch): ContextualLayout {
    return {
      id: match.layoutId,
      name: match.name,
      description: match.description,
      category: match.category,
      svgData: match.svgTemplate,
      editableElements: match.editableElements,
      context: {
        userHistory: [],
        timeContext: 'General purpose',
        domainContext: match.category,
        socialContext: 'Individual use'
      },
      personalization: {
        adaptedElements: match.editableElements,
        userPreferences: {},
        learningInsights: {}
      },
      metadata: {
        confidence: match.confidenceScore,
        reasoning: match.reasoning,
        alternatives: [],
        nextSuggestions: []
      }
    };
  }

  /**
   * Calculate layout score for ranking
   */
  private calculateLayoutScore(layout: ContextualLayout, request: NLPLayoutRequest): number {
    try {
      let score = layout.metadata.confidence;
      
      // Boost score for contextual layouts
      if (layout.context.userHistory.length > 0) {
        score += 0.1;
      }
      
      // Boost score for personalized layouts
      if (Object.keys(layout.personalization.userPreferences).length > 0) {
        score += 0.1;
      }
      
      // Boost score based on user preferences
      if (request.context?.preferences) {
        const preferences = request.context.preferences;
        if (preferences.preferredCategories?.includes(layout.category)) {
          score += 0.2;
        }
      }
      
      return Math.min(score, 1.0);
    } catch (error) {
      console.error('Error calculating layout score:', error);
      return 0.5; // Default score
    }
  }

  /**
   * Calculate overall confidence
   */
  private calculateOverallConfidence(intent: ParsedIntent, layouts: ContextualLayout[]): number {
    if (layouts.length === 0) return 0;
    
    const avgLayoutConfidence = layouts.reduce((sum, layout) => sum + layout.metadata.confidence, 0) / layouts.length;
    const intentConfidence = intent.confidence;
    
    return (avgLayoutConfidence + intentConfidence) / 2;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(request: NLPLayoutRequest): string {
    try {
      const key = `${request.prompt}_${request.userId || 'anonymous'}_${JSON.stringify(request.context || {})}_${JSON.stringify(request.options || {})}`;
      return Buffer.from(key).toString('base64');
    } catch (error) {
      console.error('Error generating cache key:', error);
      return `fallback_${Date.now()}`;
    }
  }

  /**
   * Update learning data
   */
  private updateLearningData(request: NLPLayoutRequest, response: NLPLayoutResponse) {
    try {
      if (!request.userId) return;
      
      const learningKey = request.userId;
      const learningData = NLPLayoutService.learningData.get(learningKey) || {
        interactions: [],
        patterns: {},
        preferences: {}
      };
      
      // Add interaction
      learningData.interactions.push({
        prompt: request.prompt,
        intent: response.insights.intentAnalysis,
        selectedLayout: response.layouts[0]?.id,
        timestamp: new Date().toISOString(),
        confidence: response.metadata.confidence
      });
      
      // Update patterns
      const intent = response.insights.intentAnalysis.primaryIntent;
      learningData.patterns[intent] = (learningData.patterns[intent] || 0) + 1;
      
      // Keep only last 100 interactions
      if (learningData.interactions.length > 100) {
        learningData.interactions.splice(0, learningData.interactions.length - 100);
      }
      
      NLPLayoutService.learningData.set(learningKey, learningData);
    } catch (error) {
      console.error('Error updating learning data:', error);
    }
  }

  /**
   * Get learning insights for a user
   */
  async getLearningInsights(userId: string): Promise<any> {
    const learningData = this.learningData.get(userId);
    if (!learningData) {
      return { message: 'No learning data available' };
    }
    
    const totalInteractions = learningData.interactions.length;
    const mostCommonIntent = Object.entries(learningData.patterns)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'general';
    
    const avgConfidence = learningData.interactions.reduce((sum, interaction) => 
      sum + interaction.confidence, 0) / totalInteractions;
    
    return {
      totalInteractions,
      mostCommonIntent,
      averageConfidence: avgConfidence,
      patterns: learningData.patterns,
      recentActivity: learningData.interactions.slice(-10)
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    if (this.cache) {
      this.cache.clear();
    }
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      cacheSize: this.cache ? this.cache.size : 0,
      learningUsers: this.learningData ? this.learningData.size : 0,
      totalInteractions: this.learningData ? Array.from(this.learningData.values())
        .reduce((sum, data) => sum + data.interactions.length, 0) : 0
    };
  }
}

// Export singleton instance
export const nlpLayoutService = NLPLayoutService.getInstance();
