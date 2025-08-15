import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: (User & { password: string })[];
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setHydrated: () => void;
}

// Default mock users for demo
const DEFAULT_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'John Doe',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-01-15'),
    password: 'password123',
  },
  {
    id: '2',
    email: 'instructor@example.com',
    name: 'Sarah Wilson',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2023-12-01'),
    password: 'password123',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: DEFAULT_USERS,
      isHydrated: false,
      
      setHydrated: () => {
        set({ isHydrated: true });
      },
      
      login: async (email: string, password: string) => {
        const { users } = get();
        console.log('🔐 Login attempt for:', email);
        console.log('👥 Available users:', users.map(u => u.email));
        
        // Mock authentication using persisted users
        const user = users.find(u => u.email === email);
        if (user && user.password === password) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _pwd, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          console.log('✅ Login successful for:', email);
          return true;
        }
        console.log('❌ Login failed for:', email);
        return false;
      },
      
      register: async (name: string, email: string, password: string, role: 'student' | 'instructor') => {
        const { users } = get();
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          return false;
        }

        // Create new user with password
        const newUserWithPassword = {
          id: Date.now().toString(),
          email,
          name,
          role,
          createdAt: new Date(),
          password,
        };

        // Add to persisted users array
        const updatedUsers = [...users, newUserWithPassword];

        // Create user object without password for state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pwd, ...newUser } = newUserWithPassword;
        set({ 
          users: updatedUsers,
          user: newUser, 
          isAuthenticated: true 
        });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (updates: Partial<User>) => {
        const { user, users } = get();
        if (user) {
          // Update user in auth state
          const updatedUser = { ...user, ...updates };
          
          // Update user in users array
          const updatedUsers = users.map(u => 
            u.id === user.id 
              ? { ...u, ...updates }
              : u
          );
          
          set({ 
            user: updatedUser,
            users: updatedUsers
          });
        }
      },
    }),
    {
      name: 'skillset-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 Auth store rehydrating...', state);
        if (state) {
          state.setHydrated();
          if (state.isAuthenticated && state.user) {
            console.log('✅ User session restored:', state.user.email);
          }
        }
        return state;
      },
      // Ensure we use localStorage and handle serialization properly
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            // Convert date strings back to Date objects
            if (parsed.state?.user?.createdAt) {
              parsed.state.user.createdAt = new Date(parsed.state.user.createdAt);
            }
            if (parsed.state?.users) {
              parsed.state.users = parsed.state.users.map((user: any) => ({
                ...user,
                createdAt: new Date(user.createdAt)
              }));
            }
            return parsed;
          } catch (error) {
            console.error('Failed to parse auth storage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Failed to save auth storage:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);