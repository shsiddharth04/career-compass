import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Target, BookOpen, ArrowRight, Sparkles, ChevronRight, Briefcase, Zap, TrendingUp, Users } from 'lucide-react';
import { ShinyText } from '../components/ShinyText';
import { ScrollStack, Card } from '../components/ScrollStack';

export const Landing: React.FC = () => {

  const featureCards: Card[] = [
    {
      id: 1,
      name: "AI Career Paths",
      designation: "Tailored career suggestions based on your unique profile, skills, and interests.",
      className: "bg-neutral-900",
      content: (
        <div className="flex items-center gap-3 text-slate-300">
           <Compass className="h-6 w-6 text-white" />
           <span className="font-medium text-white">Powered by Gemini 2.5</span>
        </div>
      ),
    },
    {
      id: 2,
      name: "Course Recommendations",
      designation: "Discover the exact courses you need to bridge your skill gaps and level up.",
      className: "bg-zinc-900",
      content: (
        <div className="flex items-center gap-3 text-slate-300">
           <BookOpen className="h-6 w-6 text-white" />
           <span className="font-medium text-white">Short-term & Long-term options</span>
        </div>
      ),
    },
    {
      id: 3,
      name: "Goal Tracking",
      designation: "Create structured plans and track progress towards your dream role with precision.",
      className: "bg-stone-900",
      content: (
         <div className="flex items-center gap-3 text-slate-300">
            <Target className="h-6 w-6 text-white" />
            <span className="font-medium text-white">Milestone management</span>
         </div>
      ),
    },
    {
        id: 4,
        name: "Community Insights",
        designation: "Explore public plans from professionals in your industry to see what works.",
        className: "bg-slate-900",
        content: (
          <div className="flex items-center gap-3 text-slate-300">
             <Users className="h-6 w-6 text-white" />
             <span className="font-medium text-white">Learn from 500+ peers</span>
          </div>
        ),
      }
  ];

  return (
    <div className="relative isolate z-10 flex flex-col items-center">
      
      {/* Hero Section */}
      <div className="relative w-full px-6 pt-20 pb-32 lg:px-8 lg:pt-36 lg:pb-12 flex flex-col items-center text-center">
        
        {/* Small Pill Badge */}
        <div className="mb-8 flex justify-center animate-fade-in-up">
          <div className="relative rounded-full px-4 py-1.5 text-xs font-medium leading-5 text-slate-300 ring-1 ring-white/20 hover:ring-white/40 bg-white/5 backdrop-blur-md transition-all duration-300 flex items-center gap-2 group cursor-pointer">
            <Sparkles className="w-3 h-3 text-white" />
            <span>New: AI Course Recommendations</span>
          </div>
        </div>

        {/* Massive Brand Title with Shiny Animation */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] animate-fade-in select-none">
          <ShinyText text="CareerCompass" speed={4} />
        </h1>

        {/* Sub-Headline */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-slate-400 mb-8 max-w-3xl">
          Chart Your Career with <span className="text-white border-b border-white/20 pb-1">AI Precision</span>
        </h2>

        {/* Description */}
        <p className="mt-2 text-lg leading-8 text-slate-500 max-w-2xl mx-auto font-light mb-10">
          Not just another job board. An intelligent system to help you choose your path, develop the right skills, and accelerate your growth.
        </p>

        {/* CTA Buttons - Matching React Bits Style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-neutral-950 hover:bg-slate-200 transition-all duration-300 min-w-[160px]"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/explore"
            className="group inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold text-slate-300 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 min-w-[160px]"
          >
            Explore Plans
            <ChevronRight className="ml-2 h-4 w-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
        </div>
      </div>

      {/* Feature Section with Scroll Stack */}
      <div className="relative w-full max-w-7xl px-6 lg:px-8 pb-32 z-10">
        <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-white tracking-tight">Everything you need to grow</h2>
             <p className="text-slate-400 mt-2">Scroll to explore our powerful AI-driven features.</p>
        </div>
        <ScrollStack items={featureCards} />
      </div>
    </div>
  );
};