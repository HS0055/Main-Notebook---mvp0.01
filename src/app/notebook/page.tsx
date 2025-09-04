"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import NotebookSidebar from '@/components/notebook/NotebookSidebar';
import NotebookHeader from '@/components/notebook/NotebookHeader';
import PaperCanvas from '@/components/notebook/PaperCanvas';
import AIAssistantPanel from '@/components/notebook/AIAssistantPanel';
import StudyModeToggle from '@/components/notebook/StudyModeToggle';
import { BookCover } from '@/components/notebook/BookCover';
import { PageNavigation } from '@/components/notebook/PageNavigation';
import { BookOpen, Maximize2, Split, Settings, X, Wand2, Sparkles, Eraser } from 'lucide-react';

import UnifiedAILayout from '@/components/notebook/UnifiedAILayout';
import ExactTemplates from '@/components/notebook/ExactTemplates';

interface Page {
  id: string;
  leftContent: string;
  rightContent: string;
  title?: string;
  pageOrder?: number;
  paperStyle?: {
    lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music';
    lineSpacing: 'narrow' | 'normal' | 'wide';
    marginLine: boolean;
    paperColor: string;
    lineColor: string;
  };
  templateOverlay?: string;
}

interface Notebook {
  id: string;
  title: string;
  pages: Page[];
  currentPageIndex: number;
  isActive: boolean;
  isOpen: boolean;
  studyMode: 'write' | 'study'; // Per-notebook study mode
  cover: {
    color: string;
    pattern: string;
    image?: string;
  };
  paperStyle: {
    lineType: 'ruled' | 'grid' | 'dots' | 'blank' | 'graph' | 'music';
    lineSpacing: 'narrow' | 'normal' | 'wide';
    marginLine: boolean;
    paperColor: string;
    lineColor: string;
  };
}

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string>('');
  const [activePageId, setActivePageId] = useState<string>('');
  const [showBookCover, setShowBookCover] = useState(false);
  const [viewMode, setViewMode] = useState<'left' | 'right' | 'split' | 'full'>('split');
  const [showPaperSettings, setShowPaperSettings] = useState(false);

  const [showEnhancedAI, setShowEnhancedAI] = useState(false);
  const [showUnifiedAI, setShowUnifiedAI] = useState(false);
  const [showTemplateGenerator, setShowTemplateGenerator] = useState(false);
  const [bookmarkStates, setBookmarkStates] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAiOnboarding, setShowAiOnboarding] = useState(false);

  // Define activeNotebook FIRST - before other useMemo hooks that depend on it
  const activeNotebook = useMemo(() => {
    const notebook = notebooks.find(nb => nb.id === activeNotebookId);
    if (notebook) {
      return {
        ...notebook,
        isActive: true,
        isOpen: !showBookCover,
        currentPageIndex: notebook.pages.findIndex(p => p.id === activePageId)
      };
    }
    return undefined;
  }, [notebooks, activeNotebookId, activePageId, showBookCover]);

  const activePage = useMemo(() => 
    activeNotebook?.pages.find(page => page.id === activePageId), 
    [activeNotebook, activePageId]
  );

  const notebooksForSidebar = useMemo(() => 
    notebooks.map(notebook => ({
      ...notebook,
      isActive: notebook.id === activeNotebookId,
      isOpen: notebook.id === activeNotebookId && !showBookCover,
      currentPageIndex: notebook.id === activeNotebookId ? 
        (activeNotebook?.currentPageIndex || 0) : 0
    })), 
    [notebooks, activeNotebookId, showBookCover, activeNotebook]
  );

  // Get current notebook's paper style - AFTER activeNotebook is defined
  const currentPaperStyle = useMemo(() => {
    // Prefer per-page paper style if present, otherwise fall back to notebook default
    const pageStyle = activeNotebook?.pages.find(p => p.id === activePageId)?.paperStyle;
    return pageStyle || activeNotebook?.paperStyle || {
      lineType: 'ruled' as const,
      lineSpacing: 'normal' as const,
      marginLine: true,
      paperColor: '#FAF7F0',
      lineColor: '#E5E5E5'
    };
  }, [activeNotebook, activePageId]);

  // Get current notebook's study mode - AFTER activeNotebook is defined
  const currentStudyMode = useMemo(() => {
    return activeNotebook?.studyMode || 'write';
  }, [activeNotebook]);

  // Update notebook's paper style
  const handlePaperStyleChange = useCallback(async (newPaperStyle: any) => {
    if (!activeNotebookId || !activePage?.id) return;

    try {
      const response = await fetch(`/api/pages/${activePage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperStyle: newPaperStyle })
      });

      if (response.ok) {
        setNotebooks(prev => prev.map(nb => 
          nb.id === activeNotebookId 
            ? { 
                ...nb, 
                pages: nb.pages.map(p => 
                  p.id === activePage.id ? { ...p, paperStyle: newPaperStyle } : p
                )
              }
            : nb
        ));
      }
    } catch (error) {
      console.error('Error updating paper style:', error);
    }
  }, [activeNotebookId, activePage?.id]);

  const handleTemplateOverlayChange = useCallback(async (overlay: string | null) => {
    if (!activeNotebookId || !activePage?.id) return;

    try {
      const response = await fetch(`/api/pages/${activePage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateOverlay: overlay })
      });

      if (response.ok) {
        setNotebooks(prev => prev.map(nb => 
          nb.id === activeNotebookId 
            ? { 
                ...nb, 
                pages: nb.pages.map(p => 
                  p.id === activePage.id ? { ...p, templateOverlay: overlay || undefined } : p
                )
              }
            : nb
        ));
      }
    } catch (error) {
      console.error('Error updating template overlay:', error);
    }
  }, [activeNotebookId, activePage?.id]);

  // Update notebook's study mode
  const handleStudyModeChange = useCallback(async (mode: 'write' | 'study') => {
    if (!activeNotebookId) return;

    try {
      // Update in backend
      const response = await fetch(`/api/notebooks/${activeNotebookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studyMode: mode }),
      });

      if (response.ok) {
        // Update in local state
        setNotebooks(prev => prev.map(nb => 
          nb.id === activeNotebookId 
            ? { ...nb, studyMode: mode }
            : nb
        ));
      }
    } catch (error) {
      console.error('Error updating study mode:', error);
      // Fallback to local update if backend fails
      setNotebooks(prev => prev.map(nb => 
        nb.id === activeNotebookId 
          ? { ...nb, studyMode: mode }
          : nb
      ));
    }
  }, [activeNotebookId]);

  // Load notebooks from API
  useEffect(() => {
    const loadNotebooks = async () => {
      try {
        const response = await fetch('/api/notebooks');
        if (response.ok) {
          const apiNotebooks = await response.json();
          
          // Transform API notebooks to match our interface
          const transformedNotebooks: Notebook[] = await Promise.all(
            apiNotebooks.map(async (nb: any) => {
              // Load pages for each notebook
              const pagesResponse = await fetch(`/api/notebooks/${nb.id}/pages`);
              const pages = pagesResponse.ok ? await pagesResponse.json() : [];
              
              return {
                id: nb.id.toString(),
                title: nb.title,
                pages: pages.map((page: any) => ({
                  id: page.id.toString(),
                  leftContent: page.leftContent || '',
                  rightContent: page.rightContent || '',
                  title: page.title,
                  pageOrder: page.pageOrder,
                  paperStyle: page.paperStyle || undefined,
                  templateOverlay: page.templateOverlay || undefined
                })),
                currentPageIndex: 0,
                isActive: false,
                isOpen: false,
                studyMode: nb.studyMode || 'write', // Per-notebook study mode
                cover: nb.cover || {
                  color: '#2C2C2C',
                  pattern: 'ruled',
                },
                paperStyle: {
                  lineType: 'ruled',
                  lineSpacing: 'normal',
                  marginLine: true,
                  paperColor: '#FAF7F0',
                  lineColor: '#E5E5E5'
                }
              };
            })
          );

          setNotebooks(transformedNotebooks);
          
          // Set first notebook as active if we have notebooks
          if (transformedNotebooks.length > 0) {
            const firstNotebook = transformedNotebooks[0];
            setActiveNotebookId(firstNotebook.id);
            if (firstNotebook.pages.length > 0) {
              setActivePageId(firstNotebook.pages[0].id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading notebooks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotebooks();
  }, []);

  // One-time onboarding hint for AI button
  useEffect(() => {
    try {
      const seen = typeof window !== 'undefined' && localStorage.getItem('ai_onboarding_seen');
      if (!seen) {
        setShowAiOnboarding(true);
        typeof window !== 'undefined' && localStorage.setItem('ai_onboarding_seen', '1');
      }
    } catch (e) {}
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + Shift + L opens AI Layout
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = navigator.platform.toLowerCase().includes('mac') ? e.metaKey : e.ctrlKey;
      if (isMod && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        setShowUnifiedAI(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNotebookSelect = useCallback((notebookId: string) => {
    console.log('📋 SWITCHING TO NOTEBOOK:', notebookId);
    
    setActiveNotebookId(notebookId);
    const notebook = notebooks.find(nb => nb.id === notebookId);
    
    if (notebook && notebook.pages.length > 0) {
      const firstPage = notebook.pages[0];
      console.log('📄 SWITCHING TO PAGE:', firstPage.id, 'Content:', {
        left: firstPage.leftContent?.substring(0, 50) + '...',
        right: firstPage.rightContent?.substring(0, 50) + '...'
      });
      setActivePageId(firstPage.id);
    } else {
      console.log('📄 NO PAGES IN NOTEBOOK');
      setActivePageId('');
    }
  }, [notebooks]);

  const handleNotebookOpen = useCallback((notebookId: string) => {
    setActiveNotebookId(notebookId);
    const notebook = notebooks.find(nb => nb.id === notebookId);
    if (notebook && notebook.pages.length > 0) {
      setActivePageId(notebook.pages[0].id);
    } else {
      // Clear activePageId if notebook has no pages
      setActivePageId('');
    }
    setShowBookCover(false);
  }, [notebooks]);

  const handleNewNotebook = useCallback(async () => {
    try {
      const response = await fetch('/api/notebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Notebook',
          studyMode: 'write', // Default study mode
          cover: {
            color: '#2C2C2C',
            pattern: 'ruled',
          },
        }),
      });

      if (response.ok) {
        const newNotebook = await response.json();
        
        // Create first page
        const pageResponse = await fetch(`/api/notebooks/${newNotebook.id}/pages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Page 1',
            leftContent: '',
            rightContent: '',
          }),
        });

        if (pageResponse.ok) {
          const newPage = await pageResponse.json();
          
          const notebookWithPage: Notebook = {
            id: newNotebook.id.toString(),
            title: newNotebook.title,
            pages: [{
              id: newPage.id.toString(),
              title: newPage.title,
              leftContent: newPage.leftContent || '',
              rightContent: newPage.rightContent || '',
              pageOrder: newPage.pageOrder
            }],
            currentPageIndex: 0,
            isActive: false,
            isOpen: false,
            studyMode: newNotebook.studyMode || 'write', // Per-notebook study mode
            cover: newNotebook.cover,
            paperStyle: {
              lineType: 'ruled',
              lineSpacing: 'normal',
              marginLine: true,
              paperColor: '#FAF7F0',
              lineColor: '#E5E5E5'
            }
          };

          setNotebooks(prev => [...prev, notebookWithPage]);
          setActiveNotebookId(notebookWithPage.id);
          setActivePageId(notebookWithPage.pages[0].id);
          setShowBookCover(false);
        }
      }
    } catch (error) {
      console.error('Error creating new notebook:', error);
    }
  }, []);

  const handleEditTitle = useCallback(async (notebookId: string, newTitle: string) => {
    if (!notebookId || !newTitle.trim()) return;

    try {
      const response = await fetch(`/api/notebooks/${notebookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (response.ok) {
        setNotebooks(prev => prev.map(nb => 
          nb.id === notebookId 
            ? { ...nb, title: newTitle.trim() }
            : nb
        ));
      } else {
        console.error('Failed to update notebook title');
      }
    } catch (error) {
      console.error('Error updating notebook title:', error);
    }
  }, []);

  const handleRemoveNotebook = useCallback(async (notebookId: string) => {
    try {
      const response = await fetch(`/api/notebooks/${notebookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove notebook from state
        setNotebooks(prev => prev.filter(nb => nb.id !== notebookId));
        
        // If we're removing the active notebook, switch to another one
        if (activeNotebookId === notebookId) {
          const remainingNotebooks = notebooks.filter(nb => nb.id !== notebookId);
          if (remainingNotebooks.length > 0) {
            const firstNotebook = remainingNotebooks[0];
            setActiveNotebookId(firstNotebook.id);
            if (firstNotebook.pages.length > 0) {
              setActivePageId(firstNotebook.pages[0].id);
            } else {
              setActivePageId('');
            }
          } else {
            // No notebooks left
            setActiveNotebookId('');
            setActivePageId('');
          }
        }
      } else {
        console.error('Failed to delete notebook');
      }
    } catch (error) {
      console.error('Error deleting notebook:', error);
    }
  }, [activeNotebookId, notebooks]);

  const handleSearch = useCallback((query: string) => {
    // Search functionality - could navigate to search results
    console.log('Search:', query);
  }, []);

  const handleBookmark = useCallback(() => {
    if (activeNotebookId) {
      setBookmarkStates(prev => ({
        ...prev,
        [activeNotebookId]: !prev[activeNotebookId]
      }));
    }
  }, [activeNotebookId]);

  const handleSettings = useCallback(() => {
    console.log('Settings clicked');
  }, []);

  const handleCoverChange = useCallback((notebookId: string, cover: { color: string; pattern: string; image?: string }) => {
    setNotebooks(prev => prev.map(nb => 
      nb.id === notebookId 
        ? { ...nb, cover }
        : nb
    ));
  }, []);

  const handleLeftContentChange = useCallback(async (content: string) => {
    if (!activePage?.id) return;

    // CRITICAL FIX: Ensure we're updating the correct notebook and page
    console.log('Updating left content for page:', activePage.id, 'in notebook:', activeNotebookId);

    try {
      const response = await fetch(`/api/pages/${activePage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leftContent: content }),
      });

      if (response.ok) {
        // CRITICAL FIX: Update state immediately with correct targeting
        setNotebooks(prev => prev.map(notebook => 
          notebook.id === activeNotebookId
            ? {
                ...notebook,
                pages: notebook.pages.map(page => 
                  page.id === activePage.id
                    ? { ...page, leftContent: content }
                    : page
                )
              }
            : notebook
        ));
      } else {
        console.error('Failed to update left content');
      }
    } catch (error) {
      console.error('Error updating left content:', error);
    }
  }, [activeNotebookId, activePage?.id]);

  const handleRightContentChange = useCallback(async (content: string) => {
    if (!activePage?.id) return;

    // CRITICAL FIX: Ensure we're updating the correct notebook and page
    console.log('Updating right content for page:', activePage.id, 'in notebook:', activeNotebookId);

    try {
      const response = await fetch(`/api/pages/${activePage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rightContent: content }),
      });

      if (response.ok) {
        // CRITICAL FIX: Update state immediately with correct targeting
        setNotebooks(prev => prev.map(notebook => 
          notebook.id === activeNotebookId
            ? {
                ...notebook,
                pages: notebook.pages.map(page => 
                  page.id === activePage.id
                    ? { ...page, rightContent: content }
                    : page
                )
              }
            : notebook
        ));
      } else {
        console.error('Failed to update right content');
      }
    } catch (error) {
      console.error('Error updating right content:', error);
    }
  }, [activeNotebookId, activePage?.id]);

  const handleFullContentChange = useCallback(async (content: string) => {
    if (!activePage?.id) return;

    // CRITICAL FIX: Ensure we're updating the correct notebook and page
    console.log('Updating full content for page:', activePage.id, 'in notebook:', activeNotebookId);

    try {
      const response = await fetch(`/api/pages/${activePage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leftContent: content }),
      });

      if (response.ok) {
        // CRITICAL FIX: Update state immediately with correct targeting
        setNotebooks(prev => prev.map(notebook => 
          notebook.id === activeNotebookId
            ? {
                ...notebook,
                pages: notebook.pages.map(page => 
                  page.id === activePage.id
                    ? { 
                        ...page, 
                        leftContent: content,
                        rightContent: page.rightContent || '' // Preserve existing right content
                      }
                    : page
                )
              }
            : notebook
        ));
      } else {
        console.error('Failed to update full content');
      }
    } catch (error) {
      console.error('Error updating full content:', error);
    }
  }, [activeNotebookId, activePage?.id]);

  const handleNewPage = useCallback(async () => {
    if (!activeNotebook) return;

    try {
      const response = await fetch(`/api/notebooks/${activeNotebook.id}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Page ${activeNotebook.pages.length + 1}`,
          leftContent: '',
          rightContent: '',
        }),
      });

      if (response.ok) {
        const newPage = await response.json();
        
        const pageData: Page = {
          id: newPage.id.toString(),
          title: newPage.title,
          leftContent: newPage.leftContent || '',
          rightContent: newPage.rightContent || '',
          pageOrder: newPage.pageOrder
        };

        setNotebooks(prev => prev.map(notebook => 
          notebook.id === activeNotebookId 
            ? { ...notebook, pages: [...notebook.pages, pageData] }
            : notebook
        ));

        setActivePageId(pageData.id);
      }
    } catch (error) {
      console.error('Error creating new page:', error);
    }
  }, [activeNotebook, activeNotebookId]);

  const handlePreviousPage = useCallback(() => {
    if (!activeNotebook) return;
    
    const currentIndex = activeNotebook.currentPageIndex;
    if (currentIndex > 0) {
      setActivePageId(activeNotebook.pages[currentIndex - 1].id);
    }
  }, [activeNotebook]);

  const handleNextPage = useCallback(() => {
    if (!activeNotebook) return;
    
    const currentIndex = activeNotebook.currentPageIndex;
    if (currentIndex < activeNotebook.pages.length - 1) {
      setActivePageId(activeNotebook.pages[currentIndex + 1].id);
    }
  }, [activeNotebook]);

  const handleShowCover = useCallback(() => {
    setShowBookCover(true);
  }, []);

  const handleShowCoverFromSidebar = useCallback((notebookId: string) => {
    setActiveNotebookId(notebookId);
    setShowBookCover(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background font-body items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notebooks...</p>
        </div>
      </div>
    );
  }

  if (showBookCover && activeNotebook) {
    return (
      <BookCover 
        notebook={activeNotebook}
        onOpen={() => setShowBookCover(false)}
        onCoverChange={(cover) => handleCoverChange(activeNotebook.id, cover)}
      />
    );
  }

  const currentNotebookTitle = activeNotebook?.title || 'No notebook';
  const studyModeLabel = currentStudyMode === 'study' ? 'Study Mode' : 'Write Mode';

  return (
    <div className="flex h-screen bg-background font-body">
      <NotebookSidebar
        notebooks={notebooksForSidebar}
        onNotebookSelect={handleNotebookSelect}
        onNotebookOpen={handleNotebookOpen}
        onNewNotebook={handleNewNotebook}
        onRemoveNotebook={handleRemoveNotebook}
        onEditTitle={handleEditTitle}
        onSettings={handleSettings}
        onCoverChange={handleCoverChange}
        onShowCover={handleShowCoverFromSidebar}
      />

      <div className="flex-1 flex flex-col ml-[280px]">
        <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm border-gray-100">
          <NotebookHeader
            currentNotebook={activeNotebook}
            currentPage={activePage}
            onEditTitle={(newTitle) => {
              if (!activeNotebook?.id) return;
              void handleEditTitle(activeNotebook.id, newTitle);
            }}
            onSearch={handleSearch}
            onBookmark={handleBookmark}
            onSettings={handleSettings}
            isBookmarked={bookmarkStates[activeNotebookId] || false}
            onShowCover={handleShowCover}
          />
          
          <div className="flex items-center gap-3">
            {/* AI Layout Generator - Primary Feature */}
            <button
              onClick={() => {
                console.log('AI Layout button clicked!');
                setShowUnifiedAI(true);
                console.log('showUnifiedAI set to true');
              }}
              className="group relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700"
              title="🧠 AI Layout Generator - Create smart layouts with templates"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <Sparkles className="relative z-10 w-5 h-5" />
              <span className="relative z-10 font-semibold">AI Layout</span>
            </button>

            {/* Clear AI Overlay when active */}
            {activePage?.templateOverlay && (
              <button
                onClick={() => handleTemplateOverlayChange(null)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
                title="🧹 Clear AI overlay from this page"
              >
                <Eraser className="w-4 h-4" />
                <span className="text-sm font-medium">Clear AI</span>
              </button>
            )}

            {/* Quick Templates */}
            <button
              onClick={() => setShowTemplateGenerator(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
              title="📋 Quick Templates"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Templates</span>
            </button>

            {/* View Mode Controls */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'split' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Split View - Both Pages"
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('full')}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'full' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Full Width"
              >
                Full
              </button>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                currentStudyMode === 'study' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}>
                {studyModeLabel}
              </div>
              
              {activePage && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {activePage.leftContent && activePage.rightContent ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Both pages</span>
                    </>
                  ) : activePage.leftContent || activePage.rightContent ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>One page</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span>Empty</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex relative bg-gray-50">
          <div className={`flex-1 flex transition-all duration-300 ${
            currentStudyMode === 'study' ? 'mr-80' : 'mr-0'
          }`}>
            
            {(viewMode === 'left' || viewMode === 'split') && (
              <div className={`${
                viewMode === 'split' 
                  ? 'w-1/2 border-r-2 border-gray-300 shadow-sm' 
                  : 'w-full'
              } relative bg-white`}>
                <PaperCanvas
                  key={`left-${activePageId}-${activeNotebookId}`}
                  content={activePage?.leftContent || ''}
                  onContentChange={handleLeftContentChange}
                  currentPage={(activeNotebook?.currentPageIndex || 0) + 1}
                  totalPages={activeNotebook?.pages.length || 0}
                  paperStyle={currentPaperStyle}
                  onPaperStyleChange={handlePaperStyleChange}
                  isLeftSide={true}
                  showSettings={viewMode !== 'split'}
                  templateOverlay={activePage?.templateOverlay}
                  onTemplateOverlayChange={handleTemplateOverlayChange}
                />
                {viewMode === 'split' && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border shadow-sm">
                      Left Page
                    </div>
                  </div>
                )}
              </div>
            )}

            {(viewMode === 'right' || viewMode === 'split') && (
              <div className={`${
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              } relative bg-white`}>
                <PaperCanvas
                  key={`right-${activePageId}-${activeNotebookId}`}
                  content={activePage?.rightContent || ''}
                  onContentChange={handleRightContentChange}
                  currentPage={(activeNotebook?.currentPageIndex || 0) + 1}
                  totalPages={activeNotebook?.pages.length || 0}
                  paperStyle={currentPaperStyle}
                  onPaperStyleChange={handlePaperStyleChange}
                  isLeftSide={false}
                  showSettings={viewMode !== 'split'}
                  templateOverlay={activePage?.templateOverlay}
                  onTemplateOverlayChange={handleTemplateOverlayChange}
                />
                {viewMode === 'split' && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border shadow-sm">
                      Right Page
                    </div>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'full' && (
              <div className="w-full relative bg-white">
                <PaperCanvas
                  key={`full-${activePageId}-${activeNotebookId}`}
                  content={activePage?.leftContent || ''}
                  onContentChange={handleFullContentChange}
                  currentPage={(activeNotebook?.currentPageIndex || 0) + 1}
                  totalPages={activeNotebook?.pages.length || 0}
                  paperStyle={currentPaperStyle}
                  onPaperStyleChange={handlePaperStyleChange}
                  isLeftSide={false}
                  showSettings={true}
                />
                <div className="absolute top-3 left-3 z-10">
                  <div className="text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border shadow-sm">
                    Full Width
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'split' && (
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setShowPaperSettings(!showPaperSettings)}
                  className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-colors border border-gray-200"
                  title="Paper Settings (Both Pages)"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                
                <AnimatePresence>
                  {showPaperSettings && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      className="absolute top-12 right-0 w-64 bg-white rounded-lg shadow-xl border p-4 z-30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm">Paper Style</h3>
                        <button 
                          onClick={() => setShowPaperSettings(false)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-4">
                        ✨ Changes apply to both pages simultaneously
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium mb-2">Line Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { type: 'ruled', label: 'Ruled' },
                              { type: 'grid', label: 'Grid' },
                              { type: 'dots', label: 'Dots' },
                              { type: 'blank', label: 'Blank' },
                              { type: 'music', label: 'Music' },
                              { type: 'graph', label: 'Graph' }
                            ].map(({ type, label }) => (
                              <button
                                key={type}
                                onClick={() => handlePaperStyleChange({ ...currentPaperStyle, lineType: type as any })}
                                className={`p-2 rounded text-xs transition ${
                                  currentPaperStyle.lineType === type 
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium mb-2">Line Spacing</label>
                          <div className="flex gap-2">
                            {['narrow', 'normal', 'wide'].map((spacing) => (
                              <button
                                key={spacing}
                                onClick={() => handlePaperStyleChange({ ...currentPaperStyle, lineSpacing: spacing as any })}
                                className={`px-3 py-1 rounded text-xs capitalize transition flex-1 ${
                                  currentPaperStyle.lineSpacing === spacing 
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                {spacing}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={currentPaperStyle.marginLine}
                              onChange={(e) => handlePaperStyleChange({ ...currentPaperStyle, marginLine: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            <span className="font-medium">Show margin lines</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-2">Paper Color</label>
                          <div className="flex gap-2 flex-wrap">
                            {['#FAF7F0', '#FFFFFF', '#F0F8FF', '#FFFACD'].map((color) => (
                              <button
                                key={color}
                                onClick={() => handlePaperStyleChange({ ...currentPaperStyle, paperColor: color })}
                                className={`w-8 h-8 rounded border-2 ${
                                  currentPaperStyle.paperColor === color ? 'border-blue-500' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {currentStudyMode === 'study' && (
            <div className="w-80 fixed right-0 top-0 h-full border-l border-gray-200 bg-white shadow-lg z-50">
              <div className="p-4 border-b bg-blue-50">
                <div className="text-sm font-medium text-blue-800">
                  📚 Studying: {activeNotebook?.title}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  AI understands this notebook's content
                </div>
              </div>
              <AIAssistantPanel
                currentNotebook={activeNotebook}
                currentPage={activePage}
                studyMode={currentStudyMode}
                allNotebooks={notebooks}
              />
            </div>
          )}
        </div>

        {/* Floating AI Action (persistent) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowUnifiedAI(true)}
            className="relative inline-flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:scale-105 transition-transform"
            title="Open AI Layout (Cmd/Ctrl+Shift+L)"
          >
            <Wand2 className="w-6 h-6" />
          </button>
          {/* Onboarding tooltip (one-time) */}
          {showAiOnboarding && (
            <div className="absolute -top-3 right-16 bg-white border border-purple-200 text-purple-800 text-xs font-medium px-3 py-2 rounded-lg shadow-lg w-56">
              🪄 Tip: Click the magic wand to generate smart layouts.
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white">
          <PageNavigation
            currentPage={(activeNotebook?.currentPageIndex || 0) + 1}
            totalPages={activeNotebook?.pages.length || 0}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onAddPage={handleNewPage}
            canGoPrevious={(activeNotebook?.currentPageIndex || 0) > 0}
            canGoNext={(activeNotebook?.currentPageIndex || 0) < (activeNotebook?.pages.length || 1) - 1}
            notebookId={activeNotebookId}
          />
        </div>
      </div>

      <StudyModeToggle
        onModeChange={handleStudyModeChange}
        initialMode={currentStudyMode}
        notebookTitle={activeNotebook?.title || 'No notebook'}
      />

      {/* Exact Templates Modal */}
      <AnimatePresence>
        {showTemplateGenerator && (
          <ExactTemplates
            isVisible={showTemplateGenerator}
            onClose={() => setShowTemplateGenerator(false)}
            onTemplateSelect={(template) => {
              console.log('Template selected:', template.name);
              setShowTemplateGenerator(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Unified AI Modal */}
      <AnimatePresence>
        {showUnifiedAI && (
          <UnifiedAILayout
            isVisible={showUnifiedAI}
            onClose={() => setShowUnifiedAI(false)}
            onLayoutInsert={(layoutData) => {
              // Handle the unified layout data
              console.log('Notebook: Received layout data:', layoutData);
              
              if (activePage?.id) {
                // Store the complete layout data including editable elements
                const layoutDataWithElements = {
                  svgData: layoutData.svgData,
                  editableElements: layoutData.editableElements || [],
                  layoutName: layoutData.name,
                  layoutDescription: layoutData.description
                };
                
                console.log('Notebook: Storing layout data with elements:', layoutDataWithElements);
                
                // Apply the layout as a template overlay with editable elements
                if (layoutData.svgData) {
                  handleTemplateOverlayChange(JSON.stringify(layoutDataWithElements));
                }
                
                // Update paper style if suggested
                if (layoutData.suggestedStyle) {
                  const newPaperStyle = {
                    ...activePage.paperStyle,
                    lineType: layoutData.suggestedStyle.lineType || activePage.paperStyle?.lineType || 'ruled',
                    lineSpacing: layoutData.suggestedStyle.lineSpacing || activePage.paperStyle?.lineSpacing || 'normal'
                  };
                  handlePaperStyleChange(newPaperStyle);
                }
              }
            }}
            paperStyle={currentPaperStyle}
            userId="user-123" // TODO: Get from auth system
          />
        )}
      </AnimatePresence>
    </div>
  );
}