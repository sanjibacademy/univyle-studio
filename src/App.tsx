"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Key, AlertCircle, RefreshCw, Sparkles, Copyright, X } from 'lucide-react';
import { AppData, AIPrompt, BlogPost, Lead, Booking, SiteSettings, PortfolioItem, ServiceCategory, AIServiceType, PurchaseRequest, PurchaseStatus } from '@/types';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromptCard from '@/components/PromptCard';
import PromptDetail from '@/components/PromptDetail';
import PortfolioSection from '@/components/PortfolioSection';
import CoursesSection from '@/components/CoursesSection';
import BlogSection from '@/components/BlogSection';
import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import AdminDashboard from '@/components/AdminDashboard';
import PremiumPacksSection from '@/components/PremiumPacksSection';
import { useLanguage } from '@/context/LanguageContext';

export default function App() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<AppData | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('prompts');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AIServiceType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Load App Data from Full-stack API on Mount
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('API server failed to respond');
      const json = await res.json();
      setData(json);
      
      // Auto-unlock admin panel in local development or if token exists
      const token = localStorage.getItem('univyle_admin_token');
      if (token === 'univyle-admin-secure-token-2026') {
        setIsAdminLoggedIn(true);
      }
    } catch (err) {
      console.error('Error fetching backend data', err);
      setError('server_error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Check query params for deep-linking (SEO & sharing)
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('promptId');
    const bId = params.get('blogId');
    const isAdminTrigger = params.get('admin') === 'true' || params.get('portal') === 'admin' || params.get('login') === 'admin';

    if (pId) {
      setCurrentTab('prompts');
      setSelectedPromptId(pId);
    } else if (bId) {
      setCurrentTab('blog');
    }

    if (isAdminTrigger) {
      setAdminModalOpen(true);
      // Clean up the URL to hide the custom entry point from the address bar
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('admin');
      newUrl.searchParams.delete('portal');
      newUrl.searchParams.delete('login');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

  // Clear selected prompt details when leaving the prompts tab
  useEffect(() => {
    if (currentTab !== 'prompts') {
      setSelectedPromptId(null);
    }
  }, [currentTab]);

  // Admin login actions
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordInput })
      });
      const json = await res.json();
      if (json.success) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('univyle_admin_token', json.token);
        setAdminModalOpen(false);
        setAdminPasswordInput('');
        setCurrentTab('admin');
      } else {
        setAdminLoginError(json.message);
      }
    } catch (err) {
      setAdminLoginError('login_failed');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('univyle_admin_token');
    if (currentTab === 'admin') {
      setCurrentTab('prompts');
    }
  };

  // -------------------------------------------------------------
  // Data modification triggers (All calling the Express APIs)
  // -------------------------------------------------------------

  // Copy Increment
  const handleCopyPrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}/copy`, { method: 'POST' });
      const json = await res.json();
      if (json.success && data) {
        // Optimistically update metrics locally
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            prompts: prev.prompts.map(p => p.id === id ? { ...p, copyCount: json.copyCount } : p),
            stats: {
              ...prev.stats,
              totalCopies: prev.stats.totalCopies + 1,
              adRevenue: json.adRevenue
            }
          };
        });
      }
    } catch (err) {
      console.error('Error recording copy', err);
    }
  };

  // Like Increment
  const handleLikePrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}/like`, { method: 'POST' });
      const json = await res.json();
      if (json.success && data) {
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            prompts: prev.prompts.map(p => p.id === id ? { ...p, likes: json.likes } : p)
          };
        });
      }
    } catch (err) {
      console.error('Error liking prompt', err);
    }
  };

  // Submit Contact Lead (Freelance)
  const handleSubmitLead = async (lead: { name: string; email: string; service: ServiceCategory; message: string }) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      const json = await res.json();
      if (json.success) {
        // Reload fresh server data
        await fetchData();
        return { success: true, message: json.message };
      }
      return { success: false, message: json.message };
    } catch (err) {
      return { success: false, message: 'সার্ভার ইনপুট গ্রহণে ব্যর্থ হয়েছে।' };
    }
  };

  // Submit Course Call Booking
  const handleSubmitBooking = async (booking: { name: string; email: string; phone: string; course: string; preferredTime: string; notes?: string }) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      const json = await res.json();
      if (json.success) {
        await fetchData();
        return { success: true, message: json.message };
      }
      return { success: false, message: json.message };
    } catch (err) {
      return { success: false, message: 'বুকিং কলব্যাক রিকোয়েস্ট ব্যর্থ হয়েছে।' };
    }
  };

  // Update Lead Status (Admin only)
  const handleUpdateLeadStatus = async (id: string, status: 'new' | 'contacted' | 'completed') => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Update Booking Status (Admin only)
  const handleUpdateBookingStatus = async (id: string, status: 'new' | 'called' | 'joined') => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Update Settings (Admin only)
  const handleUpdateSettings = async (updatedSettings: SiteSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Add Prompt (Admin only)
  const handleAddPrompt = async (prompt: Omit<AIPrompt, 'id' | 'createdAt' | 'likes' | 'copyCount'>) => {
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Update Prompt (Admin only)
  const handleUpdatePrompt = async (id: string, prompt: Partial<AIPrompt>) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Delete Prompt
  const handleDeletePrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Add Blog (Admin only)
  const handleAddBlog = async (blog: Omit<BlogPost, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Add Portfolio Item
  const handleAddPortfolio = async (item: Omit<PortfolioItem, 'id'>) => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Submit Purchase Request
  const handleSubmitPurchase = async (req: Omit<PurchaseRequest, 'id' | 'createdAt' | 'status' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      const json = await res.json();
      if (json.success) {
        await fetchData();
        return { success: true, message: json.message };
      }
      return { success: false, message: json.message };
    } catch {
      return { success: false, message: 'অনুরোধ পাঠাতে সমস্যা হয়েছে।' };
    }
  };

  // Update Purchase Status (Admin)
  const handleUpdatePurchaseStatus = async (id: string, status: PurchaseStatus, paymentMethod?: string, paymentNote?: string) => {
    try {
      const res = await fetch(`/api/purchases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentMethod, paymentNote })
      });
      if (res.ok) { await fetchData(); return true; }
      return false;
    } catch { return false; }
  };

  // Delete Purchase Request (Admin)
  const handleDeletePurchaseRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
      if (res.ok) { await fetchData(); return true; }
      return false;
    } catch { return false; }
  };

  // Filter Logic for Prompts Section
  const getFilteredPrompts = () => {
    if (!data) return [];
    return data.prompts.filter((p) => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || p.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  };

  const getPromptCategories = () => {
    if (!data) return [];
    const cats = data.prompts.map(p => p.category);
    return Array.from(new Set(cats)) as string[];
  };

  // Render Loader or Errors
  if (loading && !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white font-sans">
        <RefreshCw className="h-8 w-8 animate-spin text-teal-400 mb-4" />
        <p className="text-sm font-medium text-zinc-400">{t('loading')}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('connection_error')}</h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6">{error ? t(error) : (language === 'bn' ? 'ডাটাবেস কানেকশন পাওয়া যায়নি।' : 'Database connection not found.')}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-teal-400 hover:text-teal-300 rounded-lg text-xs font-semibold transition-all"
        >
          {t('try_again')}
        </button>
      </div>
    );
  }

  const selectedPrompt = data?.prompts.find(p => p.id === selectedPromptId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-teal-500/25 selection:text-teal-300">
      
      {/* Navbar header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleAdminLogout}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        notificationAlert={data.settings.notificationAlert}
      />

      {/* Main Container */}
      <main className="pb-20">
        
        {/* TAB: PROMPTS */}
        {currentTab === 'prompts' && (
          selectedPrompt ? (
            <PromptDetail
              prompt={selectedPrompt}
              allPrompts={data.prompts}
              onBack={() => {
                setSelectedPromptId(null);
                window.history.pushState({}, '', window.location.origin);
              }}
              onCopy={handleCopyPrompt}
              onLike={handleLikePrompt}
              onSelectPrompt={(id) => {
                setSelectedPromptId(id);
                const url = new URL(window.location.href);
                url.searchParams.set('promptId', id);
                window.history.pushState({}, '', url.toString());
              }}
            />
          ) : (
            <div>
              <Hero
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={getPromptCategories()}
                stats={{
                  totalPrompts: data.prompts.length,
                  totalCopies: data.stats.totalCopies,
                  simulatedViews: data.stats.simulatedViews
                }}
                heroTitle={data.settings.heroTitle}
                heroSubtitle={data.settings.heroSubtitle}
              />

              {/* Google AdSense Area */}
              <AdSensePlaceholder
                enabled={data.settings.adSenseEnabled}
                adsText={data.settings.adsText}
                simulatedRevenue={data.stats.adRevenue}
              />

              {/* Prompts Showcase Grid */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-5 mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{t('trending_prompts')}</h2>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-1">{t('trending_sub')}</p>
                  </div>
                </div>

                {getFilteredPrompts().length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-zinc-900 rounded-2xl">
                    <p className="text-sm text-zinc-500">{t('no_prompts_match')}</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setSelectedType('all'); setSelectedCategory('all'); }}
                      className="mt-4 text-xs font-semibold text-teal-400 hover:text-teal-300"
                    >
                      {t('reset_all')}
                    </button>
                  </div>
                ) : (
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full">
                    {getFilteredPrompts().map((p) => (
                      <div key={p.id} className="break-inside-avoid mb-6">
                        <PromptCard
                          prompt={p}
                          onCopy={handleCopyPrompt}
                          onLike={handleLikePrompt}
                          onViewDetails={(id) => {
                            setSelectedPromptId(id);
                            const url = new URL(window.location.href);
                            url.searchParams.set('promptId', id);
                            window.history.pushState({}, '', url.toString());
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )
        )}


        {/* TAB: PREMIUM PACKS */}
        {currentTab === 'packs' && (
          <div>
            <AdSensePlaceholder
              enabled={data.settings.adSenseEnabled}
              adsText={data.settings.adsText}
              simulatedRevenue={data.stats.adRevenue}
            />
            <PremiumPacksSection
              packs={data.premiumPacks || []}
              onSubmitPurchase={handleSubmitPurchase}
            />
          </div>
        )}

        {/* TAB: PORTFOLIO & FREELANCE PORTFOLIO */}
        {currentTab === 'portfolio' && (
          <div>
            {/* Google AdSense Placement */}
            <AdSensePlaceholder
              enabled={data.settings.adSenseEnabled}
              adsText={data.settings.adsText}
              simulatedRevenue={data.stats.adRevenue}
            />

            <PortfolioSection
              portfolio={data.portfolio}
              testimonials={data.testimonials}
              profileBio={data.settings.profileBio}
              hourlyRate={data.settings.profileHourlyRate}
              availability={data.settings.profileAvailability}
              onSubmitLead={handleSubmitLead}
            />
          </div>
        )}

        {/* TAB: ACADEMY COURSES */}
        {currentTab === 'courses' && (
          <div>
            <CoursesSection
              courses={data.courses}
              onSubmitBooking={handleSubmitBooking}
            />
          </div>
        )}

        {/* TAB: BLOG UPDATES */}
        {currentTab === 'blog' && (
          <div>
            {/* Ad placement */}
            <AdSensePlaceholder
              enabled={data.settings.adSenseEnabled}
              adsText={data.settings.adsText}
              simulatedRevenue={data.stats.adRevenue}
            />

            <BlogSection
              blogs={data.blogs}
            />
          </div>
        )}

        {/* TAB: ADMIN PANELS (Access restricted) */}
        {currentTab === 'admin' && isAdminLoggedIn && (
          <AdminDashboard
            prompts={data.prompts}
            blogs={data.blogs}
            leads={data.leads}
            bookings={data.bookings}
            settings={data.settings}
            portfolio={data.portfolio}
            stats={data.stats}
            onAddPrompt={handleAddPrompt}
            onUpdatePrompt={handleUpdatePrompt}
            onDeletePrompt={handleDeletePrompt}
            onAddBlog={handleAddBlog}
            onDeleteBlog={handleDeleteBlog}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onDeleteLead={handleDeleteLead}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onUpdateSettings={handleUpdateSettings}
            onAddPortfolio={handleAddPortfolio}
            onDeletePortfolio={handleDeletePortfolio}
            purchaseRequests={data.purchaseRequests || []}
            premiumPacks={data.premiumPacks || []}
            onUpdatePurchaseStatus={handleUpdatePurchaseStatus}
            onDeletePurchaseRequest={handleDeletePurchaseRequest}
          />
        )}

      </main>

      {/* Footer Design */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <svg 
              viewBox="0 0 100 100" 
              className="h-7 w-7 drop-shadow-[0_0_6px_rgba(20,241,149,0.3)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGradFoot" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path d="M30 25 V55 C30 68, 40 75, 50 75 C60 75, 70 68, 70 55 V25" stroke="url(#logoGradFoot)" strokeWidth="8" strokeLinecap="round"/>
              <path d="M42 35 L50 58 L58 35" stroke="#ffffff" strokeWidth="7" strokeLinecap="round"/>
            </svg>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-white">UNIVYLE Studio</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">AI & Design Beyond Limits</span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-zinc-500 flex items-center justify-center md:justify-end gap-1.5">
              <Copyright className="h-3.5 w-3.5" />
              <span>{new Date().getFullYear()} UNIVYLE Studio. All Rights Reserved.</span>
            </p>
            <p className="text-[10px] text-zinc-600 mt-1">Made with premium typography, converting components, and SEO optimizers.</p>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal overlay */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-300" id="login-modal">
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close */}
            <button
              onClick={() => { setAdminModalOpen(false); setAdminLoginError(null); }}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{language === 'bn' ? 'অ্যাডমিন প্রবেশদ্বার' : 'Admin Login'}</h3>
              <p className="text-xs text-zinc-400 mt-1">
                {language === 'bn' ? 'পূর্ণ ডিজাইন পরিবর্তন এবং প্রম্পট এডিট করার জন্য পাসওয়ার্ড টাইপ করুন।' : 'Type your password to manage templates, prompts, and site content.'}
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                  {language === 'bn' ? 'সিক্রেট পাসওয়ার্ড (Default: admin123)' : 'Secret Password (Default: admin123)'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-700 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
                    id="password-input"
                  />
                </div>
              </div>

              {adminLoginError && (
                <div className="flex items-start space-x-2 rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400" id="login-error">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{t(adminLoginError)}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 py-2.5 text-sm font-bold text-zinc-950 shadow-md"
                id="login-btn"
              >
                {language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Login to Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
