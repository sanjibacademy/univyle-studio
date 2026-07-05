import React from 'react';
import { Search, Sparkles, Image as ImageIcon, MessageSquare, Terminal, Eye, Copy, Award } from 'lucide-react';
import { AIServiceType } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: AIServiceType | 'all';
  setSelectedType: (type: AIServiceType | 'all') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  stats: {
    totalPrompts: number;
    totalCopies: number;
    simulatedViews: number;
  };
  heroTitle: string;
  heroSubtitle: string;
}

export default function Hero({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  categories,
  stats,
  heroTitle,
  heroSubtitle
}: HeroProps) {
  const { language, t } = useLanguage();

  const filterTypes: { id: AIServiceType | 'all'; label: string; icon: any; colorClass: string }[] = [
    { id: 'all', label: language === 'bn' ? 'সব প্রম্পট' : 'All Prompts', icon: Sparkles, colorClass: 'text-zinc-400' },
    { id: 'chatgpt', label: 'ChatGPT', icon: MessageSquare, colorClass: 'text-emerald-400' },
    { id: 'midjourney', label: 'Midjourney', icon: ImageIcon, colorClass: 'text-sky-400' },
    { id: 'stable-diffusion', label: 'Stable Diffusion', icon: Terminal, colorClass: 'text-purple-400' },
  ];

  // If Bengali, use high-fidelity translated text, else use admin's DB title/subtitle
  const displayTitle = language === 'bn' ? t('hero_title_val') : (heroTitle || t('hero_title_val'));
  const displaySubtitle = language === 'bn' ? t('hero_subtitle_val') : (heroSubtitle || t('hero_subtitle_val'));

  // Motion variants for stagger entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 12 }
    }
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-16 sm:py-20 border-b border-zinc-900" id="hero-section">
      {/* Premium floating background glows mimicking high-end landing pages like uniquepromoto */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0], 
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
          opacity: [0.12, 0.2, 0.12]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 12, 
          ease: "easeInOut" 
        }}
        className="absolute top-0 left-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0], 
          x: [0, -20, 0],
          scale: [1, 0.9, 1],
          opacity: [0.1, 0.18, 0.1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Banner Badge with continuous slow pulse and hover lift */}
        <motion.div 
          variants={badgeVariants}
          whileHover={{ scale: 1.05, borderColor: 'rgba(20, 241, 149, 0.4)' }}
          className="inline-flex cursor-default items-center space-x-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-semibold text-teal-400 mb-6 backdrop-blur-md transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
          <span>{t('badge_title')}</span>
        </motion.div>

        {/* Hero Title with Word-by-word highlight */}
        <motion.h1 
          variants={itemVariants}
          className="mx-auto max-w-4xl font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl" 
          id="hero-title"
        >
          {displayTitle.split(' ').map((word, i) => {
            const lowercaseWord = word.toLowerCase();
            const isHighlighted = lowercaseWord.includes('prompts') || 
                                  lowercaseWord.includes('digital') || 
                                  lowercaseWord.includes('univyle') || 
                                  lowercaseWord.includes('প্রম্পটস') ||
                                  lowercaseWord.includes('ডিজিটাল');
            if (isHighlighted) {
              return (
                <span key={i} className="inline-block bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mr-2 font-black drop-shadow-[0_2px_10px_rgba(16,185,129,0.15)]">
                  {word}{' '}
                </span>
              );
            }
            return <span key={i} className="inline-block mr-2">{word}</span>;
          })}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg" 
          id="hero-subtitle"
        >
          {displaySubtitle}
        </motion.p>

        {/* Search Bar with focus glow ring and interactive scale */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="mx-auto mt-10 max-w-2xl" 
          id="search-container"
        >
          <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-teal-500/50 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:shadow-[0_0_30px_rgba(20,241,149,0.05)] transition-all duration-300">
            <div className="flex items-center">
              <div className="pointer-events-none pl-3 text-zinc-500">
                <Search className="h-5 w-5 text-teal-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_placeholder')}
                className="block w-full bg-transparent border-0 py-2.5 pl-3 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:ring-0"
                id="search-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Active Stats Dashboard with spring-loaded items */}
        <motion.div 
          variants={itemVariants}
          className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-xs text-center shadow-lg" 
          id="hero-stats"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center border-r border-zinc-900 transition-all">
            <span className="font-mono text-xl sm:text-2xl font-bold bg-linear-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">{stats.totalPrompts}</span>
            <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1">{t('total_prompts')}</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center border-r border-zinc-900 transition-all">
            <span className="font-mono text-xl sm:text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{stats.totalCopies}</span>
            <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1">{t('total_copies')}</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center transition-all">
            <span className="font-mono text-xl sm:text-2xl font-bold bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{stats.simulatedViews}</span>
            <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1">{t('visitors')}</span>
          </motion.div>
        </motion.div>

        {/* AI Engine Filters with Spring micro-interactions */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 flex flex-wrap items-center justify-center gap-2" 
          id="ai-engine-filters"
        >
          {filterTypes.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setSelectedType(item.id)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-teal-400 border border-teal-500/40 shadow-[0_0_20px_rgba(20,241,149,0.1)]'
                    : 'bg-zinc-900/60 border border-zinc-900/80 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
                id={`filter-type-${item.id}`}
              >
                <Icon className={`h-4 w-4 ${item.colorClass}`} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Categories Carousel */}
        <motion.div 
          variants={itemVariants}
          className="mt-4 flex flex-wrap items-center justify-center gap-1.5" 
          id="category-carousel"
        >
          <motion.button
            onClick={() => setSelectedCategory('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                : 'bg-zinc-900/30 border border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
            id="cat-all"
          >
            {t('all_categories')}
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'bg-zinc-900/30 border border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
              id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
