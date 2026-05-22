import { create } from 'zustand';
import { FirebaseUser, StaffProfile, UserRole } from '../types/auth.types';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  staffProfile: StaffProfile | null;
  role: UserRole | null;
  departmentId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: FirebaseUser, profile: StaffProfile) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

// Persist auth status in sessionStorage for demo fluidity
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { firebaseUser: null, staffProfile: null, role: null, departmentId: null, isAuthenticated: false };
  }
  const savedUser = sessionStorage.getItem('careq_auth_user');
  const savedProfile = sessionStorage.getItem('careq_auth_profile');
  
  if (savedUser && savedProfile) {
    const user = JSON.parse(savedUser);
    const profile = JSON.parse(savedProfile);
    return {
      firebaseUser: user,
      staffProfile: profile,
      role: profile.role,
      departmentId: profile.departmentId,
      isAuthenticated: true
    };
  }
  return { firebaseUser: null, staffProfile: null, role: null, departmentId: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  isLoading: false,

  setUser: (user, profile) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('careq_auth_user', JSON.stringify(user));
      sessionStorage.setItem('careq_auth_profile', JSON.stringify(profile));
    }
    set({
      firebaseUser: user,
      staffProfile: profile,
      role: profile.role,
      departmentId: profile.departmentId,
      isAuthenticated: true,
      isLoading: false
    });
  },

  clearUser: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('careq_auth_user');
      sessionStorage.removeItem('careq_auth_profile');
    }
    set({
      firebaseUser: null,
      staffProfile: null,
      role: null,
      departmentId: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  setLoading: (loading) => set({ isLoading: loading })
}));
