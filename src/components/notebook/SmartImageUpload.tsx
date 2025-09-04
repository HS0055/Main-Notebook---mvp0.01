"use client";

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  Wand2, 
  Download, 
  RotateCcw, 
  Sparkles,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Move3D,
  Zap,
  Check,
  X
} from 'lucide-react';
import { AILayoutEngine, useAILayoutEngine } from './AILayoutEngine';

interface PaperStyle {
  lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music' | 'calendar';
  lineSpacing: 'narrow' | 'normal' | 'wide';
  marginLine: boolean;
  paperColor: string;
  lineColor: string;
}

interface SmartImageUploadProps {
  paperStyle: PaperStyle;
  onImageInsert?: (imageData: string, metadata: any) => void;
  onClose?: () => void;
  isVisible?: boolean;
}

export default function SmartImageUpload({ 
  paperStyle, 
  onImageInsert,
  onClose,
  isVisible = false 
}: SmartImageUploadProps) {
  // Generation modes
  const [mode, setMode] = useState<'prompt' | 'reference' | 'image+prompt'>('image+prompt');
  const [prompt, setPrompt] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState<any[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number>(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [overlaySettings, setOverlaySettings] = useState({
    opacity: 0.3,
    autoContrast: true,
    textDetection: false,
    lineAlign: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { generateLayouts, analyzeImage } = useAILayoutEngine();

  // Process image with AI
  const processImage = useCallback(async (imageSrc?: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/ai-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: imageSrc,
          prompt: prompt,
          mode: mode === 'reference' ? 'reference' : mode === 'prompt' ? 'prompt' : 'image+prompt',
          paperStyle: paperStyle,
          options: overlaySettings,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setGeneratedVariations(data.layouts.map((layout: any) => ({
          name: layout.name,
          description: layout.description,
          dataUrl: layout.imageData,
          analysis: layout.analysis,
        })));
        setSelectedVariation(0);
      } else {
        console.error('AI Layout API error:', data.error);
        alert('Failed to generate layouts: ' + data.error);
      }
    } catch (error) {
      console.error('Error processing image with AI:', error);
      alert('Error processing image with AI.');
    } finally {
      setIsProcessing(false);
    }
  }, [prompt, mode, paperStyle, overlaySettings]);

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file too large. Please select an image under 10MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      // Don't auto-process, wait for user to click Generate Layouts button
    };
    reader.readAsDataURL(file);
  }, [mode, processImage]);

  // Reset component state
  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setImagePreview('');
    setGeneratedVariations([]);
    setSelectedVariation(0);
    setShowOriginal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Prompt-only layout generator (using API)
  const generateFromPrompt = useCallback(async (promptText: string) => {
    if (!promptText.trim()) return;
    setPrompt(promptText);
    await processImage(); // Call processImage without image data for prompt-only mode
  }, [processImage]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const syntheticEvent = {
        target: { files: [imageFile] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(syntheticEvent);
    }
  }, [handleFileSelect]);

  // Save selected layout to notebook
  const handleSaveLayout = useCallback(() => {
    if (!generatedVariations.length || !generatedVariations[selectedVariation]) return;
    
    const variation = generatedVariations[selectedVariation];
    
    // Check if this is an SVG template (contains SVG data)
    const isSvgTemplate = variation.dataUrl.includes('svg') || variation.dataUrl.startsWith('data:image/svg');
    
    // ALWAYS treat AI-generated layouts as templates
    const isTemplate = true; // Force all AI layouts to be templates
    
    const metadata = {
      originalFileName: selectedFile?.name || 'generated-from-prompt',
      originalSize: selectedFile?.size || 0,
      generatedAt: new Date().toISOString(),
      paperStyleUsed: paperStyle,
      aiAnalysis: variation.analysis,
      layoutName: variation.name,
      overlaySettings,
      isTemplate: isTemplate, // Always true for AI layouts
      layoutData: variation.dataUrl,
      mode: mode
    };
    
    console.log('SmartImageUpload: Saving layout', {
      isTemplate: metadata.isTemplate,
      isSvgTemplate,
      hasLayoutData: !!metadata.layoutData,
      dataUrl: variation.dataUrl,
      layoutDataPreview: metadata.layoutData?.substring(0, 100) + '...'
    });
    
    onImageInsert?.(variation.dataUrl, metadata);
    handleReset();
    onClose?.();
  }, [generatedVariations, selectedVariation, selectedFile, paperStyle, overlaySettings, onImageInsert, mode, handleReset, onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Smart Image Layout</h2>
                <p className="text-sm text-gray-500">AI-powered paper overlay generator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Mode selector */}
          <div className="mt-4 flex items-center gap-2">
            {(['prompt','reference','image+prompt'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setGeneratedVariations([]); setSelectedFile(null); setImagePreview(''); }}
                className={`px-3 py-1.5 rounded-full text-sm border ${mode===m? 'bg-purple-600 text-white border-purple-600':'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {m==='prompt' ? 'Prompt only' : m==='reference' ? 'Reference image' : 'Image + prompt'}
              </button>
            ))}
            <div className="ml-auto w-[420px]">
              <input
                placeholder="Describe any layout (e.g. 'weekly planner with drawing section', 'habit tracker + meal plan', 'study notes with timeline')"
                value={prompt}
                onChange={(e)=>setPrompt(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            {mode==='prompt' && (
              <button
                onClick={()=>{ setSelectedFile(null); setImagePreview(''); generateFromPrompt(prompt || 'weekly notes'); }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </span>
                ) : 'Generate'}
              </button>
            )}
            {mode!=='prompt' && imagePreview && (
              <button
                onClick={()=>{ processImage(imagePreview); }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </span>
                ) : 'Generate Layouts'}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-y-auto">
          {/* Upload Area */}
          {!selectedFile && mode!=='prompt' && (
            <div className="flex-1 p-8 flex items-center justify-center">
              <div 
                className="w-full max-w-md border-3 border-dashed border-purple-300 rounded-xl p-12 text-center hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-purple-50/30 to-blue-50/30 shadow-sm hover:shadow-md"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="space-y-4"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-colors">
                    <Upload className="w-10 h-10 text-purple-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload Your Image
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Drop an image here or click to browse
                    </p>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>📱 Perfect for planner photos</div>
                      <div>📝 Handwritten notes digitization</div>
                      <div>📊 Chart and diagram overlay</div>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 text-sm text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                    <Sparkles className="w-4 h-4" />
                    <span>AI will enhance with paper lines</span>
                  </div>
                </motion.div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Processing & Preview */}
          {(selectedFile && mode!=='prompt') || (mode==='prompt' && generatedVariations.length>0) ? (
            <div className="flex-1 flex">
              {/* Left Panel - Original Image */}
              <div className="w-1/2 p-4 border-r border-gray-200">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{mode==='prompt' ? 'Prompt Preview' : 'Original Image'}</h3>
                    <div className="flex items-center gap-2">
                      {mode!=='prompt' && (
                      <button
                        onClick={() => setShowOriginal(!showOriginal)}
                        className={`p-2 rounded-lg transition-colors ${
                          showOriginal ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {showOriginal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>) }
                      <button
                        onClick={handleReset}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden relative">
                    {mode==='prompt' ? (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 p-4">
                        <div className="text-center">
                          <div className="mb-2 font-medium text-gray-700">Prompt</div>
                          <div className="bg-white border rounded p-3 max-h-48 overflow-auto text-left">
                            {prompt || 'Describe the layout you want...'}
                          </div>
                        </div>
                      </div>
                    ) : imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Original" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p>Drop an image here or click to upload</p>
                        </div>
                      </div>
                    )}
                    
                    {/* File Info Overlay */}
                    {selectedFile && (
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded text-xs">
                        <div className="flex items-center justify-between">
                          <span>{selectedFile.name}</span>
                          <span>{(selectedFile.size / 1024 / 1024).toFixed(2)}MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - AI Generated Layouts */}
              <div className="w-1/2 p-4">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      AI Enhanced
                    </h3>
                    {isProcessing && (
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                        <span>Processing...</span>
                      </div>
                    )}
                  </div>
                  
                  {isProcessing && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="animate-pulse">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mx-auto mb-4" />
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-32 mx-auto" />
                            <div className="h-3 bg-gray-200 rounded w-24 mx-auto" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          AI is analyzing your image and generating layouts...
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {generatedVariations.length > 0 && (
                    <div className="flex-1 flex flex-col">
                      {/* Layout Preview */}
                      <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden relative mb-4">
                        <img 
                          src={showOriginal ? imagePreview : (generatedVariations[selectedVariation]?.dataUrl || imagePreview)} 
                          alt="Enhanced" 
                          className="w-full h-full object-contain"
                        />
                        
                        {/* Enhancement Info */}
                        <div className="absolute top-2 left-2 right-2">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                            <div className="text-xs font-medium text-gray-900">
                              {showOriginal ? 'Original Image' : (generatedVariations[selectedVariation]?.name || 'Processing...')}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {showOriginal ? 'No enhancements applied' : (generatedVariations[selectedVariation]?.description || 'Generating layout variations...')}
                            </div>
                          </div>
                        </div>
                        
                        {/* AI Analysis Badge */}
                        {!showOriginal && generatedVariations[selectedVariation]?.analysis && (
                          <div className="absolute bottom-2 right-2">
                            <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              <span>AI Enhanced</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Layout Variations */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Choose Layout Style</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {generatedVariations.map((variation, index) => (
                            <motion.button
                              key={index}
                              onClick={() => setSelectedVariation(index)}
                              className={`relative p-2 rounded-lg border-2 transition-all overflow-hidden ${
                                selectedVariation === index
                                  ? 'border-purple-500 ring-2 ring-purple-200'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="aspect-video">
                                <img 
                                  src={variation.dataUrl} 
                                  alt={variation.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              
                              <div className="absolute bottom-1 left-1 right-1 text-white">
                                <div className="text-xs font-medium truncate">{variation.name}</div>
                              </div>
                              
                              {selectedVariation === index && (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Controls */}
        {(mode==='prompt' || selectedFile) && generatedVariations.length > 0 && (
          <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-white/95 backdrop-blur z-10">
            <div className="flex items-center justify-between">
              {/* Enhancement Options */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Overlay Opacity:</label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.1"
                    value={overlaySettings.opacity}
                    onChange={(e) => setOverlaySettings(prev => ({
                      ...prev,
                      opacity: parseFloat(e.target.value)
                    }))}
                    className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round(overlaySettings.opacity * 100)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoContrast"
                    checked={overlaySettings.autoContrast}
                    onChange={(e) => setOverlaySettings(prev => ({
                      ...prev,
                      autoContrast: e.target.checked
                    }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="autoContrast" className="text-sm text-gray-700">
                    Auto Contrast
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showOriginal ? 'Show Enhanced' : 'Show Original'}</span>
                </button>
                
                <button
                  onClick={handleSaveLayout}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Insert into Notebook</span>
                </button>
              </div>
            </div>
            
            {/* AI Analysis Summary */}
            {generatedVariations[selectedVariation]?.analysis && (
              <div className="mt-4 bg-white rounded-lg p-3 border border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  AI Analysis Summary
                </h5>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Suggested Style:</span>
                    <div className="font-medium capitalize text-purple-700">
                      {generatedVariations[selectedVariation]?.analysis?.suggestedLineType || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Optimal Spacing:</span>
                    <div className="font-medium capitalize text-blue-700">
                      {generatedVariations[selectedVariation]?.analysis?.optimalSpacing || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Content Areas:</span>
                    <div className="font-medium text-green-700">
                      {generatedVariations[selectedVariation]?.analysis?.contentAreas?.length || 0} detected
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">AI is working its magic...</h3>
                <p className="text-sm text-gray-500">
                  Analyzing content, detecting patterns, and generating layouts
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
