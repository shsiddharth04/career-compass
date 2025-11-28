import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlanStatus, PlanVisibility, CareerPlan } from '../types';
import { createPlan, deletePlan, getUserPlans } from '../services/db';
import { generateCareerPaths, recommendCourses } from '../services/gemini';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Sparkles, BookOpen, Loader2, Briefcase, Award, Target, User, Eye, Calendar, ArrowRight } from 'lucide-react';
import { MarkdownText } from '../components/MarkdownText';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<CareerPlan[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    currentRole: '',
    yearsExperience: 0,
    interests: '',
    currentSkills: '',
    desiredRoles: '',
    careerGoals: '',
    visibility: PlanVisibility.Private,
  });

  const [aiPaths, setAiPaths] = useState('');
  const [aiCourses, setAiCourses] = useState('');
  const [isGeneratingPaths, setIsGeneratingPaths] = useState(false);
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);

  useEffect(() => {
    if (user) {
      setPlans(getUserPlans(user.id));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePaths = async () => {
    setIsGeneratingPaths(true);
    const interestsArray = formData.interests.split(',').map(s => s.trim()).filter(Boolean);
    const desiredRolesArray = formData.desiredRoles.split(',').map(s => s.trim()).filter(Boolean);

    const result = await generateCareerPaths(
      formData.currentRole,
      Number(formData.yearsExperience),
      formData.currentSkills,
      interestsArray,
      desiredRolesArray
    );
    setAiPaths(result);
    setIsGeneratingPaths(false);
  };

  const handleRecommendCourses = async () => {
    setIsGeneratingCourses(true);
    const desiredRolesArray = formData.desiredRoles.split(',').map(s => s.trim()).filter(Boolean);
    const result = await recommendCourses(formData.currentSkills, desiredRolesArray);
    setAiCourses(result);
    setIsGeneratingCourses(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createPlan({
      userId: user.id,
      fullName: user.name,
      email: user.email,
      currentRole: formData.currentRole,
      yearsExperience: Number(formData.yearsExperience),
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      currentSkills: formData.currentSkills,
      desiredRoles: formData.desiredRoles.split(',').map(s => s.trim()).filter(Boolean),
      careerGoals: formData.careerGoals,
      aiSuggestedPaths: aiPaths,
      aiRecommendedCourses: aiCourses,
      visibility: formData.visibility,
      status: PlanStatus.Draft,
    });

    // Reset form and reload plans
    setFormData({
      currentRole: '',
      yearsExperience: 0,
      interests: '',
      currentSkills: '',
      desiredRoles: '',
      careerGoals: '',
      visibility: PlanVisibility.Private,
    });
    setAiPaths('');
    setAiCourses('');
    setPlans(getUserPlans(user.id));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      deletePlan(id);
      if (user) setPlans(getUserPlans(user.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name.split(' ')[0]}</h1>
        <p className="text-slate-400 mt-2 text-lg">Manage your career plans or create a new path for your future.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Creation Form - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/50 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/20 border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-400" />
                Create New Career Plan
              </h2>
            </div>
            
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal & Current Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400" /> Current Role
                    </label>
                    <input
                      type="text"
                      name="currentRole"
                      required
                      value={formData.currentRole}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
                      placeholder="e.g. Junior Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" /> Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsExperience"
                      required
                      value={formData.yearsExperience}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                       <User className="w-4 h-4 text-blue-400" /> Interests <span className="text-xs text-slate-500 font-normal">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
                      placeholder="e.g. Artificial Intelligence, Product Management, UX Design"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-400" /> Current Skills
                    </label>
                    <textarea
                      name="currentSkills"
                      rows={3}
                      value={formData.currentSkills}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
                      placeholder="Describe your technical and soft skills (e.g., React, Python, Public Speaking)..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                       <Target className="w-4 h-4 text-blue-400" /> Desired Roles <span className="text-xs text-slate-500 font-normal">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      name="desiredRoles"
                      value={formData.desiredRoles}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
                      placeholder="e.g. Senior Software Engineer, CTO, Product Lead"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-300">Career Goals</label>
                    <textarea
                      name="careerGoals"
                      rows={2}
                      value={formData.careerGoals}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600 hover:bg-white/10"
                      placeholder="Where do you see yourself in 5 years? What impact do you want to make?"
                    />
                  </div>
                </div>
                
                {/* AI Section */}
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-blue-950/20 p-6 rounded-xl border border-blue-500/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-32 h-32 text-blue-400" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-blue-100 font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                      AI Insights
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <button
                        type="button"
                        onClick={handleGeneratePaths}
                        disabled={isGeneratingPaths || !formData.currentRole}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 border border-blue-500/50"
                      >
                        {isGeneratingPaths ? <Loader2 className="animate-spin h-4 w-4"/> : <Sparkles className="h-4 w-4"/>}
                        Generate Career Paths
                      </button>
                      <button
                        type="button"
                        onClick={handleRecommendCourses}
                        disabled={isGeneratingCourses || !formData.currentSkills}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-blue-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                      >
                        {isGeneratingCourses ? <Loader2 className="animate-spin h-4 w-4"/> : <BookOpen className="h-4 w-4"/>}
                        Recommend Courses
                      </button>
                    </div>

                    <div className="space-y-4">
                      {aiPaths && (
                        <div className="animate-fade-in">
                          <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Suggested Paths</label>
                          <div className="p-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg text-sm text-slate-300 shadow-inner custom-scrollbar max-h-96 overflow-y-auto">
                            <MarkdownText text={aiPaths} />
                          </div>
                        </div>
                      )}

                      {aiCourses && (
                        <div className="animate-fade-in">
                          <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Recommended Courses</label>
                          <div className="p-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg text-sm text-slate-300 shadow-inner custom-scrollbar max-h-96 overflow-y-auto">
                            <MarkdownText text={aiCourses} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 border-t border-white/10 pt-6">
                   <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                     <Eye className="w-4 h-4 text-blue-400" /> Visibility
                   </label>
                   <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    className="block w-full md:w-1/3 rounded-lg border-white/10 bg-white/5 p-2.5 text-sm text-white shadow-sm focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
                   >
                     <option value={PlanVisibility.Private} className="bg-neutral-900 text-white">Private - Only you can see</option>
                     <option value={PlanVisibility.Public} className="bg-neutral-900 text-white">Public - Visible to community</option>
                   </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center py-3 px-8 border border-transparent text-sm font-medium rounded-lg text-neutral-950 bg-white hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:scale-105"
                  >
                    Save Career Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Existing Plans List - Takes 1 column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Plans</h2>
            <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">{plans.length}</span>
          </div>

          <div className="space-y-4">
            {plans.length === 0 ? (
               <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10 border-dashed">
                 <div className="mx-auto h-12 w-12 text-slate-500 mb-3">
                   <Target className="h-full w-full" />
                 </div>
                 <h3 className="text-sm font-medium text-white">No plans yet</h3>
                 <p className="mt-1 text-sm text-slate-400">Create your first career plan to get started.</p>
               </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="bg-neutral-900/50 backdrop-blur-md rounded-xl shadow-lg shadow-black/20 border border-white/5 hover:border-blue-500/30 hover:bg-neutral-800/80 transition-all duration-300 overflow-hidden group">
                   <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            plan.visibility === PlanVisibility.Public 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {plan.visibility}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/plan/${plan.id}`} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDelete(plan.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-base font-semibold text-white mb-1">{plan.currentRole}</h3>
                      <div className="flex items-center text-slate-400 mb-4">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        <p className="text-sm truncate">{plan.desiredRoles[0] || 'Future Role'}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-xs text-slate-500">
                           {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                        <Link to={`/plan/${plan.id}`} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center">
                          View Details <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};