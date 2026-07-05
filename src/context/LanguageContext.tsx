"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  // Navigation
  ai_prompts: { en: 'AI Prompts', bn: 'এআই প্রম্পট' },
  hire_me: { en: 'Hire Me', bn: 'হায়ার মি' },
  academy: { en: 'Academy', bn: 'একাডেমি' },
  blog: { en: 'Blog', bn: 'ব্লগ' },
  admin_dashboard: { en: 'Admin Dashboard', bn: 'অ্যাডমিন ড্যাশবোর্ড' },
  logout: { en: 'Logout', bn: 'লগআউট' },
  login: { en: 'Login', bn: 'লগইন' },
  loading: { en: 'UNIVYLE Studio is loading...', bn: 'UNIVYLE Studio লোড হচ্ছে...' },

  // Hero Section
  badge_title: { en: 'Style Beyond Limits: Premium Prompts Platform', bn: 'স্টাইল বিয়ন্ড লিমিটস: প্রিমিয়াম প্রম্পটস প্ল্যাটফর্ম' },
  search_placeholder: { en: "Search ChatGPT or Midjourney prompts (e.g. 'cyberpunk', 'logo', 'copywriter')...", bn: "ChatGPT বা Midjourney ইমেজ প্রম্পট সার্চ করুন (যেমন: 'cyberpunk', 'logo', 'copywriter')..." },
  total_prompts: { en: 'Total Prompts', bn: 'প্রম্পট সংখ্যা' },
  total_copies: { en: 'Total Copies', bn: 'মোট কপি' },
  visitors: { en: 'Total Visitors', bn: 'ভিজিটরস' },
  all_prompts: { en: 'All Prompts', bn: 'সব প্রম্পট' },
  all_categories: { en: 'All Categories', bn: 'সব ক্যাটাগরি' },
  hero_title_val: { en: 'Discover Premium  1 AI Prompts & Freelance Digital Solutions', bn: 'প্রিমিয়াম এআই প্রম্পটস এবং ফ্রিল্যান্স ডিজিটাল সলিউশন' },
  hero_subtitle_val: { en: 'Welcome to UNIVYLE Studio. Your hub for ChatGPT / Midjourney prompts, high-end Graphics, cinematic Video Editing, and Full-Stack Web Development.', bn: 'ইউনিভাইল স্টুডিওতে স্বাগতম। ChatGPT/Midjourney প্রম্পট, হাই-এন্ড গ্রাফিক্স, সিনেমাটিক ভিডিও এডিটিং এবং ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্টের ওয়ান-স্টপ হাব।' },
  notification_alert_val: { en: '🔥 SPECIAL OFFER: Register for any UNIVYLE course today and get a 20% discount. Book a callback call now!', bn: '🔥 বিশেষ অফার: যেকোনো কোর্সে আজই ভর্তি হয়ে আকর্ষণীয় ডিসকাউন্ট পান। এখনই ফ্রি পরামর্শ কল বুক করুন!' },

  // Prompts Section
  trending_prompts: { en: 'Trending & Effective AI Prompts', bn: 'গরম ও কার্যকারী এআই প্রম্পটস' },
  trending_sub: { en: 'The most popular, highly actionable copy-paste prompt collection.', bn: 'সবচেয়ে জনপ্রিয় এবং কপি করার উপযোগী চমৎকার কালেকশন' },
  no_prompts_match: { en: 'No prompts match your search query!', bn: 'আপনার সার্চ করা কিওয়ার্ডের সাথে কোনো প্রম্পট মিলছে না!' },
  reset_all: { en: 'Reset all filters', bn: 'সব প্রম্পট ফিরে আনুন' },
  copy_prompt: { en: 'Copy Prompt', bn: 'কপি প্রম্পট' },
  copied: { en: 'Copied!', bn: 'কপি হয়েছে!' },
  view_details: { en: 'View Details', bn: 'বিস্তারিত দেখুন' },
  like: { en: 'Like', bn: 'পছন্দ' },
  top_highlight: { en: 'Top Highlight', bn: 'টপ প্রম্পট' },

  // Detail Prompts
  back_to_prompts: { en: 'Back to all prompts', bn: 'সব প্রম্পটে ফিরে যান' },
  prompt_copied: { en: 'Prompt copied successfully to clipboard!', bn: 'প্রম্পট ক্লিপবোর্ডে কপি করা হয়েছে!' },
  related_prompts: { en: 'Related AI Prompts', bn: 'সম্পর্কিত এআই প্রম্পট' },

  // Portfolio Section
  lead_creator: { en: 'UNIVYLE Lead Creator', bn: 'UNIVYLE লিড ক্রিয়েটর' },
  open_for_projects: { en: 'Open for Projects', bn: 'প্রজেক্টের জন্য এভেইলবল' },
  developer_role: { en: 'Full-Stack Developer • Graphic Designer • Motion Artist', bn: 'ফুল-স্ট্যাক ডেভেলপার • গ্রাফিক ডিজাইনার • মোশন আর্টিস্ট' },
  bio: {
    en: 'I am Sanjib Sarkar, the founder of UNIVYLE. We believe that coding or beautiful graphics alone is not enough—a successful project requires proper strategy, flawless design, and a high-quality user experience. In every project, we prioritize achieving our client\'s business objectives with elegant design and robust development.',
    bn: 'আমি সঞ্জীব সরকার, UNIVYLE-এর প্রতিষ্ঠাতা। আমরা বিশ্বাস করি শুধু কোডিং বা সুন্দর গ্রাফিক্সই যথেষ্ঠ নয়—একটি সফল প্রজেক্টের জন্য প্রয়োজন সঠিক স্ট্র্যাটেজি, নিখুঁত ডিজাইন এবং উচ্চ-মানের ইউজার এক্সপেরিয়েন্স। প্রতিটি প্রোজেক্টে আমরা ক্লায়েন্টের ব্যবসার লক্ষ্য অর্জনকে সর্বোচ্চ প্রাধান্য দিয়ে ডিজাইন ও কোডিং করে থাকি।'
  },
  client_commitment: { en: 'Client Commitment', bn: 'ক্লায়েন্টের প্রতি অঙ্গীকার' },
  connect_linkedin: { en: 'Connect on LinkedIn', bn: 'লিঙ্কডইন কানেক্ট করুন' },
  approach_title: { en: 'Our Approach & Methodology (Our Client-First Approach)', bn: 'আমাদের কাজের পদ্ধতি ও নিখুঁত দৃষ্টিভঙ্গি (Our Client-First Approach)' },
  approach_sub: { en: 'A digital project is only successful when the strategy and art behind it are flawless. We deliver exceptional results with unique planning and modern code.', bn: 'একটি ডিজিটাল প্রজেক্ট তখনই সফল হয় যখন তার পেছনের স্ট্র্যাটেজি এবং আর্ট নিখুঁত হয়। আমরা সম্পূর্ণ ইউনিক পরিকল্পনা ও আধুনিক কোড দিয়ে কাজ শেষ করি।' },
  approach_1_title: { en: '1. Deep Audit & Discovery', bn: '১. গভীর আলোচনা ও রিসার্চ (Deep Audit & Discovery)' },
  approach_1_desc: { en: 'We analyze your audience, study competitors, and document technical requirements to lay a solid plan before starting.', bn: 'কাজ শুরুর পূর্বে আপনার লক্ষ্য, অডিয়েন্স ও প্রতিযোগী ব্র্যান্ডের চমৎকার অ্যানালাইসিস করে আমরা একদম ইউনিক স্ট্র্যাটেজি ডিজাইন করি।' },
  approach_2_title: { en: '2. Interactive Prototypes', bn: '২. ফাস্ট প্রোটোটাইপিং ও আর্টওয়ার্ক (Interactive Prototypes)' },
  approach_2_desc: { en: 'We design high-fidelity interactive visual layouts and wireframes, getting early client feedback and approval.', bn: 'ডিজাইনের সঠিক ভিজ্যুয়াল আর্ট এবং ইউজার ইন্টারফেস (UI/UX) তৈরি করে ফিডব্যাক নেওয়া হয় যাতে নিখুঁত আর্ট নিশ্চিত করা যায়।' },
  approach_3_title: { en: '3. Production-Ready Code', bn: '৩. প্রিমিয়াম কোডিং ও টেস্টিং (Production-Ready Code)' },
  approach_3_desc: { en: 'We implement lightweight, blazing-fast responsive designs using modern tech stacks like React, Vite, and tailwind.', bn: 'আধুনিক রিঅ্যাক্ট, টাইপস্ক্রিপ্ট ও ফাস্ট কোডিং ফ্রেমওয়ার্ক দিয়ে সম্পূর্ণ বাগমুক্ত এবং সুপার-ফাস্ট রসপন্সিভ ওয়েবসাইট তৈরি করি।' },
  approach_4_title: { en: '4. Handoff & Support', bn: '৪. লাইভ লঞ্চ ও মেন্টেনেন্স (Handoff & Support)' },
  approach_4_desc: { en: 'We launch on reliable cloud hostings, configure SEO indexing, and provide clear guides alongside lifelong technical support.', bn: 'সার্ভার ডেপ্লয়মেন্ট, মেইন ডোমেইনে কানেক্ট এবং সঠিক এসইও ইনডেক্সিং করার সাথে সম্পূর্ণ গাইডলাইন এবং ফ্রি মেইনটেন্যান্স দেওয়া হয়।' },
  all_projects: { en: 'All Projects', bn: 'সব প্রজেক্ট' },
  graphics_design_tab: { en: 'Graphics Design', bn: 'গ্রাফিক্স ডিজাইন' },
  video_editing_tab: { en: 'Video Editing', bn: 'ভিডিও এডিটিং' },
  web_dev_tab: { en: 'Web Development', bn: 'ওয়েব ডেভেলপমেন্ট' },
  testimonials_title: { en: 'Client Testimonials', bn: 'ক্লায়েন্টদের বাস্তব অভিজ্ঞতা ও মতামত' },
  testimonials_sub: { en: 'See what our global clients say about Sanjib\'s professional commitment and execution quality.', bn: 'বিশ্বজুড়ে কাজ করা আমাদের কিছু সম্মানিত ক্লায়েন্টদের রিভিউ, যা আমাদের কাজের গুরুত্ব প্রমাণ করে' },
  contact_me: { en: 'Get in Touch', bn: 'সরাসরি যোগাযোগ করুন' },
  contact_me_sub: { en: 'Have an idea or project? Let\'s discuss your objectives. Send a brief message, and I will get back to you shortly.', bn: 'আপনার যেকোনো আইডিয়া বা ব্যবসার সঠিক ডিজিটাল রূপান্তর নিয়ে আমাদের সাথে কথা বলুন। একটি সংক্ষিপ্ত মেসেজ দিন।' },
  your_name: { en: 'Your Name *', bn: 'আপনার নাম *' },
  email_address: { en: 'Email Address *', bn: 'ইমেইল এড্রেস *' },
  select_service: { en: 'Required Service *', bn: 'প্রয়োজনীয় সার্ভিস *' },
  your_message: { en: 'Your Message *', bn: 'বার্তা লিখুন *' },
  send_message: { en: 'Send Message', bn: 'মেসেজ পাঠান' },
  sending: { en: 'Sending...', bn: 'পাঠানো হচ্ছে...' },
  fill_all_fields: { en: 'Please fill in all the required fields.', bn: 'অনুগ্রহ করে সব তথ্য পূরণ করুন।' },
  lead_success: { en: 'Your inquiry has been submitted! I will contact you via email shortly.', bn: 'আপনার মেসেজ সফলভাবে সাবমিট হয়েছে! শীঘ্রই আপনার সাথে ইমেইলে যোগাযোগ করা হবে।' },

  // Academy Section
  academy_badge: { en: 'UNIVYLE ACADEMY', bn: 'ইউনিভাইল একাডেমি' },
  academy_title: { en: 'Upgrade Your Skills & Launch Your Career', bn: 'আপনার দক্ষতা বৃদ্ধি করুন এবং ক্যারিয়ার গড়ুন' },
  academy_sub: { en: 'Our industry-ready courses follow standard structures of Coursera, Udemy, and Google Career Certificates. Book a free advice call to receive structured mentorship.', bn: 'আমাদের ইন্ডাস্ট্রি-রেডি কোর্সগুলো Coursera, Udemy এবং Google Career Certificate-এর মানসম্মত স্ট্রাকচার অনুসরণ করে তৈরি।' },
  duration_pace: { en: 'Duration & Pace', bn: 'সময়সীমা ও গতি' },
  hands_on: { en: 'Hands-on Work', bn: 'বাস্তব প্রজেক্ট' },
  software_to_master: { en: "Software You'll Master", bn: 'সফটওয়্যার যা শিখবেন' },
  career_pathways: { en: 'Career Pathways', bn: 'ক্যারিয়ার ক্ষেত্র' },
  view_curriculum: { en: 'View Curriculum Details', bn: 'সিলেবাস ও ডিটেইলস' },
  book_course: { en: 'Book Course', bn: 'বুক কোর্স' },
  free_advisory_call: { en: 'Book a Free Advisory Call', bn: 'ফ্রি ক্যারিয়ার পরামর্শ কল বুক করুন' },
  free_advisory_sub: { en: 'Enter your details below. Our experienced mentor will call you back to discuss your career objectives and guide you through the syllabus.', bn: 'নিচে আপনার তথ্য দিন। আমাদের অভিজ্ঞ মেন্টর আপনাকে কল করে আপনার ক্যারিয়ার লক্ষ্য এবং সিলেবাস নিয়ে বিস্তারিত আলোচনা করবেন।' },
  whatsapp_number: { en: 'WhatsApp / Phone Number *', bn: 'হোয়াটসঅ্যাপ / মোবাইল নম্বর *' },
  speaking_time: { en: 'Preferred Speaking Time *', bn: 'কথা বলার পছন্দের সময় *' },
  message_optional: { en: 'Your Questions / Message (Optional)', bn: 'আপনার কোনো প্রশ্ন বা বার্তা (ঐচ্ছিক)' },
  request_callback: { en: 'Request Callback', bn: 'কলব্যাক রিকোয়েস্ট করুন' },
  booking_success: { en: 'Your course inquiry has been submitted! Our mentor will call you soon.', bn: 'আপনার কোর্স বুকিং রিকোয়েস্ট সফল হয়েছে! খুব শীঘ্রই আমাদের মেন্টর আপনাকে কল করবেন।' },
  booking_failed: { en: 'Inquiry failed. Please try again later.', bn: 'রিকোয়েস্ট ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।' },

  // Modal Detail Course
  modal_callback_avail: { en: '• Live Advisory Callback Available', bn: '• লাইভ অ্যাডভাইস কলব্যাক সুবিধা রয়েছে' },
  what_you_will_master: { en: "What You'll Master", bn: 'যে সকল মডিউল শিখবেন' },
  course_overview: { en: 'Course Overview', bn: 'কোর্সের সংক্ষিপ্ত বিবরণী' },
  career_opportunities: { en: 'Career Opportunities', bn: 'ক্যারিয়ারের সুযোগসমূহ' },
  cert_title: { en: 'Professional Certificate of Completion', bn: 'প্রফেশনাল কোর্স কমপ্লিশন সার্টিফিকেট' },
  cert_tag: { en: 'Future-Ready', bn: 'ভবিষ্যত-উপযোগী' },
  cert_desc: { en: 'Upon finishing all assignments and successfully submitting your final capstone project, receive a certified credential from UNIVYLE Academy to showcase on your LinkedIn profile and resume.', bn: 'সবগুলো অ্যাসাইনমেন্ট এবং ফাইনাল ক্যাপস্টোন প্রজেক্ট সফলভাবে জমা দেওয়ার পর, আপনার লিঙ্কডইন প্রোফাইল এবং রিজিউমে যুক্ত করার জন্য ইউনিভাইল একাডেমি থেকে প্রফেশনাল সার্টিফিকেট পাবেন।' },
  modal_footer_hint: { en: 'Questions? Book a call. Our career advisor will explain the modules in details.', bn: 'কোনো প্রশ্ন আছে? কল বুক করুন, আমাদের ক্যারিয়ার উপদেষ্টা মডিউলগুলো বুঝিয়ে বলবেন।' },
  close: { en: 'Close', bn: 'বন্ধ করুন' },
  book_free_call: { en: 'Book Free Advisory Call', bn: 'ফ্রি পরামর্শ কল বুক করুন' },

  // Blog Section
  blog_badge: { en: 'UNIVYLE BLOG & INSIGHTS', bn: 'ইউনিভাইল ব্লগ ও ইনসাইটস' },
  blog_title: { en: 'Our Blog & Technical Insights', bn: 'আমাদের ব্লগ ও টেকনিক্যাল আপডেট' },
  blog_sub: { en: 'Read our regular blog posts covering prompt engineering, freelance design, and modern web development strategies to scale your skills.', bn: 'প্রম্পট ইঞ্জিনিয়ারিং, ফ্রিল্যান্স ডিজাইন ও মডার্ন ওয়েব ডেভেলপমেন্টের সেরা কৌশলগুলো নিয়ে আমাদের নিয়মিত ব্লগ পোস্টগুলো পড়ুন।' },
  back_to_articles: { en: 'Back to all blog articles', bn: 'সব ব্লগ আর্টিকেলে ফিরে যান' },
  copied_link: { en: 'Copied', bn: 'কপি হয়েছে' },
  share_article: { en: 'Share Article', bn: 'শেয়ার করুন' },
  read_article: { en: 'Read Article', bn: 'আর্টিকেল পড়ুন' },

  // Admin and Errors
  server_error: { en: 'Connection to the server failed. Please refresh the page.', bn: 'সার্ভারের সাথে যোগাযোগ করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।' },
  login_failed: { en: 'Login failed. Please try again.', bn: 'লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।' },
  server_failed_input: { en: 'The server failed to accept input.', bn: 'সার্ভার ইনপুট গ্রহণে ব্যর্থ হয়েছে।' },
  booking_failed_msg: { en: 'Booking callback request failed.', bn: 'বুকিং কলব্যাক রিকোয়েস্ট ব্যর্থ হয়েছে।' },
  try_again: { en: 'Try Again', bn: 'আবার চেষ্টা করুন' },
  admin_panel_title: { en: 'Admin Dashboard', bn: 'অ্যাডমিন প্যানেল' },
  connection_error: { en: 'Connection Error!', bn: 'সংযোগ ত্রুটি!' },

  // PromptDetail translations
  back_to_prompt_list: { en: 'Back to Prompt List', bn: 'প্রম্পট তালিকায় ফিরে যান' },
  verified_output: { en: 'Verified Generation Output', bn: 'যাচাইকৃত আউটপুট রেজাল্ট' },
  how_to_use_prompt: { en: 'How to use this Prompt?', bn: 'কিভাবে এই প্রম্পটটি ব্যবহার করবেন?' },
  use_step_1: { en: 'First, copy the prompt text below to your clipboard by clicking Copy.', bn: 'প্রথমে নিচের কপি বাটনে ক্লিক করে প্রম্পটটি আপনার ক্লিপবোর্ডে কপি করে নিন।' },
  use_step_2_chat: { en: 'Paste it into ChatGPT and change the placeholder info in brackets to match your requirements.', bn: 'ChatGPT-তে গিয়ে প্রম্পটটি পেস্ট করুন এবং আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী বন্ধনীতে থাকা তথ্য পরিবর্তন করুন।' },
  use_step_2_img: { en: 'Go to Midjourney or Stable Diffusion and paste it inside the /imagine input.', bn: 'Midjourney বা Stable Diffusion বক্সে গিয়ে /imagine বক্সে প্রম্পটটি পেস্ট করুন।' },
  use_step_3: { en: 'Add your own custom creative subjects or backdrop keywords at the end to get customized results.', bn: 'পছন্দসই ফল পেতে প্রম্পটটির পেছনে আপনার নিজস্ব সৃজনশীল সাবজেক্ট ও ব্যাকগ্রাউন্ড কী-ওয়ার্ড যোগ করতে পারেন।' },
  prompt_about: { en: 'Prompt Description', bn: 'প্রম্পট সম্পর্কে বিবরণ' },
  prompt_code_title: { en: 'Core Prompt Code (Prompt Command)', bn: 'মূল প্রম্পট কোড (Prompt Command)' },
  likes_count: { en: 'Likes count', bn: 'পছন্দ সংখ্যা' },
  used_instances: { en: 'Used instances', bn: 'মোট ব্যবহারের সংখ্যা' },
  liked_success: { en: 'Liked', bn: 'পছন্দ করা হয়েছে' },
  like_prompt: { en: 'Like Prompt', bn: 'পছন্দ করুন' },
  shared_success: { en: 'Link Copied!', bn: 'লিংক কপি হয়েছে!' },
  share_friends: { en: 'Share with friends', bn: 'বন্ধুদের সাথে শেয়ার' },
  copied_success: { en: 'Copied Successfully', bn: 'সফলভাবে কপি হয়েছে' },
  copy_prompt_action: { en: 'Copy Prompt', bn: 'প্রম্পট কপি করুন' },
  related_prompts_title: { en: 'Related Prompts', bn: 'সম্পর্কিত আরো কিছু প্রম্পট' },
  related_prompts_sub: { en: 'Other popular and editor choices in the same category', bn: 'এই ক্যাটাগরিতে পাওয়া অন্যান্য জনপ্রিয় ও এডিটর চয়েস প্রম্পটস' },
  // Premium Packs
  premium_packs: { en: 'Premium Packs', bn: 'প্রিমিয়াম প্যাক' },
  premium_packs_badge: { en: 'UNIVYLE PREMIUM', bn: 'ইউনিভাইল প্রিমিয়াম' },
  premium_packs_title: { en: 'Premium AI Prompt Packs', bn: 'প্রিমিয়াম এআই প্রম্পট প্যাক' },
  premium_packs_sub: { en: 'Hand-crafted, tested prompt collections delivered as PDF.', bn: 'হাতে তৈরি প্রম্পট কালেকশন PDF হিসেবে পাবেন।' },
  get_this_pack: { en: 'Get This Pack', bn: 'এই প্যাকটি নিন' },
  view_pack_details: { en: 'View Details', bn: 'বিস্তারিত দেখুন' },
  total_prompts_count: { en: 'Prompts', bn: 'প্রম্পট' },
  pages_count: { en: 'Pages', bn: 'পৃষ্ঠা' },
  format_label: { en: 'Format', bn: 'ফরম্যাট' },
  highlights_title: { en: "What's Included", bn: 'কী কী পাবেন' },
  preview_images_title: { en: 'Preview', bn: 'প্রিভিউ' },
  faq_title: { en: 'Frequently Asked Questions', bn: 'সচরাচর জিজ্ঞাসা' },
  featured_badge: { en: 'Featured', bn: 'ফিচারড' },
  back_to_packs: { en: 'Back to all packs', bn: 'সব প্যাকে ফিরে যান' },
  purchase_form_title: { en: 'Request to Purchase', bn: 'ক্রয়ের অনুরোধ পাঠান' },
  purchase_form_sub: { en: "Fill in your details. We'll contact you via WhatsApp with payment instructions.", bn: 'আপনার তথ্য দিন। WhatsApp-এ payment বিস্তারিত পাঠানো হবে।' },
  full_name: { en: 'Full Name *', bn: 'পূর্ণ নাম *' },
  whatsapp_phone: { en: 'WhatsApp Number *', bn: 'হোয়াটসঅ্যাপ নম্বর *' },
  country_label: { en: 'Country *', bn: 'দেশ *' },
  product_name_label: { en: 'Product', bn: 'পণ্য' },
  product_price_label: { en: 'Price', bn: 'মূল্য' },
  notes_optional: { en: 'Notes (Optional)', bn: 'নোটস (ঐচ্ছিক)' },
  submit_request: { en: 'Send Purchase Request', bn: 'ক্রয়ের অনুরোধ পাঠান' },
  submitting: { en: 'Submitting...', bn: 'পাঠানো হচ্ছে...' },
  purchase_success: { en: 'Request sent! We will contact you on WhatsApp soon.', bn: 'অনুরোধ পাঠানো হয়েছে! শীঘ্রই WhatsApp-এ যোগাযোগ করা হবে।' },
  purchase_failed: { en: 'Request failed. Please try again.', bn: 'অনুরোধ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' },
  how_it_works: { en: 'How It Works', bn: 'কিভাবে কাজ করে' },
  step_request: { en: 'Submit Request', bn: 'অনুরোধ পাঠান' },
  step_whatsapp: { en: 'We Contact You on WhatsApp', bn: 'WhatsApp-এ যোগাযোগ' },
  step_pay: { en: 'Pay via bKash / Nagad', bn: 'bKash / Nagad-এ পেমেন্ট' },
  step_deliver: { en: 'Receive PDF on WhatsApp', bn: 'WhatsApp-এ PDF পান' },
  purchase_requests: { en: 'Purchase Requests', bn: 'ক্রয়ের অনুরোধ' },
  status_pending: { en: 'Pending', bn: 'অপেক্ষারত' },
  status_payment_waiting: { en: 'Payment Waiting', bn: 'পেমেন্ট অপেক্ষায়' },
  status_paid: { en: 'Paid', bn: 'পেমেন্ট হয়েছে' },
  status_delivered: { en: 'Delivered', bn: 'ডেলিভারি হয়েছে' },
  status_cancelled: { en: 'Cancelled', bn: 'বাতিল' },

};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('univyle_lang');
    if (saved) {
      setLanguageState(saved as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('univyle_lang', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
