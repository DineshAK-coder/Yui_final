import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Globe, BrainCircuit, Mic, ShieldAlert, Cpu } from 'lucide-react';

const futureFeatures = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Geopolitical Risk Modeling',
    description: 'Preemptively predicting airspace closures or border restrictions based on real-time news and diplomatic sentiment analysis before official advisories are issued.',
    impact: 'Prevents bookings in highly volatile regions and ensures zero stranding risk.'
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: 'Voice-Native Autonomous Agent',
    description: 'A dedicated AI voice agent that can call regional airlines or boutique hotels that lack APIs, verbally negotiating rebooking options on your behalf.',
    impact: 'Bridges the gap between API-first systems and legacy travel infrastructure.'
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: 'Biometric Stress Adaptation',
    description: 'Integrating with wearable data (e.g., Apple Watch) to measure traveler fatigue and automatically suggesting/booking lounge access or longer layovers if stress levels are high.',
    impact: 'Transforms travel management into holistic traveler well-being management.'
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    title: 'Hyper-Local Weather Micro-Predictions',
    description: 'Using advanced satellite imagery forecasting and machine learning to predict specific runway micro-bursts or fog rolling in before standard meteorology services.',
    impact: 'Seconds matter in rebooking; beating the airline to the punch secures the last seat.'
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Smart Contract Compensation',
    description: 'Autonomous claim filing on blockchain-based parametric insurance policies the instant an eligible delay or cancellation is mathematically confirmed.',
    impact: 'Zero-friction financial compensation hitting the user\'s wallet before they even land.'
  }
];

export default function FutureAIFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="future-features" className="section-padding bg-bg relative overflow-hidden" ref={containerRef}>
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-bg to-bg pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 group hover:bg-accent/20 transition-colors">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Research & Development</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            The Horizon of Travel AI
          </h2>
          <p className="text-secondary text-lg">
            Our autonomous loop is just the beginning. The next frontier involves extending Yui's reasoning capabilities into the physical, financial, and emotional realities of travel.
          </p>
        </div>

        <motion.div 
          style={{ y }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {futureFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`p-8 rounded-3xl bg-surface/50 border border-white/5 hover:border-accent/30 hover:bg-surface transition-all duration-300 group ${idx === 3 ? 'md:col-span-2 lg:col-span-2' : ''} ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-bg border border-white/10 flex items-center justify-center text-secondary group-hover:text-accent group-hover:border-accent/50 transition-colors mb-6 shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-secondary mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="pt-6 border-t border-white/5">
                <p className="text-xs uppercase font-bold tracking-wider text-white/40 mb-2">Predicted Impact</p>
                <p className="text-sm text-white/80 font-medium">
                  {feature.impact}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
