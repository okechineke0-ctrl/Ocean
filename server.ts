import 'dotenv/config';
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { 
  createInquiry, 
  createEmergencyTicket, 
  getInquiries, 
  getEmergencyTickets,
  updateInquiryRecord,
  deleteInquiryRecord
} from './src/db/queries.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

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

// Comprehensive Fallback Knowledge Engine for Ocean Technologies
function generateMatureConsultantResponse(userQuery: string): string {
  const query = (userQuery || '').toLowerCase();

  // 1. Emergency 500 error / Downtime / Broken website
  if (query.includes('500') || query.includes('down') || query.includes('crash') || query.includes('error') || query.includes('broken') || query.includes('fix') || query.includes('bug') || query.includes('urgent')) {
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

  // 2. E-Commerce / Online Store Pricing
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

  // 3. Mobile App Development
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

  // 4. Maintenance / Retainer Plans
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

  // 5. Pricing / Cost / Budget General
  if (query.includes('cost') || query.includes('price') || query.includes('pricing') || query.includes('how much') || query.includes('quote') || query.includes('rate') || query.includes('naira')) {
    return `### **Ocean Technologies — Standard Project Pricing**

**All projects include responsive UI/UX design, modern coding standards, SSL security, and 30 days of post-launch warranty.**

| Service Type | Scope & Deliverables | Timeline | Estimated Cost (₦) |
| :--- | :--- | :--- | :--- |
| **Starter Business Website** | 5-7 pages, mobile-first, contact forms, SEO ready | 7–14 days | **₦120,000 – ₦250,000** |
| **Corporate Brand Portal** | Custom UI, blog, career portal, CMS, speed optimization | 2–3 weeks | **₦300,000 – ₦650,000** |
| **Custom E-Commerce Store** | Payment gateways (Paystack/Flutterwave), cart, order dashboard | 3–5 weeks | **₦450,000 – ₦1,200,000** |
| **Full-Stack SaaS / Web App** | Authentication, database architecture, APIs, dashboards | 4–8 weeks | **₦800,000 – ₦2,500,000+** |
| **Mobile App (iOS & Android)** | Cross-platform build, API sync, push notifications | 6–10 weeks | **₦950,000 – ₦3,000,000+** |
| **Emergency Bug Fix** | Codebase diagnosis, server crash fix, malware cleanup | 24 hours | **₦35,000 – ₦120,000** |

> For a tailored quote, message us on WhatsApp at **[09129216768](https://wa.me/2349129216768)** or use our interactive **AI Estimator** tab.`;
  }

  // 6. Default General Inquiry
  return `### **Welcome to Ocean Technologies**

**We are a premier software engineering firm located in Agbani, Enugu State, Nigeria (ESUT Corridor).**

#### **Our Core Capabilities:**
- **Custom Web Engineering**: High-speed corporate websites, web applications, and customer portals.
- **Mobile Development**: Native-grade iOS & Android applications.
- **Enterprise Software**: Database architecture, API integrations, and cloud infrastructure.
- **Maintenance & Emergency Support**: 24/7 monitoring, security patches, and rapid bug resolution.

#### **How We Can Help You Today:**
- Use the **AI Estimator** tab to calculate custom project milestones and pricing.
- Use the **Bug Triage** tab for instant diagnostics on server downtime or technical issues.
- Connect directly with our engineering lead via **WhatsApp: [09129216768](https://wa.me/2349129216768)** or **Email: oceantechnologies62@gmail.com**.`;
}

// System instruction for Ocean Technologies Assistant
const OCEAN_SYSTEM_PROMPT = `
You are the official Senior AI Technical Consultant for "Ocean Technologies", a premier software engineering and development company headquartered in Agbani, Enugu State, Nigeria (ESUT Corridor).

Company Details:
- Brand Name: Ocean Technologies
- Headquarters: Agbani, Enugu State, Nigeria (Near ESUT Corridor)
- Managing Director / Founder: Engr. Kechineke
- Official WhatsApp & Phone Line: +234 912 921 6768 (09129216768)
- Official Email: oceantechnologies62@gmail.com
- Services Offered:
  1. Custom Website Design & Development (Landing pages, Corporate sites, Portals)
  2. Mobile App Development (Cross-platform iOS & Android using Flutter / React Native)
  3. Custom Web Applications & Enterprise SaaS (Node.js, Python, PostgreSQL, Next.js, React)
  4. Software Maintenance, Server Uptime Monitoring, Security Patches & Cloud Backups
  5. Emergency 24/7 Bug Fixes & Website Repair (500 errors, broken checkouts, malware cleanup, database recovery)

Pricing Benchmarks (Nigerian Naira ₦):
- Basic / Starter Business Website: ₦120,000 – ₦250,000 (1-2 weeks)
- Corporate / Brand Portal: ₦300,000 – ₦650,000 (2-4 weeks)
- E-Commerce / Multi-Vendor Store: ₦500,000 – ₦1,200,000+ (3-6 weeks)
- Full-Stack Web App / SaaS: ₦800,000 – ₦2,500,000+ (4-10 weeks)
- Native / Hybrid Mobile App (iOS & Android): ₦950,000 – ₦3,000,000+ (6-12 weeks)
- Emergency Bug Fix: ₦35,000 – ₦120,000 (Same day / 24 hours turnaround)
- Monthly Maintenance Retainer: ₦45,000 – ₦180,000/month

Guidelines for your responses:
1. Always maintain a professional, articulate, and reassuring tone.
2. Provide realistic pricing ranges in Naira (₦) along with clear milestones.
3. If the user reports technical downtime or errors, provide structured root causes and immediate action steps.
4. Format your output using clear markdown with headings, bullet points, and bold text.
`;

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
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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

  // Mature, reliable native estimate
  const nativeProposal = `### **Ocean Technologies — Technical Scope & Estimate**

#### **Project Category: ${projectType || 'Custom Software Solution'}**
- **Target Platforms**: ${platforms || 'Web & Mobile'}
- **Core Requirements**: ${features || 'Custom functionality, database, payments'}
- **Target Timeline**: ${timeline || '3–4 Weeks'}

---

#### **1. Recommended Architecture & Tech Stack**
- **Frontend**: React / Next.js with Tailwind CSS (Ultra-fast, SEO-optimized, mobile responsive).
- **Backend & APIs**: Node.js / Express with modular REST or GraphQL architecture.
- **Database**: PostgreSQL / Cloud Firestore with automated encrypted backups.
- **Security & Payments**: Paystack / Flutterwave API integration with webhook authentication and SSL encryption.

#### **2. Milestones & Delivery Schedule**
- **Phase 1 (Week 1)**: UI/UX wireframes, architecture specification & database schema.
- **Phase 2 (Weeks 2–3)**: Core engineering, payment gateway integration, user authentication.
- **Phase 3 (Week 4)**: Quality assurance testing, security auditing & live deployment.

#### **3. Investment Estimate**
- **Estimated Budget Range**: **₦450,000 – ₦1,250,000** (depending on custom feature depth).
- **Includes**: 30 days of post-launch engineering support and deployment handover.

> **Next Steps**: Send this summary to Engr. Kechineke on WhatsApp at **[09129216768](https://wa.me/2349129216768)** to finalize milestones and schedule your project kickoff.`;

  res.json({ proposal: nativeProposal });
});

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

