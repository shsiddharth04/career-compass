import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

export interface Card {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
  className?: string; // Allow custom background classes
}

export const ScrollStack: React.FC<{ items: Card[], offset?: number, scaleFactor?: number }> = ({ 
  items, 
  offset = 40, // Increased offset for better header visibility when stacked
  scaleFactor = 0.06 
}) => {
  return (
    <div className="relative w-full flex items-center justify-center py-20">
      <div className="flex w-full max-w-5xl flex-col gap-4 px-4">
        {items.map((card, index) => {
          return (
            <CardStackItem
              key={card.id}
              i={index}
              card={card}
              total={items.length}
              offset={offset}
              scaleFactor={scaleFactor}
            />
          );
        })}
      </div>
    </div>
  );
};

interface CardStackItemProps {
  card: Card;
  i: number;
  total: number;
  offset: number;
  scaleFactor: number;
}

const CardStackItem: React.FC<CardStackItemProps> = ({
  card,
  i,
  total,
  offset,
  scaleFactor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div
      ref={containerRef}
      className="sticky flex flex-col items-center justify-center self-auto"
      style={{
        top: 120 + i * offset, // Stagger sticky top positions
        marginBottom: (total - i - 1) * offset, // Push content below
        zIndex: i,
      }}
    >
        <motion.div
            className={`relative w-full h-[350px] sm:h-[400px] rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-12 flex flex-col justify-between overflow-hidden transition-colors border border-white/10 ${card.className || 'bg-neutral-900'}`}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
        >
            {/* Header Row */}
            <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/10 border border-white/5 text-slate-300 uppercase tracking-wider mb-3 backdrop-blur-sm">
                        0{i + 1}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{card.name}</h3>
                 </div>
            </div>
            
            {/* Main Content Area */}
            <div className="relative z-10 mt-auto">
                 <p className="text-slate-300 text-xl sm:text-2xl font-medium max-w-3xl mb-8 leading-relaxed">
                    {card.designation}
                 </p>
                 <div className="pt-6 border-t border-white/10">
                    {card.content}
                 </div>
            </div>

            {/* Subtle Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"></div>
        </motion.div>
    </div>
  );
};