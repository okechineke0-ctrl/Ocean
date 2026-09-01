import { ServiceItem, MaintenancePlan, ProjectCaseStudy, Testimonial, FAQItem } from '../types';

export const COMPANY_INFO = {
  name: 'Ocean Technologies',
  tagline: 'Reliable Website Maintenance, App Development & Software Solutions',
  subtagline: 'Empowering businesses with custom websites, high-performance mobile apps, and 24/7 software troubleshooting.',
  address: 'Agbani, Enugu State, Nigeria (ESUT Corridor, Enugu State University of Science and Technology)',
  city: 'Agbani, Enugu State',
  country: 'Nigeria',
  phone: '09129216768',
  phoneFormatted: '+234 912 921 6768',
  phoneTel: 'tel:09129216768',
  whatsappUrl: 'https://wa.me/2349129216768?text=Hello%20Ocean%20Technologies,%20I%20would%20like%20to%20inquire%20about%20your%20software%20services.',
  email: 'oceantechnologies62@gmail.com',
  emailMailto: 'mailto:oceantechnologies62@gmail.com',
  workingHours: 'Monday – Saturday: 8:00 AM – 7:00 PM (WAT) • 24/7 Emergency Software Hotline',
  emergencyResponseTime: 'Under 2 hours for critical server & bug fixes',
  yearsActive: '5+ Years in Software Engineering',
  projectsCompleted: '120+',
  activeClients: '65+',
  uptimeGuarantee: '99.9% Uptime Support',
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    category: 'Website Development',
    tagline: 'High-speed, responsive, custom-built websites tailored to convert visitors into clients.',
    description: 'We build modern, ultra-responsive corporate websites, e-commerce storefronts, educational portals, and custom web applications. Every website is engineered for speed, mobile responsiveness, search engine optimization (SEO), and conversion.',
    keyBenefits: [
      'Mobile-first responsive design for all smartphone & desktop screens',
      'Built-in Technical SEO & fast page load speeds under 1.5 seconds',
      'Custom admin dashboard for easy content updates',
      'Integrated payment gateways (Paystack, Flutterwave, Stripe, Bank Transfer)',
      'Bank-grade SSL security and protection against malware'
    ],
    deliverables: [
      'Custom UI/UX Wireframes and Visual Prototypes',
      'Full Responsive Frontend & Backend Architecture',
      'Content Management System (CMS) / Custom Portal',
      'Domain Setup, SSL Certificate & Hosting Configuration',
      'Free 30-Day Post-Launch Maintenance & Support'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'WordPress', 'PHP', 'PostgreSQL / MySQL'],
    deliveryTime: '1 to 3 Weeks',
    startingPriceNGN: 150000,
    startingPriceUSD: 120,
    iconName: 'Globe',
    isPopular: true,
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    category: 'Mobile App Development',
    tagline: 'Native and cross-platform mobile apps for iOS and Android that users love.',
    description: 'Turn your idea or business operations into a seamless mobile app. We design, develop, test, and publish iOS and Android applications with intuitive user experience, offline data caching, real-time push notifications, and robust cloud backends.',
    keyBenefits: [
      'Single codebase or native performance for iOS & Android',
      'Secure biometric authentication (Fingerprint / Face ID)',
      'Real-time push notifications & SMS alerts',
      'Offline functionality & instant cloud sync',
      'Google Play Store & Apple App Store submission assistance'
    ],
    deliverables: [
      'Complete Interactive Figma App Prototype',
      'Compiled Production APK & iOS IPA Builds',
      'Secure Cloud API & Database Infrastructure',
      'Admin Web Portal to manage users and orders',
      'App Store & Play Store Publishing Support'
    ],
    technologies: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Firebase', 'REST & GraphQL APIs'],
    deliveryTime: '3 to 6 Weeks',
    startingPriceNGN: 350000,
    startingPriceUSD: 280,
    iconName: 'Smartphone',
    isPopular: true,
  },
  {
    id: 'website-maintenance',
    title: 'Website Maintenance & Retainers',
    category: 'Website Maintenance',
    tagline: 'Keep your website fast, updated, secured against hackers, and 100% bug-free.',
    description: 'Do not let a slow, hacked, or outdated website cost you customers. Our dedicated maintenance engineers handle daily cloud backups, security patching, WordPress plugin updates, database optimization, broken link fixes, and regular content uploads so you can focus on running your business.',
    keyBenefits: [
      '24/7 Automated Uptime & Performance Monitoring',
      'Daily Off-Site Cloud Backups with instant 1-click restore',
      'Core, Theme & Plugin Security Updates without site breakage',
      'Speed optimization & image compression',
      'Monthly technical audit and visitor traffic report'
    ],
    deliverables: [
      'Scheduled Monthly Maintenance Checklist',
      'Emergency Hack & Malware Removal Protocol',
      'Content Updates (Text, Banners, Products & Blog Posts)',
      'Monthly Health & Security Report',
      'Priority WhatsApp Engineering Access'
    ],
    technologies: ['WordPress', 'cPanel / Cloudflare', 'AWS / DigitalOcean', 'PHP', 'Security Firewalls', 'Database Tuning'],
    deliveryTime: 'Ongoing Monthly Service',
    startingPriceNGN: 35000,
    startingPriceUSD: 30,
    iconName: 'Wrench',
    isPopular: true,
  },
  {
    id: 'software-issue-troubleshooting',
    title: 'Software Issue Troubleshooting & Bug Fixes',
    category: 'Software Troubleshooting',
    tagline: 'Fast diagnostic and permanent resolution for crashing apps, broken websites, and database errors.',
    description: 'Experiencing a broken checkout, database connection failure, white screen of death, or buggy mobile app? Our senior software engineers diagnose the root cause and apply permanent code and server fixes quickly to get your business back online.',
    keyBenefits: [
      'Rapid emergency diagnostic within 2 hours',
      'Fix for broken payment integrations (Paystack, Flutterwave, Stripe)',
      'Database repair, data recovery, and SQL query optimization',
      'Resolving 500 Internal Server Errors, 404s, and memory limits',
      'Legacy code refactoring and bug patching'
    ],
    deliverables: [
      'Root-Cause Diagnostic Report',
      'Permanent Codebase Fix & Verification Testing',
      'Database Optimization & Cleanup',
      'Security Hardening to prevent recurring issues',
      '7-Day Post-Fix Warranty'
    ],
    technologies: ['PHP', 'Node.js', 'Python', 'MySQL / PostgreSQL', 'React / Vue', 'Apache / Nginx / Linux'],
    deliveryTime: '2 to 24 Hours',
    startingPriceNGN: 25000,
    startingPriceUSD: 20,
    iconName: 'Bug',
    isPopular: false,
  },
  {
    id: 'custom-portals-apis',
    title: 'Custom Portals & System Integrations',
    category: 'Custom Portals & APIs',
    tagline: 'Tailored management portals, school systems, and automated API bridges.',
    description: 'We develop custom Enterprise Resource Planning (ERP), School Management Systems, Student Portals, Hospital Records Systems, Inventory Management, and bespoke API integrations connecting your third-party tools seamlessly.',
    keyBenefits: [
      'Role-based access control (Admin, Staff, Student, Customer)',
      'Automated PDF invoice and report generation',
      'Integration with SMS gateways and email automation',
      'Secure data encryption and automated audit logs',
      'Custom dashboard with actionable business analytics'
    ],
    deliverables: [
      'Custom Database Schema & Data Modeling',
      'Protected User Management & Role Hierarchy',
      'Automated Business Workflows & Data Export',
      'Staff Training & Video Walkthrough Manuals',
      'Scalable Cloud Architecture'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Express', 'Redis', 'Docker'],
    deliveryTime: '4 to 8 Weeks',
    startingPriceNGN: 450000,
    startingPriceUSD: 360,
    iconName: 'Server',
    isPopular: false,
  }
];

export const MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    id: 'starter-care',
    name: 'Starter Care Plan',
    tagline: 'Essential security, updates, and backups for small business websites.',
    audience: 'Best for local businesses, portfolios, and blogs in Enugu and across Nigeria.',
    priceNGN: '₦25,000 / month',
    priceUSD: '$20 / month',
    billingCycle: 'monthly',
    responseTime: 'Within 24 Hours',
    features: [
      'Weekly automated cloud backups',
      'WordPress / CMS core & plugin security updates',
      'Uptime monitoring (Checks every 10 minutes)',
      'Malware & spam protection scan',
      'Up to 2 minor content updates per month',
      'WhatsApp & Email support'
    ],
    deliverablesSummary: 'Peace of mind knowing your website is secure, backed up, and running smoothly.',
    bestFor: 'Informational websites, school club sites, portfolios, small clinic websites'
  },
  {
    id: 'business-growth',
    name: 'Business Pro Retainer',
    tagline: 'Comprehensive maintenance, speed tuning, and on-demand developer hours.',
    audience: 'Best for active businesses, e-commerce stores, and corporate portals.',
    priceNGN: '₦55,000 / month',
    priceUSD: '$45 / month',
    billingCycle: 'monthly',
    responseTime: 'Within 6 Hours',
    isPopular: true,
    features: [
      'Daily cloud backups with 1-click disaster recovery',
      'Continuous 24/7 server & uptime monitoring',
      'Monthly speed & database performance optimization',
      'Up to 6 content updates / product uploads per month',
      'Payment gateway checks (Paystack/Flutterwave)',
      'Priority WhatsApp hotline to lead engineer',
      'Monthly technical health & analytics report'
    ],
    deliverablesSummary: 'Proactive engineering care ensuring zero downtime and rapid updates.',
    bestFor: 'E-Commerce stores, busy corporate sites, real estate portals, service providers'
  },
  {
    id: 'enterprise-sla',
    name: 'Enterprise & Full System SLA',
    tagline: 'Dedicated engineering support for mission-critical web apps and mobile backends.',
    audience: 'Best for fintech apps, educational institutions (ESUT community), and portals.',
    priceNGN: '₦120,000 / month',
    priceUSD: '$95 / month',
    billingCycle: 'monthly',
    responseTime: 'Within 1 to 2 Hours (24/7 SLA)',
    features: [
      'Real-time automated backups and server replication',
      'Dedicated software engineer assigned to your system',
      'Unlimited bug fixes & emergency troubleshooting',
      'Mobile app API & database maintenance',
      'Security audit & penetration testing prevention',
      'Direct phone & WhatsApp emergency escalation',
      'Custom feature additions (Up to 10 dev hours/mo)'
    ],
    deliverablesSummary: 'Complete IT & software department outsourced to Ocean Technologies experts.',
    bestFor: 'Mobile apps, multi-vendor marketplaces, institutions, high-traffic portals'
  },
  {
    id: 'one-time-rescue',
    name: 'Emergency One-Off Bug Fix',
    tagline: 'Fast emergency repair for broken websites, crashing software, or hacked systems.',
    audience: 'Pay-as-you-need emergency assistance without recurring commitments.',
    priceNGN: 'From ₦20,000 (One-Off)',
    priceUSD: 'From $18 (One-Off)',
    billingCycle: 'per-incident',
    responseTime: 'Under 2 Hours Immediate Triage',
    features: [
      'Immediate code & database diagnostic inspection',
      'Malware cleaning & website un-blacklisting',
      'Fixing White Screen of Death / PHP Fatal Errors',
      'Restoring broken payment forms & checkouts',
      'Fixing broken mobile app API endpoints',
      '7-day post-fix guarantee'
    ],
    deliverablesSummary: 'Swift resolution of critical errors to prevent revenue loss.',
    bestFor: 'Anyone with an urgent website or app breakdown needing immediate help'
  }
];

export const CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: 'esut-student-hub',
    title: 'Agbani Campus Student Service & Housing Portal',
    client: 'CampusLink Agbani',
    clientType: 'Academic / ESUT Community',
    category: 'Website Development',
    summary: 'A fast, mobile-optimized directory and booking portal for students and businesses around Agbani & ESUT.',
    challenge: 'Students faced difficulty discovering verified student accommodation, laundry services, and campus tech hubs in Agbani.',
    solution: 'Designed and engineered a high-speed Progressive Web App with WhatsApp direct ordering, search filtering, and landlord verification.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Paystack API'],
    metrics: [
      { label: 'Active Users', value: '4,500+' },
      { label: 'Page Load Speed', value: '0.8s' },
      { label: 'Monthly Inquiries', value: '1,200+' }
    ],
    location: 'Agbani, Enugu State',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
    mockupType: 'browser'
  },
  {
    id: 'enugu-agro-logistics',
    title: 'Enugu Fresh Agro Mobile & Web Logistics Platform',
    client: 'Eastern Agro Solutions',
    clientType: 'Enterprise',
    category: 'Mobile App Development',
    summary: 'Cross-platform mobile application connecting farmers across Enugu State with urban distributors and stores.',
    challenge: 'Inefficient ordering through manual calls and delayed dispatches causing produce spoilage.',
    solution: 'Built a robust mobile app (Android & iOS) with real-time inventory tracking, driver dispatch notifications, and offline order queueing.',
    technologies: ['Flutter', 'Node.js', 'PostgreSQL', 'Google Maps API', 'Firebase'],
    metrics: [
      { label: 'Dispatch Efficiency', value: '+68%' },
      { label: 'Monthly Orders', value: '3,800+' },
      { label: 'App Rating', value: '4.9 ★' }
    ],
    location: 'Enugu State, Nigeria',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
    mockupType: 'mobile'
  },
  {
    id: 'fintech-checkout-rescue',
    title: 'Emergency Bug Fix & Database Recovery for E-Commerce Store',
    client: 'NaijaGadgets Online',
    clientType: 'E-Commerce',
    category: 'Software Rescue & Maintenance',
    summary: 'Diagnosed and repaired a critical database deadlock and broken checkout that was costing ₦800,000+ in lost daily sales.',
    challenge: 'After a plugin upgrade, customers could not checkout and were receiving 500 Server Errors on payment verification.',
    solution: 'Ocean Technologies engineers resolved the SQL deadlock within 90 minutes, cleaned corrupted session tables, and configured Paystack webhook retries.',
    technologies: ['MySQL', 'PHP', 'WordPress / WooCommerce', 'Paystack Webhooks', 'Cloudflare'],
    metrics: [
      { label: 'Resolution Time', value: '85 Mins' },
      { label: 'Sales Recovered', value: '100%' },
      { label: 'Ongoing SLA', value: 'Active' }
    ],
    location: 'Nigeria (Remote Client)',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    mockupType: 'code'
  },
  {
    id: 'healthcare-records-portal',
    title: 'Medical Clinic Patient Records & Appointment Web System',
    client: 'Grace Memorial Specialist Hospital',
    clientType: 'Healthcare',
    category: 'Custom Portal',
    summary: 'A secure cloud portal for managing patient health records, doctor appointment scheduling, and automated SMS reminders.',
    challenge: 'Lost paper cards and long wait times causing patient dissatisfaction and record loss.',
    solution: 'Engineered an intuitive, secure web portal accessible on tablets and computers with automated SMS reminders and PDF medical history exports.',
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Termii SMS API'],
    metrics: [
      { label: 'Wait Time Reduced', value: '-55%' },
      { label: 'Digital Records', value: '12,000+' },
      { label: 'Uptime', value: '99.99%' }
    ],
    location: 'Enugu, Nigeria',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1000&q=80',
    mockupType: 'dashboard'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    clientName: 'Engr. Emeka Okonkwo',
    role: 'Managing Director',
    company: 'Okonkwo Construction & Engineering Ltd',
    location: 'Enugu, Nigeria',
    comment: 'Ocean Technologies transformed our online presence. Our previous website was slow and full of errors. They redesigned everything, optimized it for mobile, and now manage all our website updates smoothly. Highly recommended!',
    serviceReceived: 'Website Development & Monthly Maintenance Retainer',
    rating: 5
  },
  {
    id: '2',
    clientName: 'Chiamaka Nnaji',
    role: 'Founder & CEO',
    company: 'Zuri Essentials Boutique',
    location: 'Agbani / ESUT Campus Area',
    comment: 'When our e-commerce checkout crashed during a major sales weekend, Ocean Technologies answered my call immediately at 09129216768 and resolved the database issue within 2 hours. They saved my business from huge embarrassment.',
    serviceReceived: 'Emergency Bug Troubleshooting & Speed Optimization',
    rating: 5
  },
  {
    id: '3',
    clientName: 'Dr. Kenneth Eze',
    role: 'Director of ICT',
    company: 'Apex Health Systems',
    location: 'Enugu State, Nigeria',
    comment: 'Ocean Technologies built our patient management mobile and web application. Their technical depth in Flutter and React is remarkable. The team is right here in Agbani, always accessible, professional, and reliable.',
    serviceReceived: 'Mobile App & Custom Web Portal Development',
    rating: 5
  },
  {
    id: '4',
    clientName: 'Tochukwu Udeh',
    role: 'Co-Founder',
    company: 'PayNaija Merchant Services',
    location: 'Lagos & Enugu, Nigeria',
    comment: 'Finding a software company that actually delivers on time and maintains software properly is rare. Ocean Technologies handles our server monitoring and API maintenance with utmost competence.',
    serviceReceived: 'Enterprise Maintenance SLA & API Integration',
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'General',
    question: 'Where is Ocean Technologies located?',
    answer: 'Our main office is located in Agbani, Enugu State, Nigeria, within the Enugu State University of Science and Technology (ESUT) corridor. We serve clients locally in Agbani, across Enugu State, and remotely throughout Nigeria and internationally.'
  },
  {
    id: '2',
    category: 'Website Development',
    question: 'How long does it take to develop a new website?',
    answer: 'A standard professional business website typically takes 1 to 2 weeks. Custom web applications, portals, and complex e-commerce stores take between 2 to 4 weeks depending on the required features and database complexity.'
  },
  {
    id: '3',
    category: 'Maintenance & Retainers',
    question: 'What is included in your Website Maintenance packages?',
    answer: 'Our maintenance packages include 24/7 uptime monitoring, scheduled cloud backups, WordPress core and plugin security patches, database cleanup, speed optimization, malware removal, and dedicated developer hours for routine content updates and text changes.'
  },
  {
    id: '4',
    category: 'Urgent Software Fixes',
    question: 'My website or mobile app has an urgent error/crash. How quickly can you fix it?',
    answer: 'We have an active 24/7 software emergency hotline (09129216768 / WhatsApp). For critical issues like payment failures, database errors, or server crashes, our engineers begin diagnostics immediately and typically resolve issues within 1 to 3 hours.'
  },
  {
    id: '5',
    category: 'Mobile Apps',
    question: 'Do you build apps for both Android and iOS (Apple)?',
    answer: 'Yes! We use cutting-edge cross-platform technologies such as Flutter and React Native, as well as native Kotlin and Swift. This ensures your app runs smoothly and natively on both Google Play Store and Apple App Store while saving you cost.'
  },
  {
    id: '6',
    category: 'Payments & Agbani Office',
    question: 'How do I get started or request a price quote?',
    answer: 'You can request a quote directly through our website, send us an email at oceantechnologies62@gmail.com, or reach us on phone/WhatsApp at 09129216768. You are also welcome to visit our physical office in Agbani, Enugu State (near ESUT).'
  }
];

export const WHY_CHOOSE_US = [
  {
    title: 'Root-Cause Problem Solvers',
    description: 'We do not just patch surface symptoms. We diagnose underlying database, server, and code architecture to ensure your software never fails again.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Fast Turnaround & 24/7 Hotline',
    description: 'Direct access to senior software engineers via phone (09129216768) and WhatsApp with rapid response times.',
    icon: 'Clock'
  },
  {
    title: 'Clean, Modern Code & Design',
    description: 'We write maintainable, scalable code in modern tech stacks (React, Flutter, Node.js, Next.js, PHP) with fast loading times.',
    icon: 'Code'
  },
  {
    title: 'Affordable & Transparent Pricing',
    description: 'Clear pricing in Naira (₦) with zero hidden fees. Maintenance packages starting from as low as ₦25,000/month.',
    icon: 'CheckCircle2'
  }
];
