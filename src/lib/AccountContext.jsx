import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = useCallback(async () => {
    if (isLoadingAuth) {
      setLoading(true);
      return;
    }
    if (!user) {
      setAccount(null);
      setLoading(false);
      return;
    }
    try {
      const accounts = await base44.entities.Account.filter({ owner_user_id: user.id });
      setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
    } catch {
      setAccount(null);
    }
    setLoading(false);
  }, [user, isLoadingAuth]);

  useEffect(() => {
    setLoading(true);
    fetchAccount();
  }, [fetchAccount]);

  return (
    <AccountContext.Provider value={{ account, loading, refreshAccount: fetchAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}