export type AIServiceType = 'chatgpt' | 'midjourney' | 'stable-diffusion' | 'other';
export type ServiceCategory = 'graphics' | 'video' | 'web' | 'other';
export type PurchaseStatus = 'pending' | 'payment_waiting' | 'paid' | 'delivered' | 'cancelled';

export interface AIPrompt {
  id: string;
  title: string;
  type: AIServiceType;
  category: string;
  promptText: string;
  description: string;
  author: string;
  likes: number;
  copyCount: number;
  createdAt: string;
  featuredImage?: string;
}

// ✅ NEW: Premium Prompt Pack
export interface PremiumPack {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  coverImage: string;
  previewImages: string[];
  totalPrompts: number;
  pages: number;
  format: string;
  category: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
  isFeatured?: boolean;
  isAvailable: boolean;
}

// ✅ NEW: Purchase Request
export interface PurchaseRequest {
  id: string;
  packId: string;
  packName: string;
  packPrice: number;
  currency: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  notes?: string;
  status: PurchaseStatus;
  paymentMethod?: string;
  paymentNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string;
  createdAt: string;
  tags: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  service: ServiceCategory;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  preferredTime: string;
  notes?: string;
  status: 'new' | 'called' | 'joined';
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: ServiceCategory;
  image: string;
  description: string;
  link?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  avatar: string;
  rating: number;
  feedback: string;
  serviceType: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  syllabus: string[];
  price: string;
  category: ServiceCategory | 'other';
  tagline?: string;
  level?: string;
  projectsIncluded?: string;
  softwareMastered?: string[];
  careerOpportunities?: string[];
  overview?: string;
}

export interface SiteSettings {
  adSenseEnabled: boolean;
  adsText: string;
  heroTitle: string;
  heroSubtitle: string;
  notificationAlert: string;
  profileBio: string;
  profileHourlyRate: string;
  profileAvailability: 'Available' | 'Busy' | 'Fully Booked';
}

export interface SiteStats {
  totalPrompts: number;
  totalCopies: number;
  totalLeads: number;
  totalBookings: number;
  totalPurchaseRequests: number;
  simulatedViews: number;
  adRevenue: number;
}

export interface AppData {
  prompts: AIPrompt[];
  blogs: BlogPost[];
  leads: Lead[];
  bookings: Booking[];
  premiumPacks: PremiumPack[];
  purchaseRequests: PurchaseRequest[];
  settings: SiteSettings;
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  courses: Course[];
  stats: SiteStats;
}
