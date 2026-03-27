import { motion } from 'motion/react';

export default function Marquee() {
  const text = "AUTONOMOUS TRAVEL AGENT • PREDICT • COORDINATE • RESOLVE • ";
  
  return (
    <div className="w-full overflow-hidden bg-accent py-4 md:py-6 flex items-center">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        <div className="flex items-center text-bg font-display font-bold text-3xl md:text-5xl tracking-tight uppercase px-4">
          {text}
        </div>
        <div className="flex items-center text-bg font-display font-bold text-3xl md:text-5xl tracking-tight uppercase px-4">
          {text}
        </div>
      </motion.div>
    </div>
  );
}
