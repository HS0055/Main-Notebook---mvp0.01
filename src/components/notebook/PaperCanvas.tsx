"use client";

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Type, AlignLeft, X, ImageIcon, Wand2 } from 'lucide-react';
import SmartImageUpload from './SmartImageUpload';
import EditableLayout from './EditableLayout';

interface PaperStyle {
  lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music';
  lineSpacing: 'narrow' | 'normal' | 'wide';
  marginLine: boolean;
  paperColor: string;
  lineColor: string;
}

interface PaperCanvasProps {
  content: string;
  onContentChange: (content: string) => void;
  currentPage: number;
  totalPages: number;
  paperStyle: PaperStyle;
  onPaperStyleChange: (style: PaperStyle) => void;
  isLeftSide: boolean;
  showSettings: boolean;
  templateOverlay?: string;
  onTemplateOverlayChange?: (overlay: string | null) => void;
}

export default function PaperCanvas({
  content,
  onContentChange,
  currentPage,
  totalPages,
  paperStyle,
  onPaperStyleChange,
  isLeftSide,
  showSettings,
  templateOverlay: initialTemplateOverlay,
  onTemplateOverlayChange
}: PaperCanvasProps) {
  // ========================================
  // BULLETPROOF TYPING - NO INTERFERENCE
  // ========================================
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastPageRef = useRef(currentPage);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Only sync when page changes - NEVER during typing
  useEffect(() => {
    if (currentPage !== lastPageRef.current && textareaRef.current) {
      textareaRef.current.value = content || '';
      lastPageRef.current = currentPage;
    }
  }, [content, currentPage]);

  // Simple typing handler - completely isolated
  const handleTyping = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      onContentChange(newContent);
    }, 300);
  }, [onContentChange]);

  // ========================================
  // ISOLATED FEATURES - DON'T AFFECT TYPING
  // ========================================
  
  const [showTextSettings, setShowTextSettings] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [writeAfterMargin, setWriteAfterMargin] = useState(true);
  const [templateOverlay, setTemplateOverlay] = useState<string | null>(initialTemplateOverlay || null);
  
  // Update templateOverlay when prop changes
  useEffect(() => {
    setTemplateOverlay(initialTemplateOverlay || null);
  }, [initialTemplateOverlay]);
  const [textStyle, setTextStyle] = useState({
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 400,
    color: '#2C2C2C'
  });

  // ========================================
  // COMPLETE LINE TYPE IMPLEMENTATIONS - ALL WORKING
  // ========================================
  
  const getLineSpacing = () => {
    switch (paperStyle.lineSpacing) {
      case 'narrow': return 20;
      case 'wide': return 32;
      default: return 24;
    }
  };

  // Complete line rendering for ALL types
  const renderLines = () => {
    if (paperStyle.lineType === 'blank') return null;
    
    const lineSpacing = getLineSpacing();
    const containerHeight = 800;
    const containerWidth = 800;
    const lines = [];
    
    switch (paperStyle.lineType) {
      case 'ruled':
        // Horizontal ruled lines
        const numHorizontalLines = Math.floor(containerHeight / lineSpacing);
        for (let i = 1; i <= numHorizontalLines; i++) {
          const y = i * lineSpacing + 8;
          lines.push(
            <div
              key={`h-${i}`}
              className="absolute w-full h-px"
              style={{
                top: `${y}px`,
                left: '0',
                backgroundColor: paperStyle.lineColor,
                opacity: 0.6
              }}
            />
          );
        }
        break;

      case 'grid':
        // Grid: Horizontal + Vertical lines
        const numHLines = Math.floor(containerHeight / lineSpacing);
        const numVLines = Math.floor(containerWidth / lineSpacing);
        
        // Horizontal lines
        for (let i = 1; i <= numHLines; i++) {
          const y = i * lineSpacing + 8;
          lines.push(
            <div
              key={`h-${i}`}
              className="absolute w-full h-px"
              style={{
                top: `${y}px`,
                left: '0',
                backgroundColor: paperStyle.lineColor,
                opacity: 0.4
              }}
            />
          );
        }
        
        // Vertical lines
        for (let i = 1; i <= numVLines; i++) {
          const x = i * lineSpacing;
          lines.push(
            <div
              key={`v-${i}`}
              className="absolute h-full w-px"
              style={{
                left: `${x}px`,
                top: '0',
                backgroundColor: paperStyle.lineColor,
                opacity: 0.4
              }}
            />
          );
        }
        break;

      case 'dots':
        // Dot grid pattern
        const numDotsH = Math.floor(containerHeight / lineSpacing);
        const numDotsV = Math.floor(containerWidth / lineSpacing);
        
        for (let row = 1; row <= numDotsH; row++) {
          for (let col = 1; col <= numDotsV; col++) {
            const y = row * lineSpacing + 8;
            const x = col * lineSpacing;
            lines.push(
              <div
                key={`dot-${row}-${col}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  top: `${y - 2}px`,
                  left: `${x - 2}px`,
                  backgroundColor: paperStyle.lineColor,
                  opacity: 0.5
                }}
              />
            );
          }
        }
        break;

      case 'music':
        // Musical staff lines (5-line staves)
        const staffHeight = 5 * 8; // 5 lines, 8px apart
        const staffSpacing = staffHeight + 40; // Space between staves
        const numStaves = Math.floor((containerHeight - 40) / staffSpacing);
        
        for (let staff = 0; staff < numStaves; staff++) {
          const staffY = 40 + staff * staffSpacing;
          
          // 5 staff lines
          for (let line = 0; line < 5; line++) {
            const y = staffY + line * 8;
            lines.push(
              <div
                key={`staff-${staff}-line-${line}`}
                className="absolute w-full h-px"
                style={{
                  top: `${y}px`,
                  left: '0',
                  backgroundColor: paperStyle.lineColor,
                  opacity: 0.7
                }}
              />
            );
          }
        }
        break;

      case 'graph':
        // Graph paper with major and minor grid lines
        const minorSpacing = lineSpacing / 5; // 5 minor divisions per major
        const numMinorH = Math.floor(containerHeight / minorSpacing);
        const numMinorV = Math.floor(containerWidth / minorSpacing);
        
        // Minor grid lines
        for (let i = 1; i <= numMinorH; i++) {
          const y = i * minorSpacing + 8;
          const isMajor = i % 5 === 0;
          lines.push(
            <div
              key={`gh-${i}`}
              className="absolute w-full h-px"
              style={{
                top: `${y}px`,
                left: '0',
                backgroundColor: paperStyle.lineColor,
                opacity: isMajor ? 0.6 : 0.2
              }}
            />
          );
        }
        
        for (let i = 1; i <= numMinorV; i++) {
          const x = i * minorSpacing;
          const isMajor = i % 5 === 0;
          lines.push(
            <div
              key={`gv-${i}`}
              className="absolute h-full w-px"
              style={{
                left: `${x}px`,
                top: '0',
                backgroundColor: paperStyle.lineColor,
                opacity: isMajor ? 0.6 : 0.2
              }}
            />
          );
        }
        break;

      default:
        break;
    }
    
    return lines;
  };

  // ========================================
  // SIMPLE TEXTAREA POSITIONING
  // ========================================
  
  const textareaStyle = {
    position: 'absolute' as const,
    top: '8px',
    left: writeAfterMargin ? '92px' : '8px', // After red line or from edge
    right: '8px',
    bottom: '8px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    resize: 'none' as const,
    padding: '0',
    fontSize: `${textStyle.fontSize}px`,
    fontFamily: textStyle.fontFamily,
    fontWeight: textStyle.fontWeight,
    color: textStyle.color,
    lineHeight: `${getLineSpacing()}px`,
    overflow: 'hidden auto',
    wordWrap: 'break-word' as const,
    whiteSpace: 'pre-wrap' as const
  };

  return (
    <div 
      className="relative w-full h-full"
      style={{ backgroundColor: paperStyle.paperColor }}
    >
      {/* Template background overlay (from AI) */}
      {templateOverlay && (
        <>
          {(() => {
            // Check if this is an editable layout (JSON with editable elements)
            try {
              const layoutData = JSON.parse(templateOverlay);
              console.log('PaperCanvas: Parsed layout data:', layoutData);
              
              if (layoutData.editableElements && Array.isArray(layoutData.editableElements) && layoutData.editableElements.length > 0) {
                console.log('PaperCanvas: Rendering editable layout with', layoutData.editableElements.length, 'elements');
                // This is an editable layout - render with EditableLayout component
                return (
                  <EditableLayout
                    svgData={layoutData.svgData}
                    editableElements={layoutData.editableElements}
                    onElementChange={(elementId, value) => {
                      // Handle element changes - could save to database
                      console.log('Element changed:', elementId, value);
                    }}
                    onLayoutSave={(layoutData) => {
                      // Handle layout save
                      console.log('Layout saved:', layoutData);
                    }}
                    className="absolute inset-0 w-full h-full z-20"
                  />
                );
              } else {
                console.log('PaperCanvas: No editable elements found, treating as regular SVG');
              }
            } catch (e) {
              console.log('PaperCanvas: Not JSON, treating as regular SVG:', e);
            }
            
            // Regular SVG overlay (wrap in safe container)
            return (
              <div className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0" style={{ opacity: 0.8 }}>
                <div dangerouslySetInnerHTML={{ __html: templateOverlay }} />
              </div>
            );
          })()}
        </>
      )}

      {/* ALL LINE TYPES NOW WORKING */}
      {!templateOverlay && renderLines()}

      {/* Red margin line - simple and clean */}
      {paperStyle.marginLine && (
        <div 
          className="absolute top-0 bottom-0 w-px"
          style={{ 
            left: '80px',
            backgroundColor: '#FF6B6B',
            opacity: 0.8
          }}
        />
      )}

      {/* BULLETPROOF TEXTAREA - Hide when editable layout is active */}
      {!templateOverlay && (
        <textarea
          ref={textareaRef}
          defaultValue={content || ''}
          onChange={handleTyping}
          style={textareaStyle}
          spellCheck={false}
          className="focus:outline-none relative z-10"
        />
      )}

      {/* Canvas Controls - Fixed positioning and z-index */}
      {showSettings && (
        <div className="absolute top-4 right-4 flex gap-2 z-30">
          {/* AI Image Upload - Prominent placement */}
          <button
            onClick={() => setShowImageUpload(true)}
            className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-xl transition-all duration-300 hover:from-purple-600 hover:to-blue-600 hover:scale-110 hover:shadow-2xl border-2 border-white"
            title="🪄 AI Image Layout Generator - Upload images with smart overlays"
          >
            <Wand2 className="w-5 h-5" />
          </button>

          {templateOverlay && (
            <button
              onClick={() => {
                setTemplateOverlay(null);
                onTemplateOverlayChange?.(null);
              }}
              className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-colors border border-gray-200"
              title="Remove applied template overlay"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {/* Margin position toggle */}
          <button
            onClick={() => setWriteAfterMargin(!writeAfterMargin)}
            className={`p-2 rounded-full shadow-lg transition-colors border ${
              writeAfterMargin 
                ? 'bg-blue-500 text-white border-blue-600' 
                : 'bg-red-500 text-white border-red-600'
            }`}
            title={writeAfterMargin ? "Writing after red line" : "Writing from edge"}
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          {/* Text customization */}
          <button
            onClick={() => setShowTextSettings(!showTextSettings)}
            className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-colors border border-gray-200"
            title="Text Options"
          >
            <Type className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Text customization panel */}
      <AnimatePresence>
        {showTextSettings && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border p-4 z-30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Text Settings</h3>
              <button 
                onClick={() => setShowTextSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className="block text-xs font-medium mb-2">
                  Font Size: {textStyle.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={textStyle.fontSize}
                  onChange={(e) => setTextStyle(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs font-medium mb-2">Font</label>
                <select
                  value={textStyle.fontFamily}
                  onChange={(e) => setTextStyle(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="Inter">Inter</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Caveat">Caveat</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                </select>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {['#2C2C2C', '#000000', '#DC2626', '#2563EB'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextStyle(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded border-2 ${
                        textStyle.color === color ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Writing Position */}
              <div>
                <label className="block text-xs font-medium mb-2">Position</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWriteAfterMargin(false)}
                    className={`flex-1 p-2 rounded text-xs ${
                      !writeAfterMargin 
                        ? 'bg-red-100 text-red-700 border border-red-300' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    From Edge
                  </button>
                  <button
                    onClick={() => setWriteAfterMargin(true)}
                    className={`flex-1 p-2 rounded text-xs ${
                      writeAfterMargin 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    After Red Line
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Image Upload Modal */}
      <AnimatePresence>
        {showImageUpload && (
          <SmartImageUpload
            paperStyle={paperStyle}
            isVisible={showImageUpload}
            onClose={() => setShowImageUpload(false)}
            onImageInsert={(imageData, metadata) => {
              console.log('PaperCanvas: onImageInsert called', {
                isTemplate: metadata.isTemplate,
                hasLayoutData: !!metadata.layoutData,
                imageDataPreview: imageData?.substring(0, 100) + '...',
                metadata: metadata
              });
              
              // Check if this is a template (no original file or SVG)
              if (metadata.isTemplate) {
                console.log('PaperCanvas: Handling as template', {
                  metadata,
                  imageData,
                  hasLayoutData: !!metadata.layoutData
                });
                // This is a template layout - apply the paper style
                const suggestedStyle = metadata.aiAnalysis?.suggestedStyle;
                const suggestedLineType = metadata.aiAnalysis?.suggestedLineType;
                const suggestedSpacing = metadata.aiAnalysis?.optimalSpacing;
                
                // Create new paper style based on AI analysis
                const newPaperStyle = {
                  ...paperStyle,
                  lineType: (suggestedLineType || suggestedStyle || paperStyle.lineType) as any,
                  lineSpacing: (suggestedSpacing || paperStyle.lineSpacing) as any
                };
                
                // Apply the new paper style
                onPaperStyleChange?.(newPaperStyle);
                // Apply the overlay to the background for a true layout
                if (metadata.layoutData) {
                  setTemplateOverlay(metadata.layoutData as string);
                  onTemplateOverlayChange?.(metadata.layoutData as string);
                }
                
                // For template layouts, we don't insert any text content
                // The visual layout is the main feature
              } else {
                console.log('PaperCanvas: Handling as regular image');
                // This is an actual image - insert it
                const imageMarkdown = `![${metadata.layoutName}](${imageData})`;
                const currentContent = textareaRef.current?.value || '';
                const newContent = currentContent + '\n\n' + imageMarkdown + '\n\n';
                
                if (textareaRef.current) {
                  textareaRef.current.value = newContent;
                  onContentChange(newContent);
                }
              }
              
              setShowImageUpload(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}