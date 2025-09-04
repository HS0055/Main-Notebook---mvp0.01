"use client";

import { useState, useCallback, useEffect } from 'react';
import { Search, Bookmark, Settings, BookOpen, Edit3, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Page {
  id: string;
  leftContent: string;
  rightContent: string;
  title?: string;
}

interface Notebook {
  id: string;
  title: string;
  pages: Page[];
  currentPageIndex: number;
  isActive: boolean;
  isOpen: boolean;
  cover: {
    color: string;
    pattern: string;
    image?: string;
  };
}

interface NotebookHeaderProps {
  currentNotebook?: Notebook;
  currentPage?: Page;
  onEditTitle: (newTitle: string) => void;
  onSearch: (query: string) => void;
  onBookmark: () => void;
  onSettings: () => void;
  isBookmarked?: boolean;
  onShowCover?: () => void;
}

export default function NotebookHeader({
  currentNotebook,
  currentPage,
  onEditTitle,
  onSearch,
  onBookmark,
  onSettings,
  isBookmarked = false,
  onShowCover
}: NotebookHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isBookmarkToggling, setIsBookmarkToggling] = useState(false);

  // Initialize edited title when notebook changes
  useEffect(() => {
    if (currentNotebook) {
      setEditedTitle(currentNotebook.title);
    }
  }, [currentNotebook?.id, currentNotebook?.title]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleStartEditing = useCallback(() => {
    setIsEditingTitle(true);
    setEditedTitle(currentNotebook?.title || '');
  }, [currentNotebook?.title]);

  const handleSaveTitle = useCallback(async () => {
    if (!currentNotebook || !editedTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const response = await fetch(`/api/notebooks/${currentNotebook.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editedTitle.trim() }),
      });

      if (response.ok) {
        onEditTitle(editedTitle.trim());
        setIsEditingTitle(false);
      } else {
        // Reset title on error
        setEditedTitle(currentNotebook.title);
        setIsEditingTitle(false);
      }
    } catch (error) {
      console.error('Error updating notebook title:', error);
      setEditedTitle(currentNotebook.title);
      setIsEditingTitle(false);
    }
  }, [currentNotebook, editedTitle, onEditTitle]);

  const handleCancelEditing = useCallback(() => {
    setEditedTitle(currentNotebook?.title || '');
    setIsEditingTitle(false);
  }, [currentNotebook?.title]);

  const handleTitleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEditing();
    }
  }, [handleSaveTitle, handleCancelEditing]);

  const handleBookmarkToggle = useCallback(async () => {
    if (!currentNotebook || isBookmarkToggling) return;

    setIsBookmarkToggling(true);
    try {
      const response = await fetch('/api/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notebookId: currentNotebook.id,
          userId: 'current-user', // Replace with actual user ID
        }),
      });

      if (response.ok) {
        onBookmark();
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarkToggling(false);
    }
  }, [currentNotebook, isBookmarkToggling, onBookmark]);

  const handleSearchResultClick = useCallback((result: any) => {
    setShowSearchResults(false);
    setSearchQuery('');
    onSearch(result.id);
  }, [onSearch]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
    setShowSearchResults(false);
  }, [searchQuery, onSearch]);

  return (
    <div className="relative">
      <header className="h-16 bg-[#F5F2E8] border-b border-[#E5E5E5] flex items-center justify-between px-6 shadow-sm">
        {/* Left section - Title */}
        <div className="flex items-center gap-4">
          {currentNotebook && (
            <button
              onClick={onShowCover}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Show Book Cover"
              data-testid="nb-cover-open"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  data-testid="nb-title-input"
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={handleTitleKeyPress}
                  className="text-xl font-['Caveat'] text-[#2C2C2C] bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  title="Save title"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEditing}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  title="Cancel editing"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-['Caveat'] text-[#2C2C2C] font-medium">
                  {currentNotebook?.title || 'My Study Notes'}
                </h1>
                {currentNotebook && (
                  <button
                    onClick={handleStartEditing}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit notebook title"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {currentPage && (
            <div className="text-sm text-gray-500 font-['Caveat']">
              Page {(currentNotebook?.currentPageIndex || 0) + 1} of {currentNotebook?.pages.length || 0}
            </div>
          )}
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-8 relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notebooks and pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        result.type === 'notebook' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {result.type === 'notebook' ? 'NB' : 'PG'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {result.title}
                        </div>
                        {result.type === 'page' && result.notebook && (
                          <div className="text-sm text-gray-500 truncate">
                            in {result.notebook.title}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          <button
            data-testid="bookmark-toggle"
            onClick={handleBookmarkToggle}
            disabled={isBookmarkToggling}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            } ${isBookmarkToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onSettings}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Date display */}
          <div className="text-sm text-gray-500 font-['Caveat'] ml-4">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>
    </div>
  );
}