"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Brain, FolderOpen, RefreshCw, ArrowRight, CheckCircle, Star, Users, Zap, MessageCircle, Heart, Sparkles, Coffee, Clock, Target, Award, Shield, ChevronRight, Palette, Layout, FileText, Wand2, PenTool, GraduationCap, TrendingUp, Lightbulb, Layers, Globe, Smartphone, Laptop, Play, MousePointer, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('study');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        clearInterval(interval);
        clearInterval(testimonialInterval);
        window.removeEventListener('scroll', handleScroll);
      };
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(testimonialInterval);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Paper-Like Experience",
      description: "Digital notebooks that feel like real paper with ruled lines, spiral binding, and natural handwriting flow.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI Study Assistant", 
      description: "Smart AI companion that analyzes your notes, generates summaries, and creates personalized study materials.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FolderOpen,
      title: "Smart Organization",
      description: "Intuitive subject-based notebooks with automatic tagging, search, and cross-referencing capabilities.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: RefreshCw,
      title: "Cross-Device Sync",
      description: "Access your notes anywhere with seamless synchronization across all your devices and platforms.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content: "StudyNote transformed how I study anatomy. The AI flashcards are incredible - they actually understand my notes and create perfect review materials!",
      rating: 5,
      image: "👩‍⚕️",
      school: "Johns Hopkins University"
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Student", 
      content: "Finally, a note-taking app that doesn't feel like fighting with technology. It's like writing on paper but with superpowers.",
      rating: 5,
      image: "👨‍💻",
      school: "MIT"
    },
    {
      name: "Emma Thompson",
      role: "Law Student",
      content: "The way StudyNote organizes my case studies and generates study guides is absolutely game-changing. My grades improved dramatically!",
      rating: 5,
      image: "👩‍⚖️",
      school: "Harvard Law School"
    }
  ];

  const statsCountUp = (num: number, suffix: string = '') => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isVisible) return;
      let start = 0;
      const end = num;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [isVisible, num]);
    
    return count.toLocaleString() + suffix;
  };

  return (
    <div className="min-h-screen bg-background font-body overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-background to-blue-50 opacity-50" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-20"
                        initial={{ 
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0
            }}
            animate={{ 
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-6 py-3 rounded-full mb-8 border border-amber-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coffee className="w-5 h-5" />
              <span className="text-sm font-medium">Hey there, fellow learner! ☕</span>
              <ChevronRight className="w-4 h-4 animate-pulse" />
            </motion.div>

            {/* Animated Main Title */}
            <div className="relative mb-8">
              <motion.h1 
                className="font-display text-7xl md:text-9xl lg:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
              StudyNote
              </motion.h1>
              
              {/* Floating icons around title */}
              <motion.div
                className="absolute -top-8 -left-8 w-20 h-20"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Brain className="w-full h-full text-purple-500 opacity-20" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-8 -right-8 w-16 h-16"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-full h-full text-blue-500 opacity-20" />
              </motion.div>
                </div>

            {/* Animated subtitle */}
            <motion.p 
              className="text-2xl md:text-3xl text-muted-foreground mb-6 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Remember how good it felt to write on real paper?
            </motion.p>
            
            <motion.p 
              className="text-lg md:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              We do too. That's why we built StudyNote - to give you that same natural writing experience, 
              but with an AI study buddy that actually gets your notes and helps you learn better.
            </motion.p>

            {/* Enhanced social proof */}
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <div className="flex -space-x-3">
                  {['👩‍🎓', '👨‍💻', '👩‍⚕️', '👨‍🏫', '👩‍🔬'].map((emoji, i) => (
                    <motion.div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-white flex items-center justify-center text-lg shadow-md"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
                <span className="font-medium">10,000+ happy students</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
              </div>
                <span className="font-medium">4.9/5 rating</span>
            </div>
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
            <Link href="/notebook">
                <motion.button 
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-5 text-lg font-medium rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                  <PenTool className="relative z-10 w-5 h-5" />
                <span className="relative z-10">Start Writing (It's Free!)</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
            </Link>

              <motion.p 
                className="text-sm text-muted-foreground mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
              No credit card required • No signup hassle • Just start writing
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Animated scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MousePointer className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>

        {/* 3D Notebook Preview */}
        <motion.div
          className="absolute top-1/2 right-10 transform -translate-y-1/2 hidden xl:block"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="relative w-64 h-80 transform rotate-12 hover:rotate-6 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shadow-2xl" />
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly py-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-gray-400 shadow-inner" />
            ))}
          </div>
            <div className="p-8 pl-12">
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-1 bg-gray-300 rounded" style={{ width: `${100 - i * 10}%` }} />
            ))}
          </div>
        </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Problem/Solution Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-4 py-2 rounded-full mb-6">
            <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Real talk time</span>
          </div>
          
            <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-4">
              Traditional Apps Suck 😤
          </h2>
          
            <p className="text-xl text-muted-foreground">
              And we're not afraid to say it
            </p>
          </motion.div>

          {/* Interactive comparison cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              className="group relative p-8 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl cursor-pointer"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-red-800 mb-6">The Old Way 👎</h3>
                <div className="space-y-4">
                  {[
                    { emoji: "😤", text: "Clunky interfaces that slow you down" },
                    { emoji: "😫", text: "'Smart' features that aren't actually smart" },
                    { emoji: "😵", text: "Notes scattered everywhere" },
                    { emoji: "😖", text: "Time wasted fighting the app" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-red-700">{item.text}</span>
                    </motion.div>
                  ))}
            </div>
              </div>
            </motion.div>
            
            <motion.div
              className="group relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl cursor-pointer"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-green-800 mb-6">The StudyNote Way 🎯</h3>
                <div className="space-y-4">
                  {[
                    { emoji: "✨", text: "Natural writing like real paper" },
                    { emoji: "🧠", text: "AI that actually understands you" },
                    { emoji: "📚", text: "Auto-organized study materials" },
                    { emoji: "🚀", text: "More studying, less organizing" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-green-700">{item.text}</span>
                    </motion.div>
                  ))}
            </div>
              </div>
            </motion.div>
          </div>
          
          {/* Call to action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-6 py-4 rounded-2xl shadow-lg">
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">Built by students who get it, for students who need it</span>
          </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Wand2 className="w-4 h-4" />
              <span className="text-sm font-medium">Simple as 1-2-3</span>
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
              How StudyNote Works
            </h2>
          </motion.div>

          {/* Animated step cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Just Start Writing",
                description: "Open StudyNote and start typing. No setup, no complicated menus. It feels like writing on paper, but better.",
                icon: PenTool,
                color: "blue",
                demo: "✍️ Taking notes naturally..."
              },
              {
                step: "02", 
                title: "AI Gets Smart",
                description: "Our AI reads your notes (privately!) and understands what you're studying. No training required.",
                icon: Brain,
                color: "purple",
                demo: "🤖 Analyzing content..."
              },
              {
                step: "03",
                title: "Study Smarter",
                description: "Get instant flashcards, quizzes, and summaries. Switch to Study Mode when ready to review.",
                icon: GraduationCap,
                color: "green",
                demo: "🎯 Generating study materials..."
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <div className="relative p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                    <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {item.step}
                </div>
                
                    <Icon className={`w-12 h-12 text-${item.color}-600 mb-6`} />
                    
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                      {item.title}
                </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      {item.description}
                    </p>
                    
                    <div className={`p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
              <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`text-${item.color}-700 text-sm font-medium`}
                      >
                        {item.demo}
                      </motion.div>
                </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
              Features That Actually Matter
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We focused on what students really need, not flashy gimmicks
            </p>
          </motion.div>

          {/* Interactive feature grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layout,
                title: "Smart Templates",
                description: "AI-powered layouts for any subject",
                gradient: "from-blue-500 to-cyan-500",
                demo: "📝"
              },
              {
                icon: Wand2,
                title: "AI Study Mode",
                description: "Instant flashcards & quizzes",
                gradient: "from-purple-500 to-pink-500",
                demo: "🧠"
              },
              {
                icon: Palette,
                title: "Custom Themes",
                description: "Make your notes beautiful",
                gradient: "from-green-500 to-emerald-500",
                demo: "🎨"
              },
              {
                icon: Globe,
                title: "Sync Everywhere",
                description: "Access on any device",
                gradient: "from-orange-500 to-red-500",
                demo: "🌍"
              },
              {
                icon: FileText,
                title: "Rich Formatting",
                description: "Tables, images, equations",
                gradient: "from-indigo-500 to-blue-500",
                demo: "📊"
              },
              {
                icon: Shield,
                title: "Private & Secure",
                description: "Your notes stay yours",
                gradient: "from-gray-600 to-gray-800",
                demo: "🔒"
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "See your improvement",
                gradient: "from-teal-500 to-cyan-500",
                demo: "📈"
              },
              {
                icon: Users,
                title: "Study Groups",
                description: "Collaborate with friends",
                gradient: "from-pink-500 to-rose-500",
                demo: "👥"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`} />
                  <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                  </div>

                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                      {feature.demo}
                  </div>
                </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
              See It In Action
          </h2>
            <p className="text-xl text-muted-foreground">
              Watch how StudyNote transforms your study experience
            </p>
          </motion.div>

          {/* Interactive demo tabs */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex border-b">
              {['study', 'organize', 'collaborate'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {tab} Mode
                </button>
              ))}
                  </div>
            
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {activeTab === 'study' && (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <Brain className="w-8 h-8 text-purple-600" />
                        <div>
                          <h3 className="font-display text-2xl font-bold">AI Study Assistant</h3>
                          <p className="text-muted-foreground">Transform notes into study materials instantly</p>
                </div>
          </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold mb-2">📝 Smart Summaries</h4>
                          <p className="text-sm text-muted-foreground">AI creates concise summaries of your notes</p>
            </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold mb-2">🎯 Flashcards</h4>
                          <p className="text-sm text-muted-foreground">Auto-generated cards for quick review</p>
            </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold mb-2">📊 Practice Tests</h4>
                          <p className="text-sm text-muted-foreground">Custom quizzes based on your content</p>
          </div>
        </div>
                    </>
                  )}
                  
                  {activeTab === 'organize' && (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <FolderOpen className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-display text-2xl font-bold">Smart Organization</h3>
                          <p className="text-muted-foreground">Everything in its perfect place</p>
              </div>
              </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>Auto-tagging and categorization</span>
            </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Smart search across all notebooks</span>
                </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span>Visual mind maps and connections</span>
                </div>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'collaborate' && (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <Users className="w-8 h-8 text-green-600" />
                        <div>
                          <h3 className="font-display text-2xl font-bold">Study Together</h3>
                          <p className="text-muted-foreground">Learn better with friends</p>
                    </div>
                  </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">👥 Shared Notebooks</h4>
                          <p className="text-sm text-muted-foreground">Collaborate on notes in real-time</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">💬 Study Groups</h4>
                          <p className="text-sm text-muted-foreground">Create groups for different subjects</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
                </div>
              </div>

          {/* Try demo button */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/notebook">
              <motion.button
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Try Live Demo
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials with Carousel */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Students love us</span>
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
              Success Stories
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-8xl">{testimonials[currentTestimonial].image}</div>
                  <div className="flex-1 text-center md:text-left">
                    <blockquote className="text-xl text-foreground mb-6 leading-relaxed italic">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    <div className="flex justify-center md:justify-start gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
                    <div>
                      <div className="font-display font-semibold text-lg text-foreground">
                        {testimonials[currentTestimonial].name}
            </div>
                      <div className="text-muted-foreground">
                        {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].school}
          </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
              </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentTestimonial === index ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: 10000, suffix: "+", label: "Happy Students" },
              { icon: FileText, number: 500000, suffix: "+", label: "Notes Created" },
              { icon: Star, number: 4.9, suffix: "/5", label: "User Rating" },
              { icon: TrendingUp, number: 85, suffix: "%", label: "Grade Improvement" }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-4">
                    <Icon className="w-10 h-10 text-purple-600" />
                  </div>
                  <div className="font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {statsCountUp(stat.number, stat.suffix)}
                    </div>
                  <div className="text-muted-foreground mt-2">
                      {stat.label}
                    </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limited Time Offer Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Limited Time Offer</span>
          </div>
          
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Free Forever Account
          </h2>
          
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join during our launch and keep all premium features free. Forever.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mb-8 max-w-2xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">All Features</div>
                  <div className="text-sm opacity-80">No limitations</div>
                </div>
                <div>
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Forever Free</div>
                  <div className="text-sm opacity-80">No hidden costs</div>
                </div>
                <div>
                  <Zap className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Early Access</div>
                  <div className="text-sm opacity-80">New features first</div>
            </div>
          </div>

              <div className="text-3xl font-bold">
                Only {10000 - Math.floor(scrollY / 10)} spots left!
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/notebook">
                <button className="group relative inline-flex items-center gap-3 bg-white text-purple-900 px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                  <Zap className="w-6 h-6" />
                  <span>Claim Your Free Account</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 px-6 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
              StudyNote
            </div>
            <p className="text-muted-foreground mb-6">
                Making digital note-taking feel beautifully natural. Built by students, for students.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Smartphone, label: "iOS" },
                  { icon: Smartphone, label: "Android" },
                  { icon: Laptop, label: "Web" }
                ].map((platform, i) => {
                  const Icon = platform.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4" />
                      <span>{platform.label}</span>
                    </div>
                  );
                })}
              </div>
          </div>
          
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <div className="space-y-3 text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#" className="block hover:text-foreground transition-colors">AI Tools</a>
                <a href="#" className="block hover:text-foreground transition-colors">Templates</a>
                <a href="#" className="block hover:text-foreground transition-colors">Pricing</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <div className="space-y-3 text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Study Tips</a>
                <a href="#" className="block hover:text-foreground transition-colors">Blog</a>
                <a href="#" className="block hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block hover:text-foreground transition-colors">API Docs</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <div className="space-y-3 text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About Us</a>
                <a href="#" className="block hover:text-foreground transition-colors">Careers</a>
                <a href="#" className="block hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="block hover:text-foreground transition-colors">Press Kit</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 StudyNote. Made with ❤️ for students worldwide.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}