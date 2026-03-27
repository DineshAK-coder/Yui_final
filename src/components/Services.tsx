import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const services = [
  { id: '01', title: 'Autonomous Rebooking', subtitle: 'Resolves in <30s' },
  { id: '02', title: 'Predictive Intelligence', subtitle: '12-24h Forecasting' },
  { id: '03', title: 'Multi-Modal Sync', subtitle: 'Unified Knowledge Graph' },
  { id: '04', title: 'Accessibility-First', subtitle: 'Unlocking 18% Market' },
];

export default function Services() {
  return (
    <section id="solutions" className="section-padding bg-bg">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="tag mb-6">{'{ Core Solutions }'}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">
              Agentic AI for Travel Disruptions
            </h2>
          </div>
          <p className="text-secondary max-w-md text-lg">
            We solve the $10.3B problem in travel & transportation through autonomous decision-making and real-time orchestration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 md:p-12 rounded-3xl bg-surface border border-white/5 hover:border-accent/50 transition-colors overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-bg">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex flex-col h-full justify-between min-h-[200px]">
                <span className="text-2xl font-display font-medium text-secondary mb-8 block">
                  {service.id}
                </span>
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-2 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xl text-secondary">{service.subtitle}</p>
                </div>
              </div>
              
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
