import { useAuthStore } from '../stores/authStore';
import { useSocketStore } from '../stores/socketStore';
import { staffService } from '../services/staffService';
import { db, mockServer } from '../lib/mockServer';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';

export function useAuth() {
  const {
    firebaseUser,
    staffProfile,
    role,
    departmentId,
    isLoading,
    isAuthenticated,
    setUser,
    clearUser,
    setLoading
  } = useAuthStore();
  
  const connectSocket = useSocketStore(state => state.connect);
  const disconnectSocket = useSocketStore(state => state.disconnect);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      let loggedUser: any;
      let profile: any;

      if (db.demoMode) {
        // Authenticate via local mock server
        const mockAuth = await mockServer.login(email);
        loggedUser = mockAuth.user;
        profile = mockAuth.profile;
      } else {
        // Real Firebase authenticate flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password || '');
        loggedUser = userCredential.user;
        // Fetch staff profile from backend
        profile = await staffService.getMyProfile();
      }

      // Store in authStore
      setUser(loggedUser, profile);
      
      // Connect websocket with token
      const idToken = db.demoMode ? 'mock-token' : await loggedUser.getIdToken();
      connectSocket(idToken);

      toast.success(`Welcome back, ${profile.name}!`);
      return profile;
    } catch (e: any) {
      console.error('[useAuth] Login failed', e);
      toast.error(e.message || 'Login failed. Please verify credentials.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (!db.demoMode) {
        await signOut(auth);
      }
      clearUser();
      disconnectSocket();
      toast.success('Logged out successfully.');
    } catch (e: any) {
      console.error('[useAuth] Logout failed', e);
      toast.error('Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user: firebaseUser,
    profile: staffProfile,
    role,
    departmentId,
    isLoading,
    isAuthenticated,
    login,
    logout
  };
}
