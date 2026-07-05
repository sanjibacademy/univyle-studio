import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Image as ImageIcon, Sparkles, Heart, Share2, Eye } from 'lucide-react';
import { AIPrompt } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

interface PromptCardProps {
  prompt: AIPrompt;
  onCopy: (id: string) => void | Promise<void>;
  onLike: (id: string) => void | Promise<void>;
  onViewDetails: (id: string) => void;
}

export default function PromptCard({ prompt, onCopy, onLike, onViewDetails }: PromptCardProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    onCopy(prompt.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      onLike(prompt.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?promptId=${prompt.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const isChatGPT = prompt.type === 'chatgpt';
  const isMidjourney = prompt.type === 'midjourney';
  const isSD = prompt.type === 'stable-diffusion';

  // Dynamic aspect ratio based on prompt ID to create a beautiful masonry staggering
  const getImageRatioClass = () => {
    const idStr = String(prompt.id);
    if (idStr.includes('1')) return 'aspect-video'; // 16:9
    if (idStr.includes('2')) return 'aspect-square'; // 1:1
    if (idStr.includes('4')) return 'aspect-[4/3]';
    if (idStr.includes('5')) return 'aspect-[3/2]';
    return 'aspect-[3/4]'; // portrait
  };

  return (
    <motion.div 
      onClick={() => onViewDetails(prompt.id)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ 
        y: -6, 
        scale: 1.01,
        boxShadow: "0 25px 45px -15px rgba(20,241,149,0.12)",
        borderColor: "rgba(20,241,149,0.3)"
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 shadow-lg backdrop-blur-md transition-colors cursor-pointer"
      id={`prompt-card-${prompt.id}`}
    >
      {/* Visual background accents */}
      <div className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-[40px] opacity-10 transition-opacity group-hover:opacity-15 ${
        isChatGPT ? 'bg-emerald-500' : isMidjourney ? 'bg-sky-500' : 'bg-purple-500'
      }`} />

      <div>
        {/* Header: Badge & Service Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center justify-center p-2 rounded-xl border ${
              isChatGPT 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : isMidjourney 
                  ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                  : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
            }`}>
              {isChatGPT && <MessageSquare className="h-4 w-4" />}
              {isMidjourney && <ImageIcon className="h-4 w-4" />}
              {isSD && <Sparkles className="h-4 w-4" />}
              {prompt.type === 'other' && <Sparkles className="h-4 w-4" />}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              {prompt.type.toUpperCase()}
            </span>
          </div>

          <span className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-800">
            {prompt.category}
          </span>
        </div>

        {/* Featured Image display */}
        {prompt.featuredImage && (
          <div className={`relative w-full overflow-hidden rounded-xl mb-4 border border-zinc-900 bg-zinc-950/40 ${getImageRatioClass()}`}>
            <img 
              src={prompt.featuredImage} 
              alt={prompt.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {/* Hover details overlay */}
            <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-teal-500 text-zinc-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Eye className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'প্রম্পট ডিটেইলস' : 'Prompt Details'}</span>
              </span>
            </div>
          </div>
        )}

        {/* Prompt Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors duration-300">
          {prompt.title}
        </h3>

        {/* Prompt Description */}
        <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {prompt.description}
        </p>

        {/* The Prompt Text Box */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="relative mt-4 rounded-xl border border-zinc-900 bg-zinc-950/90 p-4 font-mono text-xs text-zinc-300 shadow-inner group-hover:border-zinc-800/60 transition-all"
        >
          <div className="max-h-24 overflow-y-auto pr-2 custom-scrollbar break-words leading-relaxed select-all">
            {prompt.promptText}
          </div>
          <div className="absolute top-2 right-2 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
              title={language === 'bn' ? 'প্রম্পট কপি করুন' : 'Copy Prompt'}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-zinc-900/80 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">
          By <span className="text-zinc-400 font-medium">{prompt.author}</span>
        </span>

        <div className="flex items-center space-x-2">
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              liked 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-zinc-900'
            }`}
            id={`like-btn-${prompt.id}`}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current text-red-500' : ''}`} />
            <span>{prompt.likes}</span>
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              shared 
                ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-teal-400 hover:bg-zinc-900'
            }`}
            id={`share-btn-${prompt.id}`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{shared ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'শেয়ার' : 'Share')}</span>
          </motion.button>

          {/* Core Copy Action CTA */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleCopy}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-zinc-950 font-bold scale-95'
                : 'bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]'
            }`}
            id={`copy-btn-${prompt.id}`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
