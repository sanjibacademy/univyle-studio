import React, { useState } from 'react';
import { 
  Layers, Briefcase, Mail, Send, CheckCircle2, User, AlertCircle, Laptop, Film, 
  PenTool, Star, Heart, Palette, Clapperboard, Terminal, Check, Linkedin, ExternalLink,
  Play, X, Sparkles
} from 'lucide-react';
import { PortfolioItem, Testimonial, ServiceCategory } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  profileBio: string;
  hourlyRate: string;
  availability: 'Available' | 'Busy' | 'Fully Booked';
  onSubmitLead: (lead: { name: string; email: string; service: ServiceCategory; message: string }) => Promise<{ success: boolean; message: string }>;
}

export default function PortfolioSection({
  portfolio,
  testimonials,
  profileBio,
  hourlyRate,
  availability,
  onSubmitLead
}: PortfolioSectionProps) {
  const { language, t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<ServiceCategory | 'all'>('all');
  const [activeMedia, setActiveMedia] = useState<PortfolioItem | null>(null);
  
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState<ServiceCategory>('web');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setSubmitStatus({ success: false, message: t('fill_all_fields') });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await onSubmitLead({ name, email, service, message });
      // Translate response message if needed or use directly
      setSubmitStatus({
        success: res.success,
        message: res.success ? t('lead_success') : t(res.message)
      });
      if (res.success) {
        setName('');
        setEmail('');
        setMessage('');
        setService('web');
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: t('server_error') });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPortfolio = selectedCat === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === selectedCat);

  const categories: { id: ServiceCategory | 'all'; label: string; icon: any; desc: string }[] = [
    { id: 'all', label: t('all_projects'), icon: Briefcase, desc: language === 'bn' ? 'সম্পূর্ণ সার্ভিস পোর্টফোলিও' : 'Complete service portfolio' },
    { id: 'graphics', label: t('graphics_design_tab'), icon: PenTool, desc: language === 'bn' ? 'লোগো, ব্র্যান্ড আইডেন্টিটি এবং সোশ্যাল মিডিয়া আর্ট' : 'Logos, brand identity, and social media art' },
    { id: 'video', label: t('video_editing_tab'), icon: Film, desc: language === 'bn' ? 'হাই-রিটেনশন ভিডিও কাটিং, কালার গ্রেডিং এবং ইন্ট্রো' : 'High-retention video cutting, color grading, and custom intro videos' },
    { id: 'web', label: t('web_dev_tab'), icon: Laptop, desc: language === 'bn' ? 'রসপন্সিভ রিঅ্যাক্ট ওয়েব অ্যাপ, ল্যান্ডিং পেজ এবং ব্যাকএন্ড' : 'Responsive React web applications, optimized landing pages, and API backends' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" id="portfolio-section">
      {/* Sanjib Sarkar Premium Profile Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-10 mb-12 shadow-2xl backdrop-blur-md" 
        id="portfolio-profile-header"
      >
        {/* Decorative ambient background glows */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" 
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Left profile info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 opacity-20 blur-sm" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-teal-500 bg-zinc-900 text-white shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" 
                  alt="Sanjib Sarkar" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-zinc-950 text-white">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              </div>
            </motion.div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase">
                  {t('lead_creator')}
                </span>
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('open_for_projects')}</span>
                </span>
              </div>
              
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
                Sanjib Sarkar
              </h2>
              <p className="mt-1 font-mono text-xs text-zinc-500 tracking-wider">
                {t('developer_role')}
              </p>
              
              <p className="mt-3 text-sm text-zinc-300 max-w-2xl leading-relaxed">
                {language === 'bn' ? (profileBio || t('bio')) : t('bio')}
              </p>
            </div>
          </div>

          {/* Right quick connection actions (Consultation Rate Removed) */}
          <div className="flex flex-row md:flex-col sm:items-end gap-3.5 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-900">
            <div className="text-left md:text-right hidden sm:block">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{t('client_commitment')}</span>
              <span className="text-sm font-extrabold text-teal-400 block mt-0.5">Style Beyond Limits</span>
            </div>

            <motion.a 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://www.linkedin.com/in/sanjib-sarkar-90/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#0077b5] text-white hover:bg-[#006396] text-xs font-bold shadow-lg transition-all hover:shadow-[#0077b5]/15 cursor-pointer"
              id="linkedin-profile-link"
            >
              <Linkedin className="h-4 w-4" />
              <span>{t('connect_linkedin')}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Our Workflow & Client Approach Section ("Best Approaching" layout) */}
      <div className="mb-16 rounded-3xl border border-zinc-900 bg-zinc-950/20 p-6 sm:p-10 relative overflow-hidden" id="about-approach-section">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-teal-500/3 blur-[120px] pointer-events-none" />
        
        <div className="relative text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wider uppercase mb-3">
            <Sparkles className="h-3 w-3" />
            <span>{language === 'bn' ? 'ফলাফল-ভিত্তিক কাজের ধারা' : 'RESULT-ORIENTED WORKFLOW'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('approach_title')}
          </h2>
          <p className="mt-3 text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {t('approach_sub')}
          </p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { num: '01', title: t('approach_1_title'), desc: t('approach_1_desc'), color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
            { num: '02', title: t('approach_2_title'), desc: t('approach_2_desc'), color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
            { num: '03', title: t('approach_3_title'), desc: t('approach_3_desc'), color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            { num: '04', title: t('approach_4_title'), desc: t('approach_4_desc'), color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' }
          ].map((step, idx) => (
            <motion.div 
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
              }}
              whileHover={{ y: -5, borderColor: 'rgba(20,241,149,0.2)' }}
              className="p-5 rounded-2xl border border-zinc-900/60 bg-zinc-950/40 hover:border-zinc-800 transition-colors"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.bg} ${step.border} ${step.color} mb-4`}>
                <span className="text-sm font-extrabold font-mono">{step.num}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Services Showcase Section exactly matching the layout & color highlights of the user's screenshot */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h3 className="text-xs font-extrabold text-teal-400 uppercase tracking-widest">{language === 'bn' ? 'আমাদের পেশাদার সেবাসমূহ' : 'Our Professional Services'}</h3>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {language === 'bn' ? 'প্রদানকৃত প্রিমিয়াম সেবাসমূহ' : 'Our Premium Services'}
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
            {language === 'bn' 
              ? 'আমরা প্রফেশনালি আপনার ডিজিটাল বিজনেসের প্রচার ও প্রসারের জন্য ৩টি প্রধান ক্যাটাগরিতে সেবা দিয়ে থাকি' 
              : 'We professionally provide high-quality services in 3 core categories to scale your digital business'}
          </p>
        </div>

        {/* The 3 Service Cards aligned as requested */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="services-mockup-grid">
          
          {/* Card 1: Graphic Design */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 sm:p-8 shadow-xl hover:border-zinc-800 transition-all duration-300">
            <div>
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Palette className="h-6 w-6" />
              </div>
              {/* Title */}
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                {language === 'bn' ? 'গ্রাফিক্স ডিজাইন' : 'Graphic Design'}
              </h3>
              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                {language === 'bn' 
                  ? 'শারীরিক এবং ডিজিটাল উপস্থিতির জন্য সম্পূর্ণ কাস্টম ডিজাইন সেবা।' 
                  : 'Comprehensive visual communication services for physical and digital presence.'}
              </p>
            </div>
            {/* Checklist */}
            <ul className="space-y-3.5 pt-4 border-t border-zinc-900/60">
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'পোস্টার ডিজাইন' : 'Poster Design'}</span>
              </li>
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'সোশ্যাল মিডিয়া গ্রাফিক্স' : 'Social Media Graphics'}</span>
              </li>
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'ব্র্যান্ডিং ও কালার স্কিম' : 'Branding'}</span>
              </li>
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'ইউনিক লোগো ডিজাইন' : 'Logo Design'}</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Video Editing (Highlighted / Active styled card) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-teal-500/50 bg-zinc-950/90 p-6 sm:p-8 shadow-2xl shadow-teal-500/5 hover:border-teal-400 transition-all duration-300">
            {/* Glow accent */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/10 rounded-full blur-2xl" />
            
            <div>
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <Clapperboard className="h-6 w-6" />
              </div>
              {/* Title */}
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                {language === 'bn' ? 'ভিডিও এডিটিং' : 'Video Editing'}
              </h3>
              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                {language === 'bn' 
                  ? 'গল্প বলা এবং ভালো রিটেনশনের জন্য অত্যন্ত আকর্ষণীয় মোশন কন্টেন্ট।' 
                  : 'High-impact motion content optimized for storytelling and conversion.'}
              </p>
            </div>
            {/* Checklist */}
            <ul className="space-y-3.5 pt-4 border-t border-zinc-900/60">
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'ইউটিউব ও ডকুমেন্টারি ভিডিও' : 'YouTube & Documentary Videos'}</span>
              </li>
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'রিলস ও কন্টেন্ট ক্রিয়েশন' : 'Reels & Creative Ads'}</span>
              </li>
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'মার্কেটিং ও বিজনেস ভিডিও' : 'Marketing Videos'}</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Website Development */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 sm:p-8 shadow-xl hover:border-zinc-800 transition-all duration-300">
            <div>
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                <Terminal className="h-6 w-6" />
              </div>
              {/* Title */}
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                {language === 'bn' ? 'ওয়েবসাইট ডেভেলপমেন্ট' : 'Website Development'}
              </h3>
              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                {language === 'bn' 
                  ? 'আধুনিক টেকনোলজি ব্যবহার করে সুপার-ফাস্ট রেসপন্সিভ ওয়েব সলিউশন।' 
                  : 'Focusing on high-performance, responsive web solutions with cutting-edge technologies.'}
              </p>
            </div>
            {/* Checklist */}
            <ul className="space-y-3.5 pt-4 border-t border-zinc-900/60">
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'কাস্টম UI/UX ইমপ্লিমেন্টেশন' : 'Custom UI/UX Implementation'}</span>
              </li>
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'রিঅ্যাক্ট ও নেক্সটজেএস SPA' : 'Responsive Architecture'}</span>
              </li>
              <li className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-zinc-300 font-medium">{language === 'bn' ? 'স্পিড অপ্টিমাইজড ল্যান্ডিং পেজ' : 'Performance Optimization'}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Portfolio Showcase Grid with categories */}
      <div className="mb-16" id="portfolio-showcase">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-5 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {language === 'bn' ? 'সম্পন্ন কাজের পোর্টফোলিও' : 'Featured Work Showcase'}
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              {language === 'bn' 
                ? 'আমাদের ৩টি ক্যাটাগরির সফল প্রজেক্টের কয়েকটি উদাহরণ দেখুন' 
                : 'Explore our high-fidelity designs, cinematic videos, and optimized web applications.'}
            </p>
          </div>

          {/* Portfolio Category Filter Tabs with Premium Shared sliding pill */}
          <div className="flex flex-wrap gap-1.5 mt-4 md:mt-0 relative">
            {categories.map(tab => {
              const Icon = tab.icon;
              const isActive = selectedCat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCat(tab.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-teal-400 font-bold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  id={`portfolio-tab-${tab.id}`}
                >
                  {isActive && (
                    <motion.span 
                      layoutId="portfolioActiveTab"
                      className="absolute inset-0 bg-zinc-900 border border-zinc-850/80 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05),0_10px_20px_-10px_rgba(20,241,149,0.1)] rounded-lg z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Showcase Grid (Gallery style with Image & Video triggers with smooth AnimatePresence sorting) */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          id="portfolio-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredPortfolio.map((item) => {
              const isVideo = item.mediaType === 'video' || item.category === 'video' || !!item.videoUrl;
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.93 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  onClick={() => setActiveMedia(item)}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 40px -15px rgba(20,241,149,0.1)",
                    borderColor: "rgba(20,241,149,0.25)"
                  }}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-850 hover:shadow-2xl transition-all duration-300"
                  id={`portfolio-item-${item.id}`}
                >
                  <div className="relative h-48 overflow-hidden bg-zinc-900">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Play Overlay if Video */}
                    {isVideo ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-all duration-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-zinc-950 shadow-lg scale-95 group-hover:scale-110 transition-all duration-300">
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-all duration-300" />
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-950 shadow-md ${
                        item.category === 'web' ? 'bg-purple-400' : item.category === 'graphics' ? 'bg-teal-400' : 'bg-sky-400'
                      }`}>
                        {item.category === 'web' ? (language === 'bn' ? 'ওয়েব' : 'Web Dev') : item.category === 'graphics' ? (language === 'bn' ? 'গ্রাফিক্স' : 'Graphics') : (language === 'bn' ? 'ভিডিও' : 'Video')}
                      </span>
                      {isVideo && (
                        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-rose-600 shadow-md">
                          {language === 'bn' ? 'ভিডিও' : 'Video'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors duration-300">{item.title}</h4>
                    <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-2">{item.description}</p>
                    
                    <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-400 mt-4 group-hover:text-teal-300 transition-colors">
                      <span>{isVideo ? (language === 'bn' ? 'ভিডিও প্লে করুন' : 'Play Video') : t('view_details')}</span>
                      <span className="text-sm">→</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Testimonials and Contact Lead form split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-zinc-900" id="portfolio-feedback-lead">
        {/* Testimonials */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {t('testimonials_title')}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 mb-8">
            {t('testimonials_sub')}
          </p>
          
          <div className="space-y-6">
            {testimonials.map((test) => (
              <div 
                key={test.id}
                className="relative rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 shadow-lg"
                id={`testimonial-${test.id}`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={test.avatar} 
                    alt={test.clientName}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full border border-zinc-800 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{test.clientName}</h4>
                    <p className="text-[10px] text-zinc-500">{test.company}</p>
                  </div>
                  <span className="ml-auto inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-0.5 text-[10px] font-semibold text-teal-400 border border-zinc-800">
                    {test.serviceType}
                  </span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-0.5 mb-2.5">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-zinc-400 italic leading-relaxed">
                  "{test.feedback}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Capture Form */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs mb-3">
            <Mail className="h-4 w-4" />
            <span>{language === 'bn' ? 'সরাসরি যোগাযোগ চ্যানেল' : 'DIRECT INQUIRY CHANNEL'}</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {language === 'bn' ? 'প্রজেক্ট বুকিং ও ফ্রি পরামর্শ' : 'Book a Callback & Free Consultation'}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 mb-6">
            {language === 'bn' 
              ? 'আপনার ব্যবসার জন্য প্রয়োজনীয় সার্ভিসটি পছন্দ করে মেসেজ পাঠান। আমরা খুব শীঘ্রই আপনার ইমেইলে যোগাযোগ করবো।' 
              : 'Tell us about your project requirements or budget. We will get back to you shortly via email.'}
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4" id="lead-generation-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('your_name')}</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'bn' ? 'সঞ্জীব সরকার' : 'Your name'}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('email_address')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sanjib@example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('select_service')}</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as ServiceCategory)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              >
                <option value="graphics">{language === 'bn' ? 'Graphics Design (লোগো, সোশ্যাল ব্যানার)' : 'Graphic Design (Logos, branding)'}</option>
                <option value="video">{language === 'bn' ? 'Video Editing (ইউটিউব ভিডিও, প্রমোশন)' : 'Video Editing (Shorts, commercials)'}</option>
                <option value="web">{language === 'bn' ? 'Web Development (রিঅ্যাক্ট ল্যান্ডিং পেজ, অ্যাপ)' : 'Web Development (React, Full-Stack)'}</option>
                <option value="other">{language === 'bn' ? 'Other (অন্যান্য কাস্টম প্রজেক্ট)' : 'Other Custom Solutions'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('your_message')}</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'bn' 
                  ? "আপনার কাজের বিবরণ দিন। যেমন: 'আমি আমার আইটি এজেন্সির জন্য একটি ৫ পেজের আধুনিক রিঅ্যাক্ট ওয়েবসাইট এবং ব্র্যান্ড লোগো বানাতে চাই...'" 
                  : "Describe your project or business needs... (e.g. 'I need a 5-page React landing page and logo for my startup')"}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            {submitStatus && (
              <div className={`flex items-start space-x-2 rounded-xl p-3 text-xs border ${
                submitStatus.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {submitStatus.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 py-3 px-4 text-sm font-bold text-zinc-950 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all disabled:opacity-50"
              id="submit-lead-btn"
            >
              {submitting ? (
                <span>{t('sending')}</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{t('send_message')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Premium Lightbox Modal for Gallery */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/95 backdrop-blur-xl animate-fadeIn" id="portfolio-lightbox">
          <div className="relative w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[75vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-md"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Media Content Area */}
            <div className="relative flex-1 bg-zinc-900/40 flex items-center justify-center p-3 min-h-[250px] md:min-h-0">
              {activeMedia.videoUrl || activeMedia.category === 'video' ? (
                <div className="w-full h-full flex items-center justify-center p-1">
                  {/* Check if it's an embed or standard MP4 video */}
                  {activeMedia.videoUrl?.includes('youtube.com') || activeMedia.videoUrl?.includes('youtu.be') ? (
                    <iframe 
                      src={activeMedia.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                      className="w-full h-full aspect-video rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      src={activeMedia.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34285-large.mp4"} 
                      controls 
                      autoPlay 
                      className="w-full h-full max-h-[60vh] object-contain rounded-lg shadow-xl"
                    />
                  )}
                </div>
              ) : (
                <img 
                  src={activeMedia.image} 
                  alt={activeMedia.title}
                  className="w-full h-full max-h-[60vh] object-contain rounded-lg shadow-xl"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Content Details Area */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-zinc-900 p-6 flex flex-col justify-between bg-zinc-950">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    activeMedia.category === 'web' 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                      : activeMedia.category === 'graphics' 
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}>
                    {activeMedia.category === 'web' ? (language === 'bn' ? 'ওয়েব ডেভেলপমেন্ট' : 'Web Development') : activeMedia.category === 'graphics' ? (language === 'bn' ? 'গ্রাফিক্স ডিজাইন' : 'Graphic Design') : (language === 'bn' ? 'ভিডিও এডিটিং' : 'Video Editing')}
                  </span>
                  
                  {activeMedia.videoUrl || activeMedia.category === 'video' ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                      <Film className="h-2.5 w-2.5" />
                      <span>{language === 'bn' ? 'ভিডিও' : 'Video'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase">
                      <Palette className="h-2.5 w-2.5" />
                      <span>{language === 'bn' ? 'ছবি' : 'Image'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-white leading-tight mb-3">
                  {activeMedia.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                  {activeMedia.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900/80 flex flex-col gap-2.5">
                {activeMedia.link && activeMedia.link !== '#' && (
                  <a 
                    href={activeMedia.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-500 hover:bg-teal-400 py-2.5 px-4 text-xs font-bold text-zinc-950 transition-all"
                  >
                    <span>{language === 'bn' ? 'লাইভ প্রোজেক্ট ভিজিট করুন' : 'Visit Live Project'}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                
                <button
                  onClick={() => setActiveMedia(null)}
                  className="w-full text-center py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold border border-zinc-800 transition-all"
                >
                  {language === 'bn' ? 'গ্যালারিতে ফিরে যান' : 'Return to Gallery'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
