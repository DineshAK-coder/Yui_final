import { motion } from 'motion/react';
import { Accessibility, Car, Map, Volume2, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Map className="w-8 h-8" />,
    title: 'Accessible Routing',
    description: 'Only recommends fully accessible venues and routes, filtering out locations that exceed physical comfort thresholds.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    icon: <Car className="w-8 h-8" />,
    title: 'Proactive Driver Matching',
    description: 'Screens ride-share drivers for specific accessibility training and vehicle features (e.g., wheelchair ramps) before booking.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Barrier Detection',
    description: 'Real-time warnings if a venue or transit hub has reported broken elevators or temporary accessibility barriers.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20'
  },
  {
    icon: <Volume2 className="w-8 h-8" />,
    title: 'Enhanced Communication',
    description: 'Built-in text-to-speech for notifications and high-contrast UI modes in the Telegram Mini App for visual impairments.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  }
];

export default function AccessibilityFeatures() {
  return (
    <section id="accessibility" className="section-padding bg-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 mb-6 border border-blue-500/20">
            <Accessibility className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            Accessibility & Inclusion Engine
          </h2>
          <p className="text-secondary text-lg">
            18% of the population is excluded from seamless travel, facing a 35-40% cancellation rate for accessibility-flagged requests. Yui AI is built to close this ₹13,000Cr+ market gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: index * 0.15, type: "spring", bounce: 0.2 }}
              className={`p-8 rounded-3xl bg-surface border ${feature.border} hover:bg-surface-hover transition-colors group`}
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
