"use client";

import { motion } from "framer-motion";
import { Activity, Droplet, Globe, FlaskConical } from "lucide-react";

const features = [
  {
    icon: <FlaskConical className="w-8 h-8 text-blue-500" />,
    title: "Vast Chemical Catalog",
    description: "Access over 10,000+ certified chemical compounds, reagents, and industrial solvents from verified global suppliers.",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: <Activity className="w-8 h-8 text-emerald-500" />,
    title: "Real-time Purity Tracking",
    description: "View lab-verified purity metrics and certificates of analysis (CoA) attached to every single batch before you order.",
    color: "bg-emerald-50 border-emerald-100",
  },
  {
    icon: <Droplet className="w-8 h-8 text-amber-500" />,
    title: "Dynamic Fluid Logistics",
    description: "Specialized cold-chain and hazardous materials logistics tracking ensures your chemicals arrive safely and on time.",
    color: "bg-amber-50 border-amber-100",
  },
  {
    icon: <Globe className="w-8 h-8 text-purple-500" />,
    title: "Global Compliance API",
    description: "Automated REACH, OSHA, and global regulatory compliance checks integrated directly into your procurement workflow.",
    color: "bg-purple-50 border-purple-100",
  },
];

export function ScrollFeatures() {
  return (
    <section className="py-24 bg-surface-page relative z-10">
      <div className="ui-container">
        
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            Precision engineering for your supply chain
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Everything you need to source, track, and manage industrial chemical inventory in one unified platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                rotateX: 5,
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)"
              }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className={`p-8 rounded-2xl border bg-white shadow-sm flex flex-col items-start transition-colors`}
            >
              <div className={`p-4 rounded-xl ${feature.color} mb-6 inline-flex`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
