"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  Wand2, 
  Download, 
  RotateCcw, 
  Grid3X3, 
  Calendar,
  FileText,
  Layers,
  Sparkles,
  Settings,
  Eye,
  EyeOff,
  Move,
  CornerDownRight
} from 'lucide-react';

interface PaperStyle {
  lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music' | 'calendar';
  lineSpacing: 'narrow' | 'normal' | 'wide';
  marginLine: boolean;
  paperColor: string;
  lineColor: string;
}

interface ImageLayoutProps {
  paperStyle: PaperStyle;
  onImageSave?: (imageData: string, layout: any) => void;
  isVisible?: boolean;
}

interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  generate: (image: HTMLImageElement, paperStyle: PaperStyle) => string;
}

export default function ImageLayoutGenerator({ 
  paperStyle, 
  onImageSave,
  isVisible = false 
}: ImageLayoutProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLayouts, setGeneratedLayouts] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.3);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Layout templates that AI can generate
  const layoutTemplates: LayoutTemplate[] = [
    {
      id: 'ruled-overlay',
      name: 'Ruled Paper Overlay',
      description: 'Classic notebook lines over your image',
      icon: FileText,
      generate: (img, style) => generateRuledOverlay(img, style)
    },
    {
      id: 'calendar-planner',
      name: 'Calendar Planner',
      description: 'Transform image into a calendar layout',
      icon: Calendar,
      generate: (img, style) => generateCalendarLayout(img, style)
    },
    {
      id: 'grid-system',
      name: 'Grid System',
      description: 'Overlay grid lines for structured layouts',
      icon: Grid3X3,
      generate: (img, style) => generateGridOverlay(img, style)
    },
    {
      id: 'smart-margins',
      name: 'Smart Margins',
      description: 'AI detects content and adds appropriate margins',
      icon: Layers,
      generate: (img, style) => generateSmartMargins(img, style)
    }
  ];

  // Generate ruled paper overlay
  const generateRuledOverlay = useCallback((img: HTMLImageElement, style: PaperStyle): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image
    ctx.drawImage(img, 0, 0);
    
    // Calculate line spacing based on style
    const lineSpacingMap = {
      narrow: 18,
      normal: 24,
      wide: 32
    };
    const spacing = lineSpacingMap[style.lineSpacing];
    
    // Draw ruled lines
    ctx.strokeStyle = style.lineColor;
    ctx.globalAlpha = overlayOpacity;
    ctx.lineWidth = 1;
    
    for (let y = spacing; y < canvas.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(style.marginLine ? 60 : 0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw margin line if enabled
    if (style.marginLine) {
      ctx.strokeStyle = '#FF6B6B';
      ctx.globalAlpha = overlayOpacity * 0.8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, canvas.height);
      ctx.stroke();
    }
    
    return canvas.toDataURL();
  }, [overlayOpacity]);

  // Generate calendar layout
  const generateCalendarLayout = useCallback((img: HTMLImageElement, style: PaperStyle): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image with reduced opacity
    ctx.globalAlpha = 0.4;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = 1;
    
    // Draw calendar grid
    ctx.strokeStyle = style.lineColor;
    ctx.globalAlpha = overlayOpacity;
    ctx.lineWidth = 1;
    
    const cellWidth = canvas.width / 7; // 7 days
    const cellHeight = (canvas.height - 60) / 6; // 6 weeks
    const startY = 60; // Leave space for header
    
    // Draw grid
    for (let i = 0; i <= 7; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, startY);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, startY + i * cellHeight);
      ctx.lineTo(canvas.width, startY + i * cellHeight);
      ctx.stroke();
    }
    
    // Add day headers
    ctx.fillStyle = style.lineColor;
    ctx.globalAlpha = 0.8;
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    days.forEach((day, i) => {
      ctx.fillText(day, (i + 0.5) * cellWidth, 30);
    });
    
    return canvas.toDataURL();
  }, [overlayOpacity]);

  // Generate grid overlay
  const generateGridOverlay = useCallback((img: HTMLImageElement, style: PaperStyle): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image
    ctx.drawImage(img, 0, 0);
    
    // Calculate grid spacing
    const spacing = style.lineSpacing === 'narrow' ? 15 : style.lineSpacing === 'wide' ? 30 : 20;
    
    // Draw grid
    ctx.strokeStyle = style.lineColor;
    ctx.globalAlpha = overlayOpacity;
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = spacing; x < canvas.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = spacing; y < canvas.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    return canvas.toDataURL();
  }, [overlayOpacity]);

  // Generate smart margins (AI-detected content areas)
  const generateSmartMargins = useCallback((img: HTMLImageElement, style: PaperStyle): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image
    ctx.drawImage(img, 0, 0);
    
    // AI-simulated content detection (in real implementation, this would use computer vision)
    const contentAreas = [
      { x: 50, y: 100, width: canvas.width - 100, height: 200 }, // Header area
      { x: 50, y: 320, width: canvas.width - 100, height: 150 }, // Content area
      { x: canvas.width - 200, y: canvas.height - 150, width: 180, height: 120 } // Calendar area
    ];
    
    // Draw smart margins around detected content
    ctx.strokeStyle = style.lineColor;
    ctx.globalAlpha = overlayOpacity;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    contentAreas.forEach(area => {
      ctx.strokeRect(area.x, area.y, area.width, area.height);
      
      // Add ruled lines within content areas
      if (style.lineType === 'ruled') {
        ctx.setLineDash([]);
        ctx.globalAlpha = overlayOpacity * 0.6;
        const lineSpacing = 20;
        
        for (let y = area.y + lineSpacing; y < area.y + area.height; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(area.x + 10, y);
          ctx.lineTo(area.x + area.width - 10, y);
          ctx.stroke();
        }
        ctx.setLineDash([5, 5]);
        ctx.globalAlpha = overlayOpacity;
      }
    });
    
    return canvas.toDataURL();
  }, [overlayOpacity]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Generate layouts using AI
  const generateLayouts = useCallback(async () => {
    if (!selectedImage || !imagePreview) return;

    setIsGenerating(true);
    
    try {
      // Create image element for processing
      const img = new Image();
      img.onload = () => {
        const layouts = layoutTemplates.map(template => 
          template.generate(img, paperStyle)
        );
        setGeneratedLayouts(layouts);
        setSelectedLayout(layouts[0]); // Default to first layout
        setIsGenerating(false);
      };
      img.src = imagePreview;
    } catch (error) {
      console.error('Error generating layouts:', error);
      setIsGenerating(false);
    }
  }, [selectedImage, imagePreview, paperStyle, layoutTemplates]);

  // Save the generated layout
  const saveLayout = useCallback(() => {
    if (!selectedLayout) return;
    
    const layoutData = {
      originalImage: imagePreview,
      generatedLayout: selectedLayout,
      paperStyle,
      timestamp: new Date().toISOString(),
      position: imagePosition,
      scale: imageScale
    };
    
    onImageSave?.(selectedLayout, layoutData);
    
    // Reset state
    setSelectedImage(null);
    setImagePreview('');
    setGeneratedLayouts([]);
    setSelectedLayout('');
  }, [selectedLayout, imagePreview, paperStyle, imagePosition, imageScale, onImageSave]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Layout Generator</h3>
            <p className="text-xs text-gray-500">Transform images with paper overlays</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {!selectedImage && (
        <div className="p-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Upload an Image</h4>
            <p className="text-sm text-gray-500 mb-4">
              Drop your image here or click to browse
            </p>
            <div className="text-xs text-gray-400">
              Supports: JPG, PNG, GIF, WebP
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Image Preview & Controls */}
      {selectedImage && imagePreview && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Image Preview</h4>
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreview('');
                setGeneratedLayouts([]);
                setSelectedLayout('');
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-48 object-cover"
              style={{
                transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`
              }}
            />
            
            {/* Paper Style Preview Overlay */}
            {showOverlay && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: overlayOpacity }}
              >
                {paperStyle.lineType === 'ruled' && (
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          transparent,
                          transparent ${paperStyle.lineSpacing === 'narrow' ? '18px' : paperStyle.lineSpacing === 'wide' ? '32px' : '24px'},
                          ${paperStyle.lineColor} ${paperStyle.lineSpacing === 'narrow' ? '19px' : paperStyle.lineSpacing === 'wide' ? '33px' : '25px'}
                        )
                        ${paperStyle.marginLine ? `, linear-gradient(90deg, transparent 59px, #FF6B6B 60px, #FF6B6B 61px, transparent 62px)` : ''}
                      `
                    }}
                  />
                )}
                {paperStyle.lineType === 'grid' && (
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 19px,
                          ${paperStyle.lineColor} 20px
                        ),
                        repeating-linear-gradient(
                          transparent,
                          transparent 19px,
                          ${paperStyle.lineColor} 20px
                        )
                      `
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Overlay Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Overlay Visibility</label>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`p-2 rounded-lg transition-colors ${
                  showOverlay ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {showOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            
            {showOverlay && (
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Opacity: {Math.round(overlayOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.1"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Scale: {Math.round(imageScale * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={imageScale}
                onChange={(e) => setImageScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Generate Layouts Button */}
          <button
            onClick={generateLayouts}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Generating AI Layouts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Layouts</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Generated Layouts */}
      {generatedLayouts.length > 0 && (
        <div className="p-4 space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            AI Generated Layouts
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {layoutTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedLayout === generatedLayouts[index]
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedLayout(generatedLayouts[index])}
              >
                <div className="aspect-video">
                  <img 
                    src={generatedLayouts[index]} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <template.icon className="w-4 h-4" />
                    <h5 className="font-medium text-sm">{template.name}</h5>
                  </div>
                  <p className="text-xs opacity-90">{template.description}</p>
                </div>
                
                {selectedLayout === generatedLayouts[index] && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Advanced Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Layout Customization
            </h5>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Paper Style Match</label>
                <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                  <div className="flex items-center justify-between">
                    <span>Line Type:</span>
                    <span className="font-medium capitalize">{paperStyle.lineType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Spacing:</span>
                    <span className="font-medium capitalize">{paperStyle.lineSpacing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Margin Line:</span>
                    <span className="font-medium">{paperStyle.marginLine ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-2 block">AI Enhancement</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-white border border-gray-200 rounded text-xs hover:bg-gray-50 transition-colors">
                    Auto Contrast
                  </button>
                  <button className="px-3 py-2 bg-white border border-gray-200 rounded text-xs hover:bg-gray-50 transition-colors">
                    Smart Crop
                  </button>
                  <button className="px-3 py-2 bg-white border border-gray-200 rounded text-xs hover:bg-gray-50 transition-colors">
                    Text Detection
                  </button>
                  <button className="px-3 py-2 bg-white border border-gray-200 rounded text-xs hover:bg-gray-50 transition-colors">
                    Line Align
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={saveLayout}
              disabled={!selectedLayout}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Save to Notebook</span>
            </button>
            
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.download = `layout-${Date.now()}.png`;
                link.href = selectedLayout;
                link.click();
              }}
              disabled={!selectedLayout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {selectedImage && !isGenerating && generatedLayouts.length === 0 && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-amber-900 mb-1">AI Ready to Help!</h5>
                <p className="text-sm text-amber-800 mb-3">
                  I can analyze your image and create layouts that match your current paper style:
                </p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Overlay ruled lines that align with content</li>
                  <li>• Generate calendar grids for planners</li>
                  <li>• Create smart margins around text areas</li>
                  <li>• Match your notebook's paper style perfectly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paper Style Info */}
      <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
        <h5 className="font-medium text-gray-900 mb-2 text-sm">Current Paper Style</h5>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize bg-white px-2 py-1 rounded border">
              {paperStyle.lineType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Spacing:</span>
            <span className="font-medium capitalize bg-white px-2 py-1 rounded border">
              {paperStyle.lineSpacing}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Colors:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: paperStyle.paperColor }}
                title="Paper color"
              />
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: paperStyle.lineColor }}
                title="Line color"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <div className="flex items-start gap-2">
          <CornerDownRight className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-800">
            <div className="font-medium mb-1">Pro Tips:</div>
            <ul className="space-y-1 text-blue-700">
              <li>• Upload planner pages for instant digitization</li>
              <li>• AI matches your current notebook style</li>
              <li>• Generated layouts are editable in the canvas</li>
              <li>• Perfect for importing handwritten notes</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
