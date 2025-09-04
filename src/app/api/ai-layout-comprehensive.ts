// Comprehensive AI Layout Generation System
// This module provides advanced layout generation capabilities using LLM-like understanding

interface LayoutElement {
  type: 'text' | 'line' | 'rect' | 'circle' | 'path' | 'image' | 'group';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    fontSize?: number;
    fontFamily?: string;
    opacity?: number;
    transform?: string;
  };
  children?: LayoutElement[];
}

interface LayoutSection {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  purpose: string;
  elements: LayoutElement[];
}

interface ParsedPrompt {
  mainPurpose: string;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  sections: string[];
  features: string[];
  style: string[];
  dimensions?: { width: number; height: number };
}

// Enhanced prompt parser with NLP-like understanding
export function parseLayoutPrompt(prompt: string): ParsedPrompt {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect timeframe
  let timeframe: ParsedPrompt['timeframe'];
  if (lowerPrompt.includes('week') || lowerPrompt.includes('weekly')) timeframe = 'weekly';
  else if (lowerPrompt.includes('month') || lowerPrompt.includes('monthly')) timeframe = 'monthly';
  else if (lowerPrompt.includes('day') || lowerPrompt.includes('daily')) timeframe = 'daily';
  else if (lowerPrompt.includes('year') || lowerPrompt.includes('yearly')) timeframe = 'yearly';
  
  // Extract sections (drawing, notes, calendar, etc.)
  const sections: string[] = [];
  const sectionKeywords = [
    'drawing', 'sketch', 'doodle', 'illustration',
    'notes', 'writing', 'text',
    'calendar', 'dates', 'schedule',
    'todo', 'tasks', 'checklist',
    'habit', 'tracker', 'goals',
    'graph', 'chart', 'data',
    'timeline', 'progress',
    'budget', 'expense', 'finance',
    'meal', 'recipe', 'cooking',
    'workout', 'exercise', 'fitness',
    'mood', 'journal', 'reflection',
    'project', 'planning', 'brainstorm'
  ];
  
  sectionKeywords.forEach(keyword => {
    if (lowerPrompt.includes(keyword)) {
      sections.push(keyword);
    }
  });
  
  // Extract features
  const features: string[] = [];
  const featureKeywords = [
    'colorful', 'minimal', 'detailed', 'simple',
    'grid', 'lined', 'dotted', 'blank',
    'decorated', 'fancy', 'clean', 'modern',
    'vintage', 'classic', 'creative', 'professional'
  ];
  
  featureKeywords.forEach(keyword => {
    if (lowerPrompt.includes(keyword)) {
      features.push(keyword);
    }
  });
  
  // Determine main purpose
  let mainPurpose = 'general';
  if (sections.includes('calendar') || sections.includes('schedule')) mainPurpose = 'planning';
  else if (sections.includes('drawing') || sections.includes('sketch')) mainPurpose = 'creative';
  else if (sections.includes('habit') || sections.includes('tracker')) mainPurpose = 'tracking';
  else if (sections.includes('journal') || sections.includes('reflection')) mainPurpose = 'journaling';
  else if (sections.includes('project') || sections.includes('planning')) mainPurpose = 'project';
  
  return {
    mainPurpose,
    timeframe,
    sections: sections.length > 0 ? sections : ['notes'],
    features,
    style: features,
    dimensions: { width: 1200, height: 1600 }
  };
}

// Intelligent layout generator that creates custom layouts based on parsed prompt
export function generateSmartLayout(parsedPrompt: ParsedPrompt): string {
  const { width, height } = parsedPrompt.dimensions || { width: 1200, height: 1600 };
  const sections = calculateSectionLayout(parsedPrompt);
  
  let svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>`;
  
  // Background
  const bgColor = parsedPrompt.features.includes('colorful') ? '#FFF9F0' : '#FAF7F0';
  svgContent += `<rect width='100%' height='100%' fill='${bgColor}'/>`;
  
  // Generate each section
  sections.forEach(section => {
    svgContent += generateSectionContent(section, parsedPrompt);
  });
  
  svgContent += '</svg>';
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

// Calculate optimal section layout based on requirements
function calculateSectionLayout(parsedPrompt: ParsedPrompt): LayoutSection[] {
  const { width, height } = parsedPrompt.dimensions || { width: 1200, height: 1600 };
  const sections: LayoutSection[] = [];
  const margin = 40;
  const spacing = 20;
  
  // Title area
  sections.push({
    name: 'title',
    x: margin,
    y: margin,
    width: width - 2 * margin,
    height: 80,
    purpose: 'title',
    elements: []
  });
  
  let currentY = margin + 80 + spacing;
  const availableHeight = height - currentY - margin;
  
  // Smart layout algorithm based on sections needed
  const sectionTypes = parsedPrompt.sections;
  
  if (sectionTypes.includes('drawing') && sectionTypes.includes('notes')) {
    // Split layout: drawing on one side, notes on other
    const halfWidth = (width - 2 * margin - spacing) / 2;
    
    sections.push({
      name: 'drawing',
      x: margin,
      y: currentY,
      width: halfWidth,
      height: availableHeight * 0.6,
      purpose: 'drawing',
      elements: []
    });
    
    sections.push({
      name: 'notes',
      x: margin + halfWidth + spacing,
      y: currentY,
      width: halfWidth,
      height: availableHeight * 0.6,
      purpose: 'notes',
      elements: []
    });
    
    currentY += availableHeight * 0.6 + spacing;
  } else if (sectionTypes.includes('calendar') || parsedPrompt.timeframe === 'weekly') {
    // Calendar/weekly layout
    const calendarHeight = parsedPrompt.timeframe === 'weekly' ? availableHeight * 0.7 : availableHeight * 0.5;
    
    sections.push({
      name: 'calendar',
      x: margin,
      y: currentY,
      width: width - 2 * margin,
      height: calendarHeight,
      purpose: 'calendar',
      elements: []
    });
    
    currentY += calendarHeight + spacing;
  }
  
  // Add remaining sections
  if (sectionTypes.includes('todo') || sectionTypes.includes('tasks')) {
    const todoHeight = Math.min(300, availableHeight - (currentY - margin - 80 - spacing));
    
    sections.push({
      name: 'todo',
      x: margin,
      y: currentY,
      width: (width - 2 * margin) * 0.4,
      height: todoHeight,
      purpose: 'todo',
      elements: []
    });
  }
  
  if (sectionTypes.includes('habit') || sectionTypes.includes('tracker')) {
    const trackerWidth = (width - 2 * margin) * 0.6;
    const trackerX = width - margin - trackerWidth;
    
    sections.push({
      name: 'tracker',
      x: trackerX,
      y: currentY,
      width: trackerWidth,
      height: Math.min(300, availableHeight - (currentY - margin - 80 - spacing)),
      purpose: 'tracker',
      elements: []
    });
  }
  
  return sections;
}

// Generate content for each section based on its purpose
function generateSectionContent(section: LayoutSection, parsedPrompt: ParsedPrompt): string {
  let content = '';
  const { x, y, width, height, purpose } = section;
  
  // Section border
  const borderColor = parsedPrompt.features.includes('colorful') ? '#8B5CF6' : '#E5E5E5';
  content += `<rect x='${x}' y='${y}' width='${width}' height='${height}' fill='none' stroke='${borderColor}' stroke-width='2' rx='10'/>`;
  
  switch (purpose) {
    case 'title':
      content += generateTitleContent(section, parsedPrompt);
      break;
    case 'drawing':
      content += generateDrawingSection(section, parsedPrompt);
      break;
    case 'notes':
      content += generateNotesSection(section, parsedPrompt);
      break;
    case 'calendar':
      content += generateCalendarSection(section, parsedPrompt);
      break;
    case 'todo':
      content += generateTodoSection(section, parsedPrompt);
      break;
    case 'tracker':
      content += generateTrackerSection(section, parsedPrompt);
      break;
  }
  
  return content;
}

// Generate title section
function generateTitleContent(section: LayoutSection, parsedPrompt: ParsedPrompt): string {
  const { x, y, width, height } = section;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  let title = 'My Planner';
  if (parsedPrompt.timeframe === 'weekly') title = 'Weekly Planner';
  else if (parsedPrompt.timeframe === 'monthly') title = 'Monthly Overview';
  else if (parsedPrompt.sections.includes('journal')) title = 'Journal Entry';
  else if (parsedPrompt.sections.includes('project')) title = 'Project Planning';
  
  const titleColor = parsedPrompt.features.includes('colorful') ? '#7C3AED' : '#2C2C2C';
  
  return `<text x='${centerX}' y='${centerY}' font-size='36' fill='${titleColor}' text-anchor='middle' dominant-baseline='middle' font-weight='bold'>${title}</text>`;
}

// Generate drawing section with grid or dots
function generateDrawingSection(section: LayoutSection, parsedPrompt: ParsedPrompt): string {
  let content = '';
  const { x, y, width, height } = section;
  
  // Add background pattern
  if (parsedPrompt.features.includes('grid')) {
    const gridSize = 20;
    for (let gx = x; gx <= x + width; gx += gridSize) {
      content += `<line x1='${gx}' y1='${y}' x2='${gx}' y2='${y + height}' stroke='#E5E5E5' stroke-width='0.5'/>`;
    }
    for (let gy = y; gy <= y + height; gy += gridSize) {
      content += `<line x1='${x}' y1='${gy}' x2='${x + width}' y2='${gy}' stroke='#E5E5E5' stroke-width='0.5'/>`;
    }
  } else if (parsedPrompt.features.includes('dotted')) {
    const dotSize = 25;
    for (let dy = y + dotSize; dy < y + height; dy += dotSize) {
      for (let dx = x + dotSize; dx < x + width; dx += dotSize) {
        content += `<circle cx='${dx}' cy='${dy}' r='1' fill='#D1D5DB'/>`;
      }
    }
  }
  
  // Add label
  content += `<text x='${x + 10}' y='${y + 20}' font-size='14' fill='#6B7280'>Drawing Area</text>`;
  
  return content;
}

// Generate notes section with lines
function generateNotesSection(section: LayoutSection, parsedPrompt: ParsedPrompt): string {
  let content = '';
  const { x, y, width, height } = section;
  const lineSpacing = 25;
  const startY = y + 40;
  
  // Add lines
  for (let ly = startY; ly < y + height - 10; ly += lineSpacing) {
    content += `<line x1='${x + 10}' y1='${ly}' x2='${x + width - 10}' y2='${ly}' stroke='#E5E5E5' stroke-width='1'/>`;
  }
  
  // Add label
  content += `<text x='${x + 10}' y='${y + 20}' font-size='14' fill='#6B7280'>Notes</text>`;
  
  return content;
}

// Generate calendar section
function generateCalendarSection(section: LayoutSection, parsedPrompt: ParsedPrompt): string {
  let content = '';
  const { x, y, width, height } = section;
  
  if (parsedPrompt.timeframe === 'weekly') {
    // Weekly calendar
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayHeight = (height - 40) / 7;
    
    days.forEach((day, index) => {
      const dayY = y + 40 + index * dayHeight;
      
      // Day box
      content += `<rect x='${x}' y='${dayY}' width='${width}' height='${dayHeight}' fill='none' stroke='#E5E5E5' stroke-width='1'/>`;
      
      // Day label background
      content += `<rect x='${x}' y='${dayY}' width='120' height='${dayHeight}' fill='#F3F4F6'/>`;
      
      // Day name
      content += `<text x='${x + 60}' y='${dayY + dayHeight / 2}' font-size='16' fill='#4B5563' text-anchor='middle' dominant-baseline='middle'>${day}</text>`;
      
      // Time slots or lines
      const lineX = x + 130;
      for (let i = 1; i < 4; i++) {
        const lineY = dayY + (dayHeight / 4) * i;
        content += `<line x1='${lineX}' y1='${lineY}' x2='${x + width - 10}' y2='${lineY}' stroke='#F3F4F6' stroke-width='0.5'/>`;
      }
    });
  } else if (parsedPrompt.timeframe === 'monthly') {
    // Monthly calendar grid
    const cellWidth = width / 7;
    const cellHeight = (height - 60) / 5;
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Week headers
    weekDays.forEach((day, index) => {
      const dayX = x + index * cellWidth;
      content += `<text x='${dayX + cellWidth / 2}' y='${y + 30}' font-size='14' fill='#6B7280' text-anchor='middle'>${day}</text>`;
    });
    
    // Calendar grid
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        const cellX = x + day * cellWidth;
        const cellY = y + 60 + week * cellHeight;
        
        content += `<rect x='${cellX}' y='${cellY}' width='${cellWidth}' height='${cellHeight}' fill='none' stroke='#E5E5E5' stroke-width='0.5'/>`;
        
        // Add date number (simplified)
        const date = week * 7 + day + 1;
        if (date <= 31) {
          content += `<text x='${cellX + 10}' y='${cellY + 20}' font-size='12' fill='#6B7280'>${date}</text>`;
        }
      }
    }
  }
  
  return content;
}

// Generate todo section
function generateTodoSection(section: LayoutSection, parsedPrompt: ParsedPrompt): string {
  let content = '';
  const { x, y, width, height } = section;
  const itemHeight = 30;
  const maxItems = Math.floor((height - 40) / itemHeight);
  
  // Title
  content += `<text x='${x + 10}' y='${y + 25}' font-size='18' fill='#374151' font-weight='bold'>To-Do List</text>`;
  
  // Todo items
  for (let i = 0; i < maxItems; i++) {
    const itemY = y + 50 + i * itemHeight;
    
    // Checkbox
    content += `<rect x='${x + 10}' y='${itemY}' width='20' height='20' fill='none' stroke='#D1D5DB' stroke-width='2' rx='4'/>`;
    
    // Line for text
    content += `<line x1='${x + 40}' y1='${itemY + 15}' x2='${x + width - 10}' y2='${itemY + 15}' stroke='#E5E5E5' stroke-width='1'/>`;
  }
  
  return content;
}

// Generate habit tracker section
function generateTrackerSection(section: LayoutSection, parsedPrompt: ParsedPrompt): string {
  let content = '';
  const { x, y, width, height } = section;
  
  // Title
  content += `<text x='${x + 10}' y='${y + 25}' font-size='18' fill='#374151' font-weight='bold'>Habit Tracker</text>`;
  
  const habits = ['Exercise', 'Water', 'Reading', 'Sleep'];
  const dayWidth = (width - 120) / 7;
  const habitHeight = 40;
  
  // Days header
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  days.forEach((day, index) => {
    const dayX = x + 120 + index * dayWidth;
    content += `<text x='${dayX + dayWidth / 2}' y='${y + 50}' font-size='12' fill='#6B7280' text-anchor='middle'>${day}</text>`;
  });
  
  // Habit rows
  habits.forEach((habit, habitIndex) => {
    const habitY = y + 70 + habitIndex * habitHeight;
    
    // Habit name
    content += `<text x='${x + 10}' y='${habitY + 20}' font-size='14' fill='#4B5563'>${habit}</text>`;
    
    // Tracking boxes
    for (let day = 0; day < 7; day++) {
      const boxX = x + 120 + day * dayWidth + (dayWidth - 25) / 2;
      content += `<rect x='${boxX}' y='${habitY}' width='25' height='25' fill='none' stroke='#D1D5DB' stroke-width='1' rx='4'/>`;
    }
  });
  
  return content;
}

// Main comprehensive layout generator
export function generateComprehensiveLayout(prompt: string, paperStyle: any): string {
  const parsedPrompt = parseLayoutPrompt(prompt);
  
  // Add paper style preferences to parsed prompt
  if (paperStyle.lineType) {
    parsedPrompt.features.push(paperStyle.lineType);
  }
  
  return generateSmartLayout(parsedPrompt);
}

// Generate multiple layout variations
export function generateLayoutVariations(prompt: string, paperStyle: any, count: number = 3): Array<{
  name: string;
  description: string;
  imageData: string;
  confidence: number;
  analysis: {
    detectedContent: string[];
    suggestedStyle: string;
    contentAreas: number;
    suggestedLineType?: string;
    optimalSpacing?: string;
  };
}> {
  const variations = [];
  const parsedPrompt = parseLayoutPrompt(prompt);
  
  // Generate different variations by modifying the parsed prompt
  for (let i = 0; i < count; i++) {
    let variationPrompt = { ...parsedPrompt };
    let name = '';
    let description = '';
    let confidence = 0.9;
    
    switch (i) {
      case 0:
        // Original interpretation
        name = 'Classic Layout';
        description = 'Traditional layout based on your requirements';
        confidence = 0.95;
        break;
      case 1:
        // More creative version
        variationPrompt.features.push('colorful', 'decorated');
        name = 'Creative Layout';
        description = 'Enhanced with decorative elements and colors';
        confidence = 0.85;
        break;
      case 2:
        // Minimalist version
        variationPrompt.features = variationPrompt.features.filter(f => !['colorful', 'decorated'].includes(f));
        variationPrompt.features.push('minimal', 'clean');
        name = 'Minimal Layout';
        description = 'Clean and simple design for focused work';
        confidence = 0.88;
        break;
    }
    
    variations.push({
      name,
      description,
      imageData: generateSmartLayout(variationPrompt),
      confidence,
      analysis: {
        detectedContent: variationPrompt.sections,
        suggestedStyle: variationPrompt.mainPurpose,
        contentAreas: variationPrompt.sections.length,
        suggestedLineType: paperStyle.lineType || 'ruled',
        optimalSpacing: 'normal'
      }
    });
  }
  
  return variations;
}
