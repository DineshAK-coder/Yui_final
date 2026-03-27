import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Mail, AlertCircle, ShieldCheck, ArrowRight, PlaneTakeoff, ShieldAlert } from 'lucide-react';

export default function BookingEmail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const emailY = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <section id="enhanced-emails" className="section-padding bg-surface border-y border-white/5 relative overflow-hidden" ref={containerRef}>
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="max-w-xl relative z-10 order-2 lg:order-1">
            <span className="tag mb-6">{'{ Proactive Insights }'}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6">
              AI-Enhanced Booking Confirmations
            </h2>
            <p className="text-secondary text-lg mb-8">
              Standard booking emails only confirm your ticket. Yui AI injects predictive intelligence right into your inbox—analyzing weather, historical delays, and air traffic to forecast risks before you even pack your bags.
            </p>

            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 p-4 rounded-2xl bg-bg border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Predicted Disruption Risks</h4>
                  <p className="text-secondary text-sm">Real-time analysis of routing complexity and forecasted weather impacts on your itinerary.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 p-4 rounded-2xl bg-bg border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Proactive Resolution Options</h4>
                  <p className="text-secondary text-sm">1-click fallback flights and automatic hotel late-check-in guarantees pre-negotiated by Yui.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Email UI Mockup */}
          <div className="relative z-10 order-1 lg:order-2">
            <motion.div 
              style={{ y: emailY, opacity }}
              className="bg-bg rounded-2xl border border-white/10 shadow-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Email Header */}
              <div className="px-6 py-4 bg-[#1a1a1a] border-b border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Flight Confirmation: BOM → DEL</p>
                  <p className="text-secondary text-xs">From: bookings@yui-ai.com</p>
                </div>
              </div>

              {/* Email Content */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">You're all set for Delhi!</h3>
                  <p className="text-secondary text-sm">Booking Reference: <span className="text-white font-mono">#YUI-8921XK</span></p>
                </div>

                {/* Standard Flight Info */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                  <div className="text-center md:text-left flex-1">
                    <p className="text-2xl font-bold text-white">08:30</p>
                    <p className="text-secondary text-xs">Mumbai (BOM)</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4 w-full">
                    <p className="text-[10px] text-secondary mb-1">2h 15m</p>
                    <div className="w-full h-px bg-white/20 relative flex items-center justify-center">
                      <PlaneTakeoff className="w-4 h-4 text-white absolute bg-[#1a1a1a] px-1" />
                    </div>
                  </div>
                  <div className="text-center md:text-right flex-1">
                    <p className="text-2xl font-bold text-white">10:45</p>
                    <p className="text-secondary text-xs">Delhi (DEL)</p>
                  </div>
                </div>

                {/* Yui AI Injection */}
                <div className="p-1 rounded-xl bg-gradient-to-r from-accent/50 to-orange-500/50">
                  <div className="bg-bg rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-accent text-bg flex items-center justify-center font-bold text-xs">Y</div>
                      <span className="text-sm font-bold text-white">Yui AI Travel Intelligence</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-white">42% Delay Risk Detected</p>
                          <p className="text-xs text-secondary mt-1">Incoming aircraft from BLR often faces morning ATC congestion. Expected delay: <span className="text-orange-400">45-60 mins</span>.</p>
                        </div>
                      </div>

                      <div className="w-full h-px bg-white/10" />

                      <div className="flex gap-3 items-start">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-white">Protected by Yui</p>
                          <p className="text-xs text-secondary mt-1 mb-3">We've secured a tentative hold on a 10:00 AM backup Vistara flight. If your flight delays past 9:15 AM, we will automatically move you.</p>
                          
                          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors">
                            View Backup Options <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
