export type ViewMode = 
  | 'home'
  | 'services'
  | 'maintenance'
  | 'portfolio'
  | 'emergency-fix'
  | 'about'
  | 'contact';

export type ServiceCategory = 
  | 'All'
  | 'Website Development'
  | 'Mobile App Development'
  | 'Website Maintenance'
  | 'Software Troubleshooting'
  | 'Custom Portals & APIs';

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  keyBenefits: string[];
  deliverables: string[];
  technologies: string[];
  deliveryTime: string;
  startingPriceNGN: number;
  startingPriceUSD: number;
  iconName: 'Globe' | 'Smartphone' | 'Wrench' | 'Bug' | 'Server' | 'ShieldCheck' | 'Cpu' | 'Code';
  isPopular?: boolean;
}

export interface MaintenancePlan {
  id: string;
  name: string;
  tagline: string;
  audience: string;
  priceNGN: string;
  priceUSD: string;
  billingCycle: 'monthly' | 'quarterly' | 'annually' | 'per-incident';
  responseTime: string;
  isPopular?: boolean;
  features: string[];
  deliverablesSummary: string;
  bestFor: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  client: string;
  clientType: 'Enterprise' | 'Startup' | 'Academic / ESUT Community' | 'SME' | 'E-Commerce' | 'Healthcare';
  category: 'Website Development' | 'Mobile App Development' | 'Software Rescue & Maintenance' | 'Custom Portal';
  summary: string;
  challenge: string;
  solution: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  location: string;
  rating: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  location: string;
  comment: string;
  serviceReceived: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  category: 'General' | 'Website Development' | 'Mobile Apps' | 'Maintenance & Retainers' | 'Urgent Software Fixes' | 'Payments & Agbani Office';
  question: string;
  answer: string;
}

export interface QuoteRequestFormData {
  fullName: string;
  email: string;
  phone: string;
  companyOrProject: string;
  serviceType: string;
  timeline: string;
  budgetRange: string;
  description: string;
  currentWebsiteOrAppUrl?: string;
  contactMethod: 'Phone Call' | 'WhatsApp' | 'Email';
}

export interface IssueTicketFormData {
  fullName: string;
  email: string;
  phone: string;
  softwareType: 'WordPress Website' | 'Custom Web App (React/Node/PHP)' | 'Mobile App (Android/iOS)' | 'Database / Server' | 'E-Commerce Store' | 'Other';
  urgency: 'Standard (Within 24-48 hrs)' | 'High (Same-Day)' | 'Critical Emergency (Within 2-4 hrs)';
  affectedUrlOrSystem: string;
  errorDescription: string;
  accessAvailable: boolean;
}

