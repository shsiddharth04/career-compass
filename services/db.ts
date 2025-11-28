import { CareerPlan, PlanStatus, PlanVisibility } from '../types';

const DB_KEY = 'career_compass_plans';

const getPlans = (): CareerPlan[] => {
  const stored = localStorage.getItem(DB_KEY);
  return stored ? JSON.parse(stored) : [];
};

const savePlans = (plans: CareerPlan[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(plans));
};

export const createPlan = (planData: Omit<CareerPlan, 'id' | 'createdAt' | 'updatedAt'>): CareerPlan => {
  const plans = getPlans();
  const newPlan: CareerPlan = {
    ...planData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  plans.push(newPlan);
  savePlans(plans);
  return newPlan;
};

export const getUserPlans = (userId: string): CareerPlan[] => {
  const plans = getPlans();
  return plans.filter(p => p.userId === userId);
};

export const getPublicPlans = (): CareerPlan[] => {
  const plans = getPlans();
  return plans.filter(p => p.visibility === PlanVisibility.Public);
};

export const getPlanById = (id: string): CareerPlan | undefined => {
  const plans = getPlans();
  return plans.find(p => p.id === id);
};

export const updatePlan = (id: string, updates: Partial<CareerPlan>): CareerPlan | null => {
  const plans = getPlans();
  const index = plans.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updatedPlan = {
    ...plans[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  plans[index] = updatedPlan;
  savePlans(plans);
  return updatedPlan;
};

export const deletePlan = (id: string): boolean => {
  let plans = getPlans();
  const initialLength = plans.length;
  plans = plans.filter(p => p.id !== id);
  savePlans(plans);
  return plans.length < initialLength;
};