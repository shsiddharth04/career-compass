export interface User {
  id: string;
  email: string;
  name: string;
}

export enum PlanVisibility {
  Private = 'private',
  Public = 'public',
}

export enum PlanStatus {
  Draft = 'draft',
  Submitted = 'submitted',
  Reviewed = 'reviewed',
  Approved = 'approved',
}

export interface CareerPlan {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  currentRole: string;
  yearsExperience: number;
  interests: string[];
  currentSkills: string;
  desiredRoles: string[];
  careerGoals: string;
  aiSuggestedPaths: string;
  aiRecommendedCourses: string;
  visibility: PlanVisibility;
  status: PlanStatus;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}