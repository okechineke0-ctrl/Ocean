import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Wrench, Calculator, Copy, Check, ExternalLink, RefreshCw, Code2 } from 'lucide-react';

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

// GitHub Copilot-style Bot Icon Component
const GitHubBotIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Head */}
    <circle cx="12" cy="8" r="4" />
    {/* Body */}
    <path d="M12 12v8" />
    {/* Left arm */}
    <path d="M8 14l-2 3" />
    {/* Right arm */}
    <path d="M16 14l2 3" />
    {/* Left leg */}
    <path d="M9 20v2" />
    {/* Right leg */}
    <path d="M15 20v2" />
    {/* AI indicator - stylized dot */}
    <circle cx="12" cy="8" r="6" fill="none" strokeDasharray="2 2" opacity="0.6" />
  </svg>
);

export const AiAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'estimate' | 'triage'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "👋 **Welcome to Ocean Technologies AI Assistant**\n\nI'm here to help you with:\n• Project pricing & timelines\n• Technical troubleshooting\n• Service inquiries\n• Quick consultations\n\nHow can I assist you today?",
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
        text: `### **Ocean Technologies Engineering Support**\n\nOur engineering team is actively available to review your custom requirements, website issues, or quote request.\n\n- **Direct WhatsApp**: +234 912 921 6768\n- **Email**: oceantechnologies62@gmail.com`,
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
      setEstimatorResult(`### **Ocean Technologies Project Estimate**\n\n- **Category**: ${estimatorType}\n- **Estimated Budget Range**: ₦450,000 – ₦1,250,000 (depending on custom features)\n- **Timeline**: ${estimatorTimeline}`);
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
      setTriageResult(`### **Ocean Technologies Emergency Recovery**\n\n- **Issue Reported**: ${triageIssueType}\n- **Status**: Ready for immediate engineer dispatch\n- **Turnaround**: Same-day resolution (1-4 hours)`);
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
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200 text-xs font-semibold text-slate-800 animate-pulse">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>Ask AI Assistant</span>
          </div>
        )}
        <button
          id="ocean-ai-assistant-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Ocean AI Assistant"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <GitHubBotIcon className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Main AI Assistant Dialog */}
      {isOpen && (
        <div className="fixed bottom-22 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[480px] max-h-[80vh] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
          {/* Header - Professional Dark Theme */}
          <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-700 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white">Ocean AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-300">Professional Tech Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-50 border-b border-slate-200 p-1.5 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all font-medium ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('estimate')}
              className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all font-medium ${
                activeTab === 'estimate'
                  ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Estimator</span>
            </button>
            <button
              onClick={() => setActiveTab('triage')}
              className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all font-medium ${
                activeTab === 'triage'
                  ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Triage</span>
            </button>
          </div>

          {/* Tab 1: Live AI Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed font-medium ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                          : 'bg-slate-100 text-slate-800 border border-slate-300 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-normal">
                        {msg.text}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 px-1">
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="text-[10px] text-slate-600 hover:text-slate-800 flex items-center gap-0.5 hover:bg-slate-200 rounded px-1.5 py-0.5 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleWhatsAppShare(msg.text)}
                            title="Forward to Ocean Tech WhatsApp"
                            className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 font-semibold hover:bg-emerald-100 rounded px-1.5 py-0.5 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Share</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-2.5 rounded-xl border border-blue-200 w-fit animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Analyzing your request...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length < 3 && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-600 mb-2">Quick prompts:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-300 transition-all text-left hover:border-blue-300 font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Box */}
              <div className="p-3.5 bg-white border-t border-slate-200">
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
                    placeholder="Ask anything..."
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: AI Project Estimator */}
          {activeTab === 'estimate' && (
            <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                <p className="font-semibold mb-1">📊 Instant Price Calculator</p>
                <p className="text-blue-700">Get AI-powered project scope & pricing in Nigerian Naira (₦)</p>
              </div>

              <form onSubmit={handleRunEstimator} className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Project Type</label>
                  <select
                    value={estimatorType}
                    onChange={(e) => setEstimatorType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-medium"
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
                  <label className="font-semibold text-slate-700 block mb-1.5">Target Platforms</label>
                  <input
                    type="text"
                    value={estimatorPlatforms}
                    onChange={(e) => setEstimatorPlatforms(e.target.value)}
                    placeholder="e.g. Web, iOS App Store, Android Play Store"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Key Features</label>
                  <textarea
                    rows={2}
                    value={estimatorFeatures}
                    onChange={(e) => setEstimatorFeatures(e.target.value)}
                    placeholder="e.g. User auth, payments, admin panel..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">Timeline</label>
                    <select
                      value={estimatorTimeline}
                      onChange={(e) => setEstimatorTimeline(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    >
                      <option>1-2 Weeks</option>
                      <option>3-4 Weeks</option>
                      <option>6-8 Weeks</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isEstimating}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      {isEstimating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Calculate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {estimatorResult && (
                <div className="bg-slate-50 border border-blue-200 rounded-lg p-3.5 text-xs text-slate-800 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <span className="font-bold text-slate-900">Estimate Breakdown</span>
                    <button
                      onClick={() => handleWhatsAppShare(estimatorResult)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">
                    {estimatorResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Bug Triage */}
          {activeTab === 'triage' && (
            <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-900">
                <p className="font-semibold mb-1">🔧 Emergency Diagnostics</p>
                <p className="text-orange-700">Get instant AI analysis of website errors & crashes</p>
              </div>

              <form onSubmit={handleRunTriage} className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Issue Type</label>
                  <select
                    value={triageIssueType}
                    onChange={(e) => setTriageIssueType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white font-medium"
                  >
                    <option>500 Internal Server Error</option>
                    <option>Payment Gateway Failure</option>
                    <option>Connection Timeout</option>
                    <option>SSL Certificate Error</option>
                    <option>Malware / Hacked Site</option>
                    <option>Mobile App Crash</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Website/App URL (Optional)</label>
                  <input
                    type="text"
                    value={triageUrl}
                    onChange={(e) => setTriageUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Problem Description</label>
                  <textarea
                    rows={3}
                    value={triageDescription}
                    onChange={(e) => setTriageDescription(e.target.value)}
                    required
                    placeholder="Describe what happened..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTriaging || !triageDescription}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  {isTriaging ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Run Diagnostic</span>
                    </>
                  )}
                </button>
              </form>

              {triageResult && (
                <div className="bg-slate-50 border border-orange-200 rounded-lg p-3.5 text-xs text-slate-800 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <span className="font-bold text-slate-900">Diagnostic Report</span>
                    <button
                      onClick={() => handleWhatsAppShare(triageResult)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Dispatch</span>
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">
                    {triageResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="bg-slate-800 px-4 py-2.5 text-[10px] text-slate-400 border-t border-slate-700 flex items-center justify-between rounded-b-2xl">
            <span>Ocean Technologies • Agbani, Enugu</span>
            <span className="font-mono text-slate-500 text-[9px]">WhatsApp: +234 912 921 6768</span>
          </div>
        </div>
      )}
    </>
  );
};
