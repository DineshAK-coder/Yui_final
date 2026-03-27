import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { PieChart, TrendingUp, DollarSign, Activity, Users, Building } from 'lucide-react';

const tamSegments = [
  { name: 'Ride-Sharing', value: 4.2, color: '#FF4F00', icon: <Users className="w-5 h-5" /> },
  { name: 'Corporate Travel', value: 2.1, color: '#FF6B2B', icon: <Building className="w-5 h-5" /> },
  { name: 'Airlines & GDS', value: 1.8, color: '#FF8755', icon: <PieChart className="w-5 h-5" /> },
  { name: 'Other', value: 1.1, color: '#FFA480', icon: <Activity className="w-5 h-5" /> },
  { name: 'Hotels', value: 0.89, color: '#FFC0AA', icon: <Building className="w-5 h-5" /> },
  { name: 'B2C Direct', value: 0.3, color: '#FFDDD5', icon: <Users className="w-5 h-5" /> },
];

export default function BusinessImpact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="impact" className="section-padding bg-bg overflow-hidden" ref={containerRef}>
      <div className="container-custom">
        <motion.div style={{ opacity }} className="text-center max-w-3xl mx-auto mb-20">
          <span className="tag mb-6">{'{ Business Impact & Economics }'}</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            A ₹10.3B Market Opportunity
          </h2>
          <p className="text-secondary text-lg">
            Transforming disruption management from a massive cost center into a driver of loyalty and revenue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* TAM Breakdown - Animated Bars */}
          <div className="space-y-8">
            <h3 className="text-2xl font-display font-bold flex items-center gap-3">
              <PieChart className="text-accent" /> TAM Breakdown
            </h3>
            <div className="space-y-6">
              {tamSegments.map((segment, idx) => (
                <div key={segment.name} className="relative">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white flex items-center gap-2">
                      {segment.icon} {segment.name}
                    </span>
                    <span className="text-secondary font-mono">₹{segment.value}B</span>
                  </div>
                  <div className="h-3 w-full bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(segment.value / 4.2) * 100}%` }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI & Economics Cards */}
          <motion.div style={{ y: y1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Unit Economics */}
            <div className="col-span-1 sm:col-span-2 p-8 rounded-3xl bg-surface border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="text-accent" /> Unit Economics
              </h4>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-secondary text-sm mb-1">Manual Handling</p>
                  <p className="text-3xl font-mono text-white/50 line-through decoration-red-500">₹45-65</p>
                </div>
                <div className="text-right">
                  <p className="text-secondary text-sm mb-1">Yui AI Cost</p>
                  <p className="text-4xl font-mono text-accent font-bold">₹8-15</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-emerald-400 font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> 70-80% Cost Reduction
                </p>
              </div>
            </div>

            {/* Airline ROI */}
            <div className="p-6 rounded-3xl bg-surface border border-white/10 hover:border-accent/50 transition-colors">
              <p className="text-secondary text-sm mb-2">Airlines ROI</p>
              <motion.h3 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-5xl font-display font-bold text-white mb-4"
              >
                191%
              </motion.h3>
              <ul className="text-sm text-secondary space-y-2">
                <li>• ₹81L Rebooking Value</li>
                <li>• ₹50L CSAT Value</li>
              </ul>
            </div>

            {/* Ride-Sharing ROI */}
            <div className="p-6 rounded-3xl bg-accent/10 border border-accent/20 hover:border-accent/50 transition-colors">
              <p className="text-accent/80 text-sm mb-2">Ride-Sharing ROI</p>
              <motion.h3 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-display font-bold text-accent mb-4"
              >
                10k%
              </motion.h3>
              <ul className="text-sm text-accent/80 space-y-2">
                <li>• ₹75Cr Churn Reduction</li>
                <li>• ₹30Cr Accessibility Unlock</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
