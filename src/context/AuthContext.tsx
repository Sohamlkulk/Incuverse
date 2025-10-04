import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userObj: User = {
        id: foundUser.id,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
      };
      setUser(userObj);
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      isAdmin: email === 'admin@gmail.com',
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userObj: User = {
      id: newUser.id,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    };
    setUser(userObj);
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
