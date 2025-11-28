import React, { useEffect, useState } from 'react';
import { getPublicPlans } from '../services/db';
import { CareerPlan } from '../types';
import { Eye, Search, Briefcase, Target, X } from 'lucide-react';
import { MarkdownText } from '../components/MarkdownText';

export const Explore: React.FC = () => {
  const [plans, setPlans] = useState<CareerPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<CareerPlan | null>(null);

  useEffect(() => {
    setPlans(getPublicPlans());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Explore Career Paths</h1>
        <p className="text-slate-400 text-lg">
           Discover how professionals in your industry are planning their growth.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/50 backdrop-blur rounded-2xl shadow-sm border border-white/10 border-dashed">
            <Search className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-white">No public plans yet</h3>
            <p className="text-slate-400 mt-1">Be the first to share your journey!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
                <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className="bg-neutral-900/50 backdrop-blur-md rounded-xl shadow-lg shadow-black/20 hover:bg-neutral-800/80 hover:border-blue-500/30 hover:shadow-blue-500/5 transition-all duration-300 border border-white/5 p-6 text-left group flex flex-col h-full"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/30">
                            {plan.fullName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{plan.fullName}</p>
                            <p className="text-xs text-slate-400">{plan.yearsExperience}y exp</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Briefcase className="h-3 w-3" /> Current
                            </p>
                            <p className="text-sm text-slate-200 font-medium">{plan.currentRole}</p>
                        </div>
                        <div className="w-px h-4 bg-white/10 ml-1.5"></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Target className="h-3 w-3" /> Goal
                            </p>
                            <p className="text-sm text-blue-400 font-medium truncate">{plan.desiredRoles[0]}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                            {plan.interests.slice(0, 2).join(', ')}{plan.interests.length > 2 && '...'}
                        </span>
                        <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold flex items-center">
                            View Plan <Eye className="h-3 w-3 ml-1" />
                        </span>
                    </div>
                </button>
            ))}
        </div>
      )}

      {/* Detail Modal Overlay */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}></div>
          <div className="relative bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
             <div className="sticky top-0 bg-neutral-900/95 backdrop-blur z-10 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-bold text-white">Career Plan</h2>
                    <p className="text-sm text-slate-400">By {selectedPlan.fullName}</p>
                 </div>
                 <button onClick={() => setSelectedPlan(null)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                     <X className="h-5 w-5" />
                 </button>
             </div>
             
             <div className="p-6 space-y-6 text-slate-200">
                <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Role</h4>
                        <p className="font-semibold text-white">{selectedPlan.currentRole}</p>
                     </div>
                     <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Target Role</h4>
                        <p className="font-semibold text-blue-100">{selectedPlan.desiredRoles.join(', ')}</p>
                     </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Skills & Interests</h4>
                    <p className="text-sm text-slate-400 mb-2"><span className="font-medium text-slate-300">Skills:</span> {selectedPlan.currentSkills}</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedPlan.interests.map((interest, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/5">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>

                {(selectedPlan.aiSuggestedPaths) && (
                    <div className="border-t border-white/10 pt-6">
                        <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                           <Eye className="h-4 w-4" /> AI Suggestions
                        </h4>
                        <div className="bg-black/30 p-4 rounded-xl text-sm text-slate-300 shadow-inner border border-white/5">
                            <MarkdownText text={selectedPlan.aiSuggestedPaths} />
                        </div>
                    </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};