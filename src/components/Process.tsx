import { motion } from 'motion/react';

const steps = [
  {
    id: '1',
    title: 'Detect',
    description: 'Identify disruptions automatically via IoT sensors, weather forecasts, and 15+ API integrations.',
  },
  {
    id: '2',
    title: 'Analyze Cascade',
    description: 'DFS traversal of the Knowledge Graph to quantify downstream impact on ground transport and hotels.',
  },
  {
    id: '3',
    title: 'Search Alternatives',
    description: 'Rank remediation strategies by probability of success, cost, and user preference.',
  },
  {
    id: '4',
    title: 'Execute',
    description: 'Autonomously rebook flights, reschedule ground transport, and update hotel check-in times.',
  },
  {
    id: '5',
    title: 'Notify',
    description: 'Proactively communicate with users, providing seamless handoffs and alternative options.',
  },
];

export default function Process() {
  return (
    <section id="process" className="section-padding bg-surface border-y border-white/5">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <span className="tag mb-6">{'{ The Agentic Loop }'}</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
                Autonomous Disruption Management
              </h2>
              <p className="text-secondary text-lg">
                From disruption detection to resolution in under 30 seconds. Yui AI acts autonomously to execute decisions without human intervention.
              </p>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, delay: index * 0.15, type: "spring", bounce: 0.2 }}
                  className="flex gap-6 md:gap-8 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-bg border border-white/10 flex items-center justify-center text-2xl md:text-3xl font-display font-bold text-secondary group-hover:text-accent group-hover:border-accent/50 transition-colors">
                      {step.id}
                    </div>
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 group-hover:text-accent transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-lg text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
