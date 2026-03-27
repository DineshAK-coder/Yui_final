import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Rocket, Globe, Zap, Users, Target, CheckCircle2 } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1',
    time: 'Months 1-3',
    title: 'MVP Launch',
    details: ['2-3 airlines pilot program', 'Core disruption detection', 'Basic rebooking flows'],
    icon: <Rocket className="w-6 h-6" />
  },
  {
    phase: 'Phase 2',
    time: 'Months 4-6',
    title: 'Multi-Modal Expansion',
    details: ['2-3 ride-sharing platforms', '3 hotel chains integration', 'Cross-modal sync'],
    icon: <Network className="w-6 h-6" />
  },
  {
    phase: 'Phase 3',
    time: 'Months 7-9',
    title: 'Predictive Intelligence',
    details: ['Disrupt forecasting capability', '12-24h horizon models', 'All existing customers upgrade'],
    icon: <Zap className="w-6 h-6" />
  },
  {
    phase: 'Phase 4',
    time: 'Months 10-12',
    title: 'B2C Consumer Launch',
    details: ['500K user target', 'Premium model rollout (₹499/mo)', 'Direct-to-consumer app'],
    icon: <Users className="w-6 h-6" />
  },
  {
    phase: 'Phase 5',
    time: 'Year 2+',
    title: 'International Expansion',
    details: ['Southeast Asia markets', 'Thailand, Vietnam, Philippines', 'Localization & regional APIs'],
    icon: <Globe className="w-6 h-6" />
  }
];

const kpis = [
  { label: 'Automation Rate', value: '>90%', context: 'vs. <15% industry' },
  { label: 'Prediction Accuracy', value: '87%', context: '24h horizon precision' },
  { label: 'Sync Latency', value: '<2s', context: 'Multi-modal updates' },
  { label: 'Gross Margin', value: '77%', context: 'By Year 5' },
  { label: 'CAC Payback', value: '<8mo', context: 'Blended B2B/B2C' },
  { label: 'Net Rev Retention', value: '>120%', context: 'Account expansion' },
];

// Re-usable Network icon since it's not imported above
function Network(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  );
}

export default function RoadmapMetrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section id="investment" className="section-padding bg-surface border-t border-white/5" ref={containerRef}>
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="tag mb-6">{'{ Execution & Metrics }'}</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            Go-To-Market & KPIs
          </h2>
          <p className="text-secondary text-lg">
            A structured 24-month rollout plan backed by rigorous success metrics and unit economics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Timeline */}
          <div className="relative">
            {/* SVG Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-white/5 rounded-full" />
            <motion.div 
              className="absolute left-[27px] top-4 bottom-4 w-1 bg-accent rounded-full origin-top"
              style={{ scaleY: pathLength }}
            />

            <div className="space-y-12 relative z-10">
              {phases.map((phase, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="w-14 h-14 rounded-full bg-bg border-2 border-accent flex items-center justify-center flex-shrink-0 text-accent shadow-[0_0_15px_rgba(255,79,0,0.3)]">
                    {phase.icon}
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-accent font-mono text-sm font-bold">{phase.phase}</span>
                      <span className="text-secondary text-sm">({phase.time})</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">{phase.title}</h4>
                    <ul className="space-y-2">
                      {phase.details.map((detail, dIdx) => (
                        <li key={dIdx} className="text-secondary flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Metrics Bento Grid */}
          <div>
            <div className="sticky top-32">
              <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <Target className="text-accent" /> Target KPIs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kpis.map((kpi, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-2xl bg-bg border border-white/5 hover:border-accent/30 transition-colors group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-secondary text-sm mb-2 relative z-10">{kpi.label}</p>
                    <p className="text-3xl font-display font-bold text-white mb-1 relative z-10">{kpi.value}</p>
                    <p className="text-xs text-white/40 relative z-10">{kpi.context}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-accent/20 to-bg border border-accent/30"
              >
                <h4 className="text-xl font-bold text-white mb-4">Year 5 Projections</h4>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-secondary text-sm">Total ARR</p>
                    <p className="text-4xl font-mono font-bold text-accent">₹280Cr</p>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary text-sm">Active Users</p>
                    <p className="text-2xl font-mono font-bold text-white">4.8M+</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
