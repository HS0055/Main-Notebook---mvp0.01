/**
 * NLP Configuration
 * 
 * Configuration for the Advanced NLP Layout System
 */

export interface NLPConfig {
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  semantic: {
    similarityThreshold: number;
    maxResults: number;
    cacheSize: number;
  };
  context: {
    maxHistorySize: number;
    learningEnabled: boolean;
    personalizationLevel: 'low' | 'medium' | 'high';
  };
  performance: {
    enableCaching: boolean;
    cacheTimeout: number;
    enableLearning: boolean;
  };
}

export const defaultNLPConfig: NLPConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.3
  },
  semantic: {
    similarityThreshold: 0.3,
    maxResults: 10,
    cacheSize: 1000
  },
  context: {
    maxHistorySize: 100,
    learningEnabled: true,
    personalizationLevel: 'medium'
  },
  performance: {
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
    enableLearning: true
  }
};

export const getNLPConfig = (): NLPConfig => {
  return {
    ...defaultNLPConfig,
    openai: {
      ...defaultNLPConfig.openai,
      apiKey: process.env.OPENAI_API_KEY || defaultNLPConfig.openai.apiKey
    }
  };
};

export const validateNLPConfig = (config: NLPConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.openai.apiKey) {
    errors.push('OpenAI API key is required');
  }
  
  if (config.semantic.similarityThreshold < 0 || config.semantic.similarityThreshold > 1) {
    errors.push('Similarity threshold must be between 0 and 1');
  }
  
  if (config.semantic.maxResults < 1 || config.semantic.maxResults > 50) {
    errors.push('Max results must be between 1 and 50');
  }
  
  if (config.context.maxHistorySize < 1 || config.context.maxHistorySize > 1000) {
    errors.push('Max history size must be between 1 and 1000');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
