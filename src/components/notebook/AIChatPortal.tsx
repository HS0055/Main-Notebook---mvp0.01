"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatPortalProps {
  className?: string;
}

export const AIChatPortal: React.FC<AIChatPortalProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Study Assistant. I can help you understand concepts, create flashcards, summarize notes, and answer questions about your studies. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);

  // Handle mounting and localStorage
  useEffect(() => {
    setIsMounted(true);
    
    // Load saved state from localStorage
    const savedState = localStorage.getItem('ai-chat-open');
    if (savedState === 'true') {
      setIsOpen(true);
    }
  }, []);

  // Detect study mode by checking if AI Assistant Panel is visible
  useEffect(() => {
    const checkStudyMode = () => {
      const aiAssistantPanel = document.querySelector('.w-80.fixed.right-0');
      setIsStudyMode(!!aiAssistantPanel);
    };

    // Check initially
    checkStudyMode();

    // Check on DOM changes
    const observer = new MutationObserver(checkStudyMode);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('ai-chat-open', isOpen.toString());
    }
  }, [isOpen, isMounted]);

  // Keyboard shortcut handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === '.') {
      event.preventDefault();
      setIsOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Let me break this down for you...",
        "I'd be happy to help you understand this concept better. Here's what you need to know:",
        "Based on your question, I can see you're working on an important topic. Let me explain:",
        "This is a fundamental concept in your studies. Here's how I would approach it:",
        "I can help you create flashcards for this topic. Would you like me to generate some key points?",
        "This connects to several other concepts you've been studying. Let me show you the relationships:",
        "Great question! This is something many students find challenging. Here's a clear explanation:"
      ];

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  }, [inputValue, handleSendMessage]);

  const handleInputKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  }, [inputValue, handleSendMessage]);

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  // Calculate positioning based on study mode
  const getPositioning = () => {
    if (isStudyMode) {
      return {
        toggle: 'fixed bottom-6 right-[340px] z-[1000]', // Offset by AI panel width + margin
        panel: 'fixed bottom-0 right-80 z-[1001]', // Right of AI panel
        panelDesktop: 'sm:bottom-6 sm:right-[340px] sm:rounded-lg sm:border'
      };
    } else {
      return {
        toggle: 'fixed bottom-6 right-6 z-[1000]',
        panel: 'fixed bottom-0 right-0 z-[1001]',
        panelDesktop: 'sm:bottom-6 sm:right-6 sm:rounded-lg sm:border'
      };
    }
  };

  const positioning = getPositioning();

  const portalContent = (
    <>
      {/* Floating Toggle Button */}
      <button
        data-testid="ai-chat-toggle"
        onClick={toggleChat}
        className={`
          ${positioning.toggle}
          w-14 h-14 bg-primary text-primary-foreground
          rounded-full shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300 ease-out
          transform hover:scale-110 active:scale-95
          border-2 border-primary/20
          ${isOpen ? 'rotate-180' : 'rotate-0'}
        `}
        aria-label="Toggle AI Chat"
        style={{
          backgroundColor: isStudyMode ? '#3B82F6' : '#6366F1', // Different color in study mode
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        data-testid="ai-chat-panel"
        className={`
          ${positioning.panel}
          w-full max-w-md h-[600px]
          bg-background border-l border-t border-border
          shadow-2xl
          transform transition-all duration-300 ease-out
          ${isOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'
          }
          flex flex-col
          ${positioning.panelDesktop}
          sm:max-h-[600px]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-medium text-foreground">
                AI Study Assistant
              </h3>
              {isStudyMode && (
                <div className="text-xs text-muted-foreground">
                  Study Mode Active
                </div>
              )}
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-2xl px-4 py-2 text-sm
                  ${message.isUser
                    ? 'bg-primary text-primary-foreground ml-2'
                    : 'bg-muted text-muted-foreground mr-2'
                  }
                  animate-in slide-in-from-bottom-2 duration-300
                `}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground rounded-2xl px-4 py-2 mr-2 animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              placeholder="Ask me anything about your studies..."
              className="
                flex-1 px-3 py-2 
                bg-muted border border-border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                text-sm placeholder:text-muted-foreground
                transition-colors
              "
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="
                px-3 py-2 bg-primary text-primary-foreground
                rounded-lg hover:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                flex items-center justify-center
              "
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Ctrl/Cmd + . to toggle chat • {isStudyMode ? 'Positioned for Study Mode' : 'Write Mode'}
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(portalContent, document.body);
};