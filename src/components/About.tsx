import { motion } from 'motion/react';

export default function About() {
  const stats = [
    { value: '$10.3B', label: 'Addressable Market' },
    { value: '90%+', label: 'Automation Rate' },
    { value: '<30s', label: 'Agent Response Time' },
    { value: '₹280Cr', label: 'Year 5 ARR Potential' },
  ];

  return (
    <section id="impact" className="section-padding bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="tag mb-6">{'{ Market Impact }'}</span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-8"
            >
              Transforming the $10.3B Travel Market
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-invert prose-lg text-secondary"
            >
              <p className="mb-6">
                <strong>The Cascade Problem</strong>
              </p>
              <p>
                Current systems see disruptions in isolation. Yui reasons about compound effects. A delayed flight leads to missed connections, hotel penalties, and lost deals.
              </p>
              <p>
                By predicting gaps and automating handoffs across flights, ground transport, and hotels, we prevent cascading failures and reduce emergency rebooking costs by 40%.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-bg border border-white/5 flex flex-col justify-center items-center text-center"
              >
                <span className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">
                  {stat.value}
                </span>
                <span className="text-sm md:text-base text-secondary font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
