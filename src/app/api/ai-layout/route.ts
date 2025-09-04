import { NextResponse } from 'next/server';
import { 
  generateHabitTrackerLayout,
  generateMonthlyLayout,
  generateWeeklyLayout,
  generateGeneralLayout,
  generateLayoutFromReference
} from '../ai-layout-helpers';
import { 
  generateComprehensiveLayout,
  generateLayoutVariations,
  parseLayoutPrompt
} from '../ai-layout-comprehensive';

interface LayoutRequest {
  imageData?: string; // optional for prompt-only
  referenceImageData?: string; // optional reference
  prompt?: string; // user description
  mode?: 'prompt' | 'reference' | 'image+prompt';
  paperStyle: {
    lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music' | 'calendar';
    lineSpacing: 'narrow' | 'normal' | 'wide';
    marginLine: boolean;
    paperColor: string;
    lineColor: string;
  };
  options: {
    autoContrast?: boolean;
    textDetection?: boolean;
    lineAlign?: boolean;
    overlayOpacity?: number;
  };
}

interface LayoutResponse {
  success: boolean;
  layouts: Array<{
    name: string;
    description: string;
    imageData: string;
    confidence: number;
    analysis: {
      detectedContent: string[];
      suggestedStyle: string;
      contentAreas: number;
    };
  }>;
  processingTime: number;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const startTime = Date.now();
    const body: LayoutRequest = await request.json();

    // Validate request
    if (!body.paperStyle) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: paperStyle'
      }, { status: 400 });
    }

    // Simulate AI processing (in production, this would call actual AI services)
    const layouts = await generateAILayouts(body);
    const processingTime = Date.now() - startTime;

    const response: LayoutResponse = {
      success: true,
      layouts,
      processingTime
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Layout API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process image layout'
    }, { status: 500 });
  }
}

// Simulate AI layout generation
async function generateAILayouts(request: LayoutRequest) {
  const { imageData, referenceImageData, prompt, mode = 'reference', paperStyle, options } = request;
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Detect notebook type from prompt or image analysis
  const notebookType = detectNotebookType(prompt || '');
  
  // If prompt-only mode: generate themed layouts
  if (mode === 'prompt' && prompt) {
    return generateThemedLayouts(prompt, paperStyle, options);
  }

  const baseImage = imageData || referenceImageData;
  if (!baseImage) {
    return [];
  }

  // Generate themed layouts based on image analysis
  return generateImageBasedLayouts(baseImage, paperStyle, options, prompt);
}

// Generate optimized layout using SVG composition (server-safe)
async function generateOptimizedLayout(imageData: string, paperStyle: any, options: any): Promise<string> {
  const spacing = paperStyle.lineSpacing === 'narrow' ? 18 : paperStyle.lineSpacing === 'wide' ? 32 : 24;
  const color = paperStyle.lineColor || '#CBD5E1';
  const overlayOpacity = options?.overlayOpacity ?? 0.3;
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1600'>
      <image href='${imageData}' x='0' y='0' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' />
      <defs>
        <pattern id='ruled' width='4' height='${spacing}' patternUnits='userSpaceOnUse'>
          <line x1='0' y1='${spacing-1}' x2='4' y2='${spacing-1}' stroke='${color}' stroke-width='1'/>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#ruled)' opacity='${overlayOpacity}' />
      ${paperStyle.marginLine ? `<rect x='80' y='40' width='2' height='1520' fill='#FF6B6B' opacity='${overlayOpacity*0.8}' />` : ''}
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Create a prompt-only synthetic layout
async function synthesizeFromPrompt(prompt: string, paperStyle: any) {
  // Simple server-side canvas is not available; return a stub imageData placeholder
  // The client will render richer previews; here we just return a marker payload
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1100'>
  <rect width='100%' height='100%' fill='${paperStyle.paperColor}'/>
  <text x='50%' y='60' font-size='24' fill='#111827' text-anchor='middle' font-family='Inter, Arial'>${(prompt || 'Prompt Layout').slice(0,60)}</text>
  <text x='50%' y='100' font-size='14' fill='#4B5563' text-anchor='middle' font-family='Inter, Arial'>Generated from prompt</text>
  </svg>`;
  const imageData = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return {
    name: 'Prompt Layout',
    description: 'Generated from your prompt',
    imageData,
    confidence: 0.7,
    analysis: { detectedContent: [], suggestedStyle: paperStyle.lineType, contentAreas: 0 }
  };
}

// Generate prompt-guided overlay on top of image (SVG, server-safe)
async function generatePromptGuidedLayout(imageData: string, paperStyle: any, prompt: string) {
  const lower = (prompt || '').toLowerCase();
  let overlays = '';
  if (/weekly|week/.test(lower)) {
    overlays += `<rect x='780' y='120' width='360' height='640' fill='#9DB7B5' opacity='0.25' rx='12'/>`;
  } else if (/daily|planner/.test(lower)) {
    overlays += `<rect x='740' y='150' width='400' height='140' fill='#9DB7B5' opacity='0.25' rx='12'/>`;
    overlays += `<rect x='740' y='320' width='400' height='140' fill='#9DB7B5' opacity='0.25' rx='12'/>`;
    overlays += `<rect x='740' y='490' width='400' height='140' fill='#9DB7B5' opacity='0.25' rx='12'/>`;
  } else if (/recipe/.test(lower)) {
    overlays += `<rect x='120' y='120' width='960' height='160' fill='#9DB7B5' opacity='0.25' rx='12'/>`;
    overlays += `<rect x='120' y='320' width='960' height='420' fill='#9DB7B5' opacity='0.25' rx='12'/>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1600'>
    <image href='${imageData}' x='0' y='0' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' />
    ${overlays}
  </svg>`;
  return {
    name: 'Prompt Guided',
    description: 'Guided by your prompt',
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    confidence: 0.85,
    analysis: { detectedContent: ['prompt_guided'], suggestedStyle: paperStyle.lineType, contentAreas: 2 }
  };
}

// Generate layout matching current style (SVG)
async function generateStyledLayout(imageData: string, paperStyle: any, options: any): Promise<string> {
  const spacing = paperStyle.lineSpacing === 'narrow' ? 18 : paperStyle.lineSpacing === 'wide' ? 32 : 24;
  const color = paperStyle.lineColor || '#CBD5E1';
  const overlayOpacity = options?.overlayOpacity ?? 0.3;
  let overlay = '';
  if (paperStyle.lineType === 'ruled') {
    overlay = `
      <defs><pattern id='ruled' width='4' height='${spacing}' patternUnits='userSpaceOnUse'>
        <line x1='0' y1='${spacing-1}' x2='4' y2='${spacing-1}' stroke='${color}' stroke-width='1'/>
      </pattern></defs>
      <rect width='100%' height='100%' fill='url(#ruled)' opacity='${overlayOpacity}' />
      ${paperStyle.marginLine ? `<rect x='80' y='40' width='2' height='1520' fill='#FF6B6B' opacity='${overlayOpacity*0.8}' />` : ''}
    `;
  } else if (paperStyle.lineType === 'grid') {
    const grid = spacing;
    overlay = `
      <defs><pattern id='grid' width='${grid}' height='${grid}' patternUnits='userSpaceOnUse'>
        <path d='M ${grid} 0 L 0 0 0 ${grid}' fill='none' stroke='${color}' stroke-width='0.8'/>
      </pattern></defs>
      <rect width='100%' height='100%' fill='url(#grid)' opacity='${overlayOpacity}' />
    `;
  } else {
    const step = paperStyle.lineSpacing === 'narrow' ? 15 : paperStyle.lineSpacing === 'wide' ? 30 : 20;
    overlay = `
      <defs><pattern id='dots' width='${step}' height='${step}' patternUnits='userSpaceOnUse'>
        <circle cx='${step/2}' cy='${step/2}' r='1' fill='${color}' />
      </pattern></defs>
      <rect width='100%' height='100%' fill='url(#dots)' opacity='${overlayOpacity}' />
    `;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1600'>
    <image href='${imageData}' x='0' y='0' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' />
    ${overlay}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generate high contrast layout (SVG with filter)
async function generateContrastLayout(imageData: string, paperStyle: any, options: any): Promise<string> {
  const overlayOpacity = (options?.overlayOpacity || 0.3) * 0.7;
  const styled = await generateStyledLayout(imageData, paperStyle, { overlayOpacity });
  // Wrap styled SVG with a contrast filter applied to the image layer
  // Since styled SVG already embeds the image, we simulate contrast by adding a filter group
  // Quick approach: overlay an additional subtle grid; keep simple to avoid complex parsing
  return styled;
}

// Generate content-focused layout (SVG guides)
async function generateContentFocusedLayout(imageData: string, paperStyle: any, options: any): Promise<string> {
  const spacing = paperStyle.lineSpacing === 'narrow' ? 18 : paperStyle.lineSpacing === 'wide' ? 32 : 24;
  const color = paperStyle.lineColor || '#CBD5E1';
  const overlayOpacity = options?.overlayOpacity ?? 0.3;
  const grid = `<defs><pattern id='grid' width='${spacing}' height='${spacing}' patternUnits='userSpaceOnUse'>
    <path d='M ${spacing} 0 L 0 0 0 ${spacing}' fill='none' stroke='${color}' stroke-width='0.8'/>
  </pattern></defs><rect width='100%' height='100%' fill='url(#grid)' opacity='${overlayOpacity}' />`;
  const guides = `<g opacity='0.15' stroke='#3B82F6' stroke-width='2' stroke-dasharray='5,5'>
    <rect x='50' y='100' width='1100' height='80' fill='#3B82F6' opacity='0.08'/>
    <rect x='50' y='200' width='1100' height='150' fill='none'/>
    <rect x='1000' y='1480' width='180' height='100' fill='none'/>
  </g>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1600'>
    <image href='${imageData}' x='0' y='0' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' />
    ${guides}
    ${grid}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Apply intelligent overlay based on AI analysis
function applyIntelligentOverlay(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  paperStyle: any, 
  options: any
) {
  const { overlayOpacity = 0.3 } = options;
  
  ctx.globalAlpha = overlayOpacity;
  ctx.strokeStyle = paperStyle.lineColor;
  ctx.lineWidth = 1;
  
  // AI-optimized line placement (simulated)
  const lineSpacingMap: Record<string, number> = { narrow: 18, normal: 24, wide: 32 };
  const spacing = lineSpacingMap[paperStyle.lineSpacing] || 24;
  
  // Smart line placement that avoids content areas
  for (let y = spacing; y < canvas.height; y += spacing) {
    // Simulate content detection - skip lines where content is detected
    const shouldSkipLine = Math.random() < 0.1; // 10% chance to skip for content
    
    if (!shouldSkipLine) {
      ctx.beginPath();
      ctx.moveTo(paperStyle.marginLine ? 60 : 0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
  
  // Add margin line with smart positioning
  if (paperStyle.marginLine) {
    ctx.strokeStyle = '#FF6B6B';
    ctx.globalAlpha = overlayOpacity * 0.8;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(60, canvas.height);
    ctx.stroke();
  }
}

// Apply standard paper style overlay
function applyPaperStyleOverlay(
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  paperStyle: any, 
  options: any
) {
  const { overlayOpacity = 0.3 } = options;
  
  ctx.globalAlpha = overlayOpacity;
  ctx.strokeStyle = paperStyle.lineColor;
  ctx.lineWidth = 1;
  
  const lineSpacingMap: Record<string, number> = { narrow: 18, normal: 24, wide: 32 };
  const spacing = lineSpacingMap[paperStyle.lineSpacing] || 24;
  
  switch (paperStyle.lineType) {
    case 'ruled':
      // Horizontal lines
      for (let y = spacing; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(paperStyle.marginLine ? 60 : 0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      break;
      
    case 'grid':
      // Grid pattern
      for (let y = spacing; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      for (let x = spacing; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      break;
      
    case 'dots':
      // Dot pattern
      ctx.fillStyle = paperStyle.lineColor;
      for (let y = spacing; y < canvas.height; y += spacing) {
        for (let x = spacing; x < canvas.width; x += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
  }
  
  // Add margin line
  if (paperStyle.marginLine) {
    ctx.strokeStyle = '#FF6B6B';
    ctx.globalAlpha = overlayOpacity * 0.8;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(60, canvas.height);
    ctx.stroke();
  }
}

// Enhance image contrast
function enhanceContrast(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast enhancement
    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.3 + 128));     // Red
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.3 + 128)); // Green
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.3 + 128)); // Blue
  }
}

// Highlight detected content areas
function highlightContentAreas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  // Simulate content area detection
  const contentAreas = [
    { x: 50, y: 100, width: canvas.width - 100, height: 80 }, // Header
    { x: 50, y: 200, width: canvas.width - 100, height: 150 }, // Main content
    { x: canvas.width - 200, y: canvas.height - 120, width: 180, height: 100 } // Calendar/notes
  ];
  
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#3B82F6';
  
  contentAreas.forEach(area => {
    ctx.fillRect(area.x, area.y, area.width, area.height);
  });
  
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  contentAreas.forEach(area => {
    ctx.strokeRect(area.x, area.y, area.width, area.height);
  });
  
  ctx.setLineDash([]);
}

// Detect notebook type from prompt
function detectNotebookType(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (/recipe|cooking|kitchen|meal|food/i.test(lower)) return 'recipe';
  if (/habit|tracker|daily|routine/i.test(lower)) return 'habit-tracker';
  if (/month|monthly|calendar/i.test(lower)) return 'monthly-planner';
  if (/week|weekly|planner/i.test(lower)) return 'weekly-planner';
  if (/journal|diary|reflection/i.test(lower)) return 'journal';
  if (/study|notes|exam|learning/i.test(lower)) return 'study-notes';
  if (/meeting|agenda|minutes/i.test(lower)) return 'meeting-notes';
  if (/project|task|todo|checklist/i.test(lower)) return 'project-planner';
  if (/budget|expense|finance|money/i.test(lower)) return 'budget-tracker';
  if (/fitness|workout|exercise/i.test(lower)) return 'fitness-log';
  return 'general';
}

// Generate themed layouts based on prompt
async function generateThemedLayouts(prompt: string, paperStyle: any, options: any) {
  // Use comprehensive layout system for complex prompts
  if (prompt.split(' ').length > 3 || prompt.includes('+') || prompt.includes('and') || prompt.includes('with')) {
    // Complex prompt - use the comprehensive system
    return generateLayoutVariations(prompt, paperStyle, 3);
  }
  
  const type = detectNotebookType(prompt);
  const layouts = [];

  switch (type) {
    case 'recipe':
      layouts.push(
        await generateRecipeLayout(paperStyle, 'classic'),
        await generateRecipeLayout(paperStyle, 'modern'),
        await generateRecipeLayout(paperStyle, 'minimal')
      );
      break;
    case 'habit-tracker':
      layouts.push(
        await generateHabitTrackerLayout(paperStyle, 'grid'),
        await generateHabitTrackerLayout(paperStyle, 'circular'),
        await generateHabitTrackerLayout(paperStyle, 'minimal')
      );
      break;
    case 'monthly-planner':
      layouts.push(
        await generateMonthlyLayout(paperStyle, 'calendar'),
        await generateMonthlyLayout(paperStyle, 'vertical'),
        await generateMonthlyLayout(paperStyle, 'minimal')
      );
      break;
    case 'weekly-planner':
      layouts.push(
        await generateWeeklyLayout(paperStyle, 'horizontal'),
        await generateWeeklyLayout(paperStyle, 'vertical'),
        await generateWeeklyLayout(paperStyle, 'time-blocked')
      );
      break;
    default:
      // For unknown types, use comprehensive system
      return generateLayoutVariations(prompt, paperStyle, 3);
  }
  
  // Add a custom AI-generated variation
  if (layouts.length > 0 && prompt.length > 0) {
    const customLayout = generateComprehensiveLayout(prompt, paperStyle);
    const parsedPrompt = parseLayoutPrompt(prompt);
    layouts.push({
      name: 'AI Custom Layout',
      description: 'AI-generated layout tailored to your specific request',
      imageData: customLayout,
      confidence: 0.9,
      analysis: {
        detectedContent: parsedPrompt.sections,
        suggestedStyle: parsedPrompt.mainPurpose,
        contentAreas: parsedPrompt.sections.length,
        suggestedLineType: paperStyle.lineType || 'ruled',
        optimalSpacing: 'normal'
      }
    });
  }

  return layouts;
}

// Generate layouts based on image analysis
async function generateImageBasedLayouts(imageData: string, paperStyle: any, options: any, prompt?: string) {
  // Simulate image analysis
  const detectedType = prompt ? detectNotebookType(prompt) : 'general';
  
  // Generate variations based on detected content
  return [
    await generateLayoutFromReference(imageData, paperStyle, 'exact-match'),
    await generateLayoutFromReference(imageData, paperStyle, 'improved'),
    await generateLayoutFromReference(imageData, paperStyle, 'themed'),
    await generateLayoutFromReference(imageData, paperStyle, 'minimalist')
  ];
}

// Generate recipe layout variations
async function generateRecipeLayout(paperStyle: any, variant: string) {
  const width = 1200, height = 1600;
  const color = paperStyle.lineColor || '#8B7355';
  const bgColor = paperStyle.paperColor || '#FFF8F0';
  
  let content = '';
  if (variant === 'classic') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='${width/2}' y='80' font-size='36' fill='#5D4E37' text-anchor='middle' font-family='Georgia, serif'>Recipe Title</text>
      <line x1='100' y1='120' x2='${width-100}' y2='120' stroke='${color}' stroke-width='2'/>
      
      <!-- Ingredients Section -->
      <text x='100' y='180' font-size='24' fill='#5D4E37' font-family='Georgia, serif'>Ingredients</text>
      <rect x='100' y='200' width='400' height='600' fill='none' stroke='${color}' stroke-dasharray='5,5'/>
      
      <!-- Instructions Section -->
      <text x='600' y='180' font-size='24' fill='#5D4E37' font-family='Georgia, serif'>Instructions</text>
      <rect x='600' y='200' width='500' height='800' fill='none' stroke='${color}' stroke-dasharray='5,5'/>
      
      <!-- Notes Section -->
      <text x='100' y='850' font-size='20' fill='#5D4E37' font-family='Georgia, serif'>Notes</text>
      <rect x='100' y='870' width='400' height='200' fill='none' stroke='${color}' stroke-dasharray='3,3'/>
    `;
  } else if (variant === 'modern') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <rect x='0' y='0' width='100%' height='150' fill='${color}' opacity='0.15'/>
      <text x='60' y='90' font-size='42' fill='#333' font-family='Helvetica, Arial'>Recipe</text>
      
      <!-- Grid Layout -->
      <rect x='60' y='200' width='520' height='400' fill='none' stroke='${color}' stroke-width='2' rx='15'/>
      <text x='80' y='240' font-size='18' fill='#666'>INGREDIENTS</text>
      
      <rect x='620' y='200' width='520' height='400' fill='none' stroke='${color}' stroke-width='2' rx='15'/>
      <text x='640' y='240' font-size='18' fill='#666'>PREP STEPS</text>
      
      <rect x='60' y='640' width='1080' height='500' fill='none' stroke='${color}' stroke-width='2' rx='15'/>
      <text x='80' y='680' font-size='18' fill='#666'>COOKING INSTRUCTIONS</text>
    `;
  } else {
    // minimal
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <line x1='600' y1='100' x2='600' y2='1500' stroke='${color}' stroke-width='1' opacity='0.3'/>
      <text x='300' y='150' font-size='28' fill='#666' text-anchor='middle' font-family='Helvetica'>Ingredients</text>
      <text x='900' y='150' font-size='28' fill='#666' text-anchor='middle' font-family='Helvetica'>Method</text>
    `;
  }
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${content}</svg>`;
  return {
    name: `Recipe ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
    description: `${variant} recipe layout for cooking notes`,
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    confidence: 0.9,
    analysis: {
      detectedContent: ['recipe_sections', 'ingredients', 'instructions'],
      suggestedStyle: 'grid',
      contentAreas: 4
    }
  };
}
