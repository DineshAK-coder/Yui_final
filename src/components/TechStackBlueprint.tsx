import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Smartphone, BrainCircuit, Server, Globe, Database, ArrowDown } from 'lucide-react';

const layers = [
  {
    id: 'ui',
    name: 'User Interface',
    tech: 'Telegram Bot + Mini App (React/Vite)',
    description: 'All user-facing interactions, notifications, and the TMA dashboard.',
    icon: <Smartphone className="w-8 h-8" />,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400'
  },
  {
    id: 'ai',
    name: 'AI Brain',
    tech: 'Amazon Bedrock (Nova Pro + Nova Lite)',
    description: 'Intent routing, email parsing, autonomous reasoning, and decision-making.',
    icon: <BrainCircuit className="w-8 h-8" />,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400'
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    tech: 'FastAPI (Python 3.10) on Render',
    description: 'Agent tool execution, watchdog loop, webhook handling, Knowledge Graph logic.',
    icon: <Server className="w-8 h-8" />,
    color: 'from-accent/20 to-orange-500/20',
    borderColor: 'border-accent/30',
    textColor: 'text-accent'
  },
  {
    id: 'apis',
    name: 'External APIs',
    tech: 'Duffel, Geoapify, SearchApi.io',
    description: 'Flight booking/status, POI discovery, and live web data.',
    icon: <Globe className="w-8 h-8" />,
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400'
  },
  {
    id: 'persistence',
    name: 'Persistence',
    tech: 'Supabase (PostgreSQL + JSONB)',
    description: 'Chat history, user preferences, Knowledge Graph, and itinerary state.',
    icon: <Database className="w-8 h-8" />,
    color: 'from-rose-500/20 to-red-500/20',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400'
  }
];

export default function TechStackBlueprint() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="problems" className="section-padding bg-bg relative overflow-hidden" ref={containerRef}>
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="tag mb-6">{'{ System Architecture }'}</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            5-Layer Blueprint
          </h2>
          <p className="text-secondary text-lg">
            Built on the world's best infrastructure. Clean interfaces between UI, AI reasoning, orchestration, external data, and persistence.
          </p>
        </div>

        <motion.div style={{ y }} className="max-w-5xl mx-auto relative py-12">
          {/* Central Animated Spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 hidden md:block">
            <motion.div
              style={{ scaleY: useTransform(scrollYProgress, [0.1, 0.9], [0, 1]) }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-full bg-gradient-to-b from-accent/50 via-accent to-accent/50 rounded-full shadow-[0_0_15px_#FF4F00] origin-top"
            />
          </div>

          <div className="space-y-8 md:space-y-12">
            {layers.map((layer, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={layer.id} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                  
                  {/* Left Side (Empty for Odd, Content for Even) */}
                  <div className={`w-full md:w-[45%] flex ${isEven ? 'justify-end md:pr-12' : 'justify-start md:pl-12 md:order-last'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -100 : 100, rotateY: isEven ? -15 : 15 }}
                      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ 
                        type: "spring", 
                        damping: 20, 
                        stiffness: 100, 
                        delay: index * 0.2 
                      }}
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      className={`p-6 md:p-8 rounded-3xl bg-surface/90 backdrop-blur-2xl border ${layer.borderColor} shadow-2xl relative overflow-hidden group w-full`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Animated Glow Overlay */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity, delay: index }}
                        className={`absolute inset-0 bg-gradient-to-br ${layer.color} pointer-events-none`} 
                      />
                      
                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-bg border ${layer.borderColor} flex items-center justify-center mb-6 ${layer.textColor} shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_#fff3] transition-all duration-500`}>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                          >
                            {layer.icon}
                          </motion.div>
                        </div>
                        
                        <div className="mb-4 space-y-2">
                          <h3 className="text-2xl font-display font-bold text-white">
                            {layer.name}
                          </h3>
                          <span className={`inline-block text-xs font-mono px-3 py-1 rounded-full border ${layer.borderColor} ${layer.textColor} bg-bg/80 shadow-inner`}>
                            {layer.tech}
                          </span>
                        </div>
                        <p className="text-secondary leading-relaxed text-sm">
                          {layer.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Central Node Connection */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10">
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: index * 0.2 + 0.3 }}
                      className={`w-8 h-8 rounded-full bg-bg border-4 ${layer.borderColor} relative flex items-center justify-center`}
                    >
                      <div className={`w-2 h-2 rounded-full bg-white ${isEven ? 'animate-pulse' : ''}`} />
                    </motion.div>
                    
                    {/* Horizontal Connector */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "38%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                      className={`absolute h-[2px] ${layer.borderColor} border-t-2 border-dashed opacity-50 ${isEven ? 'right-4' : 'left-4'}`}
                    />
                  </div>

                  {/* Mobile Mobile Connector */}
                  {index < layers.length - 1 && (
                    <div className="md:hidden flex justify-center py-6 relative z-0 w-full">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: 60, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                        className={`w-1 border-r-2 border-dashed ${layer.borderColor} opacity-50`}
                      />
                    </div>
                  )}
                  
                  {/* Empty Spacer for alternating layout */}
                  <div className="hidden md:block w-[45%]" />
                  
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
