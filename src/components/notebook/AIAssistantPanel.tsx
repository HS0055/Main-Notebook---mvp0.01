"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  BookOpen, 
  Brain, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  FileText,
  HelpCircle,
  Lightbulb,
  Target,
  Zap,
  RotateCcw,
  Check,
  X,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';

interface Page {
  id: string;
  leftContent: string;
  rightContent: string;
  title?: string;
}

interface Notebook {
  id: string;
  title: string;
  pages: Page[];
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AIAssistantPanelProps {
  currentNotebook?: Notebook;
  currentPage?: Page;
  studyMode: 'write' | 'study';
  allNotebooks: Notebook[];
}

export default function AIAssistantPanel({
  currentNotebook,
  currentPage,
  studyMode,
  allNotebooks
}: AIAssistantPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main']));
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showFlashcardBack, setShowFlashcardBack] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Summary state
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Get all content from current notebook
  const getAllNotebookContent = useCallback(() => {
    if (!currentNotebook) return '';
    
    return currentNotebook.pages
      .map(page => `${page.title || 'Untitled Page'}: ${page.leftContent || ''} ${page.rightContent || ''}`)
      .join('\n\n')
      .trim();
  }, [currentNotebook]);

  // CRITICAL FIX: Analyze content and extract key concepts
  const analyzeContent = useCallback((content: string) => {
    if (!content) return { concepts: [], topics: [], keyPhrases: [] };
    
    // Simple content analysis - extract key information
    const words = content.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Extract potential concepts (words that appear multiple times)
    const wordFreq: {[key: string]: number} = {};
    words.forEach(word => {
      const cleaned = word.replace(/[^\w]/g, '');
      if (cleaned.length > 3) {
        wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
      }
    });
    
    const concepts = Object.entries(wordFreq)
      .filter(([word, freq]) => freq > 1)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    // Extract topics (longer phrases and sentences)
    const topics = sentences
      .slice(0, 5)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200);
    
    const keyPhrases = content
      .match(/[A-Z][^.!?]*[.!?]/g)
      ?.slice(0, 8) || [];
    
    return { concepts, topics, keyPhrases };
  }, []);

  // CRITICAL FIX: Generate flashcards based on actual content
  const generateFlashcards = useCallback(async () => {
    if (!currentNotebook) return;
    
    setIsGeneratingFlashcards(true);
    setActiveFeature('flashcards');
    
    try {
      const content = getAllNotebookContent();
      if (!content || content.length < 50) {
        setFlashcards([{
          id: '1',
          front: 'No content found',
          back: `Add some notes to "${currentNotebook.title}" to generate meaningful flashcards based on your content.`,
          difficulty: 'easy'
        }]);
        return;
      }

      const analysis = analyzeContent(content);
      console.log('📚 Content analysis:', analysis);

      // Generate flashcards based on actual content
      const contentBasedFlashcards: Flashcard[] = [];
      
      // Generate concept-based flashcards
      analysis.concepts.slice(0, 3).forEach((concept, index) => {
        const relatedSentences = content.split(/[.!?]+/)
          .filter(s => s.toLowerCase().includes(concept))
          .slice(0, 2);
        
        if (relatedSentences.length > 0) {
          contentBasedFlashcards.push({
            id: `concept_${index}`,
            front: `What is "${concept}" in the context of ${currentNotebook.title}?`,
            back: relatedSentences.join('. ').trim() || `Key concept from your notes about ${concept}`,
            difficulty: 'medium'
          });
        }
      });

      // Generate definition flashcards from key phrases
      analysis.keyPhrases.slice(0, 3).forEach((phrase, index) => {
        if (phrase.length > 30 && phrase.length < 150) {
          contentBasedFlashcards.push({
            id: `phrase_${index}`,
            front: `Explain this concept from your ${currentNotebook.title} notes`,
            back: phrase.trim(),
            difficulty: 'easy'
          });
        }
      });

      // Generate topic-based flashcards
      analysis.topics.slice(0, 2).forEach((topic, index) => {
        contentBasedFlashcards.push({
          id: `topic_${index}`,
          front: `What are the main points about this topic in ${currentNotebook.title}?`,
          back: topic.length > 200 ? topic.substring(0, 200) + '...' : topic,
          difficulty: 'hard'
        });
      });

      // Add a summary flashcard
      contentBasedFlashcards.push({
        id: 'summary',
        front: `What are the main themes covered in "${currentNotebook.title}"?`,
        back: `This notebook covers: ${analysis.concepts.slice(0, 5).join(', ')}. Based on ${currentNotebook.pages.length} pages of your personal notes.`,
        difficulty: 'easy'
      });

      setFlashcards(contentBasedFlashcards.length > 0 ? contentBasedFlashcards : [
        {
          id: 'fallback',
          front: `What topics are covered in "${currentNotebook.title}"?`,
          back: `This notebook contains ${currentNotebook.pages.length} pages covering various topics.`,
          difficulty: 'easy'
        }
      ]);
      
      setCurrentFlashcardIndex(0);
      setShowFlashcardBack(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsGeneratingFlashcards(false);
    }
  }, [currentNotebook, getAllNotebookContent, analyzeContent]);

  // CRITICAL FIX: Generate quiz based on actual content
  const generateQuiz = useCallback(async () => {
    if (!currentNotebook) return;
    
    setIsGeneratingQuiz(true);
    setActiveFeature('quiz');
    
    try {
      const content = getAllNotebookContent();
      if (!content || content.length < 50) {
        setQuizQuestions([{
          id: '1',
          question: `What should you do to get a meaningful quiz for "${currentNotebook.title}"?`,
          options: ['Add more detailed notes', 'Take the quiz anyway', 'Skip this step', 'Delete the notebook'],
          correctAnswer: 0,
          explanation: 'You need to add substantial content to your notebook before taking a meaningful quiz based on your notes.'
        }]);
        return;
      }

      const analysis = analyzeContent(content);
      console.log('🧠 Generating quiz from content analysis:', analysis);

      const contentBasedQuestions: QuizQuestion[] = [];

      // Generate questions about key concepts
      analysis.concepts.slice(0, 2).forEach((concept, index) => {
        const correctAnswer = `Key concept: ${concept}`;
        const wrongAnswers = [
          'Not covered in these notes',
          'Mentioned briefly',
          'Unrelated topic'
        ];
        
        contentBasedQuestions.push({
          id: `concept_q${index}`,
          question: `Based on your "${currentNotebook.title}" notes, which concept appears most frequently?`,
          options: [correctAnswer, ...wrongAnswers],
          correctAnswer: 0,
          explanation: `"${concept}" appears multiple times throughout your notes, indicating it's a key concept you've been studying.`
        });
      });

      // Generate content comprehension questions
      if (analysis.topics.length > 0) {
        const topic = analysis.topics[0];
        contentBasedQuestions.push({
          id: 'comprehension',
          question: `What is a main point discussed in your ${currentNotebook.title} notes?`,
          options: [
            topic.substring(0, 100) + (topic.length > 100 ? '...' : ''),
            'This topic is not covered',
            'Only mentioned in passing',
            'Contradicted by other notes'
          ],
          correctAnswer: 0,
          explanation: 'This is directly from your notes and represents a key point you\'ve documented.'
        });
      }

      // Generate study method question
      contentBasedQuestions.push({
        id: 'study_method',
        question: `Based on the content in "${currentNotebook.title}", what would be the most effective next study step?`,
        options: [
          `Focus on the key concepts: ${analysis.concepts.slice(0, 3).join(', ')}`,
          'Start completely over',
          'Ignore the main topics',
          'Only review page titles'
        ],
        correctAnswer: 0,
        explanation: 'These concepts appear frequently in your notes, suggesting they are important areas to focus your study efforts on.'
      });

      setQuizQuestions(contentBasedQuestions.length > 0 ? contentBasedQuestions : [
        {
          id: 'fallback',
          question: `How many pages of notes do you have in "${currentNotebook.title}"?`,
          options: [
            `${currentNotebook.pages.length} pages`,
            'No pages',
            'Too many to count',
            'Only empty pages'
          ],
          correctAnswer: 0,
          explanation: `You have ${currentNotebook.pages.length} pages of content in this notebook.`
        }
      ]);

      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowQuizResults(false);
      setQuizScore(0);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, [currentNotebook, getAllNotebookContent, analyzeContent]);

  // CRITICAL FIX: Generate summary based on actual content
  const generateSummary = useCallback(async () => {
    if (!currentNotebook) return;
    
    setIsGeneratingSummary(true);
    setActiveFeature('summary');
    
    try {
      const content = getAllNotebookContent();
      if (!content || content.length < 50) {
        setSummary(`📚 **${currentNotebook.title} Summary**

**Current Status:**
• This notebook has ${currentNotebook.pages.length} pages
• Content is minimal - add more notes for a detailed summary
• Ready for your study materials

**Next Steps:**
• Add detailed notes to each page
• Include key concepts and definitions
• Write explanations and examples

**Study Recommendations:**
• Start by outlining main topics
• Add detailed explanations for each concept
• Include practical examples where relevant

*Add more content to get a comprehensive AI-generated summary.*`);
        return;
      }

      const analysis = analyzeContent(content);
      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      // Generate content-based summary
      const contentSummary = `📚 **${currentNotebook.title} - Study Summary**

**Content Overview:**
• ${currentNotebook.pages.length} pages of detailed notes
• ${wordCount} words of study material
• Estimated reading time: ${readingTime} minutes

**Key Concepts Identified:**
${analysis.concepts.slice(0, 6).map(concept => `• ${concept.charAt(0).toUpperCase() + concept.slice(1)}`).join('\n')}

**Main Topics Covered:**
${analysis.topics.slice(0, 3).map((topic, i) => `${i + 1}. ${topic.length > 100 ? topic.substring(0, 100) + '...' : topic}`).join('\n')}

**Study Insights:**
• Content depth: ${wordCount > 2000 ? 'Comprehensive' : wordCount > 1000 ? 'Detailed' : wordCount > 500 ? 'Moderate' : 'Basic'}
• Most frequent concepts: ${analysis.concepts.slice(0, 3).join(', ')}

**Personalized Recommendations:**
• Create flashcards for the key concepts listed above
• Quiz yourself on the main topics covered
• Review areas where concepts repeat frequently
• Consider expanding on topics that seem underdeveloped

**Progress Tracking:**
• Pages completed: ${currentNotebook.pages.filter(p => (p.leftContent || '').length > 50 || (p.rightContent || '').length > 50).length}/${currentNotebook.pages.length}
• Content richness: ${Math.round((wordCount / currentNotebook.pages.length) / 10)}% average per page

*This summary is generated from your personal study notes and reflects your learning progress.*`;

      setSummary(contentSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error generating summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [currentNotebook, getAllNotebookContent, analyzeContent]);

  // CRITICAL FIX: Handle chat with context awareness
  const handleChatMessage = useCallback(async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);
    
    try {
      const content = getAllNotebookContent();
      const analysis = analyzeContent(content);
      
      // Generate context-aware response
      let aiResponse = '';
      
      if (!content || content.length < 50) {
        aiResponse = `I'd love to help with "${userMessage}", but I notice "${currentNotebook?.title}" doesn't have much content yet. Once you add more notes, I can provide more specific insights about your study material.

For now, I can help you:
• Plan what to study next
• Suggest note-taking strategies
• Explain study techniques

What would you like to focus on?`;
      } else {
        // Context-aware response based on notebook content
        const relevantConcepts = analysis.concepts.filter(concept => 
          userMessage.toLowerCase().includes(concept) || 
          concept.includes(userMessage.toLowerCase().split(' ')[0])
        );

        aiResponse = `Great question about "${userMessage}"! Based on your "${currentNotebook?.title || 'notebook'}" notes:

${relevantConcepts.length > 0 ? 
  `**Related concepts in your notes:** ${relevantConcepts.slice(0, 3).join(', ')}` : 
  `**Key topics in your notes:** ${analysis.concepts.slice(0, 3).join(', ')}`}

**From your study material:**
${analysis.topics.length > 0 ? 
  analysis.topics[0].substring(0, 200) + (analysis.topics[0].length > 200 ? '...' : '') : 
  `You have ${currentNotebook?.pages.length ?? 0} pages covering various topics.`}

**Study suggestions:**
• Review the concepts: ${analysis.concepts.slice(0, 3).join(', ')}
• Try the flashcard feature to test your knowledge
• Take the quiz to identify areas needing more focus

Would you like me to generate flashcards or a quiz based on your notes?`;
      }

      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        setIsChatLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error in chat:', error);
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      setIsChatLoading(false);
    }
  }, [chatInput, currentNotebook, getAllNotebookContent, analyzeContent]);

  // Quiz answer handling
  const handleQuizAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
    
    // Auto advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowQuizResults(true);
      }
    }, 2000);
  }, [selectedAnswer, quizQuestions, currentQuestionIndex]);

  const mainTools = [
    {
      id: 'chat',
      icon: MessageSquare,
      label: 'AI Chat',
      description: `Ask questions about "${currentNotebook?.title || 'your notes'}"`,
      action: () => {
        setChatExpanded(!chatExpanded);
        setActiveFeature(chatExpanded ? null : 'chat');
      }
    },
    {
      id: 'flashcards',
      icon: BookOpen,
      label: 'Generate Flashcards',
      description: `Create study cards from ${currentNotebook?.title || 'your notes'}`,
      action: generateFlashcards,
      loading: isGeneratingFlashcards
    },
    {
      id: 'quiz',
      icon: Brain,
      label: 'Quiz Me',
      description: `Test knowledge of ${currentNotebook?.title || 'your notes'}`,
      action: generateQuiz,
      loading: isGeneratingQuiz
    }
  ];

  const advancedTools = [
    {
      id: 'summarize',
      icon: FileText,
      label: 'Summarize Notes',
      description: `Get insights from ${currentNotebook?.title || 'your notes'}`,
      action: generateSummary,
      loading: isGeneratingSummary
    },
    {
      id: 'insights',
      icon: Lightbulb,
      label: 'Study Insights',
      description: 'Discover patterns and connections',
      action: () => setActiveFeature('insights')
    },
    {
      id: 'goals',
      icon: Target,
      label: 'Learning Goals',
      description: 'Track your progress and objectives',
      action: () => setActiveFeature('goals')
    }
  ];

  if (studyMode !== 'study') {
    return null;
  }

  return (
    <div className="h-full bg-[#FAF7F0] border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Study Buddy</h3>
            <p className="text-xs text-gray-500">
              {currentNotebook ? `Analyzing: ${currentNotebook.title}` : 'Ready to help you learn'}
            </p>
          </div>
        </div>
        {/* CRITICAL FIX: Add content status indicator */}
        {currentNotebook && (
          <div className="mt-2 text-xs">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
              getAllNotebookContent().length > 100 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                getAllNotebookContent().length > 100 ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              {getAllNotebookContent().length > 100 
                ? 'Rich content detected' 
                : 'Add more notes for better AI insights'
              }
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Feature Display */}
        {activeFeature === 'flashcards' && flashcards.length > 0 && (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Flashcards from {currentNotebook?.title}</h4>
                <div className="text-sm text-gray-500">
                  {currentFlashcardIndex + 1} of {flashcards.length}
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 min-h-[120px] cursor-pointer transition-transform hover:scale-105"
                onClick={() => setShowFlashcardBack(!showFlashcardBack)}
              >
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">
                    {showFlashcardBack ? 'Answer' : 'Question'}
                  </div>
                  <div className="text-gray-900 font-medium">
                    {showFlashcardBack 
                      ? flashcards[currentFlashcardIndex].back
                      : flashcards[currentFlashcardIndex].front
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    setCurrentFlashcardIndex(Math.max(0, currentFlashcardIndex - 1));
                    setShowFlashcardBack(false);
                  }}
                  disabled={currentFlashcardIndex === 0}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setShowFlashcardBack(!showFlashcardBack)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {showFlashcardBack ? 'Show Question' : 'Show Answer'}
                </button>
                
                <button
                  onClick={() => {
                    setCurrentFlashcardIndex(Math.min(flashcards.length - 1, currentFlashcardIndex + 1));
                    setShowFlashcardBack(false);
                  }}
                  disabled={currentFlashcardIndex === flashcards.length - 1}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Display */}
        {activeFeature === 'quiz' && quizQuestions.length > 0 && !showQuizResults && (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Quiz on {currentNotebook?.title}</h4>
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-900 font-medium mb-4">
                  {quizQuestions[currentQuestionIndex].question}
                </div>
                
                <div className="space-y-2">
                  {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedAnswer === null
                          ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : selectedAnswer === index
                            ? index === quizQuestions[currentQuestionIndex].correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-red-500 bg-red-50 text-red-800'
                            : index === quizQuestions[currentQuestionIndex].correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {selectedAnswer !== null && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      {quizQuestions[currentQuestionIndex].explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {activeFeature === 'quiz' && showQuizResults && (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <h4 className="font-semibold text-gray-900 mb-4">Quiz Complete!</h4>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {quizScore}/{quizQuestions.length}
              </div>
              <div className="text-gray-600 mb-4">
                {Math.round((quizScore / quizQuestions.length) * 100)}% Correct
              </div>
              <button
                onClick={() => {
                  setShowQuizResults(false);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setQuizScore(0);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        )}

        {/* Summary Display */}
        {activeFeature === 'summary' && summary && (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Study Summary</h4>
              <div className="prose prose-sm text-gray-700 whitespace-pre-line">
                {summary}
              </div>
            </div>
          </div>
        )}

        {/* Main Tools */}
        {!activeFeature && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            {mainTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  onClick={tool.action}
                  disabled={tool.loading}
                  className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                      {tool.loading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                      ) : (
                        <Icon className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm">{tool.label}</div>
                      <div className="text-xs text-gray-500">{tool.description}</div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Advanced Tools */}
        {!activeFeature && (
          <div className="px-4">
            <motion.button
              onClick={() => toggleSection('advanced')}
              className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              whileHover={{ x: 2 }}
            >
              <span>More Study Tools</span>
              <motion.div
                animate={{ rotate: expandedSections.has('advanced') ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedSections.has('advanced') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-4">
                    {advancedTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <motion.button
                          key={tool.id}
                          onClick={tool.action}
                          disabled={tool.loading}
                          className="w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group text-left disabled:opacity-50"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-colors">
                              {tool.loading ? (
                                <div className="animate-spin w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full" />
                              ) : (
                                <Icon className="w-3 h-3 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-xs">{tool.label}</div>
                              <div className="text-xs text-gray-500">{tool.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* AI Chat Expansion */}
        <AnimatePresence>
          {chatExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 300, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="mx-4 mb-4 bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">AI Chat</span>
                </div>
                <button
                  onClick={() => {
                    setChatExpanded(false);
                    setActiveFeature(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 h-full flex flex-col">
                <div className="flex-1 space-y-2 mb-3 overflow-y-auto">
                  {chatMessages.length === 0 && (
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-sm text-blue-800">
                        I'm ready to help with your {currentNotebook?.title || 'notebook'} studies. I can analyze your content and answer questions!
                      </p>
                    </div>
                  )}
                  
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-2 ${
                        message.role === 'user'
                          ? 'bg-gray-100 ml-4'
                          : 'bg-blue-50 mr-4'
                      }`}
                    >
                      <p className={`text-sm ${
                        message.role === 'user' ? 'text-gray-800' : 'text-blue-800'
                      }`}>
                        {message.content}
                      </p>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="bg-blue-50 rounded-lg p-2 mr-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                        <span className="text-sm text-blue-800">Analyzing your notes...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatMessage()}
                    placeholder={`Ask about ${currentNotebook?.title || 'your notes'}...`}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleChatMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back Button */}
      {activeFeature && activeFeature !== 'chat' && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setActiveFeature(null)}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            ← Back to Study Tools
          </button>
        </div>
      )}

      {/* Smart Suggestions */}
      {!activeFeature && (
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm text-yellow-800">Smart Tip</h5>
                <p className="text-xs text-yellow-700 mt-1">
                  {getAllNotebookContent().length > 100
                    ? `Perfect! "${currentNotebook?.title}" has rich content. Try generating flashcards or taking a quiz!`
                    : `Add more detailed notes to "${currentNotebook?.title || 'your notebook'}" for better AI insights.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}