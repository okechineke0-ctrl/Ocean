import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI initialization helper
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
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
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// System instruction for Ocean Technologies Assistant
const OCEAN_SYSTEM_PROMPT = `
You are the official AI Technical Consultant for "Ocean Technologies", a premier software engineering and development company headquartered in Agbani, Enugu State, Nigeria (ESUT Corridor).

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
1. Always be polite, technically accurate, friendly, and transparent.
2. If asked for pricing or estimates, provide realistic ranges in Naira (₦) along with a clear scope breakdown and timeline.
3. Recommend modern tech stacks (e.g. React/Vite, Next.js, Tailwind CSS, Node/Express, Python/FastAPI, Flutter, PostgreSQL).
4. If the user wants to initiate a project or request emergency support, provide Ocean Technologies' WhatsApp number (09129216768) and email (oceantechnologies62@gmail.com) with a formatted project summary they can easily send.
5. Format your output using clear markdown with bullet points and bold highlights for effortless readability.
`;

// AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: 'A message is required.' });
    }

    const ai = getGenAI();

    // Prepare contents array
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
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: OCEAN_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || 'I could not generate a response. Please try again.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      error: error.message || 'Failed to communicate with AI model.',
    });
  }
});

// AI Diagnostic Triage Endpoint for Emergency Fixes
app.post('/api/ai/triage', async (req, res) => {
  try {
    const { url, issueType, description, errorLog } = req.body;

    if (!description && !issueType) {
      return res.status(400).json({ error: 'Issue description is required.' });
    }

    const ai = getGenAI();

    const prompt = `
Please perform an emergency technical triage for this client issue:
- Target URL: ${url || 'Not provided'}
- Issue Category: ${issueType || 'General Bug / Failure'}
- Problem Description: ${description}
- Error Logs / Message: ${errorLog || 'None attached'}

Please provide:
1. **Probable Root Causes** (Top 2-3 technical possibilities)
2. **Immediate Action Steps** (What Ocean Technologies engineers will do first)
3. **Estimated Recovery Time & Priority Level**
4. **Estimated Fix Cost Range (in ₦ Naira)**
5. **Direct WhatsApp Action Link / Message** so the client can immediately contact Ocean Technologies at 09129216768.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: OCEAN_SYSTEM_PROMPT,
        temperature: 0.4,
      },
    });

    res.json({
      triageReport: response.text,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/triage:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate diagnostic report.',
    });
  }
});

// AI Project Scope & Estimate Endpoint
app.post('/api/ai/estimate', async (req, res) => {
  try {
    const { projectType, platforms, features, timeline, budget } = req.body;

    const ai = getGenAI();

    const prompt = `
A prospective client wants a project estimate from Ocean Technologies:
- Project Type: ${projectType}
- Target Platforms: ${Array.isArray(platforms) ? platforms.join(', ') : platforms}
- Key Features Requested: ${Array.isArray(features) ? features.join(', ') : features}
- Preferred Timeline: ${timeline || 'Flexible'}
- Estimated Budget Range: ${budget || 'To be determined'}

Generate a professional Technical Scope & Proposal Outline:
1. **Recommended Architecture & Tech Stack**
2. **Development Phases & Milestones**
3. **Realistic Delivery Timeline**
4. **Estimated Cost Breakdown in Nigerian Naira (₦)**
5. **Next Steps to Kickstart with Ocean Technologies**
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: OCEAN_SYSTEM_PROMPT,
        temperature: 0.5,
      },
    });

    res.json({
      proposal: response.text,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/estimate:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate estimate proposal.',
    });
  }
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
