import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Download, 
  Eye, 
  EyeOff, 
  Wand2,
  Brain,
  Zap,
  Lightbulb
} from 'lucide-react';
import EditableLayout from './EditableLayout';

interface EditableElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'date' | 'number' | 'select';
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
}

interface RAGLayout {
  name: string;
  description: string;
  category: string;
  confidence: number;
  svgData: string;
  editableElements: EditableElement[];
  metadata: {
    source: string;
    popularity: number;
    tags: string[];
  };
}

interface EnhancedSmartImageUploadProps {
  isVisible: boolean;
  onClose: () => void;
  onLayoutInsert: (layoutData: any) => void;
  paperStyle?: any;
}

export default function EnhancedSmartImageUpload({
  isVisible,
  onClose,
  onLayoutInsert,
  paperStyle
}: EnhancedSmartImageUploadProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLayouts, setGeneratedLayouts] = useState<RAGLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [elementValues, setElementValues] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const promptInputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isVisible && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [isVisible]);

  const handleGenerateLayouts = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-layout-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          editable: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedLayouts(data.layouts);
        setSuggestions(data.suggestions || []);
        setSelectedLayout(0);
        setShowPreview(true);
      } else {
        console.error('Failed to generate layouts:', data.error);
      }
    } catch (error) {
      console.error('Error generating layouts:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt]);

  const handleElementChange = useCallback((elementId: string, value: string) => {
    setElementValues(prev => ({ ...prev, [elementId]: value }));
  }, []);

  const handleLayoutSave = useCallback((layoutData: any) => {
    const enhancedLayoutData = {
      ...layoutData,
      isTemplate: true,
      isEditable: true,
      ragGenerated: true,
      originalPrompt: prompt,
      timestamp: new Date().toISOString()
    };
    
    onLayoutInsert(enhancedLayoutData);
    onClose();
  }, [prompt, onLayoutInsert, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateLayouts();
    }
  }, [handleGenerateLayouts]);

  const handleReset = useCallback(() => {
    setPrompt('');
    setGeneratedLayouts([]);
    setSelectedLayout(0);
    setShowPreview(false);
    setElementValues({});
    setSuggestions([]);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Layout Generator</h2>
                <p className="text-gray-600">Powered by RAG & Machine Learning</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!showPreview ? (
              /* Prompt Input */
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your ideal layout
                    </label>
                    <div className="relative">
                      <input
                        ref={promptInputRef}
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., 'weekly planner with habit tracker and mood journal', 'study notes with pomodoro timer', 'meeting notes with action items'"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                      />
                      <button
                        onClick={handleGenerateLayouts}
                        disabled={!prompt.trim() || isGenerating}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isGenerating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <Wand2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">💡 Suggestions</h3>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setPrompt(suggestion)}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { title: "Productivity", examples: ["Bullet journal weekly", "Habit tracker", "Goal setting"] },
                      { title: "Study", examples: ["Cornell notes", "Mind maps", "Flashcards"] },
                      { title: "Creative", examples: ["Mood journal", "Art planning", "Story writing"] },
                      { title: "Business", examples: ["Meeting notes", "Project planning", "Time tracking"] },
                      { title: "Fitness", examples: ["Workout logs", "Nutrition tracking", "Progress charts"] },
                      { title: "Custom", examples: ["Any combination", "Your unique idea", "Personalized layout"] }
                    ].map((category, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{category.title}</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {category.examples.map((example, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-purple-500" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Layout Preview */
              <div className="flex-1 flex flex-col">
                {/* Layout Selector */}
                {generatedLayouts.length > 1 && (
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {generatedLayouts.map((layout, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedLayout(index)}
                          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            selectedLayout === index
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {layout.name}
                          <span className="ml-2 text-xs opacity-75">
                            ({Math.round(layout.confidence * 100)}%)
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Layout Preview */}
                <div className="flex-1 overflow-auto p-6">
                  {generatedLayouts[selectedLayout] && (
                    <div className="max-w-4xl mx-auto">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {generatedLayouts[selectedLayout].name}
                        </h3>
                        <p className="text-gray-600">
                          {generatedLayouts[selectedLayout].description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Category: {generatedLayouts[selectedLayout].category}</span>
                          <span>Confidence: {Math.round(generatedLayouts[selectedLayout].confidence * 100)}%</span>
                          <span>Popularity: {generatedLayouts[selectedLayout].metadata.popularity}/100</span>
                        </div>
                      </div>

                      <EditableLayout
                        svgData={generatedLayouts[selectedLayout].svgData}
                        editableElements={generatedLayouts[selectedLayout].editableElements}
                        onElementChange={handleElementChange}
                        onLayoutSave={handleLayoutSave}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Reset
              </button>
              {showPreview && (
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back to Prompt
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lightbulb className="w-4 h-4" />
                <span>Powered by RAG & ML</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
