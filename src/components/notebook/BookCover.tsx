"use client";

import React, { useState, useRef } from 'react';
import { Settings, ChevronRight, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookCoverProps {
  notebook: {
    id: string;
    title: string;
    cover: {
      color: string;
      pattern: string;
      image?: string;
    };
  };
  onOpen: () => void;
  onCoverChange: (cover: { color: string; pattern: string; image?: string }) => void;
}

const coverColors = [
  '#4A90E2',
  '#E74C3C', 
  '#2ECC71',
  '#F39C12',
  '#9B59B6',
  '#8B4513'
];

const patterns = [
  'grid',
  'molecular', 
  'vintage',
  'floral',
  'circuit',
  'dots',
  'lines',
  'geometric'
];

const getPatternStyle = (pattern: string) => {
  const baseOpacity = '0.1';
  
  switch (pattern) {
    case 'grid':
      return {
        backgroundImage: `
          linear-gradient(rgba(255,255,255,${baseOpacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,${baseOpacity}) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      };
    case 'molecular':
      return {
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,${baseOpacity}) 1px, transparent 0)`,
        backgroundSize: '25px 25px'
      };
    case 'vintage':
      return {
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,${baseOpacity}) 2px, transparent 2px),
          linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%)
        `,
        backgroundSize: '30px 30px, 15px 15px'
      };
    case 'floral':
      return {
        backgroundImage: `
          radial-gradient(circle at 10px 10px, rgba(255,255,255,${baseOpacity}) 3px, transparent 3px),
          radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 2px, transparent 2px)
        `,
        backgroundSize: '35px 35px'
      };
    case 'circuit':
      return {
        backgroundImage: `
          linear-gradient(90deg, rgba(255,255,255,${baseOpacity}) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,${baseOpacity}) 1px, transparent 1px),
          linear-gradient(45deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '15px 15px, 15px 15px, 30px 30px'
      };
    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,${baseOpacity}) 2px, transparent 2px)`,
        backgroundSize: '25px 25px'
      };
    case 'lines':
      return {
        backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,${baseOpacity}), rgba(255,255,255,${baseOpacity}) 2px, transparent 2px, transparent 12px)`,
      };
    case 'geometric':
      return {
        backgroundImage: `
          linear-gradient(45deg, rgba(255,255,255,${baseOpacity}) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(255,255,255,${baseOpacity}) 25%, transparent 25%)
        `,
        backgroundSize: '20px 20px'
      };
    default:
      return {};
  }
};

export const BookCover: React.FC<BookCoverProps> = ({ notebook, onOpen, onCoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [pendingCover, setPendingCover] = useState(notebook.cover);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen();
  };

  const handleCustomizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingCover(notebook.cover);
    setShowCustomizer(true);
  };

  const handleColorChange = (color: string) => {
    setPendingCover({
      ...pendingCover,
      color
    });
  };

  const handlePatternChange = (pattern: string) => {
    setPendingCover({
      ...pendingCover,
      pattern
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPendingCover({
          ...pendingCover,
          image: imageUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPendingCover({
      ...pendingCover,
      image: undefined
    });
  };

  const handleApplyChanges = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(`/api/notebooks/${notebook.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cover: pendingCover }),
      });

      if (response.ok) {
        onCoverChange(pendingCover);
        setShowCustomizer(false);
        
        // Update card attribute data-cover
        const coverCard = document.querySelector(`[data-notebook-id="${notebook.id}"]`);
        if (coverCard) {
          coverCard.setAttribute('data-cover', JSON.stringify(pendingCover));
        }
      } else {
        console.error('Failed to update notebook cover');
      }
    } catch (error) {
      console.error('Error updating notebook cover:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancelChanges = () => {
    setPendingCover(notebook.cover);
    setShowCustomizer(false);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Book Cover */}
      <div
        data-notebook-id={notebook.id}
        data-cover={JSON.stringify(notebook.cover)}
        className={`
          relative w-[300px] h-[400px] cursor-pointer transform-gpu perspective-1000
          transition-all duration-500 ease-out
          ${isHovered ? 'scale-105 -rotate-y-2 translate-y-[-8px]' : 'rotate-y-1'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCoverClick}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main Book Cover */}
        <div
          className={`
            absolute inset-0 rounded-lg shadow-2xl border border-black/20
            transition-all duration-500 overflow-hidden
            ${isHovered ? 'shadow-3xl' : 'shadow-xl'}
          `}
          style={{
            backgroundColor: notebook.cover.image ? 'transparent' : notebook.cover.color,
            transform: 'translateZ(12px)',
          }}
        >
          {/* Background Image or Pattern */}
          {notebook.cover.image ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${notebook.cover.image})`,
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: notebook.cover.color,
                ...getPatternStyle(notebook.cover.pattern)
              }}
            />
          )}

          {/* Overlay for text readability when using custom image */}
          {notebook.cover.image && (
            <div className="absolute inset-0 bg-black/30" />
          )}

          {/* Book Spine Effect */}
          <div 
            className="absolute left-0 top-0 w-3 h-full rounded-l-lg border-r border-black/30"
            style={{
              background: `linear-gradient(90deg, ${notebook.cover.color}dd, ${notebook.cover.color}aa)`,
              transform: 'translateZ(-8px) rotateY(-90deg)',
              transformOrigin: 'left center'
            }}
          />
          
          {/* Book Pages Edge */}
          <div 
            className="absolute right-0 top-2 w-1 h-[calc(100%-16px)] bg-gradient-to-b from-white via-gray-100 to-gray-200 rounded-r-sm"
            style={{
              transform: 'translateZ(-2px)',
              boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)'
            }}
          />
          
          {/* Title */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center z-10">
            <h2 
              className="font-display text-4xl font-bold text-white drop-shadow-2xl leading-tight"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)',
                transform: 'translateZ(4px)'
              }}
            >
              {notebook.title}
            </h2>
          </div>
          
          {/* Subtle book texture overlay */}
          {!notebook.cover.image && (
            <div 
              className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 1px, transparent 1px),
                  radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
                `,
                backgroundSize: '100px 100px, 80px 80px, 200px 200px'
              }}
            />
          )}
        </div>

        {/* Hover Button */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-300 pointer-events-none
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transform: 'translateZ(20px)' }}
        >
          <button
            className="
              bg-white/95 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full
              shadow-xl border border-gray-200 font-medium
              hover:bg-white hover:scale-105 transition-all duration-200
              pointer-events-auto flex items-center gap-2
            "
            onClick={handleCoverClick}
          >
            Open Book
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Customize Button */}
        <button
          className={`
            absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm
            rounded-full flex items-center justify-center
            transition-all duration-300 hover:bg-white/30 hover:scale-110
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transform: 'translateZ(16px)' }}
          onClick={handleCustomizeClick}
        >
          <Settings className="w-4 h-4 text-white drop-shadow" />
        </button>
      </div>

      {/* Customization Modal */}
      <AnimatePresence>
        {showCustomizer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              onClick={handleCancelChanges}
            >
              {/* Modal */}
              <motion.div
                data-testid="nb-cover-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 w-96 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-gray-800">
                    Customize Cover
                  </h3>
                  <button
                    onClick={handleCancelChanges}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Preview */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preview
                  </label>
                  <div
                    className="w-full h-32 rounded-lg border-2 border-gray-200 relative overflow-hidden"
                    style={{
                      backgroundColor: pendingCover.image ? 'transparent' : pendingCover.color,
                    }}
                  >
                    {pendingCover.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${pendingCover.image})`,
                        }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: pendingCover.color,
                          ...getPatternStyle(pendingCover.pattern)
                        }}
                      />
                    )}
                    {pendingCover.image && (
                      <div className="absolute inset-0 bg-black/30" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-white font-bold text-lg drop-shadow-lg"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                      >
                        {notebook.title}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Custom Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cover Image
                  </label>
                  
                  {pendingCover.image ? (
                    <div className="relative">
                      <div 
                        className="w-full h-24 bg-cover bg-center rounded-lg border-2 border-gray-300"
                        style={{ backgroundImage: `url(${pendingCover.image})` }}
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <button
                        onClick={triggerImageUpload}
                        className="mt-2 w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={triggerImageUpload}
                      className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all duration-200"
                    >
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-sm">Upload Image</span>
                    </button>
                  )}
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Background Color
                    {pendingCover.image && (
                      <span className="text-xs text-gray-500 ml-1">(used for spine)</span>
                    )}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {coverColors.map((color) => (
                      <button
                        key={color}
                        className={`
                          w-12 h-12 rounded-lg border-2 transition-all duration-200
                          hover:scale-105
                          ${pendingCover.color === color ? 'border-gray-800 ring-2 ring-gray-400' : 'border-gray-300'}
                        `}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                      />
                    ))}
                  </div>
                </div>

                {/* Pattern Selection - only show if no custom image */}
                {!pendingCover.image && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Pattern
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {patterns.map((pattern) => (
                        <button
                          key={pattern}
                          className={`
                            px-3 py-2 text-xs rounded-md border transition-all duration-200
                            hover:bg-gray-50 capitalize
                            ${pendingCover.pattern === pattern 
                              ? 'border-gray-800 bg-gray-100 text-gray-800' 
                              : 'border-gray-300 text-gray-600'}
                          `}
                          onClick={() => handlePatternChange(pattern)}
                        >
                          {pattern}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelChanges}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    disabled={isApplying}
                  >
                    Cancel
                  </button>
                  <button
                    data-testid="cover-apply"
                    onClick={handleApplyChanges}
                    disabled={isApplying}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isApplying ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Applying...
                      </>
                    ) : (
                      'Apply Changes'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};