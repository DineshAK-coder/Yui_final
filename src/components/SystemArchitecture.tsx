import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Node, Edge, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAppSounds } from '../hooks/useAppSounds';

// Custom Animated Node Component
const CustomNode = ({ data }: any) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        opacity: 1,
        boxShadow: data.isDisrupted ? '0 0 40px rgba(239, 68, 68, 0.4)' 
                 : data.isResolved ? '0 0 40px rgba(16, 185, 129, 0.4)' 
                 : data.isImpacted ? '0 0 40px rgba(245, 158, 11, 0.4)' 
                 : '0 10px 30px rgba(0,0,0,0.5)',
        scale: data.isDisrupted ? [1, 1.05, 1] : 1
      }}
      transition={{ duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={data.onHover}
      className={`px-4 py-3 rounded-2xl border flex flex-col items-center justify-center text-center w-48 relative overflow-hidden ${
        data.isDisrupted ? 'bg-red-500/10 border-red-500' 
        : data.isResolved ? 'bg-emerald-500/10 border-emerald-500'
        : data.isImpacted ? 'bg-amber-500/10 border-amber-500'
        : 'bg-[#1a1a1a] border-white/10'
      }`}
    >
      <Handle type="target" position={Position.Top} className="opacity-0 w-full h-full absolute inset-0 z-0" />
      <div className="relative z-10">
        <span className="text-2xl block mb-2">{data.icon}</span>
        <span className="text-sm font-bold text-white block">{data.title}</span>
        <span className="text-xs text-secondary mt-1 block">{data.subtitle}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-full h-full absolute inset-0 z-0" />
    </motion.div>
  );
};

const initialNodes: Node[] = [
  { id: 'flight', type: 'custom', position: { x: 50, y: 150 }, data: { title: 'Flight AI302', subtitle: 'BOM → BLR', icon: '✈️' } },
  { id: 'meeting', type: 'custom', position: { x: 350, y: 50 }, data: { title: 'Client Meeting', subtitle: '12:00 PM', icon: '💼' } },
  { id: 'hotel', type: 'custom', position: { x: 350, y: 250 }, data: { title: 'Hotel Check-in', subtitle: '2:00 PM', icon: '🏨' } },
  { id: 'ride', type: 'custom', position: { x: 650, y: 50 }, data: { title: 'Uber to Office', subtitle: '11:15 AM', icon: '🚗' } },
];

const initialEdges: Edge[] = [
  { id: 'e-flight-meeting', source: 'flight', target: 'meeting', animated: false, style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 } },
  { id: 'e-flight-hotel', source: 'flight', target: 'hotel', animated: false, style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 } },
  { id: 'e-meeting-ride', source: 'meeting', target: 'ride', animated: false, style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 } },
];

const nodeTypes = { custom: CustomNode };

export default function SystemArchitecture() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [status, setStatus] = useState<'normal' | 'disrupted' | 'resolving' | 'resolved'>('normal');
  const { playAlert, playSuccess, playHover, playClick, playPop } = useAppSounds();

  // Inject hover sound into node data
  useEffect(() => {
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, onHover: playHover } })));
  }, [playHover, setNodes]);

  const simulateDisruption = () => {
    playAlert();
    setStatus('disrupted');
    
    // 1. Mark flight as disrupted
    setNodes((nds) => nds.map(n => {
      if (n.id === 'flight') return { ...n, data: { ...n.data, title: '🚨 DELAYED 2h', isDisrupted: true } };
      return n;
    }));

    // 2. Animate edges to show cascade
    setEdges((eds) => eds.map(e => ({
      ...e,
      animated: true,
      style: { stroke: '#ef4444', strokeWidth: 3 }
    })));

    // 3. Mark dependent nodes as impacted after a short delay
    setTimeout(() => {
      playPop();
      setNodes((nds) => nds.map(n => {
        if (n.id === 'meeting') return { ...n, data: { ...n.data, subtitle: 'At Risk', isImpacted: true, icon: '⚠️' } };
        if (n.id === 'hotel') return { ...n, data: { ...n.data, subtitle: 'Late Arrival', isImpacted: true, icon: '⚠️' } };
        if (n.id === 'ride') return { ...n, data: { ...n.data, subtitle: 'Missed Pickup', isImpacted: true, icon: '⚠️' } };
        return n;
      }));
    }, 1000);
  };

  const resolveDisruption = () => {
    playClick();
    setStatus('resolving');
    
    // 1. Change edge colors to resolving
    setEdges((eds) => eds.map(e => ({
      ...e,
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 3 }
    })));

    // 2. Resolve nodes
    setTimeout(() => {
      playSuccess();
      setNodes((nds) => nds.map(n => {
        if (n.id === 'flight') return { ...n, data: { ...n.data, title: 'Rebooked', subtitle: 'AI405 (10:00 AM)', isDisrupted: false, isResolved: true, icon: '✅' } };
        if (n.id === 'meeting') return { ...n, data: { ...n.data, title: 'Rescheduled', subtitle: '2:00 PM', isImpacted: false, isResolved: true, icon: '✅' } };
        if (n.id === 'hotel') return { ...n, data: { ...n.data, title: 'Notified', subtitle: 'Late Check-in', isImpacted: false, isResolved: true, icon: '✅' } };
        if (n.id === 'ride') return { ...n, data: { ...n.data, title: 'Updated', subtitle: '1:15 PM', isImpacted: false, isResolved: true, icon: '✅' } };
        return n;
      }));
      
      setEdges((eds) => eds.map(e => ({
        ...e,
        animated: false,
        style: { stroke: 'rgba(16, 185, 129, 0.5)', strokeWidth: 2 }
      })));
      
      setStatus('resolved');
    }, 1500);
  };

  const resetGraph = () => {
    playClick();
    setStatus('normal');
    // Re-inject onHover since we are resetting to initial config
    setNodes(initialNodes.map(n => ({ ...n, data: { ...n.data, onHover: playHover } })));
    setEdges(initialEdges);
  };

  return (
    <section id="architecture" className="section-padding bg-bg border-y border-white/5 relative">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="tag mb-6">{'{ Knowledge Graph }'}</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            Cascade Analysis Visualization
          </h2>
          <p className="text-secondary text-lg">
            Yui doesn't just see a delayed flight; it sees the entire interconnected web of your trip. Interact with the graph below to see how a single disruption cascades, and how Yui resolves it.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8 relative z-10">
          <button
            onClick={simulateDisruption}
            onMouseEnter={playHover}
            disabled={status !== 'normal'}
            className="px-6 py-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Simulate Disruption
          </button>
          <button
            onClick={resolveDisruption}
            onMouseEnter={playHover}
            disabled={status !== 'disrupted'}
            className="px-6 py-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${status === 'resolving' ? 'animate-spin' : ''}`} /> Auto-Resolve
          </button>
          <button
            onClick={resetGraph}
            onMouseEnter={playHover}
            disabled={status === 'normal'}
            className="px-6 py-3 rounded-full bg-surface text-secondary border border-white/10 hover:text-white transition-colors font-bold"
          >
            Reset
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
          className="w-full h-[500px] rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            panOnScroll={true}
            zoomOnScroll={false}
            attributionPosition="bottom-right"
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#333" gap={20} size={1} />
            <Controls className="bg-surface border-white/10 fill-white" showInteractive={false} />
          </ReactFlow>
        </motion.div>
      </div>
    </section>
  );
}
