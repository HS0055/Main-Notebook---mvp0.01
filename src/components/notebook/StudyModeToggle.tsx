"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { PenTool, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface StudyModeToggleProps {
  onModeChange?: (mode: 'write' | 'study') => void
  initialMode?: 'write' | 'study'
  notebookTitle?: string
}

export default function StudyModeToggle({ 
  onModeChange = () => {}, 
  initialMode = 'write',
  notebookTitle = 'No notebook'
}: StudyModeToggleProps) {
  const [mode, setMode] = useState<'write' | 'study'>(initialMode)
  const [showTooltip, setShowTooltip] = useState(false)

  // CRITICAL FIX: Sync with initialMode when it changes (notebook switching)
  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const handleToggle = useCallback(() => {
    const newMode = mode === 'write' ? 'study' : 'write'
    setMode(newMode)
    onModeChange(newMode)
  }, [mode, onModeChange])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Enhanced Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-16 right-0 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 whitespace-nowrap"
          >
            <div className="text-sm font-medium text-gray-900">
              {mode === 'write' ? 'Switch to Study Mode' : 'Switch to Write Mode'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {mode === 'write' 
                ? `AI will analyze "${notebookTitle}" content` 
                : 'Focus on note taking'
              }
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200 translate-y-px" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wooden Panel with Enhanced Hover */}
      <motion.div
        className="relative w-[60px] h-[40px] rounded-lg bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 shadow-lg"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(180, 83, 9, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(180, 83, 9, 0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(180, 83, 9, 0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(180, 83, 9, 0.1) 75%)
          `,
          backgroundSize: '6px 6px',
          backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        {/* Toggle Track */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-5 bg-gradient-to-r from-amber-900 to-amber-800 rounded-full shadow-inner">
          {/* Toggle Switch */}
          <motion.button
            className="absolute w-8 h-8 -top-1.5 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-full shadow-md border border-yellow-300 flex items-center justify-center"
            onClick={handleToggle}
            animate={{
              x: mode === 'write' ? 0 : 20
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            whileHover={{ 
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.6)",
              scale: 1.1 
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              initial={false}
              animate={{ 
                rotate: mode === 'write' ? 0 : 180,
                scale: mode === 'write' ? 1 : 1.1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {mode === 'write' ? (
                <PenTool className="w-3 h-3 text-amber-900" />
              ) : (
                <Brain className="w-3 h-3 text-amber-900" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Decorative Screws */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-sm" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-sm" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-sm" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-sm" />
      </motion.div>

      {/* Enhanced Mode Label with Notebook Context */}
      <motion.div
        className="mt-2 text-center"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <span 
          className="text-xs text-primary/80 font-[var(--font-display)] font-medium"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {mode === 'write' ? 'Write Mode' : 'Study Mode'}
        </span>
        {/* CRITICAL FIX: Show current notebook context */}
        <div className="text-[10px] text-gray-500 mt-1 max-w-[80px] truncate">
          {notebookTitle}
        </div>
        {/* Status indicator */}
        <div className={`w-1 h-1 mx-auto mt-1 rounded-full ${
          mode === 'study' ? 'bg-blue-500' : 'bg-amber-500'
        } opacity-60`} />
      </motion.div>

      {/* Click Feedback Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ 
          scale: mode === 'write' ? 1 : 1.2,
          opacity: 0 
        }}
        transition={{ duration: 0.3 }}
        key={mode}
      >
        <div className={`w-full h-full rounded-lg border-2 ${
          mode === 'study' ? 'border-blue-400/60' : 'border-yellow-400/60'
        }`} />
      </motion.div>
    </div>
  )
}