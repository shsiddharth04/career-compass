import React from 'react';

export const ShinyText: React.FC<{ text: string; className?: string; speed?: number }> = ({ text, className = "", speed = 3 }) => {
  return (
    <span className={`inline-block relative ${className}`}>
        <style>
            {`
                @keyframes shine {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
            `}
        </style>
        <span 
            className="bg-clip-text text-transparent bg-[length:200%_auto]"
            style={{
                backgroundImage: 'linear-gradient(120deg, #cbd5e1 40%, #ffffff 50%, #cbd5e1 60%)',
                animation: `shine ${speed}s linear infinite`
            }}
        >
            {text}
        </span>
    </span>
  );
};