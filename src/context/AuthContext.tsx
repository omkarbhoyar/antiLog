import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';

export const DEMO_USERS: Record<string, User> = {
  customer: {
    id: 'user-cust-01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98201 99887',
    role: 'customer',
    city: 'Nagpur',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  },
  dealer_om: {
    id: 'team-01',
    name: 'Om Prakash Mundada',
    email: 'omprakash@omcars.com',
    phone: '+91 98230 45678',
    role: 'dealer_owner',
    dealerId: 'dealer-1',
    dealerName: 'OM Cars',
    city: 'Nagpur',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  },
  dealer_jay: {
    id: 'team-05',
    name: 'Jayesh Patel',
    email: 'jayesh@jaycars.com',
    phone: '+91 98221 77889',
    role: 'dealer_owner',
    dealerId: 'dealer-2',
    dealerName: 'Jay Cars Luxury & SUVs',
    city: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  super_admin: {
    id: 'admin-01',
    name: 'Antilog Platform Admin',
    email: 'admin@antilog.com',
    phone: '+91 98110 00001',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
};

interface AuthContextType {
  currentUser: User;
  activeRole: UserRole;
  switchUser: (key: keyof typeof DEMO_USERS) => void;
  loginAs: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem('antilog_auth_user');
      return stored ? JSON.parse(stored) : DEMO_USERS.customer;
    } catch {
      return DEMO_USERS.customer;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('antilog_auth_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const switchUser = (key: keyof typeof DEMO_USERS) => {
    if (DEMO_USERS[key]) {
      setCurrentUser(DEMO_USERS[key]);
    }
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(DEMO_USERS.customer);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole: currentUser.role,
        switchUser,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
