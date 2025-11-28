import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CareerPlan, PlanVisibility } from '../types';
import { getPlanById, updatePlan } from '../services/db';
import { generateCareerPaths, recommendCourses } from '../services/gemini';
import { Loader2, Sparkles, BookOpen, Save, ArrowLeft, Briefcase, Calendar, Award, Target, Eye, User } from 'lucide-react';
import { MarkdownText } from '../components/MarkdownText';

export const EditPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  
  const [isGeneratingPaths, setIsGeneratingPaths] = useState(false);
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPlan = getPlanById(id);
      if (foundPlan) {
        if (user && foundPlan.userId !== user.id) {
             alert("You are not authorized to edit this plan.");
             navigate('/dashboard');
             return;
        }
        setPlan(foundPlan);
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
    }
  }, [id, navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!plan) return;
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: value });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan && id) {
      updatePlan(id, {
        currentRole: plan.currentRole,
        yearsExperience: plan.yearsExperience,
        interests: typeof plan.interests === 'string' ? (plan.interests as string).split(',') : plan.interests,
        currentSkills: plan.currentSkills,
        desiredRoles: typeof plan.desiredRoles === 'string' ? (plan.desiredRoles as string).split(',') : plan.desiredRoles,
        careerGoals: plan.careerGoals,
        visibility: plan.visibility,
        aiSuggestedPaths: plan.aiSuggestedPaths,
        aiRecommendedCourses: plan.aiRecommendedCourses,
      });
      alert('Plan updated successfully!');
    }
  };

  const handleRegeneratePaths = async () => {
    if (!plan) return;
    setIsGeneratingPaths(true);
    const interestsArray = Array.isArray(plan.interests) ? plan.interests : (plan.interests as string).split(',');
    const desiredRolesArray = Array.isArray(plan.desiredRoles) ? plan.desiredRoles : (plan.desiredRoles as string).split(',');

    const result = await generateCareerPaths(
      plan.currentRole,
      plan.yearsExperience,
      plan.currentSkills,
      interestsArray,
      desiredRolesArray
    );
    setPlan({ ...plan, aiSuggestedPaths: result });
    setIsGeneratingPaths(false);
  };

  const handleRecommendCourses = async () => {
    if (!plan) return;
    setIsGeneratingCourses(true);
    const desiredRolesArray = Array.isArray(plan.desiredRoles) ? plan.desiredRoles : (plan.desiredRoles as string).split(',');
    const result = await recommendCourses(plan.currentSkills, desiredRolesArray);
    setPlan({ ...plan, aiRecommendedCourses: result });
    setIsGeneratingCourses(false);
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
  );
  
  if (!plan) return <div className="p-10 text-center text-white">Plan not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
         <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-400 hover:text-white transition-colors font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
         </button>
         <h1 className="text-2xl font-bold text-white">Edit Career Plan</h1>
      </div>

      <div className="bg-neutral-900/50 backdrop-blur-md shadow-2xl shadow-black/20 rounded-2xl p-6 sm:p-8 border border-white/10">
        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                 <Briefcase className="w-4 h-4 text-blue-400" /> Current Role
               </label>
               <input
                 type="text"
                 name="currentRole"
                 value={plan.currentRole}
                 onChange={handleChange}
                 className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
               />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-blue-400" /> Years of Experience
               </label>
               <input
                 type="number"
                 name="yearsExperience"
                 value={plan.yearsExperience}
                 onChange={handleChange}
                 className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
               />
             </div>
             <div className="md:col-span-2 space-y-2">
               <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" /> Interests
               </label>
               <input
                 type="text"
                 name="interests"
                 value={Array.isArray(plan.interests) ? plan.interests.join(', ') : plan.interests}
                 onChange={(e) => setPlan({...plan, interests: e.target.value.split(',').map(s=>s.trim())})}
                 className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
               />
             </div>
             <div className="md:col-span-2 space-y-2">
               <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                 <Award className="w-4 h-4 text-blue-400" /> Current Skills
               </label>
               <textarea
                 name="currentSkills"
                 rows={3}
                 value={plan.currentSkills}
                 onChange={handleChange}
                 className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
               />
             </div>
             <div className="md:col-span-2 space-y-2">
               <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                 <Target className="w-4 h-4 text-blue-400" /> Desired Roles
               </label>
               <input
                 type="text"
                 name="desiredRoles"
                 value={Array.isArray(plan.desiredRoles) ? plan.desiredRoles.join(', ') : plan.desiredRoles}
                 onChange={(e) => setPlan({...plan, desiredRoles: e.target.value.split(',').map(s=>s.trim())})}
                 className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
               />
             </div>
             <div className="md:col-span-2 space-y-2">
               <label className="text-sm font-medium text-slate-300">Career Goals</label>
               <textarea
                 name="careerGoals"
                 rows={2}
                 value={plan.careerGoals}
                 onChange={handleChange}
                 className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
               />
             </div>

             {/* AI Section */}
             <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-blue-950/20 p-6 rounded-xl border border-blue-500/10">
                <div className="space-y-6">
                    <div>
                       <div className="flex justify-between items-center mb-3">
                         <label className="text-sm font-bold text-blue-100 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400" /> AI Suggested Paths
                         </label>
                         <button
                           type="button"
                           onClick={handleRegeneratePaths}
                           disabled={isGeneratingPaths}
                           className="inline-flex items-center text-xs font-medium text-blue-300 hover:text-white transition-colors bg-white/5 px-3 py-1 rounded-full border border-white/10 shadow-sm"
                         >
                            {isGeneratingPaths ? <Loader2 className="animate-spin h-3 w-3 mr-1"/> : <Sparkles className="h-3 w-3 mr-1"/>}
                            Regenerate
                         </button>
                       </div>
                       <div className="p-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg text-sm text-slate-300 shadow-inner custom-scrollbar max-h-96 overflow-y-auto">
                         <MarkdownText text={plan.aiSuggestedPaths || "No suggestions generated yet."} />
                       </div>
                    </div>

                    <div>
                       <div className="flex justify-between items-center mb-3">
                         <label className="text-sm font-bold text-blue-100 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-400" /> AI Recommended Courses
                         </label>
                         <button
                           type="button"
                           onClick={handleRecommendCourses}
                           disabled={isGeneratingCourses}
                           className="inline-flex items-center text-xs font-medium text-blue-300 hover:text-white transition-colors bg-white/5 px-3 py-1 rounded-full border border-white/10 shadow-sm"
                         >
                            {isGeneratingCourses ? <Loader2 className="animate-spin h-3 w-3 mr-1"/> : <BookOpen className="h-3 w-3 mr-1"/>}
                            Recommend
                         </button>
                       </div>
                       <div className="p-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg text-sm text-slate-300 shadow-inner custom-scrollbar max-h-96 overflow-y-auto">
                         <MarkdownText text={plan.aiRecommendedCourses || "No courses recommended yet."} />
                       </div>
                    </div>
                </div>
             </div>

             <div className="md:col-span-2">
               <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                 <Eye className="w-4 h-4 text-blue-400" /> Visibility
               </label>
               <select
                 name="visibility"
                 value={plan.visibility}
                 onChange={handleChange}
                 className="block w-full md:w-1/3 rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
               >
                 <option value={PlanVisibility.Private} className="bg-neutral-900 text-white">Private</option>
                 <option value={PlanVisibility.Public} className="bg-neutral-900 text-white">Public</option>
               </select>
             </div>
          </div>

          <div className="flex justify-end pt-5 border-t border-white/10">
            <button
              type="submit"
              className="inline-flex items-center justify-center py-3 px-8 border border-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)] text-sm font-medium rounded-lg text-neutral-950 bg-white hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all hover:scale-105"
            >
              <Save className="h-4 w-4 mr-2" />
              Update Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};