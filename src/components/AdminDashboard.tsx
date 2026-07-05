import React, { useState } from 'react';
import { 
  Shield, FileCode, Newspaper, Mail, PhoneCall, Settings, Plus, Trash2, Edit2, 
  Check, X, DollarSign, Eye, Copy, RefreshCw, AlertCircle, Save, Layers, ListFilter, ShoppingBag, Package 
} from 'lucide-react';
import { 
  AIPrompt, BlogPost, Lead, Booking, SiteSettings, SiteStats, PortfolioItem, ServiceCategory, AIServiceType, PremiumPack, PurchaseRequest, PurchaseStatus 
} from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface AdminDashboardProps {
  prompts: AIPrompt[];
  blogs: BlogPost[];
  leads: Lead[];
  bookings: Booking[];
  settings: SiteSettings;
  portfolio: PortfolioItem[];
  stats: SiteStats;
  onAddPrompt: (prompt: Omit<AIPrompt, 'id' | 'createdAt' | 'likes' | 'copyCount'>) => Promise<boolean>;
  onUpdatePrompt: (id: string, prompt: Partial<AIPrompt>) => Promise<boolean>;
  onDeletePrompt: (id: string) => Promise<boolean>;
  onAddBlog: (blog: Omit<BlogPost, 'id' | 'createdAt'>) => Promise<boolean>;
  onDeleteBlog: (id: string) => Promise<boolean>;
  onUpdateLeadStatus: (id: string, status: 'new' | 'contacted' | 'completed') => Promise<boolean>;
  onDeleteLead: (id: string) => Promise<boolean>;
  onUpdateBookingStatus: (id: string, status: 'new' | 'called' | 'joined') => Promise<boolean>;
  onDeleteBooking: (id: string) => Promise<boolean>;
  onUpdateSettings: (settings: SiteSettings) => Promise<boolean>;
  onAddPortfolio: (item: Omit<PortfolioItem, 'id'>) => Promise<boolean>;
  onDeletePortfolio: (id: string) => Promise<boolean>;
  purchaseRequests: PurchaseRequest[];
  premiumPacks: PremiumPack[];
  onUpdatePurchaseStatus: (id: string, status: PurchaseStatus, paymentMethod?: string, paymentNote?: string) => Promise<boolean>;
  onDeletePurchaseRequest: (id: string) => Promise<boolean>;
}

type AdminTab = 'prompts' | 'blogs' | 'portfolio' | 'leads' | 'bookings' | 'settings' | 'purchases';

export default function AdminDashboard({
  prompts,
  blogs,
  leads,
  bookings,
  settings,
  portfolio,
  stats,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onAddBlog,
  onDeleteBlog,
  onUpdateLeadStatus,
  onDeleteLead,
  onUpdateBookingStatus,
  onDeleteBooking,
  onUpdateSettings,
  onAddPortfolio,
  onDeletePortfolio,
  purchaseRequests,
  premiumPacks,
  onUpdatePurchaseStatus,
  onDeletePurchaseRequest
}: AdminDashboardProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('settings');

  // Success/Error Feedback Alerts
  const [alert, setAlert] = useState<{ success: boolean; message: string } | null>(null);

  // Form states
  // 1. Prompt Form
  const [promptTitle, setPromptTitle] = useState('');
  const [promptType, setPromptType] = useState<AIServiceType>('chatgpt');
  const [promptCategory, setPromptCategory] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptDesc, setPromptDesc] = useState('');
  const [promptAuthor, setPromptAuthor] = useState('Sanjib Sarkar');
  const [promptFeaturedImage, setPromptFeaturedImage] = useState('');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);

  // 2. Blog Form
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCover, setBlogCover] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Web Development');
  const [blogAuthor, setBlogAuthor] = useState('Sanjib Sarkar');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogTagsString, setBlogTagsString] = useState('React, Frontend, Web');

  // 3. Portfolio Form
  const [portTitle, setPortTitle] = useState('');
  const [portCategory, setPortCategory] = useState<ServiceCategory>('web');
  const [portImage, setPortImage] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');
  const [portDesc, setPortDesc] = useState('');
  const [portLink, setPortLink] = useState('#');
  const [portMediaType, setPortMediaType] = useState<'image' | 'video'>('image');
  const [portVideoUrl, setPortVideoUrl] = useState('');

  // 4. Site Settings Form
  const [adSenseEnabled, setAdSenseEnabled] = useState(settings.adSenseEnabled);
  const [adsText, setAdsText] = useState(settings.adsText);
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [notificationAlert, setNotificationAlert] = useState(settings.notificationAlert);
  const [profileBio, setProfileBio] = useState(settings.profileBio);
  const [profileHourlyRate, setProfileHourlyRate] = useState(settings.profileHourlyRate);
  const [profileAvailability, setProfileAvailability] = useState(settings.profileAvailability);

  const showAlert = (success: boolean, message: string) => {
    setAlert({ success, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Submissions handlers
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle || !promptCategory || !promptText || !promptDesc) {
      showAlert(false, language === 'bn' ? 'সব ক্ষেত্র পূরণ করুন।' : 'Please fill in all fields.');
      return;
    }

    if (editingPromptId) {
      const res = await onUpdatePrompt(editingPromptId, {
        title: promptTitle,
        type: promptType,
        category: promptCategory,
        promptText: promptText,
        description: promptDesc,
        author: promptAuthor,
        featuredImage: promptFeaturedImage
      });
      if (res) {
        showAlert(true, language === 'bn' ? 'প্রম্পট সফলভাবে আপডেট করা হয়েছে!' : 'Prompt successfully updated!');
        setEditingPromptId(null);
        resetPromptForm();
      } else {
        showAlert(false, language === 'bn' ? 'আপডেট ব্যর্থ হয়েছে।' : 'Update failed.');
      }
    } else {
      const res = await onAddPrompt({
        title: promptTitle,
        type: promptType,
        category: promptCategory,
        promptText: promptText,
        description: promptDesc,
        author: promptAuthor,
        featuredImage: promptFeaturedImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
      });
      if (res) {
        showAlert(true, language === 'bn' ? 'প্রম্পট সফলভাবে যুক্ত করা হয়েছে!' : 'Prompt successfully added!');
        resetPromptForm();
      } else {
        showAlert(false, language === 'bn' ? 'যোগ করতে সমস্যা হয়েছে।' : 'Failed to add prompt.');
      }
    }
  };

  const handleEditPromptTrigger = (p: AIPrompt) => {
    setEditingPromptId(p.id);
    setPromptTitle(p.title);
    setPromptType(p.type);
    setPromptCategory(p.category);
    setPromptText(p.promptText);
    setPromptDesc(p.description);
    setPromptAuthor(p.author);
    setPromptFeaturedImage(p.featuredImage || '');
  };

  const resetPromptForm = () => {
    setPromptTitle('');
    setPromptType('chatgpt');
    setPromptCategory('');
    setPromptText('');
    setPromptDesc('');
    setPromptAuthor('Sanjib Sarkar');
    setPromptFeaturedImage('');
    setEditingPromptId(null);
  };

  const handleDeletePromptTrigger = async (id: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে এই প্রম্পটটি ডিলিট করতে চান?' : 'Are you sure you want to delete this prompt?')) {
      const res = await onDeletePrompt(id);
      if (res) showAlert(true, language === 'bn' ? 'প্রম্পট সফলভাবে ডিলিট করা হয়েছে!' : 'Prompt successfully deleted!');
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogExcerpt || !blogContent) {
      showAlert(false, language === 'bn' ? 'সব ক্ষেত্র পূরণ করুন।' : 'Please fill in all fields.');
      return;
    }

    const tags = blogTagsString.split(',').map(t => t.trim()).filter(Boolean);
    const res = await onAddBlog({
      title: blogTitle,
      excerpt: blogExcerpt,
      content: blogContent,
      category: blogCategory,
      author: blogAuthor,
      readTime: blogReadTime,
      coverImage: blogCover,
      tags
    });

    if (res) {
      showAlert(true, language === 'bn' ? 'ব্লগ পোস্ট সফলভাবে প্রকাশ করা হয়েছে!' : 'Blog post published successfully!');
      setBlogTitle('');
      setBlogExcerpt('');
      setBlogContent('');
      setBlogTagsString('React, Frontend, Web');
    } else {
      showAlert(false, language === 'bn' ? 'ব্লগ পোস্ট প্রকাশ করতে সমস্যা হয়েছে।' : 'Failed to publish blog post.');
    }
  };

  const handleDeleteBlogTrigger = async (id: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে এই ব্লগটি ডিলিট করতে চান?' : 'Are you sure you want to delete this blog post?')) {
      const res = await onDeleteBlog(id);
      if (res) showAlert(true, language === 'bn' ? 'ব্লগ সফলভাবে ডিলিট করা হয়েছে!' : 'Blog successfully deleted!');
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle || !portDesc) {
      showAlert(false, language === 'bn' ? 'সব ক্ষেত্র পূরণ করুন।' : 'Please fill in all fields.');
      return;
    }

    const res = await onAddPortfolio({
      title: portTitle,
      category: portCategory,
      image: portImage,
      description: portDesc,
      link: portLink,
      mediaType: portMediaType,
      videoUrl: portMediaType === 'video' ? portVideoUrl : undefined
    });

    if (res) {
      showAlert(true, language === 'bn' ? 'পোর্টফোলিও আইটেম সফলভাবে যুক্ত করা হয়েছে!' : 'Portfolio item successfully added!');
      setPortTitle('');
      setPortDesc('');
      setPortLink('#');
      setPortVideoUrl('');
      setPortMediaType('image');
    } else {
      showAlert(false, language === 'bn' ? 'যোগ করতে সমস্যা হয়েছে।' : 'Failed to add item.');
    }
  };

  const handleDeletePortfolioTrigger = async (id: string) => {
    if (confirm(language === 'bn' ? 'পোর্টফোলিও প্রজেক্ট ডিলিট করতে চান?' : 'Do you want to delete this portfolio project?')) {
      const res = await onDeletePortfolio(id);
      if (res) showAlert(true, language === 'bn' ? 'পোর্টফোলিও ডিলিট করা হয়েছে!' : 'Portfolio project deleted!');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onUpdateSettings({
      adSenseEnabled,
      adsText,
      heroTitle,
      heroSubtitle,
      notificationAlert,
      profileBio,
      profileHourlyRate,
      profileAvailability
    });

    if (res) {
      showAlert(true, language === 'bn' ? 'সাইটের সেটিংস ও কনফিগারেশন সফলভাবে সেভ হয়েছে!' : 'Site settings and configuration saved successfully!');
    } else {
      showAlert(false, language === 'bn' ? 'সেভ করতে সমস্যা হয়েছে।' : 'Failed to save settings.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" id="admin-dashboard">
      {/* Admin Title Card */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 bg-linear-to-r from-zinc-950 to-zinc-900 p-6 sm:p-8 shadow-2xl mb-10">
        <div className="absolute inset-y-0 right-0 w-48 bg-teal-500/5 blur-2xl rounded-full" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <span className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Shield className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {language === 'bn' ? 'UNIVYLE অ্যাডমিন কন্ট্রোল সেন্টার' : 'UNIVYLE Admin Control Center'}
              </h1>
              <p className="text-zinc-400 text-xs mt-0.5">
                {language === 'bn' ? 'সব কন্টেন্ট পরিবর্তন, বিজ্ঞাপন সেটিং, কোর্স বুকিং এবং কন্টাক্ট ইনবক্স কন্ট্রোল করুন' : 'Control all content modifications, advertisement settings, course bookings, and contact inbox.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-zinc-900/60 rounded-xl px-4 py-2 border border-zinc-800 font-mono text-xs text-zinc-400">
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Ad Revenue</span>
              <span className="text-emerald-400 font-bold">${stats.adRevenue.toFixed(2)}</span>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Inboxes</span>
              <span className="text-white font-bold">{leads.length + bookings.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout with Sidebar tabs and Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2" id="admin-tabs-list">
          {[
            { id: 'settings', label: language === 'bn' ? 'সাইট এডিট ও সেটিংস' : 'Site Edit & Settings', icon: Settings },
            { id: 'prompts', label: language === 'bn' ? 'প্রম্পট ম্যানেজমেন্ট' : 'Prompt Management', icon: FileCode },
            { id: 'blogs', label: language === 'bn' ? 'ব্লগ ও এসইও পোস্ট' : 'Blogs & SEO Posts', icon: Newspaper },
            { id: 'portfolio', label: language === 'bn' ? 'পোর্টফোলিও প্রজেক্টস' : 'Portfolio Projects', icon: Layers },
            { id: 'leads', label: `${language === 'bn' ? 'ক্লায়েন্ট ইনবক্স' : 'Client Inbox'} (${leads.filter(l => l.status === 'new').length})`, icon: Mail },
            { id: 'bookings', label: `${language === 'bn' ? 'কোর্স বুকিং' : 'Course Bookings'} (${bookings.filter(b => b.status === 'new').length})`, icon: PhoneCall },
            { id: 'purchases', label: `${language === 'bn' ? 'ক্রয়ের অনুরোধ' : 'Purchase Requests'} (${purchaseRequests.filter(r => r.status === 'pending').length})`, icon: ShoppingBag },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-teal-400 border border-teal-500/20 shadow-md'
                    : 'bg-zinc-950/20 border border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200'
                }`}
                id={`admin-tab-btn-${item.id}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-3 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md" id="admin-active-panel">
          {/* Feedback message overlay */}
          {alert && (
            <div className={`mb-6 flex items-start space-x-2.5 rounded-xl p-4 text-xs border animate-in fade-in slide-in-from-top-2 duration-300 ${
              alert.success 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              <Check className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{alert.message}</span>
            </div>
          )}

          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
                <Settings className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">
                  {language === 'bn' ? 'সম্পূর্ণ সাইট এডিট ও কনফিগারেশন' : 'Complete Site Edit & Configuration'}
                </h2>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 1. Header Alerts */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">টপ নোটিফিকেশন এলার্ট বার</label>
                  <input
                    type="text"
                    value={notificationAlert}
                    onChange={(e) => setNotificationAlert(e.target.value)}
                    placeholder="নোটিফিকেশন বার টেক্সট..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden"
                  />
                </div>

                {/* 2. Hero Header Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">হিরো টাইটেল (Hero Title)</label>
                    <textarea
                      rows={2}
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="হিরো হেডলাইন..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">হিরো সাবটাইটেল (Hero Subtitle)</label>
                    <textarea
                      rows={2}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder="হিরো সাবহেড..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* 3. Portfolio Freelance details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-900 pt-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">ফ্রি-ল্যান্সার বায়ো (Bio)</label>
                    <textarea
                      rows={3}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder="বায়ো লিখুন..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">ঘণ্টা প্রতি কাজের রেট</label>
                      <input
                        type="text"
                        value={profileHourlyRate}
                        onChange={(e) => setProfileHourlyRate(e.target.value)}
                        placeholder="$45/hr"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">কাজ গ্রহণের অবস্থা</label>
                      <select
                        value={profileAvailability}
                        onChange={(e) => setProfileAvailability(e.target.value as any)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden"
                      >
                        <option value="Available">Available (Hireable)</option>
                        <option value="Busy">Busy (Busy status)</option>
                        <option value="Fully Booked">Fully Booked (Fully booked)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Google AdSense Ads settings */}
                <div className="border-t border-zinc-900 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Google AdSense মনিটাইজেশন এনাবল</h3>
                      <p className="text-[11px] text-zinc-500">আপনার প্ল্যাটফর্মের মাঝে গুগলের বিজ্ঞাপন ব্যানারগুলো চালু বা বন্ধ করুন</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={adSenseEnabled}
                        onChange={(e) => setAdSenseEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                    </label>
                  </div>

                  {adSenseEnabled && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">বিজ্ঞাপন টেক্সট / স্লট তথ্য</label>
                      <input
                        type="text"
                        value={adsText}
                        onChange={(e) => setAdsText(e.target.value)}
                        placeholder="Ad text context..."
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-900 pt-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-500 hover:bg-teal-400 py-3 text-sm font-bold text-zinc-950 shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    <span>সাইটের সম্পূর্ণ কনফিগারেশন সেভ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PROMPTS */}
          {activeTab === 'prompts' && (
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FileCode className="h-5 w-5 text-teal-400" />
                  <h2 className="text-xl font-bold text-white">প্রম্পট ম্যানেজমেন্ট</h2>
                </div>
                {editingPromptId && (
                  <button 
                    onClick={resetPromptForm}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-300"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {/* Form to Add/Edit Prompt */}
              <form onSubmit={handleSavePrompt} className="space-y-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 mb-8">
                <h3 className="text-sm font-bold text-teal-400">{editingPromptId ? 'প্রম্পট তথ্য এডিট করুন' : 'নতুন প্রম্পট যুক্ত করুন'}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">প্রম্পট টাইটেল *</label>
                    <input
                      type="text"
                      required
                      value={promptTitle}
                      onChange={(e) => setPromptTitle(e.target.value)}
                      placeholder="যেমন: Minimalist Vector Cloud Logo"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400">এআই টাইপ *</label>
                      <select
                        value={promptType}
                        onChange={(e) => setPromptType(e.target.value as AIServiceType)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                      >
                        <option value="chatgpt">ChatGPT</option>
                        <option value="midjourney">Midjourney</option>
                        <option value="stable-diffusion">Stable Diffusion</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400">ক্যাটাগরি *</label>
                      <input
                        type="text"
                        required
                        value={promptCategory}
                        onChange={(e) => setPromptCategory(e.target.value)}
                        placeholder="যেমন: Branding, Design"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">ছোট বিবরণ (Short Description) *</label>
                  <input
                    type="text"
                    required
                    value={promptDesc}
                    onChange={(e) => setPromptDesc(e.target.value)}
                    placeholder="যেমন: Generates sleek abstract logo vectors for tech brands."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">ফিচারড ইমেজ লিংক (Featured Image URL - ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={promptFeaturedImage}
                    onChange={(e) => setPromptFeaturedImage(e.target.value)}
                    placeholder="যেমন: https://images.unsplash.com/photo-..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">সম্পূর্ণ প্রম্পট টেক্সট (Prompt Text) *</label>
                  <textarea
                    rows={4}
                    required
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="সম্পূর্ণ এআই প্রম্পটটি এখানে লিখুন..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center space-x-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2 text-xs font-bold text-zinc-950"
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingPromptId ? 'সংরক্ষণ করুন' : 'প্রম্পট যোগ করুন'}</span>
                </button>
              </form>

              {/* Prompts table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500">
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2">Title</th>
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2 text-center">Copies</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {prompts.map(p => (
                      <tr key={p.id} className="hover:bg-zinc-900/20">
                        <td className="py-3 px-2 font-semibold uppercase text-teal-400">{p.type}</td>
                        <td className="py-3 px-2 font-medium text-white">{p.title}</td>
                        <td className="py-3 px-2">{p.category}</td>
                        <td className="py-3 px-2 text-center font-mono">{p.copyCount}</td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button 
                              onClick={() => handleEditPromptTrigger(p)}
                              className="p-1 rounded-md text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDeletePromptTrigger(p.id)}
                              className="p-1 rounded-md text-red-500 hover:text-red-400 bg-zinc-900 border border-zinc-800"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BLOGS */}
          {activeTab === 'blogs' && (
            <div>
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
                <Newspaper className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">ব্লগ ও এসইও (SEO) পোস্ট কন্ট্রোল</h2>
              </div>

              {/* Form to add Blog */}
              <form onSubmit={handleSaveBlog} className="space-y-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 mb-8">
                <h3 className="text-sm font-bold text-teal-400">নতুন আর্টিকেল প্রকাশ করুন</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">টাইটেল (Blog Title) *</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="যেমন: ChatGPT 2026 Guide"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400">ক্যাটাগরি</label>
                      <select
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                      >
                        <option value="Graphics Design">Graphics Design</option>
                        <option value="Video Editing">Video Editing</option>
                        <option value="Web Development">Web Development</option>
                        <option value="AI Prompts">AI Prompts</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400">পড়ার সময় (Read Time)</label>
                      <input
                        type="text"
                        value={blogReadTime}
                        onChange={(e) => setBlogReadTime(e.target.value)}
                        placeholder="5 min read"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">কভার ইমেজ লিংক (Cover Image URL)</label>
                  <input
                    type="text"
                    value={blogCover}
                    onChange={(e) => setBlogCover(e.target.value)}
                    placeholder="Unsplash image link..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">সংক্ষিপ্ত বিষয়বস্তু (Excerpt) *</label>
                  <input
                    type="text"
                    required
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    placeholder="১-২ লাইনে ব্লগ পোস্টের মূল আকর্ষণ..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">ট্যাগসমূহ (Tags - কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    value={blogTagsString}
                    onChange={(e) => setBlogTagsString(e.target.value)}
                    placeholder="React, Frontend, Web"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">সম্পূর্ণ কন্টেন্ট বডি (Markdown/Text) *</label>
                  <textarea
                    rows={6}
                    required
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="### Heading 1\nআপনার আর্টিকেল বডি লিখুন..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center space-x-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2 text-xs font-bold text-zinc-950"
                >
                  <Plus className="h-4 w-4" />
                  <span>ব্লগ পোস্টটি প্রকাশ করুন</span>
                </button>
              </form>

              {/* Blogs lists */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">প্রকাশিত ব্লগসমূহ</h3>
                {blogs.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/30 border border-zinc-900">
                    <div>
                      <h4 className="text-xs font-bold text-white">{b.title}</h4>
                      <p className="text-[10px] text-zinc-500">{b.category} • {b.readTime}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteBlogTrigger(b.id)}
                      className="p-1 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
                <Layers className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">পোর্টফোলিও প্রজেক্ট ম্যানেজমেন্ট</h2>
              </div>

              {/* Add portfolio item form */}
              <form onSubmit={handleSavePortfolio} className="space-y-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 mb-8">
                <h3 className="text-sm font-bold text-teal-400">নতুন প্রজেক্ট পোর্টফোলিওতে যুক্ত করুন</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">প্রজেক্ট টাইটেল *</label>
                    <input
                      type="text"
                      required
                      value={portTitle}
                      onChange={(e) => setPortTitle(e.target.value)}
                      placeholder="যেমন: Aura Fintech Redesign"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">সার্ভিস ক্যাটাগরি *</label>
                    <select
                      value={portCategory}
                      onChange={(e) => setPortCategory(e.target.value as ServiceCategory)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="graphics">Graphics Design</option>
                      <option value="video">Video Editing</option>
                      <option value="web">Web Development</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">প্রজেক্ট ইমেজ লিংক (Image URL)</label>
                    <input
                      type="text"
                      value={portImage}
                      onChange={(e) => setPortImage(e.target.value)}
                      placeholder="Unsplash image URL..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">লাইভ প্রজেক্ট লিংক (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={portLink}
                      onChange={(e) => setPortLink(e.target.value)}
                      placeholder="Live URL..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">মিডিয়া টাইপ *</label>
                    <select
                      value={portMediaType}
                      onChange={(e) => setPortMediaType(e.target.value as 'image' | 'video')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="image">Image (ছবি)</option>
                      <option value="video">Video (ভিডিও)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">ভিডিও লিংক (Video URL - MP4, YouTube, etc.)</label>
                    <input
                      type="text"
                      value={portVideoUrl}
                      onChange={(e) => setPortVideoUrl(e.target.value)}
                      placeholder="e.g., https://assets.mixkit.co/...mp4"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                      disabled={portMediaType === 'image'}
                      required={portMediaType === 'video'}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">প্রজেক্টের সংক্ষিপ্ত বিবরণ *</label>
                  <textarea
                    rows={2}
                    required
                    value={portDesc}
                    onChange={(e) => setPortDesc(e.target.value)}
                    placeholder="প্রজেক্ট সম্পর্কে বিবরণ দিন..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center space-x-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2 text-xs font-bold text-zinc-950"
                >
                  <Plus className="h-4 w-4" />
                  <span>প্রজেক্ট যোগ করুন</span>
                </button>
              </form>

              {/* Portfolio lists */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">চলতি পোর্টফোলিও আইটেমস</h3>
                {portfolio.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/30 border border-zinc-900">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img src={item.image} className="h-10 w-10 object-cover rounded-md border border-zinc-800" referrerPolicy="no-referrer" />
                        {(item.mediaType === 'video' || item.category === 'video') && (
                          <span className="absolute bottom-0 right-0 bg-rose-600 text-[8px] text-white px-0.5 rounded font-extrabold uppercase">
                            Vid
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase">
                          {item.category} {item.mediaType === 'video' && '• VIDEO'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeletePortfolioTrigger(item.id)}
                      className="p-1 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEADS (CLIENT MESSAGES) */}
          {activeTab === 'leads' && (
            <div>
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
                <Mail className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">ক্লায়েন্ট ইনকুয়েরি ইনবক্স (Inbox Leads)</h2>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-zinc-900 rounded-xl">
                  <Mail className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">আপনার ইনবক্সে কোনো মেসেজ নেই!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((l) => (
                    <div 
                      key={l.id}
                      className={`rounded-xl border p-5 shadow-lg relative ${
                        l.status === 'new' 
                          ? 'bg-zinc-900/40 border-teal-500/20' 
                          : 'bg-zinc-950/20 border-zinc-900'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{l.name}</h4>
                          <p className="text-[10px] text-zinc-500">{l.email} • {new Date(l.createdAt).toLocaleString('bn-BD')}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                            l.service === 'web' ? 'bg-purple-500/10 text-purple-400' : l.service === 'graphics' ? 'bg-teal-500/10 text-teal-400' : 'bg-sky-500/10 text-sky-400'
                          }`}>
                            {l.service}
                          </span>

                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            l.status === 'new' 
                              ? 'bg-teal-400 text-zinc-950 animate-pulse' 
                              : l.status === 'contacted'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-zinc-900 text-zinc-500'
                          }`}>
                            {l.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-900/60 leading-relaxed font-sans mb-4">
                        {l.message}
                      </p>

                      <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-zinc-500 uppercase mr-1">স্ট্যাটাস পরিবর্তন:</span>
                          <button 
                            onClick={async () => {
                              const res = await onUpdateLeadStatus(l.id, 'contacted');
                              if (res) showAlert(true, 'Lead status: Contacted');
                            }}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-semibold text-amber-400 rounded-md border border-zinc-800"
                          >
                            Contacted
                          </button>
                          <button 
                            onClick={async () => {
                              const res = await onUpdateLeadStatus(l.id, 'completed');
                              if (res) showAlert(true, 'Lead status: Completed');
                            }}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-semibold text-emerald-400 rounded-md border border-zinc-800"
                          >
                            Completed
                          </button>
                        </div>

                        <button 
                          onClick={async () => {
                            if (confirm('ডিলিট করতে চান?')) {
                              const res = await onDeleteLead(l.id);
                              if (res) showAlert(true, 'Lead deleted successfully');
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-400 bg-zinc-900 rounded border border-zinc-800"
                          title="Delete message"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
                <PhoneCall className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">স্টুডেন্ট কোর্স কলব্যাক বুকিংস</h2>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-zinc-900 rounded-xl">
                  <PhoneCall className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">আপনার কোর্স ক্যাটাগরিতে কোনো কলব্যাক রিকোয়েস্ট নেই!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div 
                      key={b.id}
                      className={`rounded-xl border p-5 shadow-lg ${
                        b.status === 'new' 
                          ? 'bg-zinc-900/40 border-teal-500/20' 
                          : 'bg-zinc-950/20 border-zinc-900'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{b.name}</h4>
                          <p className="text-[10px] text-teal-400 font-bold font-mono">মোবাইল: {b.phone}</p>
                          <p className="text-[10px] text-zinc-500">{b.email} • {new Date(b.createdAt).toLocaleString('bn-BD')}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 border border-zinc-800">
                            {b.preferredTime}
                          </span>

                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            b.status === 'new' 
                              ? 'bg-teal-400 text-zinc-950 animate-pulse' 
                              : b.status === 'called'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-900/60 leading-relaxed text-xs text-zinc-400 mb-4">
                        <div className="font-bold text-white mb-1 uppercase tracking-wide text-[10px]">নির্বাচিত কোর্স:</div>
                        <div className="text-teal-400 font-semibold text-sm mb-2">{b.course}</div>
                        {b.notes && (
                          <>
                            <div className="font-bold text-zinc-500 text-[10px] uppercase">জিজ্ঞাসা / নোটস:</div>
                            <p>{b.notes}</p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-zinc-500 uppercase mr-1">কল স্ট্যাটাস পরিবর্তন:</span>
                          <button 
                            onClick={async () => {
                              const res = await onUpdateBookingStatus(b.id, 'called');
                              if (res) showAlert(true, 'Booking status: Called');
                            }}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-semibold text-amber-400 rounded-md border border-zinc-800"
                          >
                            Called (কথা হয়েছে)
                          </button>
                          <button 
                            onClick={async () => {
                              const res = await onUpdateBookingStatus(b.id, 'joined');
                              if (res) showAlert(true, 'Booking status: Joined');
                            }}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-semibold text-emerald-400 rounded-md border border-zinc-800"
                          >
                            Joined (ভর্তি হয়েছে)
                          </button>
                        </div>

                        <button 
                          onClick={async () => {
                            if (confirm('বুকিং ডিলিট করতে চান?')) {
                              const res = await onDeleteBooking(b.id);
                              if (res) showAlert(true, 'Booking deleted successfully');
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-400 bg-zinc-900 rounded border border-zinc-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PURCHASE REQUESTS */}
          {activeTab === 'purchases' && (
            <div>
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-4 mb-6">
                <ShoppingBag className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">প্রিমিয়াম প্যাক ক্রয়ের অনুরোধ</h2>
              </div>

              {/* Status filter pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['all', 'pending', 'payment_waiting', 'paid', 'delivered', 'cancelled'] as const).map((s) => {
                  const count = s === 'all' ? purchaseRequests.length : purchaseRequests.filter(r => r.status === s).length;
                  const colors: Record<string, string> = {
                    all: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    payment_waiting: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    delivered: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
                    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
                  };
                  const labels: Record<string, string> = {
                    all: 'সব',
                    pending: 'Pending',
                    payment_waiting: 'Payment Waiting',
                    paid: 'Paid',
                    delivered: 'Delivered',
                    cancelled: 'Cancelled',
                  };
                  return (
                    <span key={s} className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${colors[s]}`}>
                      {labels[s]} <span className="opacity-70">({count})</span>
                    </span>
                  );
                })}
              </div>

              {purchaseRequests.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-zinc-900 rounded-xl">
                  <ShoppingBag className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">কোনো ক্রয়ের অনুরোধ নেই!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseRequests.map((req) => {
                    const statusColors: Record<string, string> = {
                      pending: 'bg-amber-400 text-zinc-950 animate-pulse',
                      payment_waiting: 'bg-sky-400 text-zinc-950',
                      paid: 'bg-emerald-500/20 text-emerald-400',
                      delivered: 'bg-teal-500/20 text-teal-400',
                      cancelled: 'bg-red-500/20 text-red-400',
                    };
                    const statusLabels: Record<string, string> = {
                      pending: 'Pending',
                      payment_waiting: 'Payment Waiting',
                      paid: 'Paid ✓',
                      delivered: 'Delivered ✓',
                      cancelled: 'Cancelled',
                    };
                    return (
                      <div key={req.id} className={`rounded-xl border p-5 shadow-lg ${
                        req.status === 'pending' ? 'bg-zinc-900/40 border-amber-500/20' :
                        req.status === 'payment_waiting' ? 'bg-zinc-900/40 border-sky-500/20' :
                        req.status === 'paid' ? 'bg-zinc-900/20 border-emerald-500/20' :
                        req.status === 'delivered' ? 'bg-zinc-900/10 border-teal-500/20' :
                        'bg-zinc-950/10 border-zinc-900'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{req.name}</h4>
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[req.status] || 'bg-zinc-800 text-zinc-400'}`}>
                                {statusLabels[req.status] || req.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500">{req.email}</p>
                            <p className="text-[11px] text-teal-400 font-bold font-mono">📱 {req.phone}</p>
                            <p className="text-[11px] text-zinc-500">🌍 {req.country} • {new Date(req.createdAt).toLocaleString('bn-BD')}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[10px] text-zinc-500 uppercase">Pack</p>
                            <p className="text-xs font-bold text-white">{req.packName}</p>
                            <p className="text-lg font-black text-teal-400 mt-0.5">৳{req.packPrice}</p>
                          </div>
                        </div>

                        {req.notes && (
                          <div className="bg-zinc-950/50 border border-zinc-900 rounded-lg p-3 text-xs text-zinc-400 mb-4">
                            <span className="text-zinc-600 font-semibold uppercase text-[10px]">Notes: </span>{req.notes}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-900/60 pt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {req.status === 'pending' && (
                              <button
                                onClick={async () => {
                                  const res = await onUpdatePurchaseStatus(req.id, 'payment_waiting');
                                  if (res) showAlert(true, 'Status: Payment Waiting — WhatsApp-এ payment details পাঠান।');
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20"
                              >
                                📤 Payment Details পাঠানো হয়েছে
                              </button>
                            )}
                            {(req.status === 'pending' || req.status === 'payment_waiting') && (
                              <button
                                onClick={async () => {
                                  const res = await onUpdatePurchaseStatus(req.id, 'paid');
                                  if (res) showAlert(true, 'Status: Paid ✓ — এখন delivery দিন।');
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              >
                                ✅ Paid হয়েছে
                              </button>
                            )}
                            {req.status === 'paid' && (
                              <button
                                onClick={async () => {
                                  const res = await onUpdatePurchaseStatus(req.id, 'delivered');
                                  if (res) showAlert(true, 'Status: Delivered ✓ — সম্পূর্ণ হয়েছে!');
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20"
                              >
                                📦 Delivered হয়েছে
                              </button>
                            )}
                            {req.status !== 'delivered' && req.status !== 'cancelled' && (
                              <button
                                onClick={async () => {
                                  if (confirm('Cancel করতে চান?')) {
                                    const res = await onUpdatePurchaseStatus(req.id, 'cancelled');
                                    if (res) showAlert(true, 'Request cancelled.');
                                  }
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-red-400"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm('Delete করতে চান?')) {
                                const res = await onDeletePurchaseRequest(req.id);
                                if (res) showAlert(true, 'Purchase request deleted.');
                              }
                            }}
                            className="p-1 rounded text-red-500 hover:text-red-400 bg-zinc-900 border border-zinc-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
