"use client";

import React, { useCallback } from 'react';

interface PaperStyle {
  lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music' | 'calendar';
  lineSpacing: 'narrow' | 'normal' | 'wide';
  marginLine: boolean;
  paperColor: string;
  lineColor: string;
}

interface LayoutAnalysis {
  contentAreas: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'text' | 'calendar' | 'list' | 'diagram' | 'table';
    confidence: number;
  }>;
  suggestedLineType: 'ruled' | 'grid' | 'dots' | 'calendar';
  optimalSpacing: 'narrow' | 'normal' | 'wide';
  marginSuggestion: boolean;
}

export class AILayoutEngine {
  // Analyze image content using computer vision simulation
  static analyzeImageContent(imageData: ImageData): LayoutAnalysis {
    const { width, height, data } = imageData;
    
    // Simulate AI content detection
    const contentAreas = this.detectContentAreas(data, width, height);
    const suggestedLineType = this.suggestLineType(contentAreas);
    const optimalSpacing = this.calculateOptimalSpacing(contentAreas, height);
    const marginSuggestion = this.shouldAddMargin(contentAreas, width);

    return {
      contentAreas,
      suggestedLineType,
      optimalSpacing,
      marginSuggestion
    };
  }

  // Detect content areas in the image
  private static detectContentAreas(data: Uint8ClampedArray, width: number, height: number) {
    const areas = [];
    
    // Simulate text detection (look for horizontal patterns)
    const textArea = this.detectTextRegions(data, width, height);
    if (textArea) areas.push(textArea);
    
    // Simulate calendar detection (look for grid patterns)
    const calendarArea = this.detectCalendarRegions(data, width, height);
    if (calendarArea) areas.push(calendarArea);
    
    // Simulate list detection (look for bullet points or checkboxes)
    const listArea = this.detectListRegions(data, width, height);
    if (listArea) areas.push(listArea);
    
    return areas;
  }

  // Detect text regions (simplified simulation)
  private static detectTextRegions(data: Uint8ClampedArray, width: number, height: number) {
    // Look for horizontal lines of text (areas with consistent horizontal patterns)
    const textDensity = new Array(Math.floor(height / 20)).fill(0);
    
    for (let y = 0; y < height; y += 20) {
      let lineActivity = 0;
      for (let x = 0; x < width; x += 10) {
        const pixelIndex = (y * width + x) * 4;
        const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
        if (brightness < 200) lineActivity++; // Dark pixels indicate content
      }
      textDensity[Math.floor(y / 20)] = lineActivity;
    }
    
    // Find the area with most text activity
    const maxActivity = Math.max(...textDensity);
    const textStart = textDensity.findIndex(density => density > maxActivity * 0.3) * 20;
    const textEnd = (textDensity.length - 1 - textDensity.slice().reverse().findIndex(density => density > maxActivity * 0.3)) * 20;
    
    if (textStart < textEnd) {
      return {
        x: width * 0.1,
        y: textStart,
        width: width * 0.8,
        height: textEnd - textStart,
        type: 'text' as const,
        confidence: 0.8
      };
    }
    
    return null;
  }

  // Detect calendar-like grid regions
  private static detectCalendarRegions(data: Uint8ClampedArray, width: number, height: number) {
    // Look for grid patterns (simplified simulation)
    let gridScore = 0;
    
    // Check for vertical lines
    for (let x = width / 7; x < width; x += width / 7) {
      for (let y = 0; y < height; y += 10) {
        const pixelIndex = (y * width + Math.floor(x)) * 4;
        const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
        if (brightness < 150) gridScore++; // Dark lines
      }
    }
    
    // Check for horizontal lines
    for (let y = height / 6; y < height; y += height / 6) {
      for (let x = 0; x < width; x += 10) {
        const pixelIndex = (Math.floor(y) * width + x) * 4;
        const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
        if (brightness < 150) gridScore++; // Dark lines
      }
    }
    
    if (gridScore > 100) { // Threshold for grid detection
      return {
        x: 0,
        y: height * 0.1,
        width: width,
        height: height * 0.8,
        type: 'calendar' as const,
        confidence: Math.min(gridScore / 200, 1)
      };
    }
    
    return null;
  }

  // Detect list regions (checkboxes, bullet points)
  private static detectListRegions(data: Uint8ClampedArray, width: number, height: number) {
    // Look for small squares or circles on the left side (checkboxes/bullets)
    let listScore = 0;
    const leftMargin = width * 0.1;
    
    for (let y = 50; y < height - 50; y += 30) {
      for (let x = 10; x < leftMargin; x += 5) {
        const pixelIndex = (y * width + x) * 4;
        const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
        if (brightness < 180) listScore++; // Potential bullet/checkbox
      }
    }
    
    if (listScore > 20) {
      return {
        x: 0,
        y: 50,
        width: width,
        height: height - 100,
        type: 'list' as const,
        confidence: Math.min(listScore / 40, 1)
      };
    }
    
    return null;
  }

  // Suggest appropriate line type based on detected content
  private static suggestLineType(contentAreas: any[]): 'ruled' | 'grid' | 'dots' | 'calendar' {
    const hasCalendar = contentAreas.some(area => area.type === 'calendar');
    const hasText = contentAreas.some(area => area.type === 'text');
    const hasList = contentAreas.some(area => area.type === 'list');
    
    if (hasCalendar) return 'calendar';
    if (hasList) return 'dots';
    if (hasText) return 'ruled';
    return 'grid'; // Default fallback
  }

  // Calculate optimal spacing based on content density
  private static calculateOptimalSpacing(contentAreas: any[], imageHeight: number): 'narrow' | 'normal' | 'wide' {
    if (contentAreas.length === 0) return 'normal';
    
    const totalContentHeight = contentAreas.reduce((sum, area) => sum + area.height, 0);
    const contentDensity = totalContentHeight / imageHeight;
    
    if (contentDensity > 0.7) return 'narrow'; // Dense content needs narrow spacing
    if (contentDensity < 0.3) return 'wide';   // Sparse content can use wide spacing
    return 'normal'; // Balanced content uses normal spacing
  }

  // Determine if margin line would be beneficial
  private static shouldAddMargin(contentAreas: any[], imageWidth: number): boolean {
    // Check if content is concentrated on the right side (leaving left margin)
    const leftSideContent = contentAreas.filter(area => area.x < imageWidth * 0.3);
    const rightSideContent = contentAreas.filter(area => area.x > imageWidth * 0.3);
    
    // If most content is on the right, suggest a margin line
    return rightSideContent.length > leftSideContent.length;
  }

  // Generate enhanced layout with AI suggestions
  static generateEnhancedLayout(
    image: HTMLImageElement, 
    paperStyle: PaperStyle,
    options: {
      autoContrast?: boolean;
      smartCrop?: boolean;
      textDetection?: boolean;
      lineAlign?: boolean;
      overlayOpacity?: number;
    } = {}
  ): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Apply image enhancements
    if (options.autoContrast) {
      this.applyAutoContrast(ctx, image);
    } else {
      ctx.drawImage(image, 0, 0);
    }
    
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const analysis = this.analyzeImageContent(imageData);
    
    // Apply AI-suggested paper style overlay
    this.applyIntelligentOverlay(ctx, canvas, analysis, paperStyle, options);
    
    return canvas.toDataURL();
  }

  // Apply auto contrast enhancement
  private static applyAutoContrast(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;
    
    // Simple contrast enhancement
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));     // Red
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128)); // Green
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128)); // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  // Apply intelligent overlay based on AI analysis
  private static applyIntelligentOverlay(
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    analysis: LayoutAnalysis, 
    paperStyle: PaperStyle,
    options: any
  ) {
    const { overlayOpacity = 0.3 } = options;
    
    // Use AI suggestions if available, otherwise use current paper style
    const lineType = analysis.suggestedLineType || paperStyle.lineType;
    const spacing = analysis.optimalSpacing || paperStyle.lineSpacing;
    const useMargin = analysis.marginSuggestion ?? paperStyle.marginLine;
    
    ctx.globalAlpha = overlayOpacity;
    ctx.strokeStyle = paperStyle.lineColor;
    ctx.lineWidth = 1;
    
    // Apply appropriate overlay based on detected content
    switch (lineType) {
      case 'ruled':
        this.drawRuledLines(ctx, canvas, spacing, useMargin, paperStyle.lineColor);
        break;
      case 'grid':
        this.drawGridLines(ctx, canvas, spacing, paperStyle.lineColor);
        break;
      case 'calendar':
        this.drawCalendarGrid(ctx, canvas, paperStyle.lineColor);
        break;
      case 'dots':
        this.drawDotPattern(ctx, canvas, spacing, paperStyle.lineColor);
        break;
    }
    
    // Highlight detected content areas
    if (options.textDetection) {
      this.highlightContentAreas(ctx, analysis.contentAreas);
    }
  }

  // Draw ruled lines
  private static drawRuledLines(
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    spacing: string, 
    useMargin: boolean, 
    lineColor: string
  ) {
    const spacingMap = { narrow: 18, normal: 24, wide: 32 };
    const lineSpacing = spacingMap[spacing];
    
    // Draw horizontal lines
    for (let y = lineSpacing; y < canvas.height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(useMargin ? 60 : 0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw margin line
    if (useMargin) {
      ctx.strokeStyle = '#FF6B6B';
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, canvas.height);
      ctx.stroke();
    }
  }

  // Draw grid lines
  private static drawGridLines(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, spacing: string, lineColor: string) {
    const spacingMap = { narrow: 15, normal: 20, wide: 30 };
    const gridSpacing = spacingMap[spacing];
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // Draw calendar grid
  private static drawCalendarGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, lineColor: string) {
    const cellWidth = canvas.width / 7;
    const cellHeight = (canvas.height - 60) / 6;
    const startY = 60;
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let i = 0; i <= 7; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, startY);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, startY + i * cellHeight);
      ctx.lineTo(canvas.width, startY + i * cellHeight);
      ctx.stroke();
    }
  }

  // Draw dot pattern
  private static drawDotPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, spacing: string, lineColor: string) {
    const spacingMap = { narrow: 15, normal: 20, wide: 30 };
    const dotSpacing = spacingMap[spacing];
    
    ctx.fillStyle = lineColor;
    
    for (let x = dotSpacing; x < canvas.width; x += dotSpacing) {
      for (let y = dotSpacing; y < canvas.height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Highlight detected content areas
  private static highlightContentAreas(ctx: CanvasRenderingContext2D, areas: any[]) {
    ctx.globalAlpha = 0.2;
    
    areas.forEach((area, index) => {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(area.x, area.y, area.width, area.height);
      
      // Add label
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${area.type} (${Math.round(area.confidence * 100)}%)`,
        area.x + 5,
        area.y + 15
      );
      ctx.globalAlpha = 0.2;
    });
  }

  // Generate multiple layout variations
  static generateLayoutVariations(
    image: HTMLImageElement, 
    paperStyle: PaperStyle
  ): Array<{ name: string; description: string; dataUrl: string; analysis: LayoutAnalysis }> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Analyze the image once
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const analysis = this.analyzeImageContent(imageData);
    
    const variations = [
      {
        name: 'AI Optimized',
        description: 'Best match based on content analysis',
        dataUrl: this.generateEnhancedLayout(image, {
          ...paperStyle,
          lineType: analysis.suggestedLineType,
          lineSpacing: analysis.optimalSpacing,
          marginLine: analysis.marginSuggestion
        }, { overlayOpacity: 0.3, autoContrast: true }),
        analysis
      },
      {
        name: 'Current Style Match',
        description: 'Uses your current paper settings',
        dataUrl: this.generateEnhancedLayout(image, paperStyle, { overlayOpacity: 0.3 }),
        analysis
      },
      {
        name: 'High Contrast',
        description: 'Enhanced contrast with subtle overlay',
        dataUrl: this.generateEnhancedLayout(image, paperStyle, { 
          overlayOpacity: 0.2, 
          autoContrast: true 
        }),
        analysis
      },
      {
        name: 'Content Focused',
        description: 'Highlights detected content areas',
        dataUrl: this.generateEnhancedLayout(image, paperStyle, { 
          overlayOpacity: 0.4, 
          textDetection: true 
        }),
        analysis
      }
    ];
    
    return variations;
  }

  // Smart line alignment based on image content
  static alignLinesToContent(
    image: HTMLImageElement, 
    paperStyle: PaperStyle,
    contentAreas: any[]
  ): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    // Draw lines that align with detected text baselines
    ctx.strokeStyle = paperStyle.lineColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    
    contentAreas.forEach(area => {
      if (area.type === 'text') {
        const lineSpacing = 24; // Standard text line height
        const startY = area.y + lineSpacing;
        
        for (let y = startY; y < area.y + area.height; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(area.x, y);
          ctx.lineTo(area.x + area.width, y);
          ctx.stroke();
        }
      }
    });
    
    return canvas.toDataURL();
  }
}

// Hook for using the AI Layout Engine
export function useAILayoutEngine() {
  const generateLayouts = useCallback((image: HTMLImageElement, paperStyle: PaperStyle) => {
    return AILayoutEngine.generateLayoutVariations(image, paperStyle);
  }, []);

  const analyzeImage = useCallback((imageData: ImageData) => {
    return AILayoutEngine.analyzeImageContent(imageData);
  }, []);

  const enhanceLayout = useCallback((image: HTMLImageElement, paperStyle: PaperStyle, options: any) => {
    return AILayoutEngine.generateEnhancedLayout(image, paperStyle, options);
  }, []);

  return {
    generateLayouts,
    analyzeImage,
    enhanceLayout
  };
}
