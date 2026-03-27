import { motion } from 'motion/react';
import { Linkedin, Twitter, Github } from 'lucide-react';

const team = [
  {
    name: 'Knowledge Graph',
    role: 'Cascade Analysis',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    name: 'Multi-Modal Sync',
    role: '<2s Latency',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    name: 'Accessibility',
    role: '100% Coverage',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    name: 'Predictive Intel',
    role: '12-24h Forecasting',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

export default function Team() {
  return (
    <section id="moats" className="section-padding bg-bg">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="tag mb-6">{'{ Competitive Moats }'}</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
            Why Yui AI Wins
          </h2>
          <p className="text-secondary text-lg">
            Our defensible advantages in the autonomous travel agent category, backed by proprietary algorithms and deep integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: index * 0.15, type: "spring", bounce: 0.2 }}
              className="group text-center"
            >
              <div className="relative overflow-hidden rounded-full aspect-square mb-6 mx-auto max-w-[240px]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay with social links removed */}
              </div>
              
              <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-accent transition-colors">
                {member.name}
              </h3>
              <p className="text-secondary font-medium uppercase tracking-wider text-sm">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
