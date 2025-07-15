import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as AuthService from '../services/AuthService';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';


interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>; // Allow state update from outside
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  signup: (email: string, username: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  changeUsername: (newUsername: string, pass: string) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  changeAvatar: (newAvatarId: string) => Promise<User>;
  updateProfileDetails: (details: { bio?: string; favoriteAnimes?: string[] }) => Promise<User>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleSession = async (session: Session | null) => {
        if (!isMounted) return;
        try {
            const user = session?.user ?? null;
            if (user) {
                const profile = await AuthService.getProfile(user);
                if (isMounted) setCurrentUser(profile);
            } else {
                if (isMounted) setCurrentUser(null);
            }
        } catch (error: any) {
            console.error("AuthContext: Failed to get user profile. Logging out.", error?.message || error);
            if (isMounted) {
                AuthService.logout();
                setCurrentUser(null);
            }
        } finally {
            if (isMounted) setIsLoading(false);
        }
    };
    
    // Handle initial session check with v1 synchronous method
    handleSession(supabase.auth.session());

    // Listen for future auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );
    
    return () => {
      isMounted = false;
      // Use v1 unsubscribe method
      authListener?.unsubscribe();
    };
  }, []);


  const login = async (email: string, pass: string): Promise<User | null> => {
    const user = await AuthService.login(email, pass);
    // onAuthStateChange will handle setting the user.
    return user;
  };

  const signup = async (email: string, username: string, pass: string): Promise<User | null> => {
    const user = await AuthService.signup(email, username, pass);
    // onAuthStateChange will handle setting the user.
    return user;
  };

  const logout = async () => {
    await AuthService.logout();
    // onAuthStateChange will set user to null.
  };
  
  const changeUsername = async (newUsername: string, pass: string): Promise<User> => {
    if (!currentUser) throw new Error("Usuário não está logado.");
    const updatedUser = await AuthService.changeUsername(currentUser.id, newUsername, pass);
    setCurrentUser(updatedUser);
    return updatedUser;
  };
  
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
      if (!currentUser) throw new Error("Usuário não está logado.");
      await AuthService.changePassword(currentPassword, newPassword);
  };

  const changeAvatar = async (newAvatarId: string): Promise<User> => {
    if (!currentUser) throw new Error("Usuário não está logado.");
    const updatedUser = await AuthService.changeAvatar(currentUser.id, newAvatarId);
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const updateProfileDetails = async (details: { bio?: string; favoriteAnimes?: string[] }): Promise<User> => {
      if (!currentUser) throw new Error("Usuário não está logado.");
      const updatedUser = await AuthService.updateProfileDetails(currentUser.id, details);
      setCurrentUser(updatedUser);
      return updatedUser;
  };
  
  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    return AuthService.sendPasswordResetEmail(email);
  };

  const resetPassword = async (newPassword: string): Promise<void> => {
    await AuthService.resetPassword(newPassword);
    // After password reset, Supabase invalidates the recovery session.
    // We should log the user out to force them to log back in.
    await logout();
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    login,
    signup,
    logout,
    changeUsername,
    changePassword,
    changeAvatar,
    updateProfileDetails,
    sendPasswordResetEmail,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};