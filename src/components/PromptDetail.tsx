import React, { useState } from 'react';
import { 
  ArrowLeft, Copy, Check, Heart, Share2, MessageSquare, Image as ImageIcon, Sparkles, 
  User, Calendar, Info, CornerDownRight, Compass, ShieldAlert, BadgeCheck 
} from 'lucide-react';
import { AIPrompt } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface PromptDetailProps {
  prompt: AIPrompt;
  allPrompts: AIPrompt[];
  onBack: () => void;
  onCopy: (id: string) => void | Promise<void>;
  onLike: (id: string) => void | Promise<void>;
  onSelectPrompt: (id: string) => void;
}

export default function PromptDetail({ 
  prompt, 
  allPrompts, 
  onBack, 
  onCopy, 
  onLike,
  onSelectPrompt
}: PromptDetailProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    onCopy(prompt.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike(prompt.id);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?promptId=${prompt.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const isChatGPT = prompt.type === 'chatgpt';
  const isMidjourney = prompt.type === 'midjourney';
  const isSD = prompt.type === 'stable-diffusion';

  // Get related prompts from the same category or type (excluding current)
  const relatedPrompts = allPrompts
    .filter(p => p.id !== prompt.id && (p.category === prompt.category || p.type === prompt.type))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300" id="prompt-detail-page">
      {/* Navigation & Header */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>{t('back_to_prompt_list')}</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual & Tips */}
        <div className="lg:col-span-5 space-y-6">
          {prompt.featuredImage ? (
            <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 shadow-2xl">
              <img 
                src={prompt.featuredImage} 
                alt={prompt.title} 
                className="w-full h-auto object-cover max-h-[500px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-6 pt-12">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>{t('verified_output')}</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-900 bg-zinc-950/20 text-zinc-500">
              <ImageIcon className="h-10 w-10 opacity-30" />
            </div>
          )}

          {/* Prompt Guidelines/How to use info */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 shadow-lg backdrop-blur-md">
            <h4 className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-3.5">
              <Info className="h-4 w-4" />
              <span>{t('how_to_use_prompt')}</span>
            </h4>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-start space-x-2 leading-relaxed">
                <CornerDownRight className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5" />
                <span>{t('use_step_1')}</span>
              </li>
              <li className="flex items-start space-x-2 leading-relaxed">
                <CornerDownRight className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5" />
                <span>{isChatGPT ? t('use_step_2_chat') : t('use_step_2_img')}</span>
              </li>
              <li className="flex items-start space-x-2 leading-relaxed">
                <CornerDownRight className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5" />
                <span>{t('use_step_3')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Prompt Details & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Header badging info */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <span className={`inline-flex items-center justify-center p-2 rounded-xl border ${
                  isChatGPT 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : isMidjourney 
                      ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                      : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                }`}>
                  {isChatGPT && <MessageSquare className="h-4.5 w-4.5" />}
                  {isMidjourney && <ImageIcon className="h-4.5 w-4.5" />}
                  {isSD && <Sparkles className="h-4.5 w-4.5" />}
                  {!isChatGPT && !isMidjourney && !isSD && <Sparkles className="h-4.5 w-4.5" />}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                  {prompt.type.toUpperCase()}
                </span>
              </div>

              <span className="inline-flex items-center rounded-lg bg-zinc-900 px-3.5 py-1 text-xs font-medium text-zinc-300 border border-zinc-800 shadow-sm">
                {prompt.category}
              </span>
            </div>

            {/* Prompt Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {prompt.title}
            </h1>

            {/* Prompt Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-zinc-500 border-b border-zinc-900/80 pb-5">
              <div className="flex items-center space-x-1.5">
                <User className="h-3.5 w-3.5 text-zinc-600" />
                <span>By <span className="text-zinc-300 font-medium">{prompt.author}</span></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                <span>{new Date(prompt.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}</span>
              </div>
            </div>

            {/* Prompt Description */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('prompt_about')}</h3>
              <p className="mt-1.5 text-sm text-zinc-300 leading-relaxed">
                {prompt.description}
              </p>
            </div>

            {/* The Prompt Text Container (Large Highlighted area) */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t('prompt_code_title')}</h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Interactive Workspace</span>
              </div>
              
              <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950 p-5 font-mono text-xs sm:text-sm text-zinc-200 shadow-inner leading-relaxed group/box">
                <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar select-all break-words">
                  {prompt.promptText}
                </div>
                
                {/* Visual glow on copy success */}
                {copied && (
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 pointer-events-none animate-pulse" />
                )}
              </div>
            </div>

            {/* Core Action Panel */}
            <div className="mt-6 pt-6 border-t border-zinc-900/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Likes metric */}
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">{t('likes_count')}</span>
                  <span className="text-sm font-extrabold text-white">{prompt.likes}</span>
                </div>
                <div className="h-6 w-px bg-zinc-800" />
                {/* Copy count metric */}
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">{t('used_instances')}</span>
                  <span className="text-sm font-extrabold text-white">{language === 'bn' ? `${prompt.copyCount} বার` : `${prompt.copyCount} times`}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    liked 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : 'bg-zinc-900/50 border-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-zinc-900'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{liked ? t('liked_success') : t('like_prompt')}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    shared 
                      ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                      : 'bg-zinc-900/50 border-zinc-900 text-zinc-400 hover:text-teal-400 hover:bg-zinc-900'
                  }`}
                >
                  <Share2 className="h-4 w-4" />
                  <span>{shared ? t('shared_success') : t('share_friends')}</span>
                </button>

                {/* BIG COPY BUTTON */}
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-xl transition-all ${
                    copied
                      ? 'bg-emerald-500 text-zinc-950 font-extrabold scale-95'
                      : 'bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? t('copied_success') : t('copy_prompt_action')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Prompts Section */}
      {relatedPrompts.length > 0 && (
        <section className="mt-16 border-t border-zinc-900/80 pt-10">
          <div className="flex items-center space-x-2.5 mb-8">
            <span className="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
              <Compass className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{t('related_prompts_title')}</h2>
              <p className="text-zinc-500 text-xs mt-0.5">{t('related_prompts_sub')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPrompts.map((p) => {
              const isP_ChatGPT = p.type === 'chatgpt';
              const isP_Midjourney = p.type === 'midjourney';
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    onSelectPrompt(p.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 shadow-md hover:border-zinc-800 transition-all cursor-pointer"
                >
                  {p.featuredImage && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg mb-3 border border-zinc-900 bg-zinc-950">
                      <img src={p.featuredImage} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">{p.type}</span>
                    <span className="text-zinc-700 font-mono text-[9px]">•</span>
                    <span className="text-[9px] text-teal-400 font-semibold">{p.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
