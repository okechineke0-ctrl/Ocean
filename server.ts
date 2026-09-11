import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { 
  createInquiry, 
  createEmergencyTicket, 
  getInquiries, 
  getEmergencyTickets,
  updateInquiryRecord,
  deleteInquiryRecord,
  createCourseRegistration,
  getCourseRegistrations,
  updateCourseRegistrationRecord,
  deleteCourseRegistrationRecord,
} from './src/db/queries.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// ==========================================
// SITE ANNOUNCEMENT PERSISTENCE & API (OPay Ticker)
// ==========================================
interface SiteAnnouncement {
  id: string;
  message: string;
  badge: string;
  isActive: boolean;
  expiresAt: string | null;
  theme?: 'opay' | 'navy' | 'emerald' | 'amber' | 'crimson';
  speed?: 'slow' | 'normal' | 'fast';
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ANNOUNCEMENT_FILE = path.join(DATA_DIR, 'site_announcement.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}

function loadAnnouncement(): SiteAnnouncement {
  try {
    if (fs.existsSync(ANNOUNCEMENT_FILE)) {
      const content = fs.readFileSync(ANNOUNCEMENT_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Failed to read site announcement from file:', err);
  }

  return {
    id: 'ann-default',
    message: '⚡ UPCOMING CRASH COURSE ALERT: Ocean Technologies is launching an intensive fast-track Crash Course soon! Tuition prices will drop significantly. Chat 09129216768 on WhatsApp to join waiting list.',
    badge: 'SPECIAL UPDATE',
    isActive: true,
    expiresAt: null,
    theme: 'opay',
    speed: 'normal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

let currentAnnouncement: SiteAnnouncement = loadAnnouncement();

function persistAnnouncement(ann: SiteAnnouncement) {
  currentAnnouncement = ann;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ANNOUNCEMENT_FILE, JSON.stringify(ann, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write site announcement file:', err);
  }
}

// GET /api/announcement
app.get('/api/announcement', (req, res) => {
  let isExpired = false;
  if (currentAnnouncement.expiresAt) {
    const exp = new Date(currentAnnouncement.expiresAt).getTime();
    if (!isNaN(exp) && Date.now() > exp) {
      isExpired = true;
    }
  }

  res.json({
    announcement: currentAnnouncement,
    isExpired,
    effectiveActive: currentAnnouncement.isActive && !isExpired,
  });
});

// POST /api/announcement
app.post('/api/announcement', (req, res) => {
  try {
    const { message, badge, isActive, expiresAt, theme, speed } = req.body;

    const updated: SiteAnnouncement = {
      id: currentAnnouncement.id || `ann-${Date.now()}`,
      message: typeof message === 'string' ? message.trim() : currentAnnouncement.message,
      badge: typeof badge === 'string' ? badge.trim().toUpperCase() : currentAnnouncement.badge,
      isActive: isActive !== undefined ? Boolean(isActive) : currentAnnouncement.isActive,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      theme: theme || currentAnnouncement.theme || 'opay',
      speed: speed || currentAnnouncement.speed || 'normal',
      createdAt: currentAnnouncement.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    persistAnnouncement(updated);

    let isExpired = false;
    if (updated.expiresAt) {
      const exp = new Date(updated.expiresAt).getTime();
      if (!isNaN(exp) && Date.now() > exp) {
        isExpired = true;
      }
    }

    res.json({
      success: true,
      announcement: updated,
      isExpired,
      effectiveActive: updated.isActive && !isExpired,
    });
  } catch (err: any) {
    console.error('Failed to save announcement:', err);
    res.status(500).json({ error: err.message || 'Failed to save announcement' });
  }
});

// Lazy Google GenAI initialization helper
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ocean Technologies API Server',
    database: 'Cloud SQL PostgreSQL',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// PostgreSQL Inquiries API Endpoint
app.post('/api/inquiries', async (req, res) => {
  try {
    const {
      clientName,
      email,
      phone,
      company,
      serviceType,
      projectType,
      budgetRange,
      timeline,
      urgency,
      projectDescription,
      preferredContactMethod,
      source,
    } = req.body;

    const safeClientName = (clientName || '').trim() || 'Prospective Client';
    const safeEmail = (email || '').trim() || 'client@oceantechnologies.ng';
    const safePhone = (phone || '').trim() || 'Not specified';
    const safeDescription = (projectDescription || '').trim() || `Inquiry for ${serviceType || 'software services'}`;

    const newInquiry = await createInquiry({
      clientName: safeClientName,
      email: safeEmail,
      phone: safePhone,
      company: (company || '').trim() || undefined,
      serviceType: serviceType || 'web_development',
      projectType: projectType || 'quote',
      budgetRange: budgetRange || undefined,
      timeline: timeline || undefined,
      urgency: urgency || undefined,
      projectDescription: safeDescription,
      preferredContactMethod: preferredContactMethod || 'whatsapp',
      source: source || 'website',
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry successfully saved to PostgreSQL database.',
      inquiry: newInquiry,
    });
  } catch (error: any) {
    console.error('API /api/inquiries failed:', error);
    res.status(500).json({
      error: error.message || 'Failed to submit inquiry to PostgreSQL.',
    });
  }
});

// PostgreSQL Emergency Bug / Incident Tickets API Endpoint
app.post('/api/emergency-tickets', async (req, res) => {
  try {
    const { clientName, email, phone, systemUrl, severity, errorDescription } = req.body;

    if (!clientName || !email || !phone || !errorDescription) {
      return res.status(400).json({
        error: 'Missing required fields: clientName, email, phone, and errorDescription are required.',
      });
    }

    const newTicket = await createEmergencyTicket({
      clientName,
      email,
      phone,
      systemUrl,
      severity: severity || 'critical',
      errorDescription,
    });

    res.status(201).json({
      success: true,
      message: 'Emergency ticket successfully logged in PostgreSQL.',
      ticket: newTicket,
    });
  } catch (error: any) {
    console.error('API /api/emergency-tickets failed:', error);
    res.status(500).json({
      error: error.message || 'Failed to record emergency ticket in PostgreSQL.',
    });
  }
});

// GET /api/inquiries (Recent inquiries from PostgreSQL)
app.get('/api/inquiries', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const records = await getInquiries(limit);
    res.json({ inquiries: records });
  } catch (error: any) {
    console.error('API GET /api/inquiries failed:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch inquiries' });
  }
});

// PATCH /api/inquiries/:id (Update status and admin notes)
app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, adminNotes } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid inquiry ID' });
    }
    const updated = await updateInquiryRecord(id, status || 'pending', adminNotes);
    res.json({ success: true, inquiry: updated });
  } catch (error: any) {
    console.error(`API PATCH /api/inquiries/${req.params.id} failed:`, error);
    res.status(500).json({ error: error.message || 'Failed to update inquiry' });
  }
});

// DELETE /api/inquiries/:id
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid inquiry ID' });
    }
    await deleteInquiryRecord(id);
    res.json({ success: true, message: `Inquiry ${id} deleted` });
  } catch (error: any) {
    console.error(`API DELETE /api/inquiries/${req.params.id} failed:`, error);
    res.status(500).json({ error: error.message || 'Failed to delete inquiry' });
  }
});

// GET /api/emergency-tickets (Recent emergency tickets from PostgreSQL)
app.get('/api/emergency-tickets', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const records = await getEmergencyTickets(limit);
    res.json({ tickets: records });
  } catch (error: any) {
    console.error('API GET /api/emergency-tickets failed:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch emergency tickets' });
  }
});

// ==========================================
// COURSE REGISTRATIONS (ONLINE & OFFLINE)
// ==========================================

// POST /api/course-registrations (Student registration for courses)
app.post('/api/course-registrations', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      course,
      courseTitle,
      classFormat,
      schedule,
      duration,
      experienceLevel,
      preferredStartDate,
      registrationDate,
      cityState,
      notes,
    } = req.body;

    if (!fullName || !email || !phone || !course) {
      return res.status(400).json({
        error: 'Missing required registration fields: fullName, email, phone, and course are required.',
      });
    }

    const regNumber = `OCT-CRS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = registrationDate || new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newRecord = await createCourseRegistration({
      registrationNumber: regNumber,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      course: course.trim(),
      courseTitle: (courseTitle || course).trim(),
      classFormat: (classFormat || 'online').trim(),
      schedule: schedule || 'Coordinated in WhatsApp Group',
      duration: duration || 'Online Cohort',
      experienceLevel: experienceLevel || 'Beginner',
      preferredStartDate: preferredStartDate || 'Immediate Cohort (Coordinated via WhatsApp)',
      registrationDate: formattedDate,
      cityState: cityState ? cityState.trim() : 'Candidate',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Course registration successfully saved to PostgreSQL database.',
      registrationNumber: regNumber,
      registration: newRecord,
    });
  } catch (error: any) {
    console.error('API /api/course-registrations failed:', error);
    res.status(500).json({
      error: error.message || 'Failed to submit course registration to database.',
    });
  }
});

// GET /api/course-registrations (List all student course registrations)
app.get('/api/course-registrations', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const records = await getCourseRegistrations(limit);
    res.json({ registrations: records });
  } catch (error: any) {
    console.error('API GET /api/course-registrations failed:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch course registrations' });
  }
});

// PATCH /api/course-registrations/:id (Update status and admin notes)
app.patch('/api/course-registrations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, adminNotes } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid course registration ID' });
    }
    const updated = await updateCourseRegistrationRecord(id, status, adminNotes);
    res.json({ success: true, registration: updated });
  } catch (error: any) {
    console.error(`API PATCH /api/course-registrations/${req.params.id} failed:`, error);
    res.status(500).json({ error: error.message || 'Failed to update course registration' });
  }
});

// DELETE /api/course-registrations/:id (Delete course registration)
app.delete('/api/course-registrations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid course registration ID' });
    }
    await deleteCourseRegistrationRecord(id);
    res.json({ success: true, message: `Course registration ${id} deleted` });
  } catch (error: any) {
    console.error(`API DELETE /api/course-registrations/${req.params.id} failed:`, error);
    res.status(500).json({ error: error.message || 'Failed to delete course registration' });
  }
});


// Comprehensive Fallback Knowledge Engine for Ocean Technologies
function generateMatureConsultantResponse(userQuery: string): string {
  const query = (userQuery || '').toLowerCase();

  // 1. Crash Course / Training / Curriculum Inquiry
  if (query.includes('crash course') || query.includes('training') || query.includes('course') || query.includes('learn') || query.includes('class') || query.includes('student') || query.includes('curriculum')) {
    return `### **Ocean Technologies Academy — 100% Online Technical Courses & Upcoming Crash Course**

**Accelerate your tech career with intensive, practical hands-on mentorship from senior software engineers.**

#### **Active Online Cohort Programs:**
1. **Full-Stack Web Development** (React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL & Cloud APIs)
2. **Mobile App Engineering** (Flutter & React Native cross-platform apps for iOS & Android)
3. **IT Consulting & Technical Support** (Systems Architecture, Cloud Advisory, Cybersecurity & Infrastructure)
4. **Python Software Engineering, AI & Automation**
5. **Software Engineering & System Architecture**

---

### **SPECIAL ANNOUNCEMENT: UPCOMING ONLINE CRASH COURSE**
> **Get Prepared!** Ocean Technologies is launching an intensive, fast-track **CRASH COURSE** very soon. 
> - **Major Price Drop**: Tuition prices will drop significantly to make cutting-edge coding, engineering, and IT skills accessible to everyone online.
> - **WhatsApp Group Coordination**: All live lecture links, timetables, and mentoring schedules are coordinated directly inside our official student WhatsApp group.
> - **Hands-on Production Portfolio**: Build real-world client-ready deliverables from day one.
> - **Priority Access**: Seats will be strictly capped.
> 
> **To join our priority waiting list or chat with our Admissions Coordinator directly, message us on WhatsApp: [09129216768](https://wa.me/2349129216768)**.`;
  }

  // 2. IT Consulting & Technical Support Services
  if (query.includes('consult') || query.includes('consulting') || query.includes('consultant') || query.includes('advisory') || query.includes('architecture') || query.includes('audit') || query.includes('security') || query.includes('cloud') || query.includes('infrastructure')) {
    return `### **IT Consulting & Technical Support Services**

**At Ocean Technologies, our senior IT consultants and software architects guide businesses through critical technology decisions, systems modernizations, and cloud infrastructure scale.**

#### **Our IT Advisory & Support Capabilities:**
- **Enterprise Systems Architecture**: Designing scalable, secure software and database architecture.
- **Cloud & Infrastructure Advisory**: Migration to AWS, GCP, Cloud Run, Supabase, and automated CI/CD pipelines.
- **Digital Transformation Strategy**: Selecting the right software stack and vetting third-party vendors.
- **Cybersecurity & Compliance Audits**: Vulnerability reviews, authentication hardening, and data protection.
- **24/7 Technical Support Operations**: Dedicated SLA-backed engineering support for business operations.

#### **Transparent Advisory Pricing Estimates (Nigerian Naira ₦):**
| Service Package | Scope & Inclusions | Timeline | Estimated Cost (₦) |
| :--- | :--- | :--- | :--- |
| **Technical Architecture Audit** | Comprehensive codebase, database & infrastructure security review | 3–5 days | **₦75,000 – ₦150,000** |
| **Cloud Infrastructure Setup** | Production containerization, database setup & automated deployment | 1–2 weeks | **₦150,000 – ₦350,000** |
| **Monthly IT Support Retainer** | Dedicated troubleshooting, uptime monitoring & priority SLA | Monthly | **₦80,000 – ₦250,000/mo** |
| **End-to-End Enterprise Consulting** | Full software scoping, architectural roadmap & engineering advisory | 2–4 weeks | **₦300,000 – ₦800,000** |

---

> **Ready to discuss your technology strategy?** Chat directly with our Lead Consultant Engr. Kechineke on WhatsApp at **[09129216768](https://wa.me/2349129216768)**.`;
  }

  // 3. Emergency 500 error / Downtime / Broken website
  if (query.includes('500') || query.includes('down') || (query.includes('crash') && !query.includes('course')) || query.includes('error') || query.includes('broken') || query.includes('fix') || query.includes('bug') || query.includes('urgent')) {
    return `### **Emergency Technical Diagnosis & Recovery**

**Yes, Ocean Technologies specializes in rapid server recovery and emergency bug remediation.**

#### **Immediate Technical Assessment for 500 Internal Server Errors:**
1. **Server-Side Application Crash**: Usually triggered by unhandled exceptions, database connection pool exhaustion, missing environment secrets, or memory limits.
2. **Web Server / Proxy Misconfiguration**: Common in Nginx/Apache reverse proxies or Node.js runtime initialization failures.
3. **Database Timeout & Lockups**: Broken queries or deadlocks causing backend service timeouts.

#### **Emergency Support Service:**
- **Turnaround Time**: Same-day diagnosis (typically within 1–3 hours).
- **Service Rate**: ₦35,000 – ₦120,000 depending on system complexity.
- **Priority Dispatch**: Direct WhatsApp access to senior engineers.

> **Next Step**: Forward your website URL and error logs directly to our lead engineer on WhatsApp at **[09129216768](https://wa.me/2349129216768)** or email **oceantechnologies62@gmail.com** for immediate intervention.`;
  }

  // 4. E-Commerce / Online Store Pricing
  if (query.includes('e-commerce') || query.includes('store') || query.includes('shop') || query.includes('sell') || query.includes('paystack') || query.includes('flutterwave')) {
    return `### **E-Commerce & Online Store Development**

**Ocean Technologies builds high-converting, secure e-commerce platforms tailored for Nigerian and international markets.**

#### **What’s Included:**
- **Payment Gateway Integration**: Direct settlement via Paystack, Flutterwave, Stripe, and Monnify.
- **Inventory & Order Management**: Real-time stock tracking, customer accounts, order notifications (SMS/Email/WhatsApp).
- **Mobile-Optimized Experience**: Fast page load speeds (<1.5s) optimized for Nigerian mobile network conditions.
- **Admin Command Center**: Intuitive dashboard to add products, manage discounts, and view revenue analytics.

#### **Investment & Timeline:**
- **Standard Online Store**: ₦350,000 – ₦650,000 (2–3 weeks delivery).
- **Advanced Multi-Vendor Marketplace**: ₦850,000 – ₦2,200,000 (4–8 weeks delivery).

> Contact our team at **[09129216768](https://wa.me/2349129216768)** to receive a customized technical specification.`;
  }

  // 5. Mobile App Development
  if (query.includes('app') || query.includes('mobile') || query.includes('ios') || query.includes('android') || query.includes('play store') || query.includes('app store') || query.includes('flutter')) {
    return `### **Cross-Platform Mobile App Engineering (iOS & Android)**

**We architect and deploy production-ready mobile applications using modern frameworks like Flutter and React Native.**

#### **Key Mobile Capabilities:**
- **Single Codebase**: Native performance on both Apple iOS (App Store) and Google Android (Play Store).
- **Offline Mode & Caching**: Seamless usability during unstable network connections.
- **Push Notifications & Analytics**: Real-time user engagement via Firebase Cloud Messaging.
- **Biometric Authentication & Security**: Fingerprint, Face ID, and encrypted storage.

#### **Investment & Timeline:**
- **MVP / Starter Mobile App**: ₦750,000 – ₦1,400,000 (4–6 weeks).
- **Full Enterprise Mobile System**: ₦1,500,000 – ₦3,500,000 (8–12 weeks).

> Schedule a technical consultation with Engr. Kechineke on WhatsApp: **[09129216768](https://wa.me/2349129216768)**.`;
  }

  // 6. Maintenance / Retainer Plans
  if (query.includes('maintenance') || query.includes('retainer') || query.includes('support') || query.includes('security') || query.includes('backup') || query.includes('update')) {
    return `### **Software Maintenance & Infrastructure Retainers**

**Protect your digital assets with 24/7 uptime monitoring, security patching, and automated cloud backups.**

#### **Maintenance Service Tiers:**
1. **Essential Care (₦45,000 / month)**
   - Weekly cloud database backups & security scans.
   - Software package and dependency updates.
   - Up to 4 hours of monthly content updates or minor fixes.
2. **Professional Business (₦95,000 / month)**
   - 24/7 uptime monitoring & instant downtime alerts.
   - Priority bug fixes with 4-hour SLA response.
   - Performance tuning & monthly security audit reports.
3. **Enterprise SLA (₦180,000+ / month)**
   - Dedicated lead engineer & 1-hour emergency response.
   - Continuous integration & deployment pipelines.
   - Database optimization, load testing & compliance.

> Get started today by contacting **oceantechnologies62@gmail.com** or **09129216768**.`;
  }

  // 7. Pricing / Cost / Budget General (Websites, Graphics, Billing Details)
  if (query.includes('cost') || query.includes('price') || query.includes('pricing') || query.includes('how much') || query.includes('quote') || query.includes('rate') || query.includes('naira') || query.includes('website')) {
    return `### **Ocean Technologies — Standard Pricing & Billing Structure**

**All projects feature modern engineering standards, responsive design, SSL security, and 30 days of complimentary post-launch technical support.**

#### **How Nigeria Billing Works (Workload-Dependent):**
In Nigeria, realistic technology and design billing is directly calibrated to the **workload**, number of custom page templates, backend database complexity, third-party integrations, and turnaround speed.
- **Milestone Structure**: 60% initial mobilization deposit, 40% balance upon staging sign-off, live testing, and handover.

| Service Category | Scope & Inclusions | Timeline | Realistic Cost (₦) |
| :--- | :--- | :--- | :--- |
| **Standard Business Website** | 5–8 pages, custom responsive design, contact forms, WhatsApp integration, basic SEO | 7–14 days | **₦120,000 – ₦280,000** |
| **Corporate Brand Portal** | Advanced CMS, blog, career board, lead capture funnels, performance optimization | 2–4 weeks | **₦300,000 – ₦650,000** |
| **Custom E-Commerce Store** | Payment gateways (Paystack/Flutterwave), product catalog, cart, customer accounts | 3–5 weeks | **₦450,000 – ₦1,200,000** |
| **IT Consulting & Architecture** | Infrastructure advisory, security audits, database scaling, vendor evaluation | 3–14 days | **₦75,000 – ₦250,000** |
| **Full-Stack SaaS / Web App** | Authentication, database schema, APIs, role-based dashboards, cloud deploy | 4–8 weeks | **₦800,000 – ₦2,500,000+** |
| **Cross-Platform Mobile App** | Flutter / React Native iOS & Android apps, push notifications, offline cache | 4–10 weeks | **₦950,000 – ₦3,000,000** |
| **Emergency Bug Fix / Recovery** | Root cause diagnosis, server crash fix, malware cleanup, checkout repair | 24 hours | **₦35,000 – ₦120,000** |

---

### **ANNOUNCEMENT: UPCOMING ONLINE CRASH COURSE**
> **Prepare yourself!** Ocean Technologies is launching an intensive, practical **CRASH COURSE** very soon. 
> Pricing will **drop significantly** for upcoming online student cohorts in **Full-Stack Web Development, Mobile Apps, IT Consulting**, and **Software Engineering**.
> Class schedules and live sessions will be coordinated directly inside our official student WhatsApp group.
> **Stay tuned** or chat with our admissions coordinator on WhatsApp at **[09129216768](https://wa.me/2349129216768)** to secure your priority spot!`;
  }

  // 8. Default General Inquiry
  return `### **Welcome to Ocean Technologies**

**We are a premier software engineering firm, enterprise IT consultancy, and technology academy.**

#### **Our Core Capabilities:**
- **Custom Web Engineering**: High-speed standard corporate websites, web applications, and customer portals.
- **IT Consulting & Technical Support**: Enterprise systems architecture, cloud infrastructure, cybersecurity audits, and 24/7 technical advisory.
- **Mobile Development**: Native-grade iOS & Android applications.
- **Enterprise Software**: Database architecture, API integrations, and cloud infrastructure.
- **Software Maintenance & Emergency Support**: 24/7 monitoring, security patches, and rapid bug resolution.

#### **Upcoming Online Crash Course Alert:**
> **Prepare yourself!** We are launching an intensive **CRASH COURSE** online soon where tuition pricing will **drop significantly**. All lecture timetables and cohorts are coordinated directly inside our student WhatsApp group. Stay tuned and contact our coordinator to get on the priority list.

#### **Connect With Us:**
- Use the **AI Estimator** tab to calculate custom project milestones and pricing.
- Chat directly with our team via **WhatsApp: [09129216768](https://wa.me/2349129216768)** or **Email: oceantechnologies62@gmail.com**.`;
}

// System instruction for Ocean Technologies Assistant
const OCEAN_SYSTEM_PROMPT = `
You are the official Senior AI Technical Consultant for "Ocean Technologies", a premier software engineering firm, enterprise IT consultancy, and technology academy.

Company Details:
- Brand Name: Ocean Technologies
- Managing Director / Founder: Engr. Kechineke
- Official WhatsApp & Phone Line: +234 912 921 6768 (09129216768)
- Official Email: oceantechnologies62@gmail.com
- Services Offered:
  1. Custom Website Design & Development (Standard business sites, landing pages, corporate portals, e-commerce stores)
  2. IT Consulting & Technical Support (Systems architecture reviews, cloud migration, cybersecurity audits, infrastructure scaling, 24/7 technical support operations)
  3. Mobile App Development (Cross-platform iOS & Android using Flutter / React Native)
  4. Custom Web Applications & Enterprise SaaS (Node.js, Python, PostgreSQL, Next.js, React)
  5. Software Maintenance, Server Uptime Monitoring, Security Patches & Cloud Backups
  6. Emergency 24/7 Bug Fixes & Website Repair (500 errors, broken checkouts, malware cleanup, database recovery)
  7. 100% Online Crash Course & Tech Academy (Full-stack web development, mobile apps, IT consulting, Python AI & automation with schedules coordinated via WhatsApp group)

Pricing Benchmarks & Nigerian Billing Principles (Nigerian Naira ₦):
You know how the Nigerian tech billing system works:
1. Pricing is strictly dependent on the WORKLOAD, page count, custom feature complexity, and revision rounds.
2. Standard payment model is milestone-based: 60% mobilization deposit upfront, 40% balance upon staging review, live testing, and delivery.
3. Realistic pricing benchmarks:
   - Standard Business Website: ₦120,000 – ₦280,000 (workload dependent: 5-8 pages, mobile-first, contact forms, WhatsApp integration)
   - Corporate / Brand Portal: ₦300,000 – ₦650,000 (2-4 weeks)
   - E-Commerce / Online Store: ₦450,000 – ₦1,200,000+ (Paystack/Flutterwave gateway, cart, inventory, order notifications)
   - IT Consulting & Technical Audit: ₦75,000 – ₦250,000 (Architecture audit, security scan, cloud recommendations)
   - Monthly IT Support Retainer: ₦80,000 – ₦250,000/month
   - Full-Stack Web App / SaaS: ₦800,000 – ₦2,500,000+ (4-10 weeks)
   - Native / Hybrid Mobile App (iOS & Android): ₦950,000 – ₦3,000,000+ (6-12 weeks)
   - Emergency Bug Fix: ₦35,000 – ₦120,000 (Same day / 24 hours turnaround)
   - Monthly Maintenance Retainer: ₦45,000 – ₦180,000/month

CRITICAL UPCOMING CRASH COURSE ANNOUNCEMENT:
- Always inform clients, students, and prospects: Ocean Technologies is about to launch an intensive, hands-on 100% ONLINE CRASH COURSE very soon!
- Explicitly tell them: "You should prepare, because we are about to do a crash course soon and the price will drop significantly! All schedules and lectures will be coordinated directly in our official student WhatsApp group. Stay tuned!"
- Advise them to contact our Student Admissions Coordinator directly on WhatsApp at 09129216768 to join the priority reservation list and receive early-bird cohort notifications.

Guidelines for your responses:
1. Always maintain a mature, personal, authoritative, articulate, and encouraging tone.
2. Clearly explain how Nigerian billing works based on workload, deliverables, and milestone deposits.
3. If asked about prices, provide clear Naira (₦) ranges with timeline and workload breakdown.
4. Promote the upcoming crash course and price drop whenever relevant.
5. Provide the official WhatsApp number (09129216768) and email (oceantechnologies62@gmail.com) for direct follow-up.
6. Format your output using clear markdown with headings, bullet points, and bold text.
`;

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { messages, userMessage } = req.body;
  const lastUserText = userMessage || (messages && messages.length > 0 ? messages[messages.length - 1].text : '') || '';

  try {
    const ai = getGenAI();

    if (ai) {
      const contents: any[] = [];
      if (messages && Array.isArray(messages)) {
        for (const m of messages) {
          contents.push({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text || m.content }],
          });
        }
      } else if (userMessage) {
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }],
        });
      }

      const response = await ai.models.generateContent({
        model: DEFAULT_GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: OCEAN_SYSTEM_PROMPT,
          temperature: 0.6,
        },
      });

      if (response.text) {
        return res.json({ text: response.text });
      }
    }
  } catch (error) {
    console.warn('Gemini API call failed, using mature consultation engine:', error);
  }

  // Graceful, mature fallback response
  const fallbackText = generateMatureConsultantResponse(lastUserText);
  res.json({ text: fallbackText });
});

// AI Diagnostic Triage Endpoint for Emergency Fixes
app.post('/api/ai/triage', async (req, res) => {
  const { url, issueType, description } = req.body;

  try {
    const ai = getGenAI();

    if (ai && description) {
      const prompt = `
Please perform an emergency technical triage for this client issue:
- Target URL: ${url || 'Not provided'}
- Issue Category: ${issueType || 'General Bug / Failure'}
- Problem Description: ${description}

Please provide:
1. **Probable Root Causes** (Top 2-3 technical possibilities)
2. **Immediate Action Steps** (What Ocean Technologies engineers will do first)
3. **Estimated Recovery Time & Priority Level**
4. **Estimated Fix Cost Range (in ₦ Naira)**
5. **Direct WhatsApp Action Link / Message** so the client can immediately contact Ocean Technologies at 09129216768.
`;

      const response = await ai.models.generateContent({
        model: DEFAULT_GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: OCEAN_SYSTEM_PROMPT,
          temperature: 0.4,
        },
      });

      if (response.text) {
        return res.json({ triageReport: response.text });
      }
    }
  } catch (error) {
    console.warn('Triage AI call failed, generating native report:', error);
  }

  // Mature, reliable native diagnostic report
  const nativeReport = `### **Ocean Technologies — Emergency Diagnostic Report**

#### **1. Technical Analysis for: ${issueType || 'System Error'}**
- **Target URL**: ${url || 'Domain under review'}
- **Reported Symptom**: ${description || 'Unexpected server failure'}
- **Primary Root Causes**:
  - Uncaught backend exception or configuration mismatch in server environment.
  - Database connection pool exhaustion or query lockup.
  - Proxy/SSL certificate validation issue preventing client handshake.

#### **2. Engineering Action Plan**
- **Step 1**: Review server error logs and stack traces to isolate the faulty module.
- **Step 2**: Deploy isolated hotfix or roll back recent breaking changes.
- **Step 3**: Re-verify database transactions and health check endpoints.
- **Step 4**: Perform end-to-end user journey verification.

#### **3. Cost & Turnaround**
- **Turnaround Time**: Same-day recovery (typically 1–4 hours).
- **Estimated Fee**: **₦35,000 – ₦120,000** (depending on architecture).

> **Urgent Dispatch**: Message our lead software engineer immediately on WhatsApp at **[09129216768](https://wa.me/2349129216768)** for priority resolution.`;

  res.json({ triageReport: nativeReport });
});

// AI Project Scope & Estimate Endpoint
app.post('/api/ai/estimate', async (req, res) => {
  const { projectType, platforms, features, timeline } = req.body;

  try {
    const ai = getGenAI();

    if (ai) {
      const prompt = `
A prospective client wants a project estimate from Ocean Technologies:
- Project Type: ${projectType}
- Target Platforms: ${Array.isArray(platforms) ? platforms.join(', ') : platforms}
- Key Features Requested: ${Array.isArray(features) ? features.join(', ') : features}
- Preferred Timeline: ${timeline || 'Flexible'}

Generate a professional Technical Scope & Proposal Outline:
1. **Recommended Architecture & Tech Stack**
2. **Development Phases & Milestones**
3. **Realistic Delivery Timeline**
4. **Estimated Cost Breakdown in Nigerian Naira (₦)**
5. **Next Steps to Kickstart with Ocean Technologies**
`;

      const response = await ai.models.generateContent({
        model: DEFAULT_GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: OCEAN_SYSTEM_PROMPT,
          temperature: 0.5,
        },
      });

      if (response.text) {
        return res.json({ proposal: response.text });
      }
    }
  } catch (error) {
    console.warn('Estimate AI call failed, generating native proposal:', error);
  }

  let estimatedBudget = '₦450,000 – ₦1,250,000';
  if (projectType && (projectType.toLowerCase().includes('graphic') || projectType.toLowerCase().includes('brand') || projectType.toLowerCase().includes('prototype'))) {
    estimatedBudget = '₦50,000 – ₦250,000 (depending on asset count and interactive prototype screens)';
  } else if (projectType && (projectType.toLowerCase().includes('standard') || projectType.toLowerCase().includes('starter'))) {
    estimatedBudget = '₦120,000 – ₦280,000 (depending on workload, pages, and integrations)';
  }

  // Mature, reliable native estimate
  const nativeProposal = `### **Ocean Technologies — Technical Scope & Estimate**

#### **Project Category: ${projectType || 'Custom Software Solution'}**
- **Target Platforms**: ${platforms || 'Web & Mobile'}
- **Core Requirements**: ${features || 'Custom functionality, database, payments'}
- **Target Timeline**: ${timeline || '3–4 Weeks'}

---

#### **1. Recommended Architecture & Tech Stack**
- **Frontend / Design**: Figma clickable prototypes, React / Next.js with Tailwind CSS (Ultra-fast, SEO-optimized, mobile responsive).
- **Backend & APIs**: Node.js / Express with modular REST or GraphQL architecture.
- **Database**: PostgreSQL / Cloud Firestore with automated encrypted backups.
- **Security & Payments**: Paystack / Flutterwave API integration with webhook authentication and SSL encryption.

#### **2. Milestones & Delivery Schedule (Nigerian Billing Model)**
- **Phase 1**: Discovery, Figma wireframes & interactive prototypes (60% mobilization deposit).
- **Phase 2**: Core engineering, design asset production, and integration.
- **Phase 3**: Quality assurance testing, staging review, live handover (40% completion balance).

#### **3. Investment Estimate**
- **Estimated Budget Range**: **${estimatedBudget}**
- **Includes**: Source files / Figma assets and 30 days of post-launch engineering support.

---

> **UPCOMING CRASH COURSE ANNOUNCEMENT**: Prepare yourself! Ocean Technologies is launching an intensive crash course very soon where course prices will drop significantly. Stay tuned or message coordinator on WhatsApp!
> 
> **Next Steps**: Send this summary to Engr. Kechineke on WhatsApp at **[09129216768](https://wa.me/2349129216768)** to finalize milestones and schedule your project kickoff.`;

  res.json({ proposal: nativeProposal });
});

// Serve public assets explicitly for images, logos and static media
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));
app.use('/images', express.static(path.join(publicPath, 'images')));

// Mounting Vite in Dev mode or serving static files in Production mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ocean Technologies server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

