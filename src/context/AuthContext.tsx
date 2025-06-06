
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  session: any;
  user: User | null;
  profile: any | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const checkUser = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUser(userData);
          setSession({ user: userData });
          setProfile({ name: userData.name, avatar: null });
        }
      } catch (error) {
        console.error('Erro ao verificar usuário logado:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
