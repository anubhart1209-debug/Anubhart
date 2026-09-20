import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

export const FlyingBagDropAnimation: React.FC = () => {
  const { flyingItems } = useApp();

  // Target position is the shopping bag button in the top right navbar
  // Usually around right: 120px, top: 32px
  const targetX = typeof window !== 'undefined' ? window.innerWidth - 120 : 800;
  const targetY = 32;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - 32,
              y: item.startY - 32,
              scale: 1,
              opacity: 1,
              rotate: 0
            }}
            animate={{
              x: [item.startX - 32, (item.startX + targetX) / 2, targetX],
              y: [item.startY - 32, Math.min(item.startY, targetY) - 120, targetY],
              scale: [1, 0.8, 0.15],
              opacity: [1, 0.95, 0.2],
              rotate: [0, -15, 25]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.65,
              ease: [0.25, 0.8, 0.25, 1],
              times: [0, 0.5, 1]
            }}
            className="absolute top-0 left-0 w-16 h-16 rounded-xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-stone-900 z-50 pointer-events-none"
          >
            <img
              src={item.image}
              alt="Item falling into bag"
              className="w-full h-full object-cover"
            />
            {/* Visual drop ripple glow */}
            <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
