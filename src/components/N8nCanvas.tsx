import { useState, useEffect, useRef, useMemo } from 'react';
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
  Lock,
  Sparkles,
  Search,
  Cpu,
  Network,
  MapPin,
  Clock,
  Navigation,
  Info,
  ChevronRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Handle, 
  Position,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { db, auth, doc, setDoc, collection, addDoc, OperationType, handleFirestoreError } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';
import { useAppSounds } from '../hooks/useAppSounds';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'plan' | 'booking' | 'auth' | 'itinerary' | 'question';
  data?: any;
}

interface N8nCanvasProps {
  onBack: () => void;
}

const THINKING_STEPS = [
  { id: 'calendar', label: 'Accessing Calendar...', icon: <Calendar className="w-4 h-4" />, color: 'text-blue-400' },
  { id: 'intent', label: 'Analyzing Intent...', icon: <Brain className="w-4 h-4" />, color: 'text-purple-400' },
  { id: 'search', label: 'Web Research...', icon: <Search className="w-4 h-4" />, color: 'text-blue-500' },
  { id: 'maps', label: 'Geospatial Analysis...', icon: <MapPin className="w-4 h-4" />, color: 'text-red-400' },
  { id: 'gds', label: 'GDS API Handshake...', icon: <Plane className="w-4 h-4" />, color: 'text-emerald-400' },
  { id: 'hotels', label: 'Inventory Sync...', icon: <Hotel className="w-4 h-4" />, color: 'text-amber-400' },
  { id: 'reasoning', label: 'Neural Optimization...', icon: <Cpu className="w-4 h-4" />, color: 'text-rose-400' },
  { id: 'finalizing', label: 'Synthesizing Plan...', icon: <Sparkles className="w-4 h-4" />, color: 'text-accent' },
];

const ItineraryNode = ({ data }: any) => (
  <div className={`p-3 rounded-xl border ${data.type === 'transport' ? 'bg-accent/10 border-accent/30' : 'bg-white/5 border-white/10'} min-w-[150px]`}>
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-accent" />
    <div className="flex items-center gap-2 mb-1">
      <div className={`p-1.5 rounded-lg ${data.type === 'transport' ? 'bg-accent text-bg' : 'bg-white/10 text-secondary'}`}>
        {data.icon}
      </div>
      <span className="text-xs font-bold text-white">{data.label}</span>
    </div>
    {data.subtext && <p className="text-[10px] text-secondary">{data.subtext}</p>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-accent" />
  </div>
);

// Custom Node for Memory Graph
const MemoryNode = ({ data }: any) => (
  <div className={`p-4 rounded-2xl border bg-surface/90 backdrop-blur-2xl transition-all shadow-2xl ${data.isCenter ? 'border-accent shadow-[0_0_30px_rgba(242,125,38,0.3)] scale-110' : 'border-white/10 hover:border-accent/40 hover:shadow-accent/10'}`}>
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <div className="flex flex-col items-center gap-2">
      <div className={`p-2.5 rounded-xl ${data.isCenter ? 'bg-accent text-bg' : 'bg-white/5 text-accent'} shadow-lg`}>
        {data.icon || <Brain className="w-5 h-5" />}
      </div>
      <div className="text-center">
        <h3 className="text-[11px] font-bold text-white leading-tight tracking-tight">{data.label}</h3>
        {data.value && <p className="text-[9px] text-secondary mt-1 max-w-[140px] whitespace-pre-wrap">{data.value}</p>}
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </div>
);

const nodeTypes = {
  itinerary: ItineraryNode,
  memory: MemoryNode,
};

function ItineraryVisualizer({ data }: { data: any }) {
  const [view, setView] = useState<'flow' | 'cards' | 'table'>('cards');
  const { playClick, playHover } = useAppSounds();

  const nodes: Node[] = useMemo(() => {
    const result: Node[] = [];
    data.steps.forEach((step: any, idx: number) => {
      // Create a zigzag or staggered layout for a more "map-like" feel
      const x = 250 + (idx % 2 === 0 ? 100 : -100);
      const y = idx * 120;
      
      result.push({
        id: `node-${idx}`,
        type: 'itinerary',
        position: { x, y },
        data: { 
          label: step.title, 
          type: step.type, 
          subtext: step.details,
          icon: step.type === 'transport' ? <Navigation className="w-3 h-3" /> : <MapPin className="w-3 h-3" />
        },
      });
    });
    return result;
  }, [data]);

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      result.push({
        id: `edge-${i}`,
        source: `node-${i}`,
        target: `node-${i+1}`,
        animated: true,
        style: { stroke: '#F27D26', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F27D26' },
      });
    }
    return result;
  }, [nodes]);

  return (
    <div className="w-full mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button 
            onClick={() => { playClick(); setView('cards'); }}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${view === 'cards' ? 'bg-accent text-bg shadow-lg' : 'text-secondary hover:text-white'}`}
          >
            Stacked Cards
          </button>
          <button 
            onClick={() => { playClick(); setView('table'); }}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${view === 'table' ? 'bg-accent text-bg shadow-lg' : 'text-secondary hover:text-white'}`}
          >
            Schedule Table
          </button>
          <button 
            onClick={() => { playClick(); setView('flow'); }}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${view === 'flow' ? 'bg-accent text-bg shadow-lg' : 'text-secondary hover:text-white'}`}
          >
            System Flow
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">{data.totalDuration}</span>
          </div>
          <div className="text-[10px] text-secondary font-mono flex items-center gap-1.5">
            <Navigation className="w-3 h-3" />
            {data.totalDistance}
          </div>
          {data.mapsUrl && (
            <motion.a
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-bg font-bold text-[10px] uppercase tracking-wider shadow-lg hover:shadow-accent/40 transition-all"
            >
              <MapPin className="w-3 h-3" />
              Open in Google Maps
            </motion.a>
          )}
        </div>
      </div>

      <div className="relative min-h-[400px] w-full bg-surface/50 rounded-2xl border border-white/5 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'flow' ? (
            <motion.div 
              key="flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                className="bg-grid"
              >
                <Background color="#333" gap={20} />
                <Controls className="bg-surface border-white/10" />
              </ReactFlow>
            </motion.div>
          ) : view === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 overflow-x-auto"
            >
              <div className="min-w-[600px]">
                <div className="grid grid-cols-4 gap-4 pb-4 border-b border-white/10 text-[10px] font-bold text-secondary uppercase tracking-widest">
                  <div>Time</div>
                  <div>Activity / Transport</div>
                  <div>Details</div>
                  <div>Distance</div>
                </div>
                <div className="divide-y divide-white/5">
                  {data.steps.map((step: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="grid grid-cols-4 gap-4 py-4 group hover:bg-white/5 transition-all rounded-lg px-2"
                    >
                      <div className="text-xs font-mono text-accent flex items-center">{step.time}</div>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${step.type === 'transport' ? 'bg-accent/20 text-accent shadow-[0_0_15px_rgba(242,125,38,0.2)]' : 'bg-white/10 text-secondary'}`}>
                          {step.type === 'transport' ? <Navigation className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-accent transition-colors">{step.title}</span>
                      </div>
                      <div className="text-xs text-secondary leading-relaxed flex items-center">{step.details}</div>
                      <div className="text-xs font-mono text-secondary/50 flex items-center">
                        {step.distance ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-accent/30" />
                            {step.distance}
                          </div>
                        ) : '-'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4"
            >
              {data.steps.map((step: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  {idx < data.steps.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-[-16px] w-[2px] border-l-2 border-dotted border-accent/30 z-0" />
                  )}
                  <div className="flex gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      step.type === 'transport' ? 'bg-accent text-bg' : 'bg-surface border border-white/10 text-accent'
                    }`}>
                      {step.type === 'transport' ? <Navigation className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 bg-surface/80 backdrop-blur-md border border-white/5 p-4 rounded-xl hover:border-accent/30 transition-all group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{step.title}</h4>
                        <span className="text-[10px] font-mono text-secondary">{step.time}</span>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed">{step.details}</p>
                      {step.distance && (
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-accent/70 font-bold">
                          <Navigation className="w-3 h-3" />
                          <span>{step.distance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://interstate-libs-uploaded-encouraged.trycloudflare.com';

function MemoryGraphOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const { playClick, playPop, playSuccess } = useAppSounds();

  const fetchMemory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/memory`);
      const data = await response.json();
      if (data.success) {
        const prefs = data.preferences;
        
        const newNodes: Node[] = [
          {
            id: 'center',
            type: 'memory',
            position: { x: 0, y: 0 },
            data: { label: 'YUI MEMORY', isCenter: true, icon: <Brain className="w-6 h-6" /> }
          }
        ];
        
        const newEdges: Edge[] = [];
        
        Object.entries(prefs).forEach(([key, value], idx) => {
          const angle = (idx / Object.keys(prefs).length) * 2 * Math.PI;
          const radius = 250;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          const nodeId = `mem-${key}`;
          newNodes.push({
            id: nodeId,
            type: 'memory',
            position: { x, y },
            data: { label: key.toUpperCase(), value: String(value) }
          });
          
          newEdges.push({
            id: `edge-${key}`,
            source: 'center',
            target: nodeId,
            animated: true,
            style: { stroke: 'rgba(242,125,38,0.2)', strokeWidth: 1 },
          });
        });
        
        setNodes(newNodes);
        setEdges(newEdges);
      }
    } catch (error) {
      console.error("Memory fetch error:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMemory();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!newKey || !newValue) return;
    playClick();
    try {
      const response = await fetch(`${BACKEND_URL}/api/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: { [newKey]: newValue } })
      });
      if (response.ok) {
        playSuccess();
        setNewKey('');
        setNewValue('');
        fetchMemory();
      }
    } catch (error) {
      console.error("Memory save error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[200] bg-bg/80 backdrop-blur-2xl flex flex-col items-center justify-center p-8"
        >
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <Brain className="w-7 h-7 text-bg" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">Yui Memory</h2>
                <p className="text-xs text-secondary">Manage persistent travel preferences and identity.</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-secondary hover:text-white transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full h-full relative rounded-3xl border border-white/5 overflow-hidden bg-grid-dense shadow-inner mt-20">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-transparent"
            >
              <Background color="#333" gap={40} size={1} />
            </ReactFlow>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center pointer-events-none">
              <div className="bg-surface/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2 pointer-events-auto shadow-2xl">
                <input 
                  type="text" 
                  placeholder="Topic (e.g. Home)" 
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-accent/40 w-40 transition-all"
                />
                <input 
                  type="text" 
                  placeholder="Memory (e.g. MAA)" 
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-accent/40 w-60 transition-all"
                />
                <button 
                  onClick={handleAdd}
                  className="px-6 py-2 bg-accent text-bg font-bold text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                >
                  Save to Memory
                </button>
              </div>
              <div className="bg-surface/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-wrap gap-2 pointer-events-auto shadow-2xl items-center">
                <button 
                  onClick={async () => {
                    playClick();
                    try {
                      const response = await fetch(`${BACKEND_URL}/api/auth/url`);
                      const { url } = await response.json();
                      window.open(url, 'oauth_popup', 'width=600,height=700');
                    } catch (error) {
                      console.error("Auth error:", error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <Mail className="w-3 h-3" />
                  Link Google Workspace 🌐
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button 
                  onClick={async () => {
                    const response = await fetch(`${BACKEND_URL}/api/memory`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ preferences: { "Auto-Email": "Enabled" } })
                    });
                    if (response.ok) fetchMemory();
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all"
                >
                  ⚡ Enable Auto-Email
                </button>
                <button 
                  onClick={async () => {
                    const response = await fetch(`${BACKEND_URL}/api/memory`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ preferences: { "Auto-Email": "Disabled" } })
                    });
                    if (response.ok) fetchMemory();
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all"
                >
                  🚫 Disable Auto-Email
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function N8nCanvas({ onBack }: N8nCanvasProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Yui, your autonomous travel agent. I can help you plan complex tours, book transport, and manage disruptions. To get started, I can connect to your Google Calendar to understand your schedule, or we can jump straight to planning.",
      type: 'auth'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingStep, setThinkingStep] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('Idle');
  const [googleTokens, setGoogleTokens] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playClick, playHover, playPop, playSuccess, playAlert } = useAppSounds();
  const [isMemoryMapOpen, setIsMemoryMapOpen] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinkingStep]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        playSuccess();
        setGoogleTokens(event.data.tokens);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Successfully connected to Google Calendar! Now, where would you like to go? I can also create a detailed tour schedule for you.",
          type: 'text'
        }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [playSuccess]);

  const handleConnect = async () => {
    playClick();
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/url`);
      const { url } = await response.json();
      window.open(url, 'oauth_popup', 'width=600,height=700');
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const fetchCalendarEvents = async () => {
    if (!googleTokens) return [];
    try {
      const response = await fetch(`${BACKEND_URL}/api/calendar/events`, {
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
    if (!input.trim() || isProcessing) return;

    playClick();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setStatus('Processing...');

    // 1. Prepare Backend Call (DO NOT WAIT YET)
    const performBackendCall = async () => {
      try {
        const events = await fetchCalendarEvents();
        setStatus('Grounding with Real-Time Data...');
        
        const response = await fetch(`${BACKEND_URL}/api/n8n-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, events })
        });
        
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
      } catch (error) {
        throw error;
      }
    };

    const backendPromise = performBackendCall();

    // 2. Simulate thinking process (runs concurrently)
    // We'll go through at least first 4 steps, then check if backend is done
    for (let i = 0; i < THINKING_STEPS.length; i++) {
      setThinkingStep(i);
      playPop();
      
      // Minimum time per step
      await new Promise(r => setTimeout(r, 600 + Math.random() * 200));
      
      // If we've done a few steps and backend is already finished, we can speed up or jump to final
      if (i >= 3) {
        // Check if promise is resolved (not easy in JS directly without a wrapper, 
        // but we'll just keep it simple and finish at least 6 steps for 'vibe')
      }
    }

    try {
      const result = await backendPromise;

      // Save to Firestore if it's a plan or itinerary
      if (auth.currentUser && (result.type === 'plan' || result.type === 'itinerary')) {
        await addDoc(collection(db, 'travel_plans'), {
          userId: auth.currentUser.uid,
          destination: input,
          type: result.type,
          data: result.data,
          createdAt: serverTimestamp()
        }).catch(e => handleFirestoreError(e, OperationType.CREATE, 'travel_plans'));
      }

      setThinkingStep(null);
      playSuccess();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.content,
        type: result.type,
        data: result.data
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setThinkingStep(null);
      playAlert();
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I encountered an error while processing your request. Please try again.",
        type: 'text'
      }]);
    } finally {
      setIsProcessing(false);
      setStatus('Idle');
    }
  };

  const handleSelectOption = async (option: any, planId: string) => {
    playClick();
    setIsProcessing(true);
    setStatus(`Booking ${option.mode}...`);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/book-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          offer_id: option.offerId,
          user_id: auth.currentUser?.uid 
        })
      });
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      playSuccess();
      
      // 1. Add Booking Success Message
      const bookingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.content,
        type: 'booking',
        data: {
          order_id: result.order_id,
          status: 'Confirmed',
          mode: result.mode,
          stay: result.stay
        }
      };
      setMessages(prev => [...prev, bookingMessage]);

      // 2. Add Proactive Recommendations (if any)
      if (result.recommendations && result.recommendations.length > 0) {
        setTimeout(() => {
          result.recommendations.forEach((rec: any, index: number) => {
            setTimeout(() => {
              const recMessage: Message = {
                id: (Date.now() + 100 + index).toString(),
                role: 'assistant',
                content: rec.content,
                type: rec.type,
                data: rec.params || {}
              };
              setMessages(prev => [...prev, recMessage]);
              playPop();
            }, index * 1000);
          });
        }, 1500);
      }

    } catch (error: any) {
      console.error("Booking error:", error);
      playAlert();
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Booking failed: ${error.message || 'Unknown error'}`,
        type: 'text'
      }]);
    } finally {
      setIsProcessing(false);
      setStatus('Idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg flex flex-col font-sans overflow-hidden">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Header */}
      <header className="h-14 border-b border-white/10 bg-surface/30 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { playClick(); onBack(); }}
            onMouseEnter={playHover}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-secondary hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Zap className="w-5 h-5 text-bg fill-current" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight">Yui Autonomous Agent</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { playClick(); setIsMemoryMapOpen(true); }}
            onMouseEnter={playHover}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all text-accent group"
          >
            <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Memory</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full ${status === 'Idle' ? 'bg-emerald-500' : 'bg-accent animate-pulse'}`} />
            <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">{status}</span>
          </div>
          <button onMouseEnter={playHover} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-secondary hover:text-white">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden z-10">
        {/* Left Sidebar - Logs/Status */}
        <div className="w-64 border-r border-white/10 bg-surface/20 backdrop-blur-md hidden lg:flex flex-col p-4 gap-6">
          <div>
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">Active Modules</h4>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 text-xs ${googleTokens ? 'text-emerald-400' : 'text-white/30'}`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>Google Calendar</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Search</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Google Maps</span>
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

          <div className="mt-auto">
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
        <div className="flex-1 flex flex-col relative">
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
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${
                    msg.role === 'user' ? 'bg-white/10' : 'bg-accent/20 border border-accent/30'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-accent" />}
                  </div>

                  <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-xl ${
                      msg.role === 'user' 
                        ? 'bg-primary text-bg font-medium' 
                        : 'liquid-glass text-secondary'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.role === 'assistant' && msg.data?.intent && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setInput(msg.content.replace('?', ''));
                          // We use a small delay to allow state update before potential manual send
                          // but better yet, we can trigger handleSend if we refactor it.
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-bg font-bold text-xs shadow-lg hover:shadow-accent/40 transition-all border border-accent/50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Explore: {msg.content}
                      </motion.button>
                    )}

                    {msg.type === 'auth' && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleConnect}
                          onMouseEnter={playHover}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-bg font-bold text-sm hover:bg-accent transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                          <Calendar className="w-4 h-4" /> Connect Google Calendar
                        </button>
                        <button
                          onClick={() => {
                            playClick();
                            setMessages(prev => [...prev, {
                              id: Date.now().toString(),
                              role: 'assistant',
                              content: "No problem! We can plan without your calendar. Where would you like to go?",
                              type: 'text'
                            }]);
                          }}
                          onMouseEnter={playHover}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                          Skip for now
                        </button>
                      </div>
                    )}

                    {msg.type === 'plan' && msg.data && (
                      <div className="space-y-6 w-full">
                        {msg.data.categories ? msg.data.categories.map((cat: any, cIdx: number) => (
                          <div key={cIdx} className="space-y-3">
                            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-accent" />
                              {cat.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {cat.options.map((opt: any, idx: number) => (
                                <motion.button
                                  key={idx}
                                  whileHover={{ scale: 1.02, y: -4 }}
                                  whileTap={{ scale: 0.98 }}
                                  onMouseEnter={playHover}
                                  onClick={() => handleSelectOption(opt, msg.data.planId)}
                                  className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left hover:border-accent/50 transition-all group relative overflow-hidden shadow-lg"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                                      {opt.icon === 'plane' && <Plane className="w-5 h-5" />}
                                      {opt.icon === 'train' && <Train className="w-5 h-5" />}
                                      {opt.icon === 'car' && <Car className="w-5 h-5" />}
                                    </div>
                                    <span className="text-sm font-mono text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                                      $ {opt.cost}
                                    </span>
                                  </div>
                                  <h5 className="text-base font-bold text-white mb-2">{opt.mode}</h5>
                                  <p className="text-xs text-secondary mb-4 leading-relaxed">{opt.reason}</p>
                                  <div className="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-emerald-500/30 transition-colors">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-bg transition-all">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]">OK</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-secondary">
                                      <Clock className="w-3 h-3" />
                                      <span>{opt.duration}</span>
                                    </div>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {msg.data.options.map((opt: any, idx: number) => (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onMouseEnter={playHover}
                                onClick={() => handleSelectOption(opt, msg.data.planId)}
                                className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left hover:border-accent/50 transition-all group relative overflow-hidden shadow-lg"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                                    {opt.mode.toLowerCase().includes('plane') && <Plane className="w-5 h-5" />}
                                    {opt.mode.toLowerCase().includes('train') && <Train className="w-5 h-5" />}
                                    {opt.mode.toLowerCase().includes('car') && <Car className="w-5 h-5" />}
                                  </div>
                                  <span className="text-sm font-mono text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                                    $ {opt.cost}
                                  </span>
                                </div>
                                <h5 className="text-base font-bold text-white mb-2">{opt.mode}</h5>
                                <p className="text-xs text-secondary mb-4 leading-relaxed">{opt.reason}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-emerald-500/30 transition-colors">
                                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-bg transition-all">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em]">OK</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-secondary">
                                    <Clock className="w-3 h-3" />
                                    <span>{opt.duration}</span>
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {msg.type === 'itinerary' && msg.data && (
                      <ItineraryVisualizer data={msg.data} />
                    )}

                    {msg.type === 'booking' && msg.data && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 w-full shadow-[0_0_50px_rgba(16,185,129,0.1)] backdrop-blur-md"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40"
                          >
                            <CheckCircle2 className="w-7 h-7 text-bg" />
                          </motion.div>
                          <div>
                            <h5 className="text-lg font-bold text-emerald-400">Booking Confirmed</h5>
                            <p className="text-xs text-emerald-400/70 font-mono">ID: YUI-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] text-secondary uppercase tracking-widest block mb-2">Transport</span>
                            <span className="text-sm text-white font-bold">{msg.data.mode}</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[10px] text-secondary uppercase tracking-widest block mb-2">Accommodation</span>
                            <span className="text-sm text-white font-bold">{msg.data.stay}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {thinkingStep !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-accent" />
                  </div>
                  <div className="p-6 rounded-2xl liquid-glass text-white flex flex-col gap-6 min-w-[320px] shadow-2xl relative overflow-hidden">
                    {/* Scanning Effect */}
                    <motion.div 
                      animate={{ y: [0, 200, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-accent/10 to-transparent pointer-events-none z-0"
                    />
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 7, ease: "linear" }}
                        className="h-full bg-accent shadow-[0_0_15px_rgba(242,125,38,0.8)]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.span 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className={`p-2.5 rounded-xl bg-white/5 ${THINKING_STEPS[thinkingStep].color}`}
                        >
                          {THINKING_STEPS[thinkingStep].icon}
                        </motion.span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight">{THINKING_STEPS[thinkingStep].label}</span>
                          <span className="text-[10px] text-secondary uppercase tracking-widest">Step {thinkingStep + 1} of {THINKING_STEPS.length}</span>
                        </div>
                      </div>
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    </div>
                    
                    {/* API Juggling Visualizer - Enhanced */}
                    <div className="relative flex justify-between items-center px-2 gap-2 h-12">
                      {/* Animated Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {THINKING_STEPS.map((step, idx) => {
                          if (thinkingStep === null) return null;
                          const isActive = thinkingStep === idx;
                          if (!isActive) return null;
                          
                          // Draw lines from active to all others
                          return THINKING_STEPS.map((other, oIdx) => {
                            if (idx === oIdx) return null;
                            const x1 = `${(idx / (THINKING_STEPS.length - 1)) * 100}%`;
                            const x2 = `${(oIdx / (THINKING_STEPS.length - 1)) * 100}%`;
                            return (
                              <motion.line
                                key={`${idx}-${oIdx}`}
                                x1={x1} y1="50%" x2={x2} y2="50%"
                                stroke="currentColor"
                                className="text-accent/20"
                                strokeWidth="1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                              />
                            );
                          });
                        })}
                      </svg>

                      {THINKING_STEPS.map((step, idx) => (
                        <motion.div
                          key={step.id}
                          animate={{ 
                            scale: thinkingStep === idx ? 1.3 : 1,
                            opacity: thinkingStep === idx ? 1 : 0.15,
                            y: thinkingStep === idx ? -8 : 0,
                            filter: thinkingStep === idx ? 'blur(0px)' : 'blur(1px)',
                            zIndex: thinkingStep === idx ? 10 : 1
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 relative ${
                            thinkingStep === idx ? 'border-accent/50 bg-accent/20 shadow-[0_0_20px_rgba(242,125,38,0.3)]' : 'border-white/5 bg-white/5'
                          }`}
                        >
                          {thinkingStep === idx && (
                            <motion.div 
                              layoutId="active-glow"
                              className="absolute inset-0 rounded-xl bg-accent/20 blur-md"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <span className={thinkingStep === idx ? step.color : 'text-white'}>
                            {step.icon}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-secondary font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                      <span>Juggling multiple APIs for optimal results...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {isProcessing && thinkingStep === null && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-lg">
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                </div>
                <div className="liquid-glass rounded-2xl px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/10 bg-surface/30 backdrop-blur-2xl z-10">
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                      <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">AI Reasoning Active</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isProcessing}
                placeholder="Where are you heading? (e.g. 'Plan a 3-day tour of Tokyo' or 'Fly to NYC')"
                className="w-full bg-surface/50 border border-white/10 rounded-2xl px-8 py-5 pr-20 text-base focus:outline-none focus:border-accent/50 transition-all placeholder:text-white/20 disabled:opacity-50 shadow-2xl backdrop-blur-md"
              />
              <button
                onClick={handleSend}
                onMouseEnter={playHover}
                disabled={!input.trim() || isProcessing}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-accent rounded-xl text-bg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 active:scale-95"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-[10px] text-secondary uppercase tracking-[0.2em]">
                <Search className="w-3 h-3" />
                <span>Google Search Grounding</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-secondary uppercase tracking-[0.2em]">
                <MapPin className="w-3 h-3" />
                <span>Google Maps Grounding</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-secondary uppercase tracking-[0.2em]">
                <Brain className="w-3 h-3" />
                <span>Gemini 3.1 Pro Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MemoryGraphOverlay isOpen={isMemoryMapOpen} onClose={() => setIsMemoryMapOpen(false)} />
    </div>
  );
}
