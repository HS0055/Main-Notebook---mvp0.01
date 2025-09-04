import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  Lightbulb,
  Image,
  Type,
  Layers,
  TrendingUp,
  Star,
  MessageSquare
} from 'lucide-react';

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

interface UnifiedLayout {
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
}

interface UnifiedAILayoutProps {
  isVisible: boolean;
  onClose: () => void;
  onLayoutInsert: (layoutData: any) => void;
  paperStyle?: any;
  userId?: string;
}

export default function UnifiedAILayout({
  isVisible,
  onClose,
  onLayoutInsert,
  paperStyle,
  userId
}: UnifiedAILayoutProps) {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mode, setMode] = useState<'prompt' | 'image' | 'hybrid'>('prompt');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLayouts, setGeneratedLayouts] = useState<UnifiedLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [elementValues, setElementValues] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [learning, setLearning] = useState<any>(null);
  const [feedback, setFeedback] = useState<number>(5);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const promptInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isVisible && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [isVisible]);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Generate layouts using unified system
  const handleGenerateLayouts = useCallback(async () => {
    if (!prompt.trim() && !imageFile) return;

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt.trim());
      formData.append('mode', mode);
      formData.append('paperStyle', JSON.stringify(paperStyle));
      if (userId) formData.append('userId', userId);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch('/api/ai-layout-unified', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedLayouts(data.layouts);
        setSuggestions(data.suggestions || []);
        setLearning(data.learning);
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
  }, [prompt, imageFile, mode, paperStyle, userId]);

  // Handle element changes
  const handleElementChange = useCallback((elementId: string, value: string) => {
    setElementValues(prev => ({ ...prev, [elementId]: value }));
  }, []);

  // Save layout and provide feedback
  const handleLayoutSave = useCallback(async (layoutData: any) => {
    const enhancedLayoutData = {
      ...layoutData,
      isTemplate: true,
      isEditable: true,
      unifiedGenerated: true,
      originalPrompt: prompt,
      timestamp: new Date().toISOString()
    };
    
    onLayoutInsert(enhancedLayoutData);
    
    // Send feedback to learning system
    if (userId && generatedLayouts[selectedLayout]) {
      try {
        await fetch('/api/ai-layout-unified', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            prompt,
            selectedLayout: generatedLayouts[selectedLayout],
            feedback
          })
        });
      } catch (error) {
        console.error('Failed to send feedback:', error);
      }
    }
    
    onClose();
  }, [prompt, generatedLayouts, selectedLayout, feedback, userId, onLayoutInsert, onClose]);

  // Handle key down
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateLayouts();
    }
  }, [handleGenerateLayouts]);

  // Reset form
  const handleReset = useCallback(() => {
    setPrompt('');
    setImageFile(null);
    setImagePreview('');
    setGeneratedLayouts([]);
    setSelectedLayout(0);
    setShowPreview(false);
    setElementValues({});
    setSuggestions([]);
    setLearning(null);
    setFeedback(5);
    setShowFeedback(false);
  }, []);

  // Render editable element
  const renderEditableElement = useCallback((element: EditableElement) => {
    const value = elementValues[element.id] || '';
    const isActive = false; // Could add active state management

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      fontSize: element.style?.fontSize || 14,
      fontFamily: element.style?.fontFamily || 'inherit',
      color: element.style?.color || '#333',
      backgroundColor: element.style?.backgroundColor || 'transparent',
      border: element.style?.border || '1px solid #E5E5E5',
      borderRadius: '4px',
      padding: '4px 8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      zIndex: 1
    };

    switch (element.type) {
      case 'text':
        return (
          <input
            key={element.id}
            type="text"
            value={value}
            placeholder={element.placeholder}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            style={baseStyle}
            className="editable-element"
          />
        );
      case 'textarea':
        return (
          <textarea
            key={element.id}
            value={value}
            placeholder={element.placeholder}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            style={{ ...baseStyle, resize: 'none' }}
            className="editable-element"
          />
        );
      case 'select':
        return (
          <select
            key={element.id}
            value={value}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            style={baseStyle}
            className="editable-element"
          >
            <option value="">Select...</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className="editable-element flex items-center justify-center cursor-pointer"
            onClick={() => handleElementChange(element.id, value === 'true' ? 'false' : 'true')}
          >
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={() => {}}
              style={{ margin: 0 }}
            />
          </div>
        );
      case 'date':
        return (
          <input
            key={element.id}
            type="date"
            value={value}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            style={baseStyle}
            className="editable-element"
          />
        );
      case 'number':
        return (
          <input
            key={element.id}
            type="number"
            value={value}
            placeholder={element.placeholder}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            style={baseStyle}
            className="editable-element"
          />
        );
      default:
        return null;
    }
  }, [elementValues, handleElementChange]);

  if (!isVisible) {
    console.log('UnifiedAILayout: Not visible, returning null');
    return null;
  }

  console.log('UnifiedAILayout: Rendering modal');
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Unified AI Layout System</h2>
                <p className="text-gray-600">Trainable • Scalable • Intelligent</p>
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
              /* Input Section */
              <div className="p-6">
                <div className="max-w-5xl mx-auto">
                  {/* Mode Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Generation Mode
                    </label>
                    <div className="flex gap-2">
                      {[
                        { key: 'prompt', label: 'Text Prompt', icon: Type, desc: 'Generate from description' },
                        { key: 'image', label: 'Image Analysis', icon: Image, desc: 'Analyze uploaded image' },
                        { key: 'hybrid', label: 'Hybrid AI', icon: Layers, desc: 'Combine text + image' }
                      ].map(({ key, label, icon: Icon, desc }) => (
                        <button
                          key={key}
                          onClick={() => setMode(key as any)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                            mode === key
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <div className="text-left">
                            <div className="font-medium">{label}</div>
                            <div className="text-xs opacity-75">{desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Input */}
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
                        disabled={(!prompt.trim() && !imageFile) || isGenerating}
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

                  {/* Image Upload */}
                  {(mode === 'image' || mode === 'hybrid') && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Reference Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {imagePreview ? (
                          <div className="space-y-4">
                            <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded" />
                            <button
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview('');
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">Click to upload or drag and drop</p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                              }}
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              Choose File
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        AI Suggestions
                      </h3>
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

                  {/* Learning Status */}
                  {learning && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">AI Learning Active</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        {learning.improved ? 'Improved patterns detected' : 'Standard patterns used'}
                        {learning.newPatterns.length > 0 && ` • ${learning.newPatterns.length} new patterns generated`}
                      </p>
                    </div>
                  )}
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
                          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                            selectedLayout === index
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span>{layout.name}</span>
                          <span className="text-xs opacity-75">
                            ({Math.round(layout.confidence * 100)}%)
                          </span>
                          {layout.metadata.source === 'generated' && (
                            <Star className="w-3 h-3" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Layout Preview */}
                <div className="flex-1 overflow-auto p-6">
                  {generatedLayouts[selectedLayout] && (
                    <div className="max-w-5xl mx-auto">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {generatedLayouts[selectedLayout].name}
                            </h3>
                            <p className="text-gray-600">
                              {generatedLayouts[selectedLayout].description}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm text-gray-500">
                              <div>Confidence: {Math.round(generatedLayouts[selectedLayout].confidence * 100)}%</div>
                              <div>Complexity: {generatedLayouts[selectedLayout].analysis.complexity}</div>
                              <div>Elements: {generatedLayouts[selectedLayout].editableElements.length}</div>
                            </div>
                            <button
                              onClick={() => setShowFeedback(!showFeedback)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Rate this layout"
                            >
                              <MessageSquare className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Feedback Panel */}
                        {showFeedback && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Rate this layout (1-10):
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={feedback}
                              onChange={(e) => setFeedback(Number(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Poor</span>
                              <span className="font-medium">{feedback}/10</span>
                              <span>Excellent</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Editable Layout */}
                      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="w-full h-auto"
                          style={{ pointerEvents: 'none' }}
                          dangerouslySetInnerHTML={{ 
                            __html: generatedLayouts[selectedLayout].svgData 
                          }}
                        />
                        
                        {/* Editable Elements Overlay */}
                        <div className="absolute inset-0">
                          {generatedLayouts[selectedLayout].editableElements.map(renderEditableElement)}
                        </div>
                      </div>
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
                  Back to Input
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {showPreview && generatedLayouts[selectedLayout] && (
                <button
                  onClick={() => handleLayoutSave(generatedLayouts[selectedLayout])}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Insert Layout</span>
                </button>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Zap className="w-4 h-4" />
                <span>Unified AI System</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
