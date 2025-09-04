"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Sparkles, Calendar, Code, Grid3X3, PenTool } from 'lucide-react';

interface ExactTemplatesProps {
  onTemplateSelect?: (template: any) => void;
  onClose?: () => void;
  isVisible?: boolean;
}

export default function ExactTemplates({ onTemplateSelect, onClose, isVisible = false }: ExactTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Exact templates based on your images
  const exactTemplates = [
    {
      id: 'weekly-notes-dark',
      name: 'Weekly Notes (Dark)',
      description: 'Exact replica of your dark weekly planner',
      preview: 'dark-weekly',
      content: {
        title: 'Weekly Notes',
        pages: [
          {
            title: 'Weekly Planning',
            leftContent: `# WEEKLY NOTES

## APARTMENT
☐ BUILD NEW CABINET!
☐ BUY FLOWERS
☐ CALL ELECTRICIAN
☐ WASH SHEETS AND TOWELS
☐ PAID SANTO
☐ GET A FRESH CANDLE

## FOOD PLAN
☐ TOFU STIR FRY
☐ AIR FRYER SWEET POTATO
☐ HOMEMADE HUMMUS
☐ LEMON CAKE
☐ COOKIES FOR BEN

## WORK STUFF
☐ RESPOND TO EMAILS
☐ WRITE UP WEEKLY TO DO
☐ FOLLOW UP WITH ENS
☐ SORT OUT DESKTOP
☐ UPLOAD NEW PROJECT`,
            rightContent: `## THIS WEEK I WANT TO

PLAN GOALS!
LOOK INTO YOGA CLASSES
COOK MORE FOR MYSELF

## COFFEE ON THE BALCONY
MORE BATHS!
VOLUNTEER AT THE DOG PARK

---

*Weekly planning for a productive and balanced life*`
          ,
          paperStyle: {
            lineType: 'dots',
            lineSpacing: 'normal',
            marginLine: false,
            paperColor: '#2C2C2C',
            lineColor: '#404040'
          }
          }
        ],
        paperStyle: {
          lineType: 'dots',
          lineSpacing: 'normal',
          marginLine: false,
          paperColor: '#2C2C2C',
          lineColor: '#404040'
        },
        cover: {
          color: '#2C2C2C',
          pattern: 'dots'
        }
      }
    },
    {
      id: 'programming-template-light',
      name: 'Programming Template (Light)',
      description: 'Clean programming notebook with code sections',
      preview: 'programming-light',
      content: {
        title: 'Programming Template',
        pages: [
          {
            title: 'Algorithm Practice',
            leftContent: `# PROGRAMMING TEMPLATE
## MINIMAL AND FUNCTIONAL

### Program: HALF PYRAMID
**File name:** pyramid.cpp
**Description:** This program creates a half pyramid

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int rows;
    cout << "Enter # of rows: ";
    cin >> rows;
    
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
\`\`\``,
            rightContent: `## Output:
Enter # of rows: 5

*
**
***
****
*****

---

## Notes:
- Uses nested loops
- Outer loop controls rows
- Inner loop prints stars
- Each row has i stars

## Complexity:
- Time: O(n²)
- Space: O(1)

## Variations:
- Right-aligned pyramid
- Number pyramid
- Character pyramid`
          ,
          paperStyle: {
            lineType: 'ruled',
            lineSpacing: 'normal',
            marginLine: true,
            paperColor: '#FFFFFF',
            lineColor: '#E5E5E5'
          }
          }
        ],
        paperStyle: {
          lineType: 'ruled',
          lineSpacing: 'normal',
          marginLine: true,
          paperColor: '#FFFFFF',
          lineColor: '#E5E5E5'
        },
        cover: {
          color: '#F8F9FA',
          pattern: 'ruled'
        }
      }
    },
    {
      id: 'programming-template-dark',
      name: 'Programming Template (Dark)',
      description: 'Dark theme programming notebook',
      preview: 'programming-dark',
      content: {
        title: 'Programming Template (Dark)',
        pages: [
          {
            title: 'Stack and Memory',
            leftContent: `# Stack and Memory Example

## Stack:
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int b = 6;
    
    return 0;
}
\`\`\`

## Memory Layout:
| Variable | Address | Value |
|----------|---------|-------|
| a        | 0x0000  | 5     |
| b        | 0x0004  | 6     |`,
            rightContent: `## Memory:
Stack grows downward
Heap grows upward

### Stack Frame:
- Return address
- Local variables
- Parameters

### Example Memory:
\`\`\`
Stack:    [0x0008] return addr
          [0x0004] b = 6  
          [0x0000] a = 5
\`\`\`

### Notes:
- Stack is LIFO
- Automatic cleanup
- Limited size`
          ,
          paperStyle: {
            lineType: 'ruled',
            lineSpacing: 'normal',
            marginLine: true,
            paperColor: '#1F2937',
            lineColor: '#374151'
          }
          }
        ],
        paperStyle: {
          lineType: 'ruled',
          lineSpacing: 'normal',
          marginLine: true,
          paperColor: '#1F2937',
          lineColor: '#374151'
        },
        cover: {
          color: '#1F2937',
          pattern: 'ruled'
        }
      }
    },
    {
      id: 'interactive-paper-menu',
      name: 'Interactive Paper Menu',
      description: 'Layout selection guide like your image',
      preview: 'interactive-menu',
      content: {
        title: 'Interactive Paper Menu',
        pages: [
          {
            title: 'Layout Options',
            leftContent: `# INTERACTIVE PAPER MENU
## TO CHOOSE THE PERFECT LAYOUT FOR YOUR NOTES

### Available Layouts:

**Grid Options:**
- Small Dotted Grid
- Large Dotted Grid

**Line Options:**
- Small Lines with Title
- Large Lines with Title
- Small Lines Oxford
- Large Lines Oxford

**Margin Options:**
- Small Lines with Margin
- Large Lines with Margin

**Grid Options:**
- Small Square Grid
- Large Square Grid`,
            rightContent: `## Layout Previews:

Each layout is designed for different note-taking styles:

### When to Use:
- **Dotted Grid:** Flexible layouts, diagrams
- **Ruled Lines:** Traditional writing, essays
- **Oxford Lines:** Academic notes, structured content
- **Margins:** Formal documents, annotations
- **Square Grid:** Technical drawings, charts

### Customization:
- Adjust line spacing
- Change colors
- Add/remove margins
- Switch between themes

*Choose the layout that best fits your writing style and content type.*`
          ,
          paperStyle: {
            lineType: 'dots',
            lineSpacing: 'normal',
            marginLine: false,
            paperColor: '#FFFFFF',
            lineColor: '#D1D5DB'
          }
          }
        ],
        paperStyle: {
          lineType: 'dots',
          lineSpacing: 'normal',
          marginLine: false,
          paperColor: '#FFFFFF',
          lineColor: '#D1D5DB'
        },
        cover: {
          color: '#F3F4F6',
          pattern: 'dots'
        }
      }
    },
    {
      id: 'creative-journal-drawing',
      name: 'Creative Journal (Drawing + Story)',
      description: 'Split layout for drawings and stories',
      preview: 'creative-drawing',
      content: {
        title: 'Creative Journal',
        pages: [
          {
            title: 'Story & Art',
            leftContent: `# Drawing Here

🌈 ☀️ ☁️

[Space for drawings, sketches, and creative illustrations]

## Art Ideas:
- Nature scenes
- Character designs  
- Abstract patterns
- Daily observations

## Materials Used:
- Colored pencils
- Markers
- Watercolors
- Digital brushes

*Let your creativity flow freely on this side*`,
            rightContent: `# Story Here

I helped my dad water the plants in the garden. The flowers are starting to bloom.

The roses are my favorite - they smell so sweet and the petals are soft like velvet. Today I learned that different flowers need different amounts of water.

## Story Elements:
- Setting: Garden
- Characters: Me, Dad
- Activity: Watering plants
- Discovery: Flower care

## Next Chapter Ideas:
- Planting new seeds
- Building a greenhouse
- Learning about butterflies
- Creating a garden map

*Continue your story here...*`
          ,
          paperStyle: {
            lineType: 'ruled',
            lineSpacing: 'wide',
            marginLine: true,
            paperColor: '#FFFEF7',
            lineColor: '#E0E7FF'
          }
          }
        ],
        paperStyle: {
          lineType: 'ruled',
          lineSpacing: 'wide',
          marginLine: true,
          paperColor: '#FFFEF7',
          lineColor: '#E0E7FF'
        },
        cover: {
          color: '#FEF3C7',
          pattern: 'ruled'
        }
      }
    }
  ];

  const generateNotebook = async (template: any) => {
    setSelectedTemplate(template.id);
    
    try {
      // Create notebook
      const notebookResponse = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.content.title,
          cover: template.content.cover,
          studyMode: 'write'
        })
      });

      if (notebookResponse.ok) {
        const notebook = await notebookResponse.json();
        
        // Create pages
        for (const pageData of template.content.pages) {
          await fetch(`/api/notebooks/${notebook.id}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: pageData.title,
              leftContent: pageData.leftContent,
              rightContent: pageData.rightContent,
              paperStyle: pageData.paperStyle || template.content.paperStyle
            })
          });
        }
        
        // Notify parent and reload
        onTemplateSelect?.(template);
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
    
    setSelectedTemplate(null);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Exact Template Gallery</h2>
                <p className="text-gray-600">Based on your uploaded images</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exactTemplates.map((template) => (
              <motion.div
                key={template.id}
                className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-purple-500 ring-4 ring-purple-200 scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                }`}
                onClick={() => generateNotebook(template)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Template Preview */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  {template.preview === 'dark-weekly' && (
                    <div className="w-full h-full bg-gray-800 p-4 text-white text-xs">
                      <div className="text-center mb-4 font-bold text-white">WEEKLY NOTES</div>
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-300">APARTMENT</div>
                          <div className="space-y-1 text-xs">
                            <div>☑ BUILD NEW CABINET!</div>
                            <div>☐ BUY FLOWERS</div>
                            <div>☐ CALL ELECTRICIAN</div>
                            <div>☐ WASH SHEETS AND TOWELS</div>
                          </div>
                          <div className="font-semibold text-gray-300 mt-4">FOOD PLAN</div>
                          <div className="space-y-1 text-xs">
                            <div>☐ TOFU STIR FRY</div>
                            <div>☐ AIR FRYER SWEET POTATO</div>
                            <div>☐ LEMON CAKE</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-300">THIS WEEK I WANT TO</div>
                          <div className="text-xs space-y-1">
                            <div>PLAN GOALS!</div>
                            <div>LOOK INTO YOGA CLASSES</div>
                            <div>COOK MORE FOR MYSELF</div>
                          </div>
                          <div className="font-semibold text-gray-300 mt-4">COFFEE ON THE BALCONY</div>
                          <div className="text-xs space-y-1">
                            <div>MORE BATHS!</div>
                            <div>VOLUNTEER AT THE DOG PARK</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {template.preview === 'programming-light' && (
                    <div className="w-full h-full bg-white p-4 text-gray-800 text-xs">
                      <div className="text-center mb-4 font-bold">PROGRAMMING TEMPLATE</div>
                      <div className="text-center mb-4 text-gray-600">MINIMAL AND FUNCTIONAL</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold mb-2">Program: HALF PYRAMID</div>
                          <div className="text-xs space-y-1">
                            <div>File name: pyramid.cpp</div>
                            <div>Description: Creates a half pyramid</div>
                            <div className="bg-gray-100 p-2 rounded mt-2 font-mono text-xs">
                              <div>#include &lt;iostream&gt;</div>
                              <div>using namespace std;</div>
                              <div>int main() {'{}'}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold mb-2">Output:</div>
                          <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                            <div>Enter # of rows: 5</div>
                            <div>*</div>
                            <div>**</div>
                            <div>***</div>
                            <div>****</div>
                            <div>*****</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {template.preview === 'programming-dark' && (
                    <div className="w-full h-full bg-gray-900 p-4 text-white text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-semibold mb-2 text-blue-300">Stack and Memory Example:</div>
                          <div className="bg-gray-800 p-2 rounded font-mono text-xs">
                            <div className="text-green-400">#include &lt;iostream&gt;</div>
                            <div className="text-blue-400">int main() {'{}'}</div>
                            <div className="text-yellow-400">  int a = 5;</div>
                            <div className="text-yellow-400">  return 0;</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold mb-2 text-purple-300">Memory:</div>
                          <div className="bg-gray-800 p-2 rounded text-xs">
                            <div>Stack: 0x0000 | a = 5</div>
                            <div>      0x0004 | b = 6</div>
                            <div className="mt-2 text-gray-400">much = 5</div>
                            <div className="text-gray-400">a = 5</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {template.preview === 'interactive-menu' && (
                    <div className="w-full h-full bg-white p-4 text-gray-800">
                      <div className="bg-gray-200 p-3 rounded-lg mb-4">
                        <div className="font-bold text-center">INTERACTIVE PAPER MENU</div>
                        <div className="text-xs text-center text-gray-600">TO CHOOSE THE PERFECT LAYOUT FOR YOUR NOTES</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="border border-gray-300 p-2 rounded bg-dots-sm">SMALL DOTTED GRID</div>
                        <div className="border border-gray-300 p-2 rounded bg-dots-lg">LARGE DOTTED GRID</div>
                        <div className="border border-gray-300 p-2 rounded bg-lines-sm">SMALL LINES WITH TITLE</div>
                        <div className="border border-gray-300 p-2 rounded bg-lines-lg">LARGE LINES WITH TITLE</div>
                        <div className="border border-gray-300 p-2 rounded bg-oxford-sm">SMALL LINES OXFORD</div>
                        <div className="border border-gray-300 p-2 rounded bg-oxford-lg">LARGE LINES OXFORD</div>
                        <div className="border border-gray-300 p-2 rounded bg-margin-sm">SMALL LINES WITH MARGIN</div>
                        <div className="border border-gray-300 p-2 rounded bg-margin-lg">LARGE LINES WITH MARGIN</div>
                        <div className="border border-gray-300 p-2 rounded bg-grid-sm">SMALL SQUARE GRID</div>
                        <div className="border border-gray-300 p-2 rounded bg-grid-lg">LARGE SQUARE GRID</div>
                      </div>
                    </div>
                  )}

                  {template.preview === 'creative-drawing' && (
                    <div className="w-full h-full bg-yellow-50 p-4 text-gray-800">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="border-r border-gray-300 pr-4">
                          <div className="font-bold mb-2 text-center">Drawing Here</div>
                          <div className="text-4xl text-center mb-2">🌈</div>
                          <div className="text-2xl text-center mb-2">☀️ ☁️</div>
                          <div className="text-center text-xs text-gray-600">
                            [Creative space for drawings and illustrations]
                          </div>
                        </div>
                        <div className="pl-4">
                          <div className="font-bold mb-2 text-center">Story Here</div>
                          <div className="text-xs space-y-2">
                            <p>I helped my dad water the plants in the garden. The flowers are starting to bloom.</p>
                            <p>The roses smell so sweet and the petals are soft like velvet.</p>
                            <p>Today I learned about different flower care.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading Overlay */}
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
                        <div className="text-sm font-medium text-purple-900">Creating Notebook...</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4 bg-white border-t">
                  <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {template.id.includes('dark') && (
                        <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">Dark Theme</span>
                      )}
                      {template.id.includes('light') && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Light Theme</span>
                      )}
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {template.content.paperStyle.lineType}
                      </span>
                    </div>
                    
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      Generate →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Click any template to generate a complete notebook with your exact layouts
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
