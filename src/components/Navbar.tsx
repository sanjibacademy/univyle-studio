import React, { useState } from 'react';
import { Menu, X, Shield, BookOpen, Layers, MessageSquare, Newspaper, FileCode, Award, Globe, Package } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  onOpenAdminModal: () => void;
  notificationAlert?: string;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  isAdminLoggedIn,
  onLogout,
  onOpenAdminModal,
  notificationAlert
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'prompts', labelKey: 'ai_prompts', icon: FileCode },
    { id: 'packs', labelKey: 'premium_packs', icon: Package },
    { id: 'portfolio', labelKey: 'hire_me', icon: Layers },
    { id: 'courses', labelKey: 'academy', icon: BookOpen },
    { id: 'blog', labelKey: 'blog', icon: Newspaper },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      {/* Top Alert Bar */}
      {notificationAlert && (
        <div className="relative w-full bg-linear-to-r from-teal-500 to-emerald-500 py-1.5 px-4 text-center text-xs font-semibold text-zinc-950 shadow-md">
          <span className="inline-block animate-pulse mr-1">📢</span>
          {notificationAlert}
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Glowing Logo matching user's image */}
        <div 
          onClick={() => setCurrentTab('prompts')}
          className="flex cursor-pointer items-center space-x-3 group"
          id="nav-logo"
        >
          <motion.div 
            whileHover={{ scale: 1.08, rotate: [0, -6, 6, 0] }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg group-hover:border-teal-500/50 transition-all duration-300"
          >
            {/* Custom stylized entwined U and V logo with orbit ring and star */}
            <svg 
              viewBox="0 0 100 100" 
              className="h-8 w-8 drop-shadow-[0_0_8px_rgba(20,241,149,0.5)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
                  <stop offset="100%" stopColor="#06b6d4" /> {/* cyan-500 */}
                </linearGradient>
              </defs>
              {/* U Path */}
              <path 
                d="M30 25 V55 C30 68, 40 75, 50 75 C60 75, 70 68, 70 55 V25" 
                stroke="url(#logoGrad)" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* V Path nested inside U */}
              <path 
                d="M42 35 L50 58 L58 35" 
                stroke="#ffffff" 
                strokeWidth="7" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Orbit Ellipse */}
              <path 
                d="M20 52 C20 40, 80 40, 80 52 C80 64, 20 64, 20 52" 
                stroke="url(#logoGrad)" 
                strokeWidth="3.5"
                strokeDasharray="4 2" 
                transform="rotate(-15, 50, 52)"
              />
              {/* Star spark */}
              <path 
                d="M82 40 L84 43 L87 44 L84 45 L82 48 L80 45 L77 44 L80 43 Z" 
                fill="#10b981"
              />
            </svg>
          </motion.div>
          <div className="flex flex-col">
            <span className="font-sans text-xl font-bold tracking-wider text-white group-hover:text-teal-400 transition-colors duration-300">
              UNIVYLE<span className="text-teal-400">.</span>
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 uppercase">
              AI & Design Beyond Limits
            </span>
          </div>
        </div>

        {/* Desktop Navigation with Premium Layout Shared Sliding pill */}
        <nav className="hidden md:flex items-center space-x-1 relative" id="nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer ${
                  isActive
                    ? 'text-teal-400 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                id={`tab-btn-${item.id}`}
              >
                {isActive && (
                  <motion.span 
                    layoutId="activeTabPill" 
                    className="absolute inset-0 rounded-lg bg-zinc-900 border-t border-zinc-800 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05),0_10px_25px_-8px_rgba(20,241,149,0.15)] z-0" 
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center space-x-2">
                  <Icon className={`h-4 w-4 transition-colors duration-300 ${isActive ? 'text-teal-400' : 'text-zinc-500'}`} />
                  <span>{t(item.labelKey)}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Admin and Right Controls */}
        <div className="hidden md:flex items-center space-x-3" id="nav-controls-right">
          {/* Segmented Premium Language Switcher */}
          <div className="flex items-center rounded-lg bg-zinc-900 p-0.5 border border-zinc-800 mr-1 shadow-inner relative">
            <button
              onClick={() => setLanguage('en')}
              className={`relative px-2.5 py-1 text-[10px] font-black rounded-md transition-colors duration-200 cursor-pointer z-10 ${
                language === 'en' ? 'text-teal-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {language === 'en' && (
                <motion.span 
                  layoutId="activeLangPill"
                  className="absolute inset-0 bg-teal-500/10 border border-teal-500/25 rounded-md -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`relative px-2.5 py-1 text-[10px] font-black rounded-md transition-colors duration-200 cursor-pointer z-10 ${
                language === 'bn' ? 'text-teal-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {language === 'bn' && (
                <motion.span 
                  layoutId="activeLangPill"
                  className="absolute inset-0 bg-teal-500/10 border border-teal-500/25 rounded-md -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              BN
            </button>
          </div>

          {isAdminLoggedIn && (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 text-teal-400 text-xs font-semibold hover:bg-teal-500/20 transition-all cursor-pointer ${
                  currentTab === 'admin' ? 'ring-2 ring-teal-500/30' : ''
                }`}
                id="btn-admin-panel"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>{t('admin_dashboard')}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-all cursor-pointer"
                id="btn-admin-logout"
              >
                {t('logout')}
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile menu button & Mobile Language Quick Switch */}
        <div className="flex md:hidden items-center space-x-3" id="nav-mobile-trigger">
          {/* Quick toggle for mobile */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300"
          >
            <Globe className="h-3.5 w-3.5 text-teal-400" />
            <span>{language === 'en' ? 'EN' : 'BN'}</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 focus:outline-hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300" id="nav-mobile-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center space-x-3 px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-teal-400'
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
                id={`mobile-tab-btn-${item.id}`}
              >
                <Icon className="h-5 w-5" />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
          {isAdminLoggedIn && (
            <div className="border-t border-zinc-900 pt-3 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold hover:bg-teal-500/20"
              >
                <Shield className="h-4 w-4" />
                <span>{t('admin_dashboard')}</span>
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium border border-zinc-800"
              >
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
