import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, MapPin, Bell, Zap, Database, Brain, ArrowRight } from 'lucide-react';

const loops = {
  disruption: {
    title: 'Autonomous Disruption Loop',
    description: 'Detects delays, reasons about cascading impacts, and rebooks automatically.',
    steps: [
      { icon: <Plane />, title: 'Duffel Webhook', desc: 'Detects flight delay in real-time' },
      { icon: <ServerIcon />, title: 'FastAPI Orchestrator', desc: 'Extracts PNR and delay duration' },
      { icon: <Database />, title: 'Supabase KG', desc: 'Queries full Knowledge Graph for impact' },
      { icon: <Brain />, title: 'Nova Pro Reasoning', desc: 'Evaluates cascading impact & selects alternatives' },
      { icon: <Bell />, title: 'Telegram Notify', desc: 'Sends 1-tap rebooking options to user' },
    ]
  },
  concierge: {
    title: 'Proactive Concierge Loop',
    description: 'Detects free time and pushes context-aware recommendations.',
    steps: [
      { icon: <Zap />, title: 'Lambda Cron', desc: 'Scans schedule every 15 mins for gaps' },
      { icon: <Database />, title: 'Supabase State', desc: 'Identifies 45m+ free time windows' },
      { icon: <MapPin />, title: 'Geoapify Places', desc: 'Fetches POIs based on location & purpose' },
      { icon: <Brain />, title: 'Nova Lite Generation', desc: 'Crafts friendly, context-aware message' },
      { icon: <Bell />, title: 'Telegram Push', desc: 'Delivers proactive recommendation' },
    ]
  }
};

function ServerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
  );
}

export default function DualLoopShowcase() {
  const [activeLoop, setActiveLoop] = useState<'disruption' | 'concierge'>('disruption');

  return (
    <section id="solutions" className="section-padding bg-surface border-y border-white/5">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="tag mb-6">{'{ Core Logic }'}</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            Dual Autonomous Loops
          </h2>
          <p className="text-secondary text-lg">
            Yui operates on two distinct, always-on loops. One protects your schedule from chaos, the other enriches your free time.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-bg p-1.5 rounded-full border border-white/10 inline-flex relative">
            <div 
              className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-surface border border-white/10 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ left: activeLoop === 'disruption' ? '6px' : 'calc(50% + 3px)' }}
            />
            <button
              onClick={() => setActiveLoop('disruption')}
              className={`relative z-10 px-6 py-3 rounded-full text-sm font-bold transition-colors duration-300 ${activeLoop === 'disruption' ? 'text-accent' : 'text-secondary hover:text-white'}`}
            >
              Disruption Manager
            </button>
            <button
              onClick={() => setActiveLoop('concierge')}
              className={`relative z-10 px-6 py-3 rounded-full text-sm font-bold transition-colors duration-300 ${activeLoop === 'concierge' ? 'text-accent' : 'text-secondary hover:text-white'}`}
            >
              Proactive Concierge
            </button>
          </div>
        </div>

        {/* Loop Visualization */}
        <div className="max-w-5xl mx-auto bg-bg rounded-[2.5rem] border border-white/10 p-8 md:p-16 relative overflow-hidden min-h-[500px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLoop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="text-center mb-16">
                <h3 className="text-3xl font-display font-bold text-white mb-4">{loops[activeLoop].title}</h3>
                <p className="text-secondary">{loops[activeLoop].description}</p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                
                {loops[activeLoop].steps.map((step, index) => (
                  <div key={index} className="relative z-10 flex flex-col items-center group w-full md:w-1/5">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.15, type: "spring" }}
                      className="w-16 h-16 rounded-2xl bg-surface border border-white/20 flex items-center justify-center text-white mb-6 group-hover:border-accent group-hover:text-accent group-hover:scale-110 transition-all duration-300 shadow-xl relative"
                    >
                      {step.icon}
                      
                      {/* Animated Particle */}
                      {index < loops[activeLoop].steps.length - 1 && (
                        <motion.div
                          animate={{ x: [0, 100, 0], opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5, ease: "easeInOut" }}
                          className="hidden md:block absolute top-1/2 -right-12 w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#FF4F00]"
                        />
                      )}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                      className="text-center px-2"
                    >
                      <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                      <p className="text-xs text-secondary leading-relaxed">{step.desc}</p>
                    </motion.div>

                    {/* Mobile Arrow */}
                    {index < loops[activeLoop].steps.length - 1 && (
                      <ArrowRight className="md:hidden w-5 h-5 text-white/20 my-4 rotate-90" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
