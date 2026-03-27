import { useState } from 'react';
import { ReactFlow, Background, Controls, MarkerType, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'motion/react';
import { Network, Zap, Database, ArrowRightLeft } from 'lucide-react';

const nodeStyle = {
  background: '#1a1a1a',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  padding: '16px',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  width: 220,
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
};

const engineNodes: Node[] = [
  { id: 'duffel', position: { x: 50, y: 50 }, data: { label: '✈️ Duffel API (Flights)' }, style: nodeStyle },
  { id: 'geoapify', position: { x: 50, y: 250 }, data: { label: '📍 Geoapify (Locations)' }, style: nodeStyle },
  { id: 'uber', position: { x: 50, y: 450 }, data: { label: '🚗 Ride-Sharing APIs' }, style: nodeStyle },
  
  { 
    id: 'kg', 
    position: { x: 400, y: 250 }, 
    data: { label: '🧠 Unified Knowledge Graph\n(Real-Time Sync Engine)' }, 
    style: { ...nodeStyle, background: 'rgba(255, 79, 0, 0.1)', border: '1px solid rgba(255, 79, 0, 0.5)', width: 250, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold' } 
  },
  
  { id: 'nova', position: { x: 750, y: 150 }, data: { label: '🤖 Amazon Nova Pro\n(Reasoning)' }, style: nodeStyle },
  { id: 'telegram', position: { x: 750, y: 350 }, data: { label: '📱 Telegram Bot\n(User Interface)' }, style: nodeStyle },
];

const engineEdges: Edge[] = [
  { id: 'e-duffel-kg', source: 'duffel', target: 'kg', animated: true, style: { stroke: '#FF4F00', strokeWidth: 2 } },
  { id: 'e-geoapify-kg', source: 'geoapify', target: 'kg', animated: true, style: { stroke: '#FF4F00', strokeWidth: 2 } },
  { id: 'e-uber-kg', source: 'uber', target: 'kg', animated: true, style: { stroke: '#FF4F00', strokeWidth: 2 } },
  
  { id: 'e-kg-nova', source: 'kg', target: 'nova', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
  { id: 'e-nova-kg', source: 'nova', target: 'kg', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
  
  { id: 'e-kg-telegram', source: 'kg', target: 'telegram', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e-telegram-kg', source: 'telegram', target: 'kg', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
];

export default function MultiModalEngine() {
  return (
    <section id="multi-modal" className="section-padding bg-surface border-y border-white/5 relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
          <div className="lg:col-span-1">
            <span className="tag mb-6">{'{ Core Technology }'}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
              Multi-Modal Coordination Engine
            </h2>
            <p className="text-secondary text-lg mb-8">
              Users juggle 5-10 apps per trip, leading to a 31% missed connection rate. Yui's engine unifies flights, hotels, rides, and meetings into a single Knowledge Graph.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Network className="w-6 h-6 text-accent flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold">Real-Time Sync</h4>
                  <p className="text-sm text-secondary">Updates cascade across all modes with &lt;2 second latency.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Database className="w-6 h-6 text-accent flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold">Unified Graph</h4>
                  <p className="text-sm text-secondary">A single source of truth stored in Supabase JSONB.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRightLeft className="w-6 h-6 text-accent flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold">Intelligent Gap-Filling</h4>
                  <p className="text-sm text-secondary">Detects free time and auto-suggests POIs via Geoapify.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
              className="w-full h-[600px] rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] overflow-hidden relative shadow-2xl"
            >
              <ReactFlow
                nodes={engineNodes}
                edges={engineEdges}
                fitView
                attributionPosition="bottom-right"
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
              >
                <Background color="#333" gap={20} size={1} />
              </ReactFlow>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
