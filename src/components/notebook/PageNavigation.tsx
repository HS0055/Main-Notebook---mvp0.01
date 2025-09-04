"use client";

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, BookOpen } from 'lucide-react';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onAddPage: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  notebookId?: string;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onAddPage,
  canGoPrevious,
  canGoNext,
  notebookId
}) => {
  const [isAddingPage, setIsAddingPage] = useState(false);

  const handleAddPage = useCallback(async () => {
    if (!notebookId || isAddingPage) return;

    setIsAddingPage(true);
    try {
      const response = await fetch(`/api/notebooks/${notebookId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Page ${totalPages + 1}`,
          leftContent: '',
          rightContent: '',
        }),
      });

      if (response.ok) {
        const newPage = await response.json();
        onAddPage();
        
        // Focus the left editor after a short delay to ensure the page is rendered
        setTimeout(() => {
          const leftEditor = document.querySelector('[data-testid="editor-left"]') as HTMLElement;
          if (leftEditor) {
            leftEditor.focus();
          }
        }, 100);
      } else {
        console.error('Failed to create new page');
      }
    } catch (error) {
      console.error('Error creating new page:', error);
    } finally {
      setIsAddingPage(false);
    }
  }, [notebookId, totalPages, onAddPage, isAddingPage]);

  return (
    <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-between px-6">
      {/* Left section - Page info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span className="font-['Caveat'] text-base">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Center section - Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${canGoPrevious 
              ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer' 
              : 'text-gray-300 cursor-not-allowed'
            }
          `}
          title="Previous page"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-4">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${canGoNext 
              ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer' 
              : 'text-gray-300 cursor-not-allowed'
            }
          `}
          title="Next page"
          aria-label="Go to next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Right section - Add page */}
      <div className="flex items-center gap-2">
        <button
          data-testid="page-add"
          onClick={handleAddPage}
          disabled={isAddingPage}
          className={`
            flex items-center gap-2 px-4 py-2 
            bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 active:bg-blue-800
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            font-medium text-sm
            shadow-sm hover:shadow-md
          `}
          title="Add new page"
          aria-label="Add new page"
        >
          {isAddingPage ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Page</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};