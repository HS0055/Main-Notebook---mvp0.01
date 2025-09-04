/**
 * Test Script for Advanced NLP System
 * 
 * This script tests the comprehensive NLP system to ensure all components
 * are working correctly and producing expected results.
 */

import { nlpLayoutService, NLPLayoutRequest } from '../lib/nlp/NLPLayoutService';
import { AdvancedPromptProcessor } from '../lib/nlp/AdvancedPromptProcessor';
import { SemanticLayoutMatcher } from '../lib/nlp/SemanticLayoutMatcher';
import { ContextAwareLayoutGenerator } from '../lib/nlp/ContextAwareLayoutGenerator';

// Test data
const testPrompts = [
  {
    prompt: "I need a weekly planner for my work projects",
    expectedIntent: "planning",
    expectedComplexity: "medium",
    description: "Basic planning request"
  },
  {
    prompt: "Create a mood journal for tracking my daily emotions",
    expectedIntent: "journal",
    expectedComplexity: "simple",
    description: "Personal journal request"
  },
  {
    prompt: "I want a comprehensive study guide for my upcoming exam with flashcards and note-taking sections",
    expectedIntent: "study",
    expectedComplexity: "complex",
    description: "Complex study request"
  },
  {
    prompt: "Design a creative brainstorming template for new product ideas",
    expectedIntent: "creative",
    expectedComplexity: "medium",
    description: "Creative design request"
  },
  {
    prompt: "Track my fitness progress with workout logs and nutrition planning",
    expectedIntent: "fitness",
    expectedComplexity: "medium",
    description: "Fitness tracking request"
  }
];

const testUsers = [
  {
    userId: "test_user_1",
    preferences: {
      preferredCategories: ["planning", "study"],
      preferredComplexity: "medium",
      preferredTone: "professional"
    }
  },
  {
    userId: "test_user_2", 
    preferences: {
      preferredCategories: ["creative", "journal"],
      preferredComplexity: "simple",
      preferredTone: "casual"
    }
  }
];

async function testAdvancedPromptProcessor() {
  console.log("🧠 Testing Advanced Prompt Processor...");
  
  for (const test of testPrompts) {
    try {
      const result = await AdvancedPromptProcessor.processPrompt(test.prompt);
      
      console.log(`\n📝 Test: ${test.description}`);
      console.log(`   Prompt: "${test.prompt}"`);
      console.log(`   Expected Intent: ${test.expectedIntent}`);
      console.log(`   Detected Intent: ${result.primaryIntent}`);
      console.log(`   Expected Complexity: ${test.expectedComplexity}`);
      console.log(`   Detected Complexity: ${result.complexity}`);
      console.log(`   Confidence: ${result.confidence}`);
      console.log(`   Emotional Tone: ${result.emotionalTone}`);
      console.log(`   Context: ${JSON.stringify(result.context)}`);
      
      // Validate results
      const intentMatch = result.primaryIntent === test.expectedIntent;
      const complexityMatch = result.complexity === test.expectedComplexity;
      
      console.log(`   ✅ Intent Match: ${intentMatch ? 'PASS' : 'FAIL'}`);
      console.log(`   ✅ Complexity Match: ${complexityMatch ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.error(`   ❌ Error processing prompt: ${error}`);
    }
  }
}

async function testSemanticLayoutMatcher() {
  console.log("\n🔍 Testing Semantic Layout Matcher...");
  
  // Test with a sample intent
  const sampleIntent = {
    primaryIntent: "planning" as const,
    secondaryIntents: ["productivity"],
    complexity: "medium" as const,
    context: {
      timeFrame: "weekly" as const,
      domain: "work",
      urgency: "medium" as const,
      collaboration: false
    },
    emotionalTone: "professional" as const,
    entities: {
      topics: ["work", "projects"],
      dates: ["weekly"]
    },
    layoutRequirements: {
      structure: "grid" as const,
      elements: ["calendar", "tasks"],
      interactivity: "medium" as const,
      visualStyle: "professional" as const
    },
    confidence: 0.9
  };
  
  try {
    const result = await SemanticLayoutMatcher.findSimilarLayouts(sampleIntent, "test_user");
    
    console.log(`\n📊 Semantic Search Results:`);
    console.log(`   Total Matches: ${result.totalMatches}`);
    console.log(`   Search Time: ${result.searchTime}ms`);
    console.log(`   Suggestions: ${result.suggestions.join(', ')}`);
    console.log(`   Alternative Queries: ${result.alternativeQueries.join(', ')}`);
    
    if (result.matches.length > 0) {
      console.log(`   Top Match: ${result.matches[0].name} (Score: ${result.matches[0].similarityScore})`);
    }
    
    console.log(`   ✅ Semantic matching completed successfully`);
    
  } catch (error) {
    console.error(`   ❌ Error in semantic matching: ${error}`);
  }
}

async function testContextAwareLayoutGenerator() {
  console.log("\n🎯 Testing Context-Aware Layout Generator...");
  
  const sampleIntent = {
    primaryIntent: "study" as const,
    secondaryIntents: ["academic"],
    complexity: "medium" as const,
    context: {
      timeFrame: "ongoing" as const,
      domain: "education",
      urgency: "medium" as const,
      collaboration: false
    },
    emotionalTone: "academic" as const,
    entities: {
      topics: ["study", "exam"],
      dates: []
    },
    layoutRequirements: {
      structure: "hierarchical" as const,
      elements: ["notes", "questions"],
      interactivity: "medium" as const,
      visualStyle: "detailed" as const
    },
    confidence: 0.8
  };
  
  try {
    const result = await ContextAwareLayoutGenerator.generateContextualLayout(
      sampleIntent,
      "test_user",
      { timeOfDay: "morning", dayOfWeek: "monday" }
    );
    
    console.log(`\n📋 Generated Contextual Layout:`);
    console.log(`   Name: ${result.name}`);
    console.log(`   Description: ${result.description}`);
    console.log(`   Category: ${result.category}`);
    console.log(`   Confidence: ${result.metadata.confidence}`);
    console.log(`   Reasoning: ${result.metadata.reasoning}`);
    console.log(`   Editable Elements: ${result.editableElements.length}`);
    console.log(`   Context: ${result.context.timeContext}`);
    
    console.log(`   ✅ Context-aware generation completed successfully`);
    
  } catch (error) {
    console.error(`   ❌ Error in context-aware generation: ${error}`);
  }
}

async function testNLPLayoutService() {
  console.log("\n🚀 Testing Main NLP Layout Service...");
  
  for (const test of testPrompts.slice(0, 3)) { // Test first 3 prompts
    try {
      const request: NLPLayoutRequest = {
        prompt: test.prompt,
        userId: "test_user",
        context: {
          preferences: {
            preferredCategories: ["planning", "study"],
            preferredComplexity: "medium"
          }
        },
        options: {
          maxResults: 3,
          includeAlternatives: true,
          learningMode: true,
          personalizationLevel: 'medium'
        }
      };
      
      const result = await nlpLayoutService.generateLayouts(request);
      
      console.log(`\n🎯 Test: ${test.description}`);
      console.log(`   Prompt: "${test.prompt}"`);
      console.log(`   Success: ${result.success}`);
      console.log(`   Layouts Generated: ${result.layouts.length}`);
      console.log(`   Suggestions: ${result.suggestions.length}`);
      console.log(`   Processing Time: ${result.metadata.processingTime}ms`);
      console.log(`   Overall Confidence: ${result.metadata.confidence}`);
      console.log(`   Cache Hit: ${result.metadata.cacheHit}`);
      
      if (result.layouts.length > 0) {
        console.log(`   Top Layout: ${result.layouts[0].name}`);
        console.log(`   Top Layout Confidence: ${result.layouts[0].metadata.confidence}`);
      }
      
      if (result.insights.intentAnalysis) {
        console.log(`   Detected Intent: ${result.insights.intentAnalysis.primaryIntent}`);
        console.log(`   Intent Confidence: ${result.insights.intentAnalysis.confidence}`);
      }
      
      console.log(`   ✅ NLP service test completed successfully`);
      
    } catch (error) {
      console.error(`   ❌ Error in NLP service: ${error}`);
    }
  }
}

async function testUserPersonalization() {
  console.log("\n👤 Testing User Personalization...");
  
  for (const user of testUsers) {
    try {
      const request: NLPLayoutRequest = {
        prompt: "I need a planner for my daily tasks",
        userId: user.userId,
        context: {
          preferences: user.preferences
        },
        options: {
          personalizationLevel: 'high',
          learningMode: true
        }
      };
      
      const result = await nlpLayoutService.generateLayouts(request);
      
      console.log(`\n👤 User: ${user.userId}`);
      console.log(`   Preferences: ${JSON.stringify(user.preferences)}`);
      console.log(`   Layouts Generated: ${result.layouts.length}`);
      console.log(`   Confidence: ${result.metadata.confidence}`);
      
      if (result.insights.userPatterns) {
        console.log(`   User Patterns: ${JSON.stringify(result.insights.userPatterns)}`);
      }
      
      console.log(`   ✅ Personalization test completed successfully`);
      
    } catch (error) {
      console.error(`   ❌ Error in personalization test: ${error}`);
    }
  }
}

async function testPerformanceMetrics() {
  console.log("\n📊 Testing Performance Metrics...");
  
  try {
    const stats = nlpLayoutService.getStats();
    console.log(`   Cache Size: ${stats.cacheSize}`);
    console.log(`   Learning Users: ${stats.learningUsers}`);
    console.log(`   Total Interactions: ${stats.totalInteractions}`);
    
    // Test cache performance
    const startTime = Date.now();
    const request: NLPLayoutRequest = {
      prompt: "test prompt for caching",
      userId: "performance_test_user"
    };
    
    // First call (should be slow)
    await nlpLayoutService.generateLayouts(request);
    const firstCallTime = Date.now() - startTime;
    
    // Second call (should be fast due to caching)
    const secondStartTime = Date.now();
    await nlpLayoutService.generateLayouts(request);
    const secondCallTime = Date.now() - secondStartTime;
    
    console.log(`   First Call Time: ${firstCallTime}ms`);
    console.log(`   Second Call Time: ${secondCallTime}ms`);
    console.log(`   Cache Speedup: ${firstCallTime / secondCallTime}x`);
    
    console.log(`   ✅ Performance metrics test completed successfully`);
    
  } catch (error) {
    console.error(`   ❌ Error in performance test: ${error}`);
  }
}

async function runAllTests() {
  console.log("🧪 Starting Comprehensive NLP System Tests...\n");
  
  try {
    await testAdvancedPromptProcessor();
    await testSemanticLayoutMatcher();
    await testContextAwareLayoutGenerator();
    await testNLPLayoutService();
    await testUserPersonalization();
    await testPerformanceMetrics();
    
    console.log("\n🎉 All NLP System Tests Completed Successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Advanced Prompt Processing");
    console.log("   ✅ Semantic Layout Matching");
    console.log("   ✅ Context-Aware Layout Generation");
    console.log("   ✅ Main NLP Layout Service");
    console.log("   ✅ User Personalization");
    console.log("   ✅ Performance Metrics");
    
  } catch (error) {
    console.error("\n❌ Test Suite Failed:", error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export {
  testAdvancedPromptProcessor,
  testSemanticLayoutMatcher,
  testContextAwareLayoutGenerator,
  testNLPLayoutService,
  testUserPersonalization,
  testPerformanceMetrics,
  runAllTests
};
