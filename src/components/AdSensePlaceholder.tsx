import React from 'react';
import { Sparkles, DollarSign, Settings, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AdSensePlaceholderProps {
  enabled: boolean;
  adsText: string;
  simulatedRevenue: number;
}

export default function AdSensePlaceholder({ enabled, adsText, simulatedRevenue }: AdSensePlaceholderProps) {
  const { language } = useLanguage();
  if (!enabled) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6" id="adsense-section">
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-teal-500/30 bg-zinc-950/40 p-4 backdrop-blur-xs">
        {/* Absolute Background Accent */}
        <div className="absolute inset-y-0 right-0 w-32 bg-teal-500/5 blur-xl rounded-full" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono text-sm font-bold">
              {language === 'bn' ? 'বিজ্ঞাপন' : 'Ad'}
            </div>
            <div>
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  {language === 'bn' ? 'স্পন্সরড বিজ্ঞাপন' : 'Sponsored Placement'}
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-sm font-medium text-zinc-300 mt-0.5">
                {adsText}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 bg-zinc-900/60 rounded-xl px-4 py-2 border border-zinc-900 shrink-0">
            <div className="text-center sm:text-right">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">
                {language === 'bn' ? 'অ্যাডসেন্স আয়' : 'AdSense Income'}
              </span>
              <span className="text-emerald-400 font-mono font-bold text-sm sm:text-base flex items-center justify-center sm:justify-end">
                <DollarSign className="h-3.5 w-3.5" />
                <span>{simulatedRevenue.toFixed(2)} USD</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
