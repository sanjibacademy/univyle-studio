"use client";

import React, { useState } from "react";
import {
  Package,
  Star,
  FileText,
  Layers,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Download,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PremiumPack, PurchaseRequest } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface PremiumPacksSectionProps {
  packs: PremiumPack[];
  onSubmitPurchase: (
    req: Omit<PurchaseRequest, "id" | "createdAt" | "status" | "updatedAt">
  ) => Promise<{ success: boolean; message: string }>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-900 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-white hover:bg-zinc-900/50 transition-colors"
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-teal-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HowItWorksStep({
  step,
  icon: Icon,
  title,
  sub,
}: {
  step: number;
  icon: any;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
        Step {step}
      </span>
      <p className="text-xs font-bold text-white">{title}</p>
      <p className="text-[11px] text-zinc-500">{sub}</p>
    </div>
  );
}

export default function PremiumPacksSection({
  packs,
  onSubmitPurchase,
}: PremiumPacksSectionProps) {
  const { language, t } = useLanguage();
  const [selectedPack, setSelectedPack] = useState<PremiumPack | null>(null);
  const [purchaseFormPack, setPurchaseFormPack] = useState<PremiumPack | null>(
    null
  );

  // Purchase form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCountry("Bangladesh");
    setNotes("");
    setSubmitStatus(null);
  };

  const openPurchaseForm = (pack: PremiumPack) => {
    setPurchaseFormPack(pack);
    setSelectedPack(null);
    resetForm();
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !country) return;
    if (!purchaseFormPack) return;
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await onSubmitPurchase({
        packId: purchaseFormPack.id,
        packName: purchaseFormPack.title,
        packPrice: purchaseFormPack.price,
        currency: purchaseFormPack.currency,
        name,
        email,
        phone,
        country,
        notes,
      });
      setSubmitStatus({ success: res.success, message: res.message });
      if (res.success) resetForm();
    } catch {
      setSubmitStatus({
        success: false,
        message: t("purchase_failed"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const categoryColor: Record<string, string> = {
    Midjourney: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    ChatGPT: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "Stable Diffusion":
      "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  // ──────────────────────────────────────────────────
  // PACK DETAIL VIEW
  // ──────────────────────────────────────────────────
  if (selectedPack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10"
      >
        <button
          onClick={() => setSelectedPack(null)}
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t("back_to_packs")}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: images + FAQ */}
          <div className="lg:col-span-2 space-y-5">
            {/* Cover */}
            <div className="overflow-hidden rounded-2xl border border-zinc-900 shadow-2xl">
              <img
                src={selectedPack.coverImage}
                alt={selectedPack.title}
                className="w-full h-56 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Preview grid */}
            {selectedPack.previewImages.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  {t("preview_images_title")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPack.previewImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-zinc-900"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                {
                  label: t("total_prompts_count"),
                  value: selectedPack.totalPrompts,
                },
                { label: t("pages_count"), value: selectedPack.pages },
                { label: t("format_label"), value: selectedPack.format },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2"
                >
                  <div className="font-mono text-sm font-bold text-teal-400">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: detail + highlights + FAQ + CTA */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              {selectedPack.isFeatured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-0.5 mb-3">
                  <Star className="h-3 w-3 fill-current" />
                  {t("featured_badge")}
                </span>
              )}
              <span
                className={`ml-2 inline-flex items-center text-[10px] font-bold uppercase border rounded-full px-2.5 py-0.5 ${
                  categoryColor[selectedPack.category] ||
                  "text-zinc-400 bg-zinc-800 border-zinc-700"
                }`}
              >
                {selectedPack.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight">
                {selectedPack.title}
              </h1>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                {selectedPack.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
                {t("highlights_title")}
              </h3>
              <ul className="space-y-2.5">
                {selectedPack.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price + CTA */}
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500">মূল্য</p>
                <p className="text-3xl font-black text-white">
                  ৳{selectedPack.price}
                  <span className="text-sm font-normal text-zinc-400 ml-1">
                    {selectedPack.currency}
                  </span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  bKash / Nagad / Bank Transfer
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openPurchaseForm(selectedPack)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-black text-sm shadow-lg hover:shadow-emerald-500/20"
              >
                <ShoppingBag className="h-4 w-4" />
                {t("get_this_pack")}
              </motion.button>
            </div>

            {/* FAQ */}
            {selectedPack.faqs.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <HelpCircle className="h-4 w-4 text-teal-400" />
                  {t("faq_title")}
                </h3>
                {selectedPack.faqs.map((faq, i) => (
                  <FAQItem key={i} q={faq.question} a={faq.answer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────
  // PURCHASE REQUEST FORM MODAL
  // ──────────────────────────────────────────────────
  if (purchaseFormPack) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10"
      >
        <button
          onClick={() => {
            setPurchaseFormPack(null);
            setSubmitStatus(null);
          }}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t("back_to_packs")}</span>
        </button>

        {/* How it works */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-5 text-center">
            {t("how_it_works")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <HowItWorksStep
              step={1}
              icon={Send}
              title={t("step_request")}
              sub="নিচের ফর্ম পূরণ করুন"
            />
            <HowItWorksStep
              step={2}
              icon={MessageCircle}
              title={t("step_whatsapp")}
              sub="কয়েক ঘণ্টার মধ্যে"
            />
            <HowItWorksStep
              step={3}
              icon={CreditCard}
              title={t("step_pay")}
              sub="সহজ পেমেন্ট মেথড"
            />
            <HowItWorksStep
              step={4}
              icon={Download}
              title={t("step_deliver")}
              sub="PDF / ZIP পাঠানো হবে"
            />
          </div>
        </div>

        {/* Product summary card */}
        <div className="flex items-center gap-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 mb-6">
          <img
            src={purchaseFormPack.coverImage}
            alt={purchaseFormPack.title}
            className="h-16 w-20 object-cover rounded-xl border border-zinc-800"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              {t("product_name_label")}
            </p>
            <h3 className="text-sm font-bold text-white truncate">
              {purchaseFormPack.title}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-zinc-500">{t("product_price_label")}</p>
            <p className="text-xl font-black text-teal-400">
              ৳{purchaseFormPack.price}
            </p>
          </div>
        </div>

        {/* The Form */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-bold text-white mb-1">
            {t("purchase_form_title")}
          </h2>
          <p className="text-xs text-zinc-400 mb-6">{t("purchase_form_sub")}</p>

          {submitStatus?.success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-10 gap-4"
            >
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === "bn" ? "অনুরোধ পাঠানো হয়েছে!" : "Request Sent!"}
              </h3>
              <p className="text-sm text-zinc-400 max-w-sm">
                {submitStatus.message}
              </p>
              <button
                onClick={() => {
                  setPurchaseFormPack(null);
                  setSubmitStatus(null);
                }}
                className="mt-2 px-5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-teal-400 text-sm font-semibold"
              >
                {language === "bn" ? "আরও প্যাক দেখুন" : "Browse More Packs"}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    {t("full_name")}
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === "bn" ? "আপনার নাম" : "Your name"}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                  />
                </div>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    {t("email_address")}
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    {t("whatsapp_phone")}
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1X XX XXX XXX"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                  />
                </div>
                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    {t("country_label")}
                  </label>
                  <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-teal-500/50 focus:outline-none"
                  >
                    {[
                      "Bangladesh",
                      "India",
                      "Pakistan",
                      "USA",
                      "UK",
                      "Canada",
                      "Australia",
                      "UAE",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  {t("notes_optional")}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === "bn"
                      ? "কোনো বিশেষ প্রশ্ন বা তথ্য থাকলে লিখুন..."
                      : "Any questions or special notes..."
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-none resize-none"
                />
              </div>

              {submitStatus && !submitStatus.success && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-black text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {submitting ? t("submitting") : t("submit_request")}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────
  // PACKS LISTING (default view)
  // ──────────────────────────────────────────────────
  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
      id="premium-packs-section"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-semibold text-teal-400 mb-4">
          <Package className="h-3.5 w-3.5" />
          <span>{t("premium_packs_badge")}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          {t("premium_packs_title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
          {t("premium_packs_sub")}
        </p>
      </div>

      {/* How it works strip */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 mb-10">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 text-center mb-5">
          {t("how_it_works")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <HowItWorksStep
            step={1}
            icon={Send}
            title={t("step_request")}
            sub="ফর্ম পূরণ করুন"
          />
          <HowItWorksStep
            step={2}
            icon={MessageCircle}
            title={t("step_whatsapp")}
            sub="কয়েক ঘণ্টার মধ্যে"
          />
          <HowItWorksStep
            step={3}
            icon={CreditCard}
            title={t("step_pay")}
            sub="bKash / Nagad"
          />
          <HowItWorksStep
            step={4}
            icon={Download}
            title={t("step_deliver")}
            sub="WhatsApp / Email"
          />
        </div>
      </div>

      {/* Packs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map((pack) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{
              y: -6,
              boxShadow: "0 25px 50px -12px rgba(20,241,149,0.1)",
              borderColor: "rgba(20,241,149,0.25)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative group flex flex-col overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 shadow-lg"
            id={`pack-card-${pack.id}`}
          >
            {/* Cover image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={pack.coverImage}
                alt={pack.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {pack.isFeatured && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-amber-400/90 text-zinc-950 px-2 py-0.5 rounded-full">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    {t("featured_badge")}
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold uppercase border rounded-full px-2 py-0.5 ${
                    categoryColor[pack.category] ||
                    "text-zinc-400 bg-zinc-800 border-zinc-700"
                  }`}
                >
                  {pack.category}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors">
                  {pack.title}
                </h3>
                <p className="text-xs text-teal-400 mt-0.5">{pack.tagline}</p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-teal-500" />
                  {pack.totalPrompts} {t("total_prompts_count")}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-zinc-600" />
                  {pack.pages} {t("pages_count")}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3 text-zinc-600" />
                  {pack.format}
                </span>
              </div>

              {/* Top 2 highlights */}
              <ul className="space-y-1.5">
                {pack.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-400">{h}</span>
                  </li>
                ))}
              </ul>

              {/* Price + actions */}
              <div className="mt-auto pt-4 border-t border-zinc-900 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] text-zinc-600">মূল্য</p>
                  <p className="text-xl font-black text-white">
                    ৳{pack.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPack(pack)}
                    className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-semibold hover:text-white hover:border-zinc-700 transition-all flex items-center gap-1"
                  >
                    <span>{t("view_pack_details")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openPurchaseForm(pack)}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 text-xs font-black shadow-md hover:shadow-emerald-500/20 transition-all flex items-center gap-1"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {t("get_this_pack")}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
