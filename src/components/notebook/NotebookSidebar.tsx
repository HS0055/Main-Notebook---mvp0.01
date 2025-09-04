"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Plus, Settings, Edit3, Eye, Trash2, BookOpen, MoreVertical, Palette, Image } from 'lucide-react';

interface Notebook {
  id: string;
  title: string;
  pages: Array<{
    id: string;
    leftContent: string;
    rightContent: string;
    title?: string;
    pageOrder?: number;
  }>;
  currentPageIndex: number;
  isActive: boolean;
  isOpen: boolean;
  cover: {
    color: string;
    pattern: string;
    image?: string;
  };
}

interface NotebookSidebarProps {
  notebooks: Notebook[];
  onNotebookSelect: (notebookId: string) => void;
  onNotebookOpen: (notebookId: string) => void;
  onNewNotebook: () => void;
  onRemoveNotebook: (notebookId: string) => void;
  onEditTitle: (notebookId: string, newTitle: string) => void;
  onSettings: () => void;
  onCoverChange: (notebookId: string, cover: { color: string; pattern: string; image?: string }) => void;
  onShowCover: (notebookId: string) => void;
}

// Predefined cover colors and patterns
const COVER_COLORS = [
  { name: 'Classic Blue', value: '#3B82F6', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Forest Green', value: '#059669', gradient: 'from-green-400 to-green-600' },
  { name: 'Sunset Orange', value: '#EA580C', gradient: 'from-orange-400 to-orange-600' },
  { name: 'Purple Magic', value: '#7C3AED', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Rose Pink', value: '#E11D48', gradient: 'from-rose-400 to-rose-600' },
  { name: 'Golden Yellow', value: '#D97706', gradient: 'from-yellow-400 to-yellow-600' },
  { name: 'Slate Gray', value: '#475569', gradient: 'from-slate-400 to-slate-600' },
  { name: 'Emerald Teal', value: '#0D9488', gradient: 'from-teal-400 to-teal-600' },
];

const COVER_PATTERNS = [
  { name: 'Solid', value: 'solid' },
  { name: 'Dots', value: 'dots' },
  { name: 'Lines', value: 'lines' },
  { name: 'Grid', value: 'grid' },
  { name: 'Spiral', value: 'spiral' },
];

// Portal Menu Component for reliable positioning
const PortalMenu = ({ 
  children, 
  anchorEl, 
  isOpen,
  onClose 
}: { 
  children: React.ReactNode;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!anchorEl || !isOpen) return;

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate menu dimensions (estimate)
      const menuWidth = 224; // w-56 = 14rem = 224px
      const menuHeight = 300; // estimated height
      
      let left = rect.right + 8;
      let top = rect.top;
      
      // Ensure menu fits within viewport horizontally
      if (left + menuWidth > viewportWidth) {
        left = rect.left - menuWidth - 8;
      }
      
      // Ensure menu fits within viewport vertically
      if (top + menuHeight > viewportHeight) {
        top = viewportHeight - menuHeight - 16;
      }
      
      // Ensure menu doesn't go above viewport
      if (top < 16) {
        top = 16;
      }
      
      setPosition({ top, left });
    };

    updatePosition();
    
    // Update position on scroll/resize
    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [anchorEl, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (anchorEl?.contains(target)) return;
      
      // Check if click is inside any portal menu
      const portalMenus = document.querySelectorAll('[data-portal-menu]');
      for (const menu of portalMenus) {
        if (menu.contains(target)) return;
      }
      
      onClose();
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, anchorEl, onClose]);

  if (!mounted || !isOpen || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-[99998] bg-black/5" />
      <div
        data-portal-menu
        className="fixed z-[99999]"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {children}
      </div>
    </>,
    document.body
  );
};

export default function NotebookSidebar({
  notebooks,
  onNotebookSelect,
  onNotebookOpen,
  onNewNotebook,
  onRemoveNotebook,
  onEditTitle,
  onSettings,
  onCoverChange,
  onShowCover,
}: NotebookSidebarProps) {
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [customizingId, setCustomizingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Store button elements for portal positioning
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleMenuToggle = useCallback((e: React.MouseEvent, notebookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 Menu button clicked for:', notebookId);
    setShowMenuId(showMenuId === notebookId ? null : notebookId);
    setCustomizingId(null);
  }, [showMenuId]);

  const handleEditClick = useCallback((notebook: Notebook) => {
    console.log('✏️ Edit clicked for:', notebook.title);
    setEditingId(notebook.id);
    setEditTitle(notebook.title);
    setShowMenuId(null);
    setCustomizingId(null);
  }, []);

  const handleViewCoverClick = useCallback((notebookId: string) => {
    console.log('📖 View cover clicked for:', notebookId);
    onShowCover(notebookId);
    setShowMenuId(null);
    setCustomizingId(null);
  }, [onShowCover]);

  const handleCustomizeClick = useCallback((notebookId: string) => {
    console.log('🎨 Customize clicked for:', notebookId);
    setCustomizingId(customizingId === notebookId ? null : notebookId);
    setShowMenuId(null);
  }, [customizingId]);

  const handleColorChange = useCallback((notebookId: string, color: typeof COVER_COLORS[0]) => {
    const notebook = notebooks.find(n => n.id === notebookId);
    if (notebook) {
      onCoverChange(notebookId, {
        ...notebook.cover,
        color: color.value
      });
    }
  }, [notebooks, onCoverChange]);

  const handlePatternChange = useCallback((notebookId: string, pattern: typeof COVER_PATTERNS[0]) => {
    const notebook = notebooks.find(n => n.id === notebookId);
    if (notebook) {
      onCoverChange(notebookId, {
        ...notebook.cover,
        pattern: pattern.value
      });
    }
  }, [notebooks, onCoverChange]);

  const handleDeleteClick = useCallback(async (notebookId: string) => {
    console.log('🗑️ Delete clicked for:', notebookId);
    
    const notebook = notebooks.find(n => n.id === notebookId);
    if (!notebook) {
      console.error('❌ Notebook not found:', notebookId);
      return;
    }

    setShowMenuId(null);
    setCustomizingId(null);

    const confirmDelete = confirm(
      `Delete "${notebook.title}"?\n\nThis will permanently delete all ${notebook.pages.length} pages and cannot be undone.`
    );
    
    if (!confirmDelete) {
      console.log('❌ User cancelled deletion');
      return;
    }

    setDeletingId(notebookId);
    
    try {
      console.log('🔄 Starting deletion process...');
      await onRemoveNotebook(notebookId);
      console.log('✅ Notebook deleted successfully');
    } catch (error) {
      console.error('❌ Delete operation failed:', error);
      alert(`Failed to delete "${notebook.title}". Please try again.`);
    } finally {
      setDeletingId(null);
    }
  }, [notebooks, onRemoveNotebook]);

  const handleEditSubmit = useCallback(async (notebookId: string) => {
    console.log('💾 Submitting edit for:', notebookId, 'new title:', editTitle.trim());
    
    if (!editTitle.trim()) {
      console.log('❌ Empty title, reverting');
      setEditingId(null);
      setEditTitle('');
      return;
    }

    try {
      await onEditTitle(notebookId, editTitle.trim());
      console.log('✅ Edit successful');
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('❌ Edit failed:', error);
    }
  }, [editTitle, onEditTitle]);

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent, notebookId: string) => {
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSubmit(notebookId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingId(null);
      setEditTitle('');
    }
  }, [handleEditSubmit]);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setEditTitle(e.target.value);
  }, []);

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const getCoverStyling = useCallback((cover: Notebook['cover']) => {
    const colorObj = COVER_COLORS.find(c => c.value === cover.color) || COVER_COLORS[0];
    let styling = `bg-gradient-to-br ${colorObj.gradient}`;
    
    switch (cover.pattern) {
      case 'dots':
        styling += ' bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_1px,transparent_2px)] bg-[length:8px_8px]';
        break;
      case 'lines':
        styling += ' bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px,transparent_6px,rgba(255,255,255,0.1)_7px)] bg-[length:8px_8px]';
        break;
      case 'grid':
        styling += ' bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:10px_10px]';
        break;
      case 'spiral':
        styling += ' bg-[conic-gradient(from_0deg,rgba(255,255,255,0.1),transparent_60deg,rgba(255,255,255,0.1)_120deg,transparent_180deg)]';
        break;
    }
    
    return styling;
  }, []);

  return (
    <div className="w-[280px] h-full bg-gradient-to-b from-amber-50 to-amber-100 border-r border-amber-200 shadow-lg fixed left-0 top-0 overflow-y-auto z-10">
      <div className="p-4 border-b border-amber-200 bg-white/50">
        <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          My Notebooks
        </h2>
      </div>

      <div className="p-4">
        <button
          onClick={onNewNotebook}
          disabled={deletingId !== null}
          className={`w-full p-3 bg-gradient-to-r from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all duration-200 flex items-center gap-3 text-amber-900 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
            deletingId !== null ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus className="w-5 h-5" />
          New Notebook
        </button>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            className={`relative group transition-all duration-200 ${
              notebook.isActive 
                ? 'transform translate-x-2 shadow-xl' 
                : 'hover:transform hover:translate-x-1 shadow-md hover:shadow-lg'
            }`}
          >
            <div
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 relative ${
                notebook.isActive 
                  ? 'bg-gradient-to-r from-white to-amber-50 border-2 border-amber-300 shadow-lg' 
                  : 'bg-white hover:bg-amber-50 border border-amber-200'
              } ${deletingId === notebook.id ? 'opacity-25 pointer-events-none animate-pulse' : ''}`}
              onClick={() => editingId !== notebook.id && deletingId !== notebook.id && onNotebookOpen(notebook.id)}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${getCoverStyling(notebook.cover)}`} />
              
              <div className="flex items-center justify-between pl-2">
                <div className="flex-1 min-w-0">
                  {editingId === notebook.id ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={handleEditChange}
                        onClick={handleInputClick}
                        onBlur={() => handleEditSubmit(notebook.id)}
                        onKeyDown={(e) => handleEditKeyDown(e, notebook.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-amber-900 bg-white border-2 border-amber-400 rounded-md focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
                        autoFocus
                        placeholder="Enter notebook name"
                      />
                      <div className="absolute -bottom-6 left-0 text-xs text-amber-600">
                        Press Enter to save, Esc to cancel
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-medium text-amber-900 truncate">
                        {deletingId === notebook.id ? (
                          <span className="text-red-600">Deleting "{notebook.title}"...</span>
                        ) : (
                          notebook.title
                        )}
                      </h3>
                      {editingId !== notebook.id && (
                        <p className="text-xs text-amber-700 mt-1">
                          {notebook.pages.length} page{notebook.pages.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {editingId !== notebook.id && (
                  <button
                    ref={(el) => {
                      if (el) {
                        buttonRefs.current.set(notebook.id, el);
                      } else {
                        buttonRefs.current.delete(notebook.id);
                      }
                    }}
                    onClick={(e) => handleMenuToggle(e, notebook.id)}
                    className={`ml-2 p-2 rounded-full transition-all duration-200 border-2 ${
                      showMenuId === notebook.id 
                        ? 'bg-amber-200 border-amber-400 shadow-md' 
                        : 'hover:bg-amber-200 border-amber-300 bg-white hover:shadow-md'
                    } ${deletingId !== null ? 'opacity-30 pointer-events-none' : ''}`}
                    title="Notebook Options"
                    disabled={deletingId !== null}
                  >
                    <MoreVertical className="w-4 h-4 text-amber-700" />
                  </button>
                )}
              </div>

              {/* Portal-rendered dropdown menu - never clipped! */}
              <PortalMenu
                anchorEl={buttonRefs.current.get(notebook.id) || null}
                isOpen={showMenuId === notebook.id && editingId !== notebook.id}
                onClose={() => setShowMenuId(null)}
              >
                <AnimatePresence>
                  {showMenuId === notebook.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.90, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.90, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="w-56 bg-white border-2 border-amber-300 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(notebook);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-amber-800 hover:bg-amber-50 flex items-center gap-3 transition-colors font-medium"
                        >
                          <Edit3 className="w-4 h-4 text-amber-600" />
                          Edit name
                        </button>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomizeClick(notebook.id);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-amber-800 hover:bg-amber-50 flex items-center gap-3 transition-colors font-medium"
                        >
                          <Palette className="w-4 h-4 text-amber-600" />
                          Customize cover
                        </button>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCoverClick(notebook.id);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-amber-800 hover:bg-amber-50 flex items-center gap-3 transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4 text-amber-600" />
                          View cover
                        </button>
                        
                        <div className="border-t border-amber-200 my-1"></div>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(notebook.id);
                          }}
                          disabled={deletingId !== null}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 font-medium ${
                            deletingId !== null
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-700 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className={`w-4 h-4 ${deletingId !== null ? 'text-gray-400' : 'text-red-600'}`} />
                          Delete notebook
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </PortalMenu>

              {/* Portal-rendered customization panel */}
              <PortalMenu
                anchorEl={buttonRefs.current.get(notebook.id) || null}
                isOpen={customizingId === notebook.id}
                onClose={() => setCustomizingId(null)}
              >
                <AnimatePresence>
                  {customizingId === notebook.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.90, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.90, x: 20 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="w-72 bg-white border-2 border-amber-300 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-amber-600" />
                            <h4 className="font-medium text-amber-900">Customize Cover</h4>
                          </div>
                          <button
                            onClick={() => setCustomizingId(null)}
                            className="text-amber-400 hover:text-amber-600 w-6 h-6 rounded-full hover:bg-amber-100 flex items-center justify-center text-lg font-bold"
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="mb-4">
                          <label className="text-xs font-medium text-amber-800 mb-2 block">Color</label>
                          <div className="grid grid-cols-4 gap-2">
                            {COVER_COLORS.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => handleColorChange(notebook.id, color)}
                                className={`w-12 h-8 rounded-lg bg-gradient-to-br ${color.gradient} border-2 transition-all duration-200 ${
                                  notebook.cover.color === color.value 
                                    ? 'border-amber-400 shadow-md scale-110' 
                                    : 'border-amber-200 hover:border-amber-300 hover:scale-105'
                                }`}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium text-amber-800 mb-2 block">Pattern</label>
                          <div className="grid grid-cols-3 gap-2">
                            {COVER_PATTERNS.map((pattern) => (
                              <button
                                key={pattern.value}
                                onClick={() => handlePatternChange(notebook.id, pattern)}
                                className={`px-3 py-2 text-xs rounded-lg border-2 transition-all duration-200 ${
                                  notebook.cover.pattern === pattern.value
                                    ? 'border-amber-400 bg-amber-50 text-amber-800 font-medium'
                                    : 'border-amber-200 hover:border-amber-300 text-amber-700 hover:bg-amber-50'
                                }`}
                              >
                                {pattern.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-amber-100">
                          <label className="text-xs font-medium text-amber-800 mb-2 block">Preview</label>
                          <div className={`w-full h-16 rounded-lg ${getCoverStyling(notebook.cover)} border border-amber-200 flex items-center justify-center`}>
                            <span className="text-white font-medium text-sm drop-shadow-lg">
                              {notebook.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </PortalMenu>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onSettings}
          disabled={deletingId !== null}
          className={`w-full p-3 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-3 text-amber-800 font-medium ${
            deletingId !== null ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}