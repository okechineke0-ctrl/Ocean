import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, MessageSquare, Wrench, Calculator, Copy, Check, ExternalLink, RefreshCw, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'How much to build an E-commerce store in Nigeria?',
  'Can Ocean Technologies build iOS and Android apps?',
  'My website is down with a 500 server error, can you help?',
  'What are your monthly website maintenance plans?',
];

export const AiAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'estimate' | 'triage'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "Hello! I'm the **Ocean Technologies AI Consultant**. How can I assist you with your website, mobile app, or software project today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estimator Form State
  const [estimatorType, setEstimatorType] = useState('Web Application / Portal');
  const [estimatorPlatforms, setEstimatorPlatforms] = useState('Web & Mobile Browser');
  const [estimatorFeatures, setEstimatorFeatures] = useState('Authentication, Cloud Backend, Paystack/Flutterwave Payments, Admin Dashboard');
  const [estimatorTimeline, setEstimatorTimeline] = useState('3-4 Weeks');
  const [estimatorResult, setEstimatorResult] = useState<string | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  // Triage Form State
  const [triageUrl, setTriageUrl] = useState('');
  const [triageIssueType, setTriageIssueType] = useState('500 Server Error / Crash');
  const [triageDescription, setTriageDescription] = useState('');
  const [triageResult, setTriageResult] = useState<string | null>(null);
  const [isTriaging, setIsTriaging] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text || 'Thank you for your message. Ocean Technologies engineers are available to review your project or technical repair.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `### **Ocean Technologies Engineering Support**\n\nOur engineering team is actively available to review your custom requirements, website issues, or quote request.\n\n- **Direct WhatsApp Line**: [**09129216768**](https://wa.me/2349129216768)\n- **Official Email**: **oceantechnologies62@gmail.com**\n- **Technical Team**: Ocean Technologies Software & Cloud Engineering Group\n\nYou can also click the **WhatsApp** button below to forward your message directly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunEstimator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEstimating) return;

    setIsEstimating(true);
    setEstimatorResult(null);

    try {
      const response = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: estimatorType,
          platforms: estimatorPlatforms,
          features: estimatorFeatures,
          timeline: estimatorTimeline,
        }),
      });

      const data = await response.json();
      setEstimatorResult(data.proposal || 'Scope generated successfully.');
    } catch {
      setEstimatorResult(`### **Ocean Technologies Project Estimate**\n\n- **Category**: ${estimatorType}\n- **Estimated Budget Range**: ₦450,000 – ₦1,250,000 (depending on custom features)\n- **Timeline**: ${estimatorTimeline}\n\nTo receive a detailed line-item invoice, please message Engr. Kechineke on WhatsApp at **09129216768**.`);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleRunTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTriaging || !triageDescription) return;

    setIsTriaging(true);
    setTriageResult(null);

    try {
      const response = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: triageUrl,
          issueType: triageIssueType,
          description: triageDescription,
        }),
      });

      const data = await response.json();
      setTriageResult(data.triageReport || 'Diagnostic analysis completed.');
    } catch {
      setTriageResult(`### **Ocean Technologies Emergency Recovery**\n\n- **Issue Reported**: ${triageIssueType}\n- **Status**: Ready for immediate engineer dispatch\n- **Turnaround**: Same-day recovery (1–4 hours)\n- **Cost Estimate**: ₦35,000 – ₦120,000\n\nPlease call or message **09129216768** immediately on WhatsApp for priority intervention.`);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppShare = (content: string) => {
    const encoded = encodeURIComponent(`Hello Ocean Technologies, I used your AI assistant to generate this project inquiry:\n\n${content}`);
    window.open(`https://wa.me/2349129216768?text=${encoded}`, '_blank');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 bg-slate-900/95 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md text-xs font-semibold tracking-wide transition-all duration-200 hover:border-sky-400/60 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-12 transition-transform" />
            <span>AI Consultant</span>
          </button>
        )}
        <button
          id="ocean-ai-assistant-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Assistant" : "Open Ocean AI Assistant"}
          className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-sky-400/40 cursor-pointer shadow-xl ${
            isOpen
              ? 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              : 'bg-gradient-to-tr from-slate-950 via-slate-900 to-sky-900 text-white border border-sky-400/40 hover:border-sky-400 hover:shadow-sky-500/25 hover:scale-105 active:scale-95'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-300" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 border border-slate-950"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Main AI Assistant Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-22 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[440px] max-h-[82vh] h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white font-display">Ocean AI Consultant</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-xs text-sky-200/80">Architecture & Technical Guidance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100/90 p-1.5 border-b border-slate-200 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-sky-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span>Live Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('estimate')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'estimate'
                  ? 'bg-white text-sky-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-sky-600" />
              <span>AI Estimator</span>
            </button>
            <button
              onClick={() => setActiveTab('triage')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'triage'
                  ? 'bg-white text-sky-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-sky-600" />
              <span>Bug Triage</span>
            </button>
          </div>

          {/* Tab 1: Live AI Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-normal">
                        {msg.text}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="text-[10px] text-slate-600 hover:text-slate-800 flex items-center gap-0.5"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleWhatsAppShare(msg.text)}
                            title="Forward to Ocean Tech WhatsApp"
                            className="text-[10px] text-emerald-800 hover:underline flex items-center gap-0.5 font-medium"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-sky-700 bg-sky-50 px-3 py-2 rounded-xl border border-sky-200 w-fit animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                    <span>Ocean AI is analyzing your request...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length < 3 && (
                <div className="px-4 py-2 bg-white border-t border-slate-200">
                  <p className="text-[11px] font-medium text-slate-600 mb-1.5">Common questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Box */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about pricing, tech stack, or bug fixes..."
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: AI Project Estimator */}
          {activeTab === 'estimate' && (
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-900">
                <p className="font-semibold mb-0.5">Automated Scope & Price Generator</p>
                <p className="text-sky-700">Get an instant AI-drafted breakdown of timeline, tech stack, and budget in Nigerian Naira (₦).</p>
              </div>

              <form onSubmit={handleRunEstimator} className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project Category</label>
                  <select
                    value={estimatorType}
                    onChange={(e) => setEstimatorType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option>Corporate Website</option>
                    <option>E-Commerce Multi-Vendor Store</option>
                    <option>Web Application / Portal</option>
                    <option>Mobile App (Android & iOS)</option>
                    <option>Custom SaaS Platform</option>
                    <option>Student / School Management System</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Platforms</label>
                  <input
                    type="text"
                    value={estimatorPlatforms}
                    onChange={(e) => setEstimatorPlatforms(e.target.value)}
                    placeholder="e.g. Web, Android Play Store, iOS App Store"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Key Features</label>
                  <textarea
                    rows={2}
                    value={estimatorFeatures}
                    onChange={(e) => setEstimatorFeatures(e.target.value)}
                    placeholder="e.g. Online payments, user profiles, notifications, admin panel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Desired Timeline</label>
                    <select
                      value={estimatorTimeline}
                      onChange={(e) => setEstimatorTimeline(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                    >
                      <option>1-2 Weeks (Urgent)</option>
                      <option>3-4 Weeks (Standard)</option>
                      <option>6-8 Weeks (Full Custom)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isEstimating}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      {isEstimating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Calculate Scope</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {estimatorResult && (
                <div className="bg-white border border-sky-200 rounded-xl p-3.5 text-xs text-slate-800 shadow-sm space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-sky-950 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      Ocean AI Proposal Breakdown
                    </span>
                    <button
                      onClick={() => handleWhatsAppShare(estimatorResult)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Send to WhatsApp</span>
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                    {estimatorResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Bug Triage */}
          {activeTab === 'triage' && (
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-900">
                <p className="font-semibold mb-0.5">Instant AI Bug & Downtime Diagnostic</p>
                <p className="text-rose-700">Troubleshoot 500 errors, broken checkouts, DNS failures, or crashing mobile apps.</p>
              </div>

              <form onSubmit={handleRunTriage} className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Issue Category</label>
                  <select
                    value={triageIssueType}
                    onChange={(e) => setTriageIssueType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option>500 Internal Server Error / Website Down</option>
                    <option>Broken Payment Gateway / Webhook Failure</option>
                    <option>Server & API Connection / Timeout Error</option>
                    <option>SSL Certificate / HTTPS Security Warning</option>
                    <option>Hacked Site / WordPress Malware Infection</option>
                    <option>Mobile App Build / Play Store Crash</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Affected Website or App URL (Optional)</label>
                  <input
                    type="text"
                    value={triageUrl}
                    onChange={(e) => setTriageUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Describe What Happened</label>
                  <textarea
                    rows={3}
                    value={triageDescription}
                    onChange={(e) => setTriageDescription(e.target.value)}
                    required
                    placeholder="e.g. When customers click Checkout, the screen goes white or shows 'Connection failed'..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTriaging || !triageDescription}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  {isTriaging ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Diagnosing Issue...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Run AI Diagnostic</span>
                    </>
                  )}
                </button>
              </form>

              {triageResult && (
                <div className="bg-white border border-rose-200 rounded-xl p-3.5 text-xs text-slate-800 shadow-sm space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-rose-950 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-rose-600" />
                      Ocean AI Diagnostic Report
                    </span>
                    <button
                      onClick={() => handleWhatsAppShare(triageResult)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Dispatch on WhatsApp</span>
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                    {triageResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="bg-slate-100 px-4 py-2 text-[10px] text-slate-500 border-t border-slate-200 flex items-center justify-between">
            <span>Ocean Technologies • Technical Support</span>
            <span className="font-mono text-slate-600">WhatsApp: 09129216768</span>
          </div>
        </div>
      )}
    </>
  );
};
