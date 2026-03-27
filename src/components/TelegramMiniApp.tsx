import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Clock, Network, Wallet, Plane, Coffee, Briefcase } from 'lucide-react';

export default function TelegramMiniApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <section id="tma" className="section-padding bg-bg overflow-hidden relative" ref={containerRef}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="max-w-xl relative z-10">
            <span className="tag mb-6">{'{ Telegram Mini App }'}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
              The Visual Layer
            </h2>
            <p className="text-secondary text-lg mb-8">
              Launched directly from the bot, the React + Vite dashboard slides up as a full-screen overlay within Telegram, providing a visual representation of the user's trip and Knowledge Graph.
            </p>

            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-accent flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Trip Timeline View</h4>
                  <p className="text-secondary text-sm">Vertically scrolling timeline showing flights, meetings, and Yui-recommended activities. Delayed events shown in amber.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Knowledge Graph Viz</h4>
                  <p className="text-secondary text-sm">Interactive Cytoscape.js graph showing all nodes and dependencies. Disruption cascades highlighted in red.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Trip Budget Tracker</h4>
                  <p className="text-secondary text-sm">Chart showing total committed spend vs. budget preference. Updated automatically on rebookings.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end perspective-1000">
            <motion.div 
              style={{ y: phoneY, rotateX: phoneRotate, opacity }}
              className="w-[320px] h-[650px] bg-[#0f0f0f] rounded-[3rem] border-[8px] border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_2px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col"
            >
              {/* Dynamic Island */}
              <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
                <div className="w-24 h-6 bg-black rounded-b-3xl" />
              </div>

              {/* Telegram Header */}
              <div className="bg-[#1c1c1d] pt-12 pb-4 px-6 border-b border-white/5 flex items-center justify-between z-40 relative shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-bg">Y</div>
                  <div>
                    <p className="text-white text-sm font-bold">Yui AI Dashboard</p>
                    <p className="text-secondary text-[10px]">bot</p>
                  </div>
                </div>
                <div className="w-6 h-1 bg-white/20 rounded-full" />
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-5 space-y-6 custom-scrollbar relative">
                
                {/* Budget Widget */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-white/60 text-xs font-bold uppercase">Trip Budget</p>
                    <Wallet className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-mono font-bold text-white">$1,240</p>
                    <p className="text-xs text-secondary mb-1">/ $2,000</p>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full mt-3 overflow-hidden">
                    <div className="w-[62%] h-full bg-purple-500 rounded-full" />
                  </div>
                </motion.div>

                {/* Timeline */}
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase mb-4">Live Timeline</p>
                  <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[15px] before:w-0.5 before:bg-white/5">
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="relative pl-10"
                    >
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-accent/20 border border-accent flex items-center justify-center -translate-x-1/2">
                        <Plane className="w-3 h-3 text-accent" />
                      </div>
                      <div className="bg-[#1a1a1a] rounded-xl p-3 border border-accent/30">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-white">Flight AI302</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent font-bold">DELAYED</span>
                        </div>
                        <p className="text-xs text-secondary">BOM → BLR • +45 mins</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="relative pl-10"
                    >
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center -translate-x-1/2">
                        <Coffee className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-white">Yui Suggestion</p>
                          <span className="text-[10px] text-secondary">11:30 AM</span>
                        </div>
                        <p className="text-xs text-secondary">Blue Tokai Coffee (2km away)</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="relative pl-10"
                    >
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center -translate-x-1/2">
                        <Briefcase className="w-3 h-3 text-blue-400" />
                      </div>
                      <div className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-white">Client Meeting</p>
                          <span className="text-[10px] text-secondary">2:00 PM</span>
                        </div>
                        <p className="text-xs text-secondary">Taj MG Road</p>
                      </div>
                    </motion.div>

                  </div>
                </div>

              </div>
              
              {/* Bottom Bar */}
              <div className="h-1 bg-white/20 w-1/3 mx-auto rounded-full absolute bottom-2 left-1/2 -translate-x-1/2" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
