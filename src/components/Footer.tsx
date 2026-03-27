import { motion } from 'motion/react';
import { ArrowRight, Twitter, Linkedin, Instagram, Dribbble } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 pt-24 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2">
            <a href="#" className="text-3xl font-display font-bold tracking-tighter mb-6 block">
              Yui AI<span className="text-accent">.</span>
            </a>
            <p className="text-secondary max-w-sm mb-8 text-lg">
              The autonomous travel agent that handles disruptions before users realize they exist.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-secondary hover:text-accent hover:border-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-secondary hover:text-accent hover:border-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-secondary hover:text-accent hover:border-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-secondary hover:text-accent hover:border-accent transition-colors">
                <Dribbble className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-display font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Problems', 'Solutions', 'Impact', 'Moats', 'Investment'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-secondary hover:text-accent transition-colors text-lg">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-display font-bold mb-6">Newsletter</h4>
            <p className="text-secondary mb-6 text-lg">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-bg border border-white/10 rounded-full px-6 py-4 text-primary focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-bg bg-primary hover:bg-white transition-colors"
              >
                Subscribe
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary text-sm">
            &copy; {new Date().getFullYear()} Yui AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-secondary">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
