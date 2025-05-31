'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Account } from '../mock/accounts';

const UserContext = createContext<{ user: Account | null, setUser: (u: Account | null) => void, loading: boolean }>({ user: null, setUser: () => {}, loading: true });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
}
export const useUser = () => useContext(UserContext); 