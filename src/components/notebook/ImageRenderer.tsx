"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Move, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Settings,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';

interface ImageData {
  src: string;
  metadata: {
    originalFileName?: string;
    layoutName: string;
    aiAnalysis?: any;
    paperStyleUsed: any;
    overlaySettings: any;
  };
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

interface ImageRendererProps {
  imageData: ImageData;
  onUpdate?: (updatedData: ImageData) => void;
  onRemove?: () => void;
  isEditable?: boolean;
  paperStyle: any;
}

export default function ImageRenderer({ 
  imageData, 
  onUpdate, 
  onRemove, 
  isEditable = true,
  paperStyle 
}: ImageRendererProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [localPosition, setLocalPosition] = useState(imageData.position);
  const [localScale, setLocalScale] = useState(imageData.scale);
  const [localRotation, setLocalRotation] = useState(imageData.rotation);
  const imageRef = useRef<HTMLDivElement>(null);

  // Update parent when local state changes
  useEffect(() => {
    if (onUpdate && (
      localPosition.x !== imageData.position.x ||
      localPosition.y !== imageData.position.y ||
      localScale !== imageData.scale ||
      localRotation !== imageData.rotation
    )) {
      const updatedData = {
        ...imageData,
        position: localPosition,
        scale: localScale,
        rotation: localRotation
      };
      onUpdate(updatedData);
    }
  }, [localPosition, localScale, localRotation, imageData, onUpdate]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditable) return;
    
    e.preventDefault();
    setIsSelected(true);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - localPosition.x,
      y: e.clientY - localPosition.y
    });
  }, [isEditable, localPosition]);

  // Handle mouse move for dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setLocalPosition(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Handle zoom
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.1 : 0.9;
    const newScale = Math.max(0.1, Math.min(3, localScale * zoomFactor));
    setLocalScale(newScale);
  }, [localScale]);

  // Handle rotation
  const handleRotate = useCallback(() => {
    setLocalRotation(prev => (prev + 90) % 360);
  }, []);

  // Reset transformations
  const handleReset = useCallback(() => {
    setLocalPosition({ x: 0, y: 0 });
    setLocalScale(1);
    setLocalRotation(0);
  }, []);

  return (
    <motion.div
      ref={imageRef}
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        transform: `scale(${localScale}) rotate(${localRotation}deg)`,
        transformOrigin: 'center center',
        zIndex: isSelected ? 20 : 10
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isSelected && setShowControls(false)}
      animate={{
        scale: isDragging ? localScale * 1.05 : localScale,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Image with AI-generated overlay */}
      <div className="relative">
        <img 
          src={imageData.src} 
          alt={imageData.metadata.layoutName}
          className="max-w-none"
          style={{ 
            maxWidth: 'none',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
        
        {/* Metadata overlay */}
        {showControls && imageData.metadata.aiAnalysis && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <div className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>{imageData.metadata.layoutName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      {showControls && isEditable && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 left-0 right-0 flex justify-center"
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1">
            {/* Move indicator */}
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
              <Move className="w-3 h-3" />
              <span>Drag</span>
            </div>
            
            {/* Zoom controls */}
            <button
              onClick={() => handleZoom('out')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3 text-gray-600" />
            </button>
            
            <span className="text-xs text-gray-500 px-1">
              {Math.round(localScale * 100)}%
            </span>
            
            <button
              onClick={() => handleZoom('in')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3 text-gray-600" />
            </button>
            
            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Rotate 90°"
            >
              <RotateCcw className="w-3 h-3 text-gray-600" />
            </button>
            
            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Reset Position & Scale"
            >
              <Minimize2 className="w-3 h-3 text-gray-600" />
            </button>
            
            {/* Remove */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1 hover:bg-red-100 rounded transition-colors ml-1 border-l border-gray-200 pl-2"
                title="Remove Image"
              >
                <span className="text-xs text-red-600">×</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg" />
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
        </div>
      )}
    </motion.div>
  );
}
