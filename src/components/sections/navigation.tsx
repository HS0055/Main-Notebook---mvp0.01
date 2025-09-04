"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-sm border-b border-white/10' 
          : 'bg-black'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-[#00D563] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">LC</span>
              </div>
              <span>Limitless Concepts</span>
            </motion.div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login"
              className="text-white hover:text-gray-300 font-medium transition-colors duration-200 px-4 py-2"
            >
              Log In
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="#pricing"
                className="bg-[#00D563] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00D563]/90 transition-colors duration-200"
              >
                Access for $37
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-white hover:text-gray-300 hover:bg-white/10 transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            height: isOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden bg-black border-t border-white/10"
        >
          <div className="py-4 space-y-2">
            <div className="px-4 space-y-2">
              <Link 
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                Log In
              </Link>
              <Link 
                href="#pricing"
                onClick={() => setIsOpen(false)}
                className="block bg-[#00D563] text-black px-4 py-2 rounded-lg font-bold text-center hover:bg-[#00D563]/90 transition-colors duration-200"
              >
                Access for $37
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}