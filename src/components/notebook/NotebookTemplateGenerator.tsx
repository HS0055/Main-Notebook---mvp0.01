"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar,
  Code,
  BookOpen,
  Grid3X3,
  PenTool,
  Coffee,
  Target,
  Lightbulb,
  Heart,
  Sparkles,
  Download,
  X,
  Wand2,
  Check
} from 'lucide-react';

interface NotebookTemplate {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'programming' | 'creative' | 'academic';
  icon: React.ComponentType<any>;
  preview: string;
  paperStyle: {
    lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music' | 'calendar';
    lineSpacing: 'narrow' | 'normal' | 'wide';
    marginLine: boolean;
    paperColor: string;
    lineColor: string;
  };
  layout: {
    sections: Array<{
      type: 'header' | 'checklist' | 'grid' | 'notes' | 'calendar' | 'code' | 'drawing';
      title: string;
      content: string;
      position: { x: number; y: number; width: number; height: number };
    }>;
  };
  cover: {
    color: string;
    pattern: string;
    title: string;
  };
}

interface NotebookTemplateGeneratorProps {
  onTemplateSelect?: (template: NotebookTemplate) => void;
  onClose?: () => void;
  isVisible?: boolean;
}

export default function NotebookTemplateGenerator({ 
  onTemplateSelect, 
  onClose, 
  isVisible = false 
}: NotebookTemplateGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('productivity');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Pre-made notebook templates based on your images
  const templates: NotebookTemplate[] = [
    {
      id: 'weekly-planner',
      name: 'Weekly Notes Planner',
      description: 'Dark theme weekly planner with sections and checkboxes',
      category: 'productivity',
      icon: Calendar,
      preview: '/api/templates/weekly-notes-preview',
      paperStyle: {
        lineType: 'ruled',
        lineSpacing: 'normal',
        marginLine: true,
        paperColor: '#2C2C2C',
        lineColor: '#404040'
      },
      layout: {
        sections: [
          {
            type: 'header',
            title: 'WEEKLY NOTES',
            content: 'WEEKLY NOTES',
            position: { x: 0, y: 0, width: 100, height: 15 }
          },
          {
            type: 'checklist',
            title: 'APARTMENT',
            content: '☐ BUILD NEW CABINET!\n☐ BUY FLOWERS\n☐ CALL ELECTRICIAN\n☐ WASH SHEETS AND TOWELS\n☐ PAID SANTO\n☐ GET A FRESH CANDLE',
            position: { x: 5, y: 20, width: 40, height: 40 }
          },
          {
            type: 'notes',
            title: 'THIS WEEK I WANT TO',
            content: 'PLAN GOALS!\nLOOK INTO YOGA CLASSES\nCOOK MORE FOR MYSELF',
            position: { x: 55, y: 20, width: 40, height: 30 }
          },
          {
            type: 'checklist',
            title: 'FOOD PLAN',
            content: '☐ TOFU STIR FRY\n☐ AIR FRYER SWEET POTATO\n☐ HOMEMADE HUMMUS\n☐ LEMON CAKE\n☐ COOKIES FOR BEN',
            position: { x: 5, y: 65, width: 40, height: 30 }
          },
          {
            type: 'notes',
            title: 'COFFEE ON THE BALCONY',
            content: 'MORE BATHS!\nVOLUNTEER AT THE DOG PARK',
            position: { x: 55, y: 65, width: 40, height: 25 }
          }
        ]
      },
      cover: {
        color: '#2C2C2C',
        pattern: 'ruled',
        title: 'Weekly Planner'
      }
    },
    {
      id: 'programming-template',
      name: 'Programming Digital Template',
      description: 'Light and dark theme coding notebook with structured layouts',
      category: 'programming',
      icon: Code,
      preview: '/api/templates/programming-preview',
      paperStyle: {
        lineType: 'ruled',
        lineSpacing: 'normal',
        marginLine: true,
        paperColor: '#FFFFFF',
        lineColor: '#E5E5E5'
      },
      layout: {
        sections: [
          {
            type: 'header',
            title: 'PROGRAMMING TEMPLATE',
            content: 'MINIMAL AND FUNCTIONAL',
            position: { x: 0, y: 0, width: 100, height: 10 }
          },
          {
            type: 'code',
            title: 'Program:',
            content: 'HALF PYRAMID\nFile name: pyramid.cpp\nDescription: This program creates a half pyramid',
            position: { x: 5, y: 15, width: 45, height: 70 }
          },
          {
            type: 'code',
            title: 'Output:',
            content: 'Enter # of rows\n*\n**\n***\n****\n*****',
            position: { x: 55, y: 15, width: 40, height: 70 }
          }
        ]
      },
      cover: {
        color: '#F8F9FA',
        pattern: 'ruled',
        title: 'Programming Notes'
      }
    },
    {
      id: 'interactive-paper',
      name: 'Interactive Paper Menu',
      description: 'Choose from multiple layout options for your notes',
      category: 'creative',
      icon: Grid3X3,
      preview: '/api/templates/interactive-preview',
      paperStyle: {
        lineType: 'dots',
        lineSpacing: 'normal',
        marginLine: false,
        paperColor: '#FFFFFF',
        lineColor: '#D1D5DB'
      },
      layout: {
        sections: [
          {
            type: 'header',
            title: 'INTERACTIVE PAPER MENU',
            content: 'TO CHOOSE THE PERFECT LAYOUT FOR YOUR NOTES',
            position: { x: 10, y: 10, width: 80, height: 15 }
          },
          {
            type: 'grid',
            title: 'Layout Options',
            content: 'SMALL DOTTED GRID\nLARGE DOTTED GRID\nSMALL LINES WITH TITLE\nLARGE LINES WITH TITLE\nSMALL LINES OXFORD\nLARGE LINES OXFORD\nSMALL LINES WITH MARGIN\nLARGE LINES WITH MARGIN\nSMALL SQUARE GRID\nLARGE SQUARE GRID',
            position: { x: 15, y: 30, width: 70, height: 60 }
          }
        ]
      },
      cover: {
        color: '#F3F4F6',
        pattern: 'dots',
        title: 'Layout Options'
      }
    },
    {
      id: 'creative-journal',
      name: 'Creative Journal',
      description: 'Drawing and story sections with ruled lines',
      category: 'creative',
      icon: PenTool,
      preview: '/api/templates/creative-preview',
      paperStyle: {
        lineType: 'ruled',
        lineSpacing: 'wide',
        marginLine: true,
        paperColor: '#FFFEF7',
        lineColor: '#E0E7FF'
      },
      layout: {
        sections: [
          {
            type: 'drawing',
            title: 'Drawing Here',
            content: '🌈 ☀️ ☁️\n[Drawing area with flowers and nature elements]',
            position: { x: 5, y: 10, width: 40, height: 80 }
          },
          {
            type: 'notes',
            title: 'Story Here',
            content: 'I helped my dad water the plants in the garden. The flowers are starting to bloom.',
            position: { x: 50, y: 10, width: 45, height: 80 }
          }
        ]
      },
      cover: {
        color: '#FEF3C7',
        pattern: 'ruled',
        title: 'Creative Journal'
      }
    },
    {
      id: 'study-notes',
      name: 'Academic Study Notes',
      description: 'Structured layout for academic subjects',
      category: 'academic',
      icon: BookOpen,
      preview: '/api/templates/study-preview',
      paperStyle: {
        lineType: 'ruled',
        lineSpacing: 'normal',
        marginLine: true,
        paperColor: '#FAFAFA',
        lineColor: '#E5E5E5'
      },
      layout: {
        sections: [
          {
            type: 'header',
            title: 'Subject & Date',
            content: 'Subject: ________________  Date: ________',
            position: { x: 0, y: 0, width: 100, height: 8 }
          },
          {
            type: 'notes',
            title: 'Main Notes',
            content: 'Key concepts:\n• \n• \n• \n\nDetailed explanations:\n\n\n\nExamples:',
            position: { x: 5, y: 12, width: 60, height: 75 }
          },
          {
            type: 'notes',
            title: 'Quick Review',
            content: 'Important formulas:\n\n\nQuestions to review:\n\n\nNext study session:',
            position: { x: 70, y: 12, width: 25, height: 75 }
          }
        ]
      },
      cover: {
        color: '#EFF6FF',
        pattern: 'ruled',
        title: 'Study Notes'
      }
    },
    {
      id: 'goal-tracker',
      name: 'Goal & Habit Tracker',
      description: 'Track daily goals and build habits',
      category: 'productivity',
      icon: Target,
      preview: '/api/templates/goals-preview',
      paperStyle: {
        lineType: 'grid',
        lineSpacing: 'normal',
        marginLine: false,
        paperColor: '#F9FAFB',
        lineColor: '#E5E7EB'
      },
      layout: {
        sections: [
          {
            type: 'header',
            title: 'GOALS & HABITS',
            content: 'Week of: ________________',
            position: { x: 0, y: 0, width: 100, height: 10 }
          },
          {
            type: 'checklist',
            title: 'Daily Habits',
            content: '☐ Morning routine\n☐ Exercise 30min\n☐ Read 20 pages\n☐ Drink 8 glasses water\n☐ Evening reflection',
            position: { x: 5, y: 15, width: 40, height: 35 }
          },
          {
            type: 'notes',
            title: 'Weekly Goals',
            content: '1. \n2. \n3. \n\nProgress notes:\n\n\nCelebrations:',
            position: { x: 50, y: 15, width: 45, height: 35 }
          },
          {
            type: 'calendar',
            title: 'Week Overview',
            content: 'Mon | Tue | Wed | Thu | Fri | Sat | Sun\n    |     |     |     |     |     |    \n    |     |     |     |     |     |    ',
            position: { x: 5, y: 55, width: 90, height: 40 }
          }
        ]
      },
      cover: {
        color: '#F0F9FF',
        pattern: 'grid',
        title: 'Goal Tracker'
      }
    }
  ];

  const categories = [
    { id: 'productivity', name: 'Productivity', icon: Target, color: 'blue' },
    { id: 'programming', name: 'Programming', icon: Code, color: 'green' },
    { id: 'creative', name: 'Creative', icon: PenTool, color: 'purple' },
    { id: 'academic', name: 'Academic', icon: BookOpen, color: 'orange' }
  ];

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const generateNotebookFromTemplate = useCallback(async (template: NotebookTemplate) => {
    setIsGenerating(true);
    setSelectedTemplate(template.id);
    
    try {
      // Simulate template generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create notebook with template structure
      const generatedNotebook = {
        ...template,
        id: `template_${Date.now()}`,
        createdAt: new Date().toISOString(),
        pages: generatePagesFromTemplate(template)
      };
      
      onTemplateSelect?.(generatedNotebook);
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setIsGenerating(false);
      setSelectedTemplate(null);
    }
  }, [onTemplateSelect]);

  const generatePagesFromTemplate = (template: NotebookTemplate) => {
    const pages = [];
    
    // Generate multiple pages based on template
    for (let i = 0; i < 3; i++) {
      const page = {
        id: `page_${i + 1}`,
        title: `Page ${i + 1}`,
        leftContent: generatePageContent(template, 'left', i),
        rightContent: generatePageContent(template, 'right', i),
        pageOrder: i + 1
      };
      pages.push(page);
    }
    
    return pages;
  };

  const generatePageContent = (template: NotebookTemplate, side: 'left' | 'right', pageIndex: number) => {
    const sections = template.layout.sections.filter(section => 
      side === 'left' ? section.position.x < 50 : section.position.x >= 50
    );
    
    return sections.map(section => {
      let content = section.content;
      
      // Add page-specific variations
      if (pageIndex > 0) {
        if (section.type === 'header') {
          content = content.replace('WEEKLY NOTES', `WEEK ${pageIndex + 1} NOTES`);
        }
        if (section.type === 'checklist') {
          content = content.replace(/☐/g, pageIndex % 2 === 0 ? '☑' : '☐');
        }
      }
      
      return `## ${section.title}\n\n${content}\n\n`;
    }).join('');
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Notebook Template Generator</h2>
                <p className="text-sm text-gray-500">Create beautiful notebooks from pre-made layouts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Categories Sidebar */}
          <div className="w-64 p-4 border-r border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4">Template Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">All Templates</span>
                </div>
              </button>
              
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id 
                        ? `bg-${category.color}-100 text-${category.color}-800 border border-${category.color}-300` 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Template Stats */}
            <div className="mt-6 p-3 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Available Templates</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>10+ unique layouts</span>
                  <span>✨</span>
                </div>
                <div className="flex justify-between">
                  <span>40+ variations</span>
                  <span>🎨</span>
                </div>
                <div className="flex justify-between">
                  <span>2 themes: light and dark</span>
                  <span>🌓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <motion.div
                    key={template.id}
                    className={`relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected && isGenerating
                        ? 'border-purple-500 ring-4 ring-purple-200 scale-105'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                    }`}
                    onClick={() => generateNotebookFromTemplate(template)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Template Preview */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      {/* Simulated template preview based on the template structure */}
                      <div 
                        className="w-full h-full p-4"
                        style={{ 
                          backgroundColor: template.paperStyle.paperColor,
                          backgroundImage: generatePreviewBackground(template.paperStyle)
                        }}
                      >
                        {/* Render template sections as preview */}
                        {template.layout.sections.map((section, index) => (
                          <div
                            key={index}
                            className="absolute text-xs"
                            style={{
                              left: `${section.position.x}%`,
                              top: `${section.position.y}%`,
                              width: `${section.position.width}%`,
                              height: `${section.position.height}%`,
                              color: template.paperStyle.paperColor === '#2C2C2C' ? '#FFFFFF' : '#2C2C2C'
                            }}
                          >
                            <div className="font-semibold mb-1">{section.title}</div>
                            <div className="opacity-70 leading-tight">
                              {section.content.substring(0, 50)}...
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-2 right-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getCategoryColor(template.category)
                        }`}>
                          {template.category}
                        </div>
                      </div>
                      
                      {/* Generation Loading Overlay */}
                      {isSelected && isGenerating && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
                            <div className="text-sm font-medium text-purple-900">Generating...</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          getCategoryBgColor(template.category)
                        }`}>
                          <Icon className={`w-4 h-4 ${getCategoryTextColor(template.category)}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                      </div>
                      
                      {/* Template Features */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                          {template.paperStyle.lineType}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                          {template.paperStyle.lineSpacing} spacing
                        </span>
                        {template.paperStyle.marginLine && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                            Margin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && isGenerating && (
                      <div className="absolute top-3 left-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Choose a template to generate a complete notebook with multiple pages and layouts
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                {filteredTemplates.length} templates available
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions for styling
function getCategoryColor(category: string) {
  const colors = {
    productivity: 'bg-blue-100 text-blue-700',
    programming: 'bg-green-100 text-green-700',
    creative: 'bg-purple-100 text-purple-700',
    academic: 'bg-orange-100 text-orange-700'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
}

function getCategoryBgColor(category: string) {
  const colors = {
    productivity: 'bg-blue-100',
    programming: 'bg-green-100',
    creative: 'bg-purple-100',
    academic: 'bg-orange-100'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100';
}

function getCategoryTextColor(category: string) {
  const colors = {
    productivity: 'text-blue-600',
    programming: 'text-green-600',
    creative: 'text-purple-600',
    academic: 'text-orange-600'
  };
  return colors[category as keyof typeof colors] || 'text-gray-600';
}

function generatePreviewBackground(paperStyle: any) {
  const { lineType, lineSpacing, lineColor } = paperStyle;
  
  const spacingMap = { narrow: '18px', normal: '24px', wide: '32px' };
  const spacing = spacingMap[lineSpacing] || '24px';
  
  switch (lineType) {
    case 'ruled':
      return `repeating-linear-gradient(transparent, transparent ${spacing}, ${lineColor} ${spacing})`;
    case 'grid':
      return `
        repeating-linear-gradient(90deg, transparent, transparent ${spacing}, ${lineColor} ${spacing}),
        repeating-linear-gradient(transparent, transparent ${spacing}, ${lineColor} ${spacing})
      `;
    case 'dots':
      return `radial-gradient(circle at 12px 12px, ${lineColor} 1px, transparent 1px)`;
    default:
      return 'none';
  }
}
