// Helper functions for AI layout generation

// Generate habit tracker layout variations
export async function generateHabitTrackerLayout(paperStyle: any, variant: string) {
  const width = 1200, height = 1600;
  const color = paperStyle.lineColor || '#4A90E2';
  const bgColor = paperStyle.paperColor || '#F8FAFF';
  
  let content = '';
  if (variant === 'grid') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='${width/2}' y='80' font-size='32' fill='#2C5282' text-anchor='middle' font-family='Arial'>Habit Tracker</text>
      
      <!-- Days of week -->
      ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => 
        `<text x='${200 + i * 120}' y='150' font-size='20' fill='#2C5282' text-anchor='middle'>${day}</text>`
      ).join('')}
      
      <!-- Habit grid -->
      ${Array.from({length: 10}, (_, i) => `
        <rect x='100' y='${180 + i * 60}' width='80' height='50' fill='none' stroke='${color}' stroke-width='1' rx='5'/>
        ${Array.from({length: 7}, (_, j) => 
          `<rect x='${200 + j * 120}' y='${180 + i * 60}' width='50' height='50' fill='none' stroke='${color}' stroke-width='1' rx='5'/>`
        ).join('')}
      `).join('')}
    `;
  } else if (variant === 'circular') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='${width/2}' y='80' font-size='32' fill='#2C5282' text-anchor='middle' font-family='Arial'>Monthly Habits</text>
      
      <!-- Circular tracker -->
      ${Array.from({length: 4}, (_, row) => 
        Array.from({length: 3}, (_, col) => {
          const cx = 200 + col * 400;
          const cy = 300 + row * 300;
          return `
            <circle cx='${cx}' cy='${cy}' r='120' fill='none' stroke='${color}' stroke-width='2'/>
            <text x='${cx}' y='${cy-140}' font-size='18' fill='#2C5282' text-anchor='middle'>Habit ${row * 3 + col + 1}</text>
          `;
        }).join('')
      ).join('')}
    `;
  } else {
    // minimal
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      ${Array.from({length: 31}, (_, i) => {
        const y = 100 + i * 45;
        return `
          <text x='80' y='${y}' font-size='16' fill='#666' text-anchor='end'>${i + 1}</text>
          <line x1='100' y1='${y - 10}' x2='1100' y2='${y - 10}' stroke='${color}' stroke-width='1' opacity='0.3'/>
        `;
      }).join('')}
    `;
  }
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${content}</svg>`;
  return {
    name: `Habit Tracker ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
    description: `${variant} habit tracking layout`,
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    confidence: 0.88,
    analysis: {
      detectedContent: ['habit_grid', 'tracking_boxes', 'dates'],
      suggestedStyle: variant === 'grid' ? 'grid' : 'dots',
      contentAreas: variant === 'circular' ? 12 : 31
    }
  };
}

// Generate monthly planner layout variations
export async function generateMonthlyLayout(paperStyle: any, variant: string) {
  const width = 1200, height = 1600;
  const color = paperStyle.lineColor || '#6B46C1';
  const bgColor = paperStyle.paperColor || '#FAF5FF';
  
  let content = '';
  if (variant === 'calendar') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='${width/2}' y='80' font-size='36' fill='#553C9A' text-anchor='middle' font-family='Georgia'>Month Year</text>
      
      <!-- Days header -->
      ${days.map((day, i) => 
        `<text x='${100 + i * 150}' y='150' font-size='18' fill='#553C9A' text-anchor='middle' font-weight='bold'>${day}</text>`
      ).join('')}
      
      <!-- Calendar grid -->
      ${Array.from({length: 5}, (_, week) => 
        Array.from({length: 7}, (_, day) => `
          <rect x='${50 + day * 150}' y='${180 + week * 250}' width='140' height='240' 
                fill='none' stroke='${color}' stroke-width='1' rx='5'/>
          <text x='${60 + day * 150}' y='${205 + week * 250}' font-size='16' fill='#666'>${week * 7 + day + 1}</text>
        `).join('')
      ).join('')}
    `;
  } else if (variant === 'vertical') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <rect x='0' y='0' width='100%' height='100' fill='${color}' opacity='0.1'/>
      <text x='60' y='65' font-size='32' fill='#553C9A' font-family='Arial'>Monthly Overview</text>
      
      <!-- Week sections -->
      ${Array.from({length: 4}, (_, i) => `
        <rect x='60' y='${150 + i * 350}' width='1080' height='320' fill='none' stroke='${color}' stroke-width='2' rx='10'/>
        <text x='80' y='${180 + i * 350}' font-size='20' fill='#553C9A'>Week ${i + 1}</text>
      `).join('')}
    `;
  } else {
    // minimal
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <line x1='400' y1='100' x2='400' y2='1500' stroke='${color}' stroke-width='1' opacity='0.3'/>
      <line x1='800' y1='100' x2='800' y2='1500' stroke='${color}' stroke-width='1' opacity='0.3'/>
      
      <text x='200' y='150' font-size='24' fill='#666' text-anchor='middle'>Goals</text>
      <text x='600' y='150' font-size='24' fill='#666' text-anchor='middle'>Calendar</text>
      <text x='1000' y='150' font-size='24' fill='#666' text-anchor='middle'>Notes</text>
    `;
  }
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${content}</svg>`;
  return {
    name: `Monthly ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
    description: `${variant} monthly planner layout`,
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    confidence: 0.92,
    analysis: {
      detectedContent: ['calendar_grid', 'month_view', 'dates'],
      suggestedStyle: 'grid',
      contentAreas: variant === 'calendar' ? 35 : 4
    }
  };
}

// Generate weekly planner layout variations
export async function generateWeeklyLayout(paperStyle: any, variant: string) {
  const width = 1200, height = 1600;
  const color = paperStyle.lineColor || '#059669';
  const bgColor = paperStyle.paperColor || '#F0FDF4';
  
  let content = '';
  if (variant === 'horizontal') {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='${width/2}' y='60' font-size='32' fill='#047857' text-anchor='middle'>Weekly Planner</text>
      
      ${days.map((day, i) => `
        <rect x='60' y='${100 + i * 200}' width='1080' height='180' fill='none' stroke='${color}' stroke-width='2' rx='10'/>
        <rect x='60' y='${100 + i * 200}' width='150' height='180' fill='${color}' opacity='0.1'/>
        <text x='135' y='${190 + i * 200}' font-size='18' fill='#047857' text-anchor='middle' transform='rotate(-90 135 ${190 + i * 200})'>${day}</text>
      `).join('')}
    `;
  } else if (variant === 'vertical') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='${width/2}' y='60' font-size='32' fill='#047857' text-anchor='middle'>Week at a Glance</text>
      
      <!-- Two columns layout -->
      ${['Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => `
        <rect x='60' y='${120 + i * 340}' width='500' height='320' fill='none' stroke='${color}' stroke-width='2' rx='10'/>
        <text x='80' y='${150 + i * 340}' font-size='20' fill='#047857'>${day}</text>
      `).join('')}
      
      ${['Fri', 'Sat', 'Sun'].map((day, i) => `
        <rect x='640' y='${120 + i * 340}' width='500' height='320' fill='none' stroke='${color}' stroke-width='2' rx='10'/>
        <text x='660' y='${150 + i * 340}' font-size='20' fill='#047857'>${day}</text>
      `).join('')}
    `;
  } else {
    // time-blocked
    const hours = Array.from({length: 12}, (_, i) => `${i + 7}:00`);
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='${width/2}' y='60' font-size='32' fill='#047857' text-anchor='middle'>Time Blocked Week</text>
      
      <!-- Time labels -->
      ${hours.map((hour, i) => 
        `<text x='50' y='${140 + i * 110}' font-size='14' fill='#666' text-anchor='end'>${hour}</text>`
      ).join('')}
      
      <!-- Day columns -->
      ${['M', 'T', 'W', 'T', 'F'].map((day, i) => `
        <text x='${150 + i * 200}' y='100' font-size='18' fill='#047857' text-anchor='middle'>${day}</text>
        <line x1='${100 + i * 200}' y1='120' x2='${100 + i * 200}' y2='1480' stroke='${color}' stroke-width='1' opacity='0.3'/>
      `).join('')}
    `;
  }
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${content}</svg>`;
  return {
    name: `Weekly ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
    description: `${variant.replace('-', ' ')} weekly planner`,
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    confidence: 0.91,
    analysis: {
      detectedContent: ['weekly_layout', 'day_sections', variant === 'time-blocked' ? 'time_slots' : 'open_planning'],
      suggestedStyle: variant === 'time-blocked' ? 'grid' : 'ruled',
      contentAreas: 7
    }
  };
}

// Generate general/study layout variations
export async function generateGeneralLayout(paperStyle: any, variant: string) {
  const width = 1200, height = 1600;
  const color = paperStyle.lineColor || '#3B82F6';
  const bgColor = paperStyle.paperColor || '#F0F9FF';
  
  let content = '';
  if (variant === 'cornell') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      
      <!-- Cornell note layout -->
      <line x1='300' y1='100' x2='300' y2='1300' stroke='${color}' stroke-width='2'/>
      <line x1='100' y1='1300' x2='1100' y2='1300' stroke='${color}' stroke-width='2'/>
      
      <text x='200' y='80' font-size='18' fill='#1E40AF' text-anchor='middle'>Cues</text>
      <text x='700' y='80' font-size='18' fill='#1E40AF' text-anchor='middle'>Notes</text>
      <text x='600' y='1350' font-size='18' fill='#1E40AF' text-anchor='middle'>Summary</text>
    `;
  } else if (variant === 'grid-sections') {
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      
      <!-- Grid sections -->
      <rect x='60' y='60' width='520' height='400' fill='none' stroke='${color}' stroke-width='2' rx='10'/>
      <text x='320' y='90' font-size='18' fill='#1E40AF' text-anchor='middle'>Key Concepts</text>
      
      <rect x='620' y='60' width='520' height='400' fill='none' stroke='${color}' stroke-width='2' rx='10'/>
      <text x='880' y='90' font-size='18' fill='#1E40AF' text-anchor='middle'>Examples</text>
      
      <rect x='60' y='500' width='1080' height='600' fill='none' stroke='${color}' stroke-width='2' rx='10'/>
      <text x='600' y='530' font-size='18' fill='#1E40AF' text-anchor='middle'>Detailed Notes</text>
    `;
  } else {
    // minimal
    content = `
      <rect width='100%' height='100%' fill='${bgColor}'/>
      <text x='100' y='80' font-size='24' fill='#666'>Title: _______________________</text>
      
      <!-- Simple lines -->
      ${Array.from({length: 40}, (_, i) => 
        `<line x1='100' y1='${120 + i * 35}' x2='1100' y2='${120 + i * 35}' stroke='${color}' stroke-width='1' opacity='0.3'/>`
      ).join('')}
    `;
  }
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${content}</svg>`;
  return {
    name: `${variant.charAt(0).toUpperCase() + variant.slice(1).replace('-', ' ')} Notes`,
    description: `${variant.replace('-', ' ')} note-taking layout`,
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    confidence: 0.85,
    analysis: {
      detectedContent: ['note_sections', variant === 'cornell' ? 'cornell_method' : 'structured_notes'],
      suggestedStyle: 'ruled',
      contentAreas: variant === 'grid-sections' ? 4 : 3
    }
  };
}

// Generate layout from reference image
export async function generateLayoutFromReference(imageData: string, paperStyle: any, variant: string) {
  const width = 1200, height = 1600;
  
  let overlay = '';
  let name = '';
  let description = '';
  
  switch (variant) {
    case 'exact-match':
      // Just the image with current paper style overlay
      overlay = generateBasicOverlay(paperStyle, 0.3);
      name = 'Exact Match';
      description = 'Your image with current paper style';
      break;
      
    case 'improved':
      // Enhanced with better structure
      overlay = `
        ${generateBasicOverlay(paperStyle, 0.2)}
        <rect x='80' y='80' width='${width-160}' height='100' fill='none' stroke='#3B82F6' stroke-width='2' stroke-dasharray='5,5' rx='10' opacity='0.5'/>
        <text x='${width/2}' y='120' font-size='24' fill='#3B82F6' text-anchor='middle' opacity='0.5'>Title Area</text>
      `;
      name = 'Enhanced Layout';
      description = 'Improved version with better structure';
      break;
      
    case 'themed':
      // Detect theme and apply appropriate overlay
      const color = '#8B5CF6';
      overlay = `
        ${generateBasicOverlay(paperStyle, 0.15)}
        <rect x='60' y='200' width='300' height='${height-400}' fill='${color}' opacity='0.05' rx='20'/>
        <rect x='${width-360}' y='200' width='300' height='${height-400}' fill='${color}' opacity='0.05' rx='20'/>
      `;
      name = 'Themed Version';
      description = 'Stylized with detected theme elements';
      break;
      
    case 'minimalist':
      // Clean, minimal overlay
      overlay = `
        <line x1='${width/2}' y1='100' x2='${width/2}' y2='${height-100}' stroke='${paperStyle.lineColor}' stroke-width='1' opacity='0.2'/>
        <line x1='100' y1='${height/2}' x2='${width-100}' y2='${height/2}' stroke='${paperStyle.lineColor}' stroke-width='1' opacity='0.2'/>
      `;
      name = 'Minimalist';
      description = 'Clean, distraction-free layout';
      break;
  }
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
    <image href='${imageData}' x='0' y='0' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' />
    ${overlay}
  </svg>`;
  
  return {
    name,
    description,
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    confidence: 0.85,
    analysis: {
      detectedContent: ['analyzed_layout', 'reference_based'],
      suggestedStyle: paperStyle.lineType,
      contentAreas: 2
    }
  };
}

// Helper to generate basic overlay
function generateBasicOverlay(paperStyle: any, opacity: number): string {
  const color = paperStyle.lineColor || '#CBD5E1';
  const spacing = paperStyle.lineSpacing === 'narrow' ? 18 : paperStyle.lineSpacing === 'wide' ? 32 : 24;
  
  if (paperStyle.lineType === 'grid') {
    return `
      <defs><pattern id='grid' width='${spacing}' height='${spacing}' patternUnits='userSpaceOnUse'>
        <path d='M ${spacing} 0 L 0 0 0 ${spacing}' fill='none' stroke='${color}' stroke-width='0.8'/>
      </pattern></defs>
      <rect width='100%' height='100%' fill='url(#grid)' opacity='${opacity}' />
    `;
  } else if (paperStyle.lineType === 'dots') {
    return `
      <defs><pattern id='dots' width='${spacing}' height='${spacing}' patternUnits='userSpaceOnUse'>
        <circle cx='${spacing/2}' cy='${spacing/2}' r='1' fill='${color}' />
      </pattern></defs>
      <rect width='100%' height='100%' fill='url(#dots)' opacity='${opacity}' />
    `;
  } else {
    // ruled
    return `
      <defs><pattern id='ruled' width='4' height='${spacing}' patternUnits='userSpaceOnUse'>
        <line x1='0' y1='${spacing-1}' x2='4' y2='${spacing-1}' stroke='${color}' stroke-width='1'/>
      </pattern></defs>
      <rect width='100%' height='100%' fill='url(#ruled)' opacity='${opacity}' />
      ${paperStyle.marginLine ? `<rect x='80' y='40' width='2' height='1520' fill='#FF6B6B' opacity='${opacity*0.8}' />` : ''}
    `;
  }
}
