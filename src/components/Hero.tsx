import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" 
      />

      {/* Floating UI Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:flex absolute top-1/3 left-10 items-center gap-3 p-4 rounded-2xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          ✈️
        </div>
        <div>
          <p className="text-sm font-bold text-white">Flight Delayed</p>
          <p className="text-xs text-secondary">Auto-rebooking...</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="hidden lg:flex absolute bottom-1/3 right-10 items-center gap-3 p-4 rounded-2xl bg-surface/80 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
          🚗
        </div>
        <div>
          <p className="text-sm font-bold text-white">Uber Updated</p>
          <p className="text-xs text-secondary">Pickup shifted to 11:00</p>
        </div>
      </motion.div>

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-secondary mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
          The autonomous travel agent
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, type: "spring", bounce: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-[1.1] mb-8"
        >
          Predict. Coordinate. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
            Resolve.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-secondary mb-12"
        >
          Transforming travel from chaotic and reactive to intelligent and proactive. Yui AI handles disruptions before you even realize they exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#solutions"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-bg bg-primary hover:bg-white transition-colors w-full sm:w-auto"
          >
            View Solutions
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a
            href="#investment"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-primary bg-surface border border-white/10 hover:bg-surface-hover transition-colors w-full sm:w-auto"
          >
            Investment Deck
          </a>
        </motion.div>
      </div>
    </section>
  );
}
