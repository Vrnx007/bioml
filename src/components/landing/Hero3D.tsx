"use client";

import { motion } from "framer-motion";
import { ArrowRight, Beaker, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function Hero3D() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-border min-h-[90vh] flex items-center">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-50 to-emerald-50 blur-3xl opacity-50" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-purple-50 to-blue-50 blur-3xl opacity-50" />
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

          {/* Right: 3D Chemical Abstract Art */}
          <motion.div 
            className="mt-16 lg:mt-0 lg:flex-1 relative h-[500px] w-full hidden md:block perspective-1000"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Center "Glass" container */}
            <motion.div 
              className="absolute inset-0 m-auto w-64 h-80 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl z-20 flex flex-col items-center justify-center overflow-hidden"
              animate={{ y: [-10, 10, -10], rotateX: [2, -2, 2], rotateY: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/60 to-transparent" />
              <Beaker className="w-24 h-24 text-blue-100 mb-4 drop-shadow-md" strokeWidth={1} />
              <div className="text-center z-10">
                <div className="text-2xl font-display font-bold text-brand-navy">Polymer X-90</div>
                <div className="text-sm font-medium text-accent-teal uppercase tracking-widest mt-1">99.9% Purity</div>
              </div>
            </motion.div>

            {/* Floating 3D Orbs / Molecules */}
            {/* Orb 1: Blue Solvent */}
            <motion.div
              className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-2xl z-30"
              style={{ boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.2), 0 20px 40px rgba(59, 130, 246, 0.4)" }}
              animate={{ 
                y: [0, -30, 0], 
                x: [0, 20, 0],
                rotate: [0, 90, 0] 
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
            
            {/* Orb 2: Teal Reagent */}
            <motion.div
              className="absolute bottom-[20%] right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 shadow-2xl z-10"
              style={{ boxShadow: "inset -15px -15px 30px rgba(0,0,0,0.2), 0 25px 50px rgba(20, 184, 166, 0.4)" }}
              animate={{ 
                y: [0, 40, 0], 
                x: [0, -20, 0] 
              }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            />

            {/* Orb 3: Small Amber Catalyst */}
            <motion.div
              className="absolute top-[40%] right-[5%] w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-2xl z-30"
              style={{ boxShadow: "inset -8px -8px 16px rgba(0,0,0,0.2), 0 15px 30px rgba(245, 158, 11, 0.4)" }}
              animate={{ 
                y: [0, -50, 0], 
                scale: [1, 1.1, 1] 
              }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
            />
            
            {/* Abstract Wireframe Ring */}
            <motion.div
              className="absolute inset-0 m-auto w-[400px] h-[400px] rounded-full border border-blue-200/50 border-dashed z-0"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
