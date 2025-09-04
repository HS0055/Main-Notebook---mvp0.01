/**
 * Simple NLP Test - Test the NLP system in isolation
 */

import { AdvancedPromptProcessor } from '../lib/nlp/AdvancedPromptProcessor';

async function testSimpleNLP() {
  console.log("🧠 Testing Simple NLP Processing...");
  
  const testPrompt = "I need a weekly planner for my work projects";
  
  try {
    console.log(`\n📝 Testing prompt: "${testPrompt}"`);
    
    const result = await AdvancedPromptProcessor.processPrompt(testPrompt, "test_user");
    
    console.log(`   Primary Intent: ${result.primaryIntent}`);
    console.log(`   Complexity: ${result.complexity}`);
    console.log(`   Confidence: ${result.confidence}`);
    console.log(`   Emotional Tone: ${result.emotionalTone}`);
    console.log(`   Context: ${JSON.stringify(result.context)}`);
    console.log(`   Layout Requirements: ${JSON.stringify(result.layoutRequirements)}`);
    
    console.log(`   ✅ NLP processing completed successfully`);
    
  } catch (error) {
    console.error(`   ❌ Error in NLP processing: ${error}`);
  }
}

// Run test
testSimpleNLP().catch(console.error);
