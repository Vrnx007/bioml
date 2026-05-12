"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

// Bubble generator
const generateBubbles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 120 + 40, // spread across bottom
    duration: Math.random() * 2 + 2,
    delay: Math.random() * 2,
  }));
};

export function Hero3D() {
  const [bubbles, setBubbles] = useState<{id: number, size: number, x: number, duration: number, delay: number}[]>([]);

  useEffect(() => {
    setBubbles(generateBubbles(15));
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-border min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-50 to-emerald-50 blur-3xl opacity-50" />
      </div>

      <div className="ui-container relative z-10 w-full">
        <div className="lg:flex lg:items-center lg:gap-16">
          
          {/* Left: Content */}
          <motion.div 
            className="max-w-2xl flex-1 pt-12 lg:pt-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border mb-6">
              <span className="flex h-2 w-2 rounded-full bg-accent-teal animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Next-Gen B2B Sourcing</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="font-display text-[2.5rem] leading-[1.1] font-bold text-brand-navy sm:text-[3.5rem] lg:text-[4rem]">
              Intelligent sourcing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-accent-teal">modern chemicals</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="ui-prose mt-6 max-w-measure text-lg text-text-secondary leading-relaxed">
              Connect with certified global manufacturers. Streamline procurement, ensure rigorous quality control, and track deliveries with unprecedented transparency.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4 items-center">
              <Link href="/catalog" className="ui-btn-primary gap-2 h-14 px-8 text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                Explore Catalog
                <ArrowRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              </Link>
              <Link href="/vendor/onboarding" className="ui-btn-secondary h-14 px-8 text-base bg-white">
                Become a Vendor
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-border flex gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ShieldCheck className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-text-primary">ISO 17025 Certified</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Truck className="w-5 h-5" /></div>
                <div className="text-sm font-medium text-text-primary">Global Logistics</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Detailed Animated Beaker */}
          <motion.div 
            className="mt-16 lg:mt-0 lg:flex-1 relative h-[500px] w-full hidden md:flex items-center justify-center perspective-1000"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative w-[300px] h-[400px]">
              
              {/* The Pouring Tube */}
              <motion.div
                className="absolute -top-10 left-[60%] origin-bottom-left"
                animate={{ rotate: [-20, -50, -20] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <svg width="40" height="100" viewBox="0 0 40 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0 C10 0 10 80 10 90 C10 100 30 100 30 90 C30 80 30 0 30 0" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" fill="rgba(255,255,255,0.8)" />
                  <path d="M12 40 C12 40 12 85 12 90 C12 95 28 95 28 90 C28 85 28 40 28 40 Z" fill="#F59E0B" />
                </svg>
                {/* Dripping drops */}
                <motion.div 
                  className="absolute -bottom-4 left-2 w-3 h-3 bg-amber-500 rounded-full blur-[1px]"
                  animate={{ y: [0, 150], opacity: [1, 1, 0], scale: [1, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "easeIn", delay: 0.5 }}
                />
                <motion.div 
                  className="absolute -bottom-4 left-3 w-2 h-2 bg-amber-400 rounded-full blur-[1px]"
                  animate={{ y: [0, 150], opacity: [1, 1, 0], scale: [1, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "easeIn", delay: 0.8 }}
                />
              </motion.div>

              {/* The Main Erlenmeyer Flask */}
              <svg width="100%" height="100%" viewBox="0 0 200 300" className="absolute inset-0 drop-shadow-2xl z-10" style={{ filter: 'drop-shadow(0px 20px 30px rgba(14, 165, 233, 0.2))' }}>
                <defs>
                  {/* Clip path to keep liquid inside the flask */}
                  <clipPath id="flask-clip">
                    <path d="M80 30 L80 100 L20 270 C10 290 20 295 40 295 L160 295 C180 295 190 290 180 270 L120 100 L120 30 Z" />
                  </clipPath>
                  
                  {/* Gradients */}
                  <linearGradient id="flask-glass" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="20%" stopColor="rgba(255,255,255,0.2)" />
                    <stop offset="80%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                  </linearGradient>

                  <linearGradient id="liquid-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0284C7" /> {/* Deep Blue */}
                    <stop offset="50%" stopColor="#0EA5E9" /> {/* Light Blue */}
                    <stop offset="100%" stopColor="#10B981" /> {/* Emerald top mixing */}
                  </linearGradient>

                  <linearGradient id="mixing-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(245, 158, 11, 0)" /> 
                    <stop offset="100%" stopColor="rgba(245, 158, 11, 0.8)" /> {/* Amber mixing layer */}
                  </linearGradient>
                </defs>

                {/* Back of the glass rim */}
                <ellipse cx="100" cy="25" rx="20" ry="5" fill="none" stroke="#E2E8F0" strokeWidth="3" />

                {/* Liquids Layer (Clipped to Flask Shape) */}
                <g clipPath="url(#flask-clip)">
                  {/* Background Liquid (Blue) */}
                  <rect x="0" y="120" width="200" height="200" fill="url(#liquid-gradient)" />
                  
                  {/* Mixing layer (Amber/Green at the top) */}
                  <motion.rect 
                    x="0" y="120" width="200" height="80" 
                    fill="url(#mixing-gradient)"
                    animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    style={{ mixBlendMode: "screen" }}
                  />

                  {/* Liquid surface wave 1 */}
                  <motion.path 
                    d="M0 130 Q 50 110, 100 130 T 200 130 L 200 150 L 0 150 Z" 
                    fill="#38BDF8" opacity="0.6"
                    animate={{ x: [-200, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  />
                  {/* Liquid surface wave 2 */}
                  <motion.path 
                    d="M0 135 Q 50 150, 100 135 T 200 135 L 200 160 L 0 160 Z" 
                    fill="#34D399" opacity="0.7" style={{ mixBlendMode: "overlay" }}
                    animate={{ x: [0, -200] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  />

                  {/* Dynamic Bubbles */}
                  {bubbles.map((bubble) => (
                    <motion.circle
                      key={bubble.id}
                      cx={bubble.x}
                      cy="290"
                      r={bubble.size}
                      fill="white"
                      opacity="0.6"
                      animate={{ 
                        y: [0, -170], 
                        x: [0, Math.random() * 20 - 10, 0, Math.random() * 20 - 10],
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: bubble.duration, 
                        delay: bubble.delay,
                        ease: "easeIn"
                      }}
                    />
                  ))}
                  
                  {/* Large reaction bubbles popping */}
                  <motion.circle cx="80" cy="140" r="15" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"
                    animate={{ scale: [0, 1.5], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  />
                  <motion.circle cx="120" cy="130" r="10" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"
                    animate={{ scale: [0, 1.5], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: 1.2 }}
                  />
                </g>

                {/* Flask Outline (Glass body) */}
                <path 
                  d="M80 30 L80 100 L20 270 C10 290 20 295 40 295 L160 295 C180 295 190 290 180 270 L120 100 L120 30" 
                  fill="url(#flask-glass)" stroke="#CBD5E1" strokeWidth="4" strokeLinejoin="round" 
                />
                
                {/* Front of the glass rim */}
                <path d="M80 25 C80 30 120 30 120 25" fill="none" stroke="#CBD5E1" strokeWidth="4" />
                <path d="M75 25 C75 33 125 33 125 25" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />

                {/* Glass Glare / Highlights */}
                <path d="M40 250 L85 110" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.6" style={{ filter: 'blur(1px)' }} />
                <path d="M150 260 L160 275" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                <path d="M110 40 L110 80" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                
                {/* Volume markings */}
                <line x1="120" y1="120" x2="135" y2="120" stroke="#94A3B8" strokeWidth="2" />
                <text x="140" y="125" fill="#94A3B8" fontSize="10" fontFamily="monospace">800</text>
                
                <line x1="120" y1="160" x2="130" y2="160" stroke="#94A3B8" strokeWidth="2" />
                
                <line x1="120" y1="200" x2="135" y2="200" stroke="#94A3B8" strokeWidth="2" />
                <text x="140" y="205" fill="#94A3B8" fontSize="10" fontFamily="monospace">400</text>
              </svg>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
