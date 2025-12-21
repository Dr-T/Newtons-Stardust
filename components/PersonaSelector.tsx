import React from 'react';
import { AIPersona } from '../types';
import { X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PersonaSelectorProps {
  personas: AIPersona[];
  selectedPersona: AIPersona;
  onSelect: (persona: AIPersona) => void;
  onClose: () => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ 
  personas, 
  selectedPersona, 
  onSelect, 
  onClose 
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="relative w-full max-w-5xl bg-black/40 border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-serif italic text-white tracking-wide">选择你的星辰导师</h2>
            <p className="text-sm font-mono text-white/40 mt-1 uppercase tracking-widest">Select Your AI Physics Tutor</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const isSelected = selectedPersona.id === persona.id;
            const Icon = persona.icon;
            
            return (
              <motion.div
                key={persona.id}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(persona)}
                className={`
                  relative cursor-pointer rounded-xl p-6 border transition-all duration-300 flex flex-col h-[320px]
                  ${isSelected 
                    ? `border-${persona.color}-400/50 bg-${persona.color}-900/10 shadow-[0_0_30px_rgba(var(--color-${persona.color}),0.1)]` 
                    : 'border-white/10 bg-white/5 hover:border-white/30'}
                `}
                style={{ borderColor: isSelected ? persona.color : undefined }}
              >
                {/* Visual Accent */}
                <div 
                  className="absolute top-0 left-0 w-full h-1 rounded-t-xl opacity-50"
                  style={{ backgroundColor: persona.color }}
                ></div>

                {/* Icon */}
                <div className="mb-6 w-12 h-12 rounded-full flex items-center justify-center bg-black/30 border border-white/10 text-white/80">
                   <Icon size={24} style={{ color: persona.color }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{persona.name}</h3>
                <p className="text-sm text-white/60 mb-6 leading-relaxed flex-1">
                  {persona.roleDescription}
                </p>

                {/* Selection Indicator */}
                <div className="mt-auto flex items-center justify-between">
                   <span 
                      className="text-xs font-mono uppercase tracking-widest px-2 py-1 rounded"
                      style={{ 
                        color: isSelected ? persona.color : '#666',
                        backgroundColor: isSelected ? `${persona.color}15` : 'transparent' 
                      }}
                   >
                     {isSelected ? 'Current Link' : 'Select Link'}
                   </span>
                   {isSelected && <ChevronRight size={16} style={{ color: persona.color }} />}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};