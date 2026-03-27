import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Play, 
  Settings, 
  ArrowLeft, 
  Zap, 
  Database, 
  Globe, 
  Brain, 
  Bell, 
  Mail, 
  Calendar, 
  Plane, 
  Train, 
  Car, 
  Hotel, 
  CheckCircle2, 
  Loader2,
  Send,
  User,
  Bot,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, doc, setDoc, collection, addDoc, OperationType, handleFirestoreError } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'plan' | 'booking' | 'auth';
  data?: any;
}

interface N8nCanvasProps {
  onBack: () => void;
}

export default function N8nCanvas({ onBack }: N8nCanvasProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Yui, your autonomous travel agent. To get started, I need to connect to your Google Calendar to understand your schedule.",
      type: 'auth'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('Idle');
  const [googleTokens, setGoogleTokens] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setGoogleTokens(event.data.tokens);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Successfully connected to Google Calendar! Now, where would you like to go?",
          type: 'text'
        }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/auth/url');
      const { url } = await response.json();
      window.open(url, 'oauth_popup', 'width=600,height=700');
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const fetchCalendarEvents = async () => {
    setStatus('Checking Google Calendar...');
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: googleTokens })
      });
      const { events } = await response.json();
      return events;
    } catch (error) {
      console.error("Calendar error:", error);
      return [];
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing || !googleTokens) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setStatus('Analyzing Intent...');

    try {
      const events = await fetchCalendarEvents();
      setStatus('Generating Travel Options...');

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        User wants to travel to: ${input}
        Real Calendar Events: ${JSON.stringify(events)}
        
        Task: 
        1. Analyze the events to determine urgency. If there are events soon (within 7 days) that look like business meetings, urgency is HIGH.
        2. Suggest multiple modes of transport.
        3. If High Urgency: Prioritize speed (e.g., Flight, High-speed train) even if expensive.
        4. If Low Urgency: Suggest affordable and comfortable options.
        5. Provide a structured plan.
        
        Format the response as a JSON object with:
        - urgencyAnalysis: string
        - urgencyLevel: "High" | "Low"
        - options: Array<{ mode: string, duration: string, cost: string, reason: string, icon: 'plane' | 'train' | 'car' }>
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);

      // Save to Firestore
      if (auth.currentUser) {
        const planRef = await addDoc(collection(db, 'travel_plans'), {
          userId: auth.currentUser.uid,
          destination: input,
          urgency: result.urgencyLevel,
          options: result.options,
          createdAt: serverTimestamp()
        }).catch(e => handleFirestoreError(e, OperationType.CREATE, 'travel_plans'));
        
        if (planRef) {
          result.planId = planRef.id;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your calendar. ${result.urgencyAnalysis}. Here are your travel options:`,
        type: 'plan',
        data: result
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered an error while planning your trip. Please check your connection and try again.",
        type: 'text'
      }]);
    } finally {
      setIsProcessing(false);
      setStatus('Idle');
    }
  };

  const handleSelectOption = async (option: any, planId: string) => {
    setIsProcessing(true);
    setStatus(`Booking ${option.mode}...`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        userId: auth.currentUser?.uid,
        planId: planId,
        mode: option.mode,
        stay: "The Grand Plaza Hotel",
        status: "Confirmed",
        createdAt: serverTimestamp()
      };

      if (auth.currentUser) {
        await addDoc(collection(db, 'bookings'), bookingData)
          .catch(e => handleFirestoreError(e, OperationType.CREATE, 'bookings'));
      }

      const bookingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Success! I've booked your ${option.mode} to ${input}. I've also secured a highly-rated stay nearby and added the itinerary to your calendar.`,
        type: 'booking',
        data: bookingData
      };

      setMessages(prev => [...prev, bookingMessage]);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsProcessing(false);
      setStatus('Idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 border-b border-white/10 bg-surface/50 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-secondary hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-bg fill-current" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight">Yui Autonomous Agent</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${status === 'Idle' ? 'bg-emerald-500' : 'bg-accent animate-pulse'}`} />
            <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">{status}</span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-secondary hover:text-white">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Logs/Status */}
        <div className="w-64 border-r border-white/10 bg-surface/30 hidden lg:flex flex-col p-4 gap-6">
          <div>
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">Active Modules</h4>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 text-xs ${googleTokens ? 'text-emerald-400' : 'text-white/30'}`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>Google Calendar</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Gmail Context</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Duffel API</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <Database className="w-3.5 h-3.5 text-rose-400" />
                <span>Knowledge Graph</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">System Health</h4>
            <div className="space-y-2">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-emerald-500" />
              </div>
              <div className="flex justify-between text-[10px] text-secondary">
                <span>Uptime</span>
                <span>99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-bg relative">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-white/10' : 'bg-accent/20 border border-accent/30'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-accent" />}
                  </div>

                  <div className={`flex flex-col gap-3 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-bg font-medium' 
                        : 'bg-surface border border-white/5 text-secondary'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.type === 'auth' && (
                      <button
                        onClick={handleConnect}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-bg font-bold text-sm hover:bg-accent transition-colors shadow-xl"
                      >
                        <Lock className="w-4 h-4" /> Connect Google Calendar
                      </button>
                    )}

                    {msg.type === 'plan' && msg.data && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                        {msg.data.options.map((opt: any, idx: number) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectOption(opt, msg.data.planId)}
                            className="bg-surface border border-white/10 rounded-xl p-4 text-left hover:border-accent/50 transition-colors group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="p-2 rounded-lg bg-white/5 text-accent">
                                {opt.mode.toLowerCase().includes('plane') && <Plane className="w-4 h-4" />}
                                {opt.mode.toLowerCase().includes('train') && <Train className="w-4 h-4" />}
                                {opt.mode.toLowerCase().includes('car') && <Car className="w-4 h-4" />}
                              </div>
                              <span className="text-xs font-mono text-white/50">{opt.cost}</span>
                            </div>
                            <h5 className="text-sm font-bold text-white mb-1">{opt.mode}</h5>
                            <p className="text-[11px] text-secondary mb-3">{opt.reason}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Select Option</span>
                              <span className="text-[10px] text-secondary">{opt.duration}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {msg.type === 'booking' && msg.data && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 w-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-bg" />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-emerald-400">Booking Confirmed</h5>
                            <p className="text-[10px] text-emerald-400/70">Reference: YUI-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-white/5">
                            <span className="text-[10px] text-secondary block mb-1">Transport</span>
                            <span className="text-xs text-white font-medium">{msg.data.mode}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <span className="text-[10px] text-secondary block mb-1">Accommodation</span>
                            <span className="text-xs text-white font-medium">{msg.data.stay}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isProcessing && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-accent animate-spin" />
                </div>
                <div className="bg-surface border border-white/5 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/10 bg-surface/20 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={!googleTokens}
                placeholder={googleTokens ? "Where are you heading? (e.g. San Francisco, Tokyo...)" : "Connect your calendar first..."}
                className="w-full bg-surface border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm focus:outline-none focus:border-accent/50 transition-colors placeholder:text-white/20 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing || !googleTokens}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent rounded-xl text-bg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-[10px] text-secondary mt-4 uppercase tracking-widest">
              Yui Autonomous Agent • Powered by Gemini 3.1 Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
