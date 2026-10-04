import { useState, useEffect, useCallback } from 'react';
import { cleanSecureInput, hasSQLInjectionThreat, stripControlCharacters } from '../utils/sanitize';
import type { RegisteredAdmin } from '../types/admin';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 30;

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface AdminUser {
  username: string;
  email: string;
  role: 'head_admin' | 'lead_admin' | 'moderator';
}

export function useAdminAuth() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw =
          sessionStorage.getItem('samarthya_admin_session') ||
          localStorage.getItem('samarthya_admin_session');
        if (raw) return JSON.parse(raw) as AdminUser;
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw =
          sessionStorage.getItem('samarthya_admin_session') ||
          localStorage.getItem('samarthya_admin_session');
        return Boolean(raw);
      } catch {
        // ignore
      }
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // Countdown timer for brute force lockout
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const refreshAuth = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw =
          sessionStorage.getItem('samarthya_admin_session') ||
          localStorage.getItem('samarthya_admin_session');
        if (raw) {
          const userObj = JSON.parse(raw) as AdminUser;
          setCurrentUser(userObj);
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    return false;
  }, []);

  // Save session helper
  const persistSession = useCallback((userObj: AdminUser) => {
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    setFailedAttempts(0);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('samarthya_admin_session', JSON.stringify(userObj));
        localStorage.setItem('samarthya_admin_session', JSON.stringify(userObj));
      }
    } catch {
      // ignore
    }
  }, []);

  // Login handler
  const login = useCallback(
    async (rawUsername: string, rawPassword: string): Promise<AuthResult> => {
      if (lockoutTimer > 0) {
        return {
          success: false,
          error: `Security lock active. Please wait ${lockoutTimer} seconds before retrying.`,
        };
      }

      if (hasSQLInjectionThreat(rawUsername) || hasSQLInjectionThreat(rawPassword)) {
        setFailedAttempts((prev) => prev + 1);
        return {
          success: false,
          error: 'Security Alert: Malicious SQL or script pattern detected. Access denied.',
        };
      }

      const username = cleanSecureInput(rawUsername).trim();
      const password = stripControlCharacters(rawPassword).trim();

      if (!username || !password) {
        return { success: false, error: 'Username and password cannot be empty.' };
      }

      // 1. Direct Supabase Cloud Database Authentication
      if (isSupabaseConfigured) {
        try {
          // Check admin_users_list in Supabase club_content
          const { data: userListRow } = await supabase
            .from('club_content')
            .select('value')
            .eq('key', 'admin_users_list')
            .maybeSingle();

          if (Array.isArray(userListRow?.value)) {
            const list = userListRow.value as RegisteredAdmin[];
            const matched = list.find(
              (u) =>
                (u.username.toLowerCase() === username.toLowerCase() ||
                  `${u.username.toLowerCase()}@samarthya.sjec.ac.in` === username.toLowerCase() ||
                  `${u.username.toLowerCase()}@sjec.ac.in` === username.toLowerCase()) &&
                u.password === password
            );

            if (matched) {
              const status = matched.status || 'approved';
              if (status === 'pending') {
                return {
                  success: false,
                  error:
                    'Registration pending. Your account is awaiting authorization from the Head Administrator.',
                };
              }
              if (status === 'rejected') {
                return {
                  success: false,
                  error: 'Account access has been rejected by the administrator.',
                };
              }

              const authUser: AdminUser = {
                username: matched.username,
                email: `${matched.username.toLowerCase()}@samarthya.sjec.ac.in`,
                role: matched.role || 'lead_admin',
              };

              persistSession(authUser);
              return { success: true };
            }
          }

          // Check admin_auth in Supabase club_content
          const { data: dbAuth } = await supabase
            .from('club_content')
            .select('value')
            .eq('key', 'admin_auth')
            .maybeSingle();

          if (dbAuth?.value) {
            const authVal = dbAuth.value as { username?: string; password?: string };
            if (
              authVal.username?.toLowerCase() === username.toLowerCase() &&
              authVal.password === password
            ) {
              const authUser: AdminUser = {
                username: authVal.username || 'admin',
                email: 'admin@samarthya.sjec.ac.in',
                role: 'head_admin',
              };
              persistSession(authUser);
              return { success: true };
            }
          }
        } catch (err) {
          console.warn('Supabase auth query notice:', err);
        }
      }

      // 2. Built-in master admin fallback credentials
      const isMasterAdmin =
        (username.toLowerCase() === 'admin' ||
          username.toLowerCase() === 'admin@sjec.ac.in' ||
          username.toLowerCase() === 'admin@samarthya.sjec.ac.in') &&
        (password === 'samarthya2026' ||
          password === 'admin@123' ||
          password === 'samarthya@2026');

      if (isMasterAdmin) {
        const authUser: AdminUser = {
          username: 'admin',
          email: 'admin@samarthya.sjec.ac.in',
          role: 'head_admin',
        };
        persistSession(authUser);
        return { success: true };
      }

      // 3. Check local registered admin storage (offline fallback)
      let registeredUsers: RegisteredAdmin[] = [];
      try {
        const saved = localStorage.getItem('samarthya_admin_users_list');
        if (saved) registeredUsers = JSON.parse(saved);
      } catch {
        registeredUsers = [];
      }

      const localMatch = registeredUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (localMatch) {
        if (localMatch.status === 'pending') {
          return {
            success: false,
            error:
              'Registration pending. Your account is awaiting authorization from the Head Administrator.',
          };
        }
        if (localMatch.status === 'rejected') {
          return {
            success: false,
            error: 'Account access has been rejected by the administrator.',
          };
        }

        const authUser: AdminUser = {
          username: localMatch.username,
          email: `${localMatch.username.toLowerCase()}@samarthya.sjec.ac.in`,
          role: localMatch.role || 'lead_admin',
        };
        persistSession(authUser);
        return { success: true };
      }

      // 4. Failed attempt counting
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setLockoutTimer(LOCKOUT_DURATION_SECONDS);
        return {
          success: false,
          error: `Too many failed attempts. Security terminal locked for ${LOCKOUT_DURATION_SECONDS} seconds.`,
        };
      }

      return {
        success: false,
        error: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempt(s) remaining before security lockout.`,
      };
    },
    [failedAttempts, lockoutTimer, persistSession]
  );

  // Register Admin Handler
  const registerAdmin = useCallback(
    async (rawUsername: string, rawPassword: string): Promise<AuthResult> => {
      if (hasSQLInjectionThreat(rawUsername) || hasSQLInjectionThreat(rawPassword)) {
        return {
          success: false,
          error: 'Security Alert: Malicious characters detected in registration input.',
        };
      }

      const username = cleanSecureInput(rawUsername).trim();
      const password = stripControlCharacters(rawPassword).trim();

      if (username.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters long.' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      if (username.toLowerCase() === 'admin') {
        return { success: false, error: 'Username "admin" is reserved.' };
      }

      // Fetch current admin_users_list from Supabase or localStorage
      let list: RegisteredAdmin[] = [];
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('club_content')
            .select('value')
            .eq('key', 'admin_users_list')
            .maybeSingle();
          if (Array.isArray(data?.value)) {
            list = data.value;
          }
        } catch (e) {
          console.warn('Could not read existing users from cloud:', e);
        }
      }

      if (list.length === 0) {
        try {
          const saved = localStorage.getItem('samarthya_admin_users_list');
          if (saved) list = JSON.parse(saved);
        } catch {
          // ignore
        }
      }

      if (list.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: `Username "${username}" already exists.` };
      }

      const newAdmin: RegisteredAdmin = {
        username,
        password,
        status: 'pending',
        role: 'lead_admin',
        registeredAt: new Date().toISOString(),
      };

      const updated = [...list, newAdmin];

      // Save locally
      try {
        localStorage.setItem('samarthya_admin_users_list', JSON.stringify(updated));
      } catch {
        // ignore
      }

      // Save to Supabase Cloud Database
      if (isSupabaseConfigured) {
        try {
          await supabase.from('club_content').upsert(
            {
              key: 'admin_users_list',
              value: updated,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          );
        } catch (e) {
          console.warn('Could not sync user to cloud database:', e);
        }
      }

      return {
        success: true,
        message:
          'Admin registration submitted directly to Supabase! Please wait for Head Admin approval in the Approvals tab before signing in.',
      };
    },
    []
  );

  // Logout handler
  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('samarthya_admin_session');
        localStorage.removeItem('samarthya_admin_session');
      }
    } catch {
      // ignore
    }
  }, []);

  return {
    currentUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    lockoutTimer,
    login,
    registerAdmin,
    refreshAuth,
    logout,
  };
}
