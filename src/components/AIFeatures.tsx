import { motion } from 'motion/react';
import { BrainCircuit, Globe, LineChart, Accessibility, MessageSquare, ShieldAlert } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-accent" />,
    title: 'Sentiment-Aware Concierge',
    description: 'Detects user frustration and adapts tone instantly. Escalates to human support if needed, improving CSAT by 15-22%.',
  },
  {
    icon: <LineChart className="w-6 h-6 text-accent" />,
    title: 'Dynamic Pricing Predictor',
    description: 'Forecasts surge pricing 15 minutes ahead. Suggests alternative routes and provides dynamic pricing transparency.',
  },
  {
    icon: <Accessibility className="w-6 h-6 text-accent" />,
    title: 'Barrier Detection',
    description: 'Checks venues for crowd size, noise, and ramps. Compares against user comfort thresholds before recommending.',
  },
  {
    icon: <Globe className="w-6 h-6 text-accent" />,
    title: 'Geopolitical Risk Analyzer',
    description: 'Monitors global events via RavenPack and Alpha Vantage to trigger proactive rerouting before disruptions hit.',
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-accent" />,
    title: 'Cascading Impact Analysis',
    description: 'Reasons about compound effects (delay → missed meeting → financial penalty) to prevent secondary disruptions.',
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-accent" />,
    title: 'Proactive Driver Matching',
    description: 'Pre-matches drivers based on accessibility training and vehicle features, reducing cancellation rates by 85%.',
  },
];

export default function AIFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 1.2, 
        type: "spring" as const, 
        bounce: 0.3 
      } 
    },
  };

  return (
    <section id="features" className="section-padding bg-surface">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="tag mb-6">{'{ Advanced Capabilities }'}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">
              Next-Gen AI Features
            </h2>
          </div>
          <p className="text-secondary max-w-md text-lg">
            Beyond basic automation, Yui AI leverages ensemble ML and context-aware reasoning to handle complex, real-world travel scenarios.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 rounded-3xl bg-bg border border-white/5 hover:border-accent/30 transition-all duration-300 overflow-hidden"
            >
              {/* Glowing orb effect on hover */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
