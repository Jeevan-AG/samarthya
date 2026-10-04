import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  UserPlus,
  LogIn,
  CheckCircle2,
  KeyRound,
  Info,
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { soundEffects } from '../../utils/soundEffects';

interface AdminAuthGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
  auth?: ReturnType<typeof useAdminAuth>;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  onAuthenticated,
  onCancel,
  auth,
}) => {
  const fallbackAuth = useAdminAuth();
  const activeAuth = auth || fallbackAuth;
  const { login, registerAdmin, lockoutTimer } = activeAuth;
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        soundEffects.playError();
        setErrorMsg('Passwords do not match. Please verify your password confirmation.');
        return;
      }

      setIsAuthorizing(true);
      soundEffects.playClick();

      const res = await registerAdmin(username, password);
      setIsAuthorizing(false);

      if (res.success) {
        soundEffects.playSuccess();
        setSuccessMsg(
          res.message ||
            'Registration submitted! Please wait for Head Admin approval before signing in.'
        );
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Registration failed.');
      }
      return;
    }

    // Sign in mode
    setIsAuthorizing(true);
    soundEffects.playClick();

    const res = await login(username, password);
    setIsAuthorizing(false);

    if (res.success) {
      soundEffects.playSuccess();
      setIsGranted(true);
      setTimeout(() => {
        onAuthenticated();
      }, 750);
    } else {
      soundEffects.playError();
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060d]/95 backdrop-blur-xl p-4 sm:p-6 font-mono overflow-y-auto">
      {/* Decorative Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,224,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,224,0.06)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Radial Glow */}
      <div className="absolute h-96 w-96 rounded-full bg-cyan/10 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-cyan/40 bg-[#070d18] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,229,224,0.2)]"
      >
        {/* Top Scanline effect */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e5e0] to-transparent animate-pulse" />

        {isGranted ? (
          /* Access Granted Screen */
          <div className="py-10 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan bg-cyan/20 text-cyan shadow-[0_0_35px_#00e5e0]"
            >
              <ShieldCheck size={44} />
            </motion.div>
            <h2 className="font-display text-3xl font-bold tracking-wider text-cyan">
              ACCESS GRANTED
            </h2>
            <p className="text-xs text-[#7d8ea3]">
              Credentials verified. Initializing SAMARTHYA Controller...
            </p>
          </div>
        ) : (
          /* Authentication Terminal */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/30 bg-[#0b1526] text-cyan shadow-[0_0_25px_rgba(0,229,224,0.25)]">
                <Cpu size={28} className="animate-pulse" />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-cyan">
                <span>// HARDWARE_CONTROLLER :: GATEWAY</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-paper">
                Admin Authentication
              </h2>
              <p className="text-xs text-[#7d8ea3] max-w-xs mx-auto">
                Authorized access for SAMARTHYA leads, faculty, and technical coordinators.
              </p>
            </div>

            {/* Mode Switcher: Sign In vs Register Admin */}
            <div className="flex rounded-xl border border-line bg-[#03060d] p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playHover();
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                  mode === 'signin'
                    ? 'bg-cyan font-bold text-[#03060d] shadow-[0_0_20px_rgba(0,229,224,0.4)]'
                    : 'text-[#7d8ea3] hover:text-paper'
                }`}
              >
                <LogIn size={13} />
                <span>SIGN IN</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playHover();
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                  mode === 'register'
                    ? 'bg-cyan font-bold text-[#03060d] shadow-[0_0_20px_rgba(0,229,224,0.4)]'
                    : 'text-[#7d8ea3] hover:text-paper'
                }`}
              >
                <UserPlus size={13} />
                <span>REGISTER ADMIN</span>
              </button>
            </div>

            {/* Success Message Banner */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-cyan/50 bg-cyan/10 p-3 text-xs text-cyan"
              >
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Error Notification Banner */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-[#ff5f56]/50 bg-[#ff5f56]/10 p-3 text-xs text-[#ff5f56]"
              >
                <AlertTriangle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Quick Helper Credentials Note */}
            {mode === 'signin' && (
              <div className="flex items-start gap-2 rounded-lg border border-cyan/20 bg-cyan/5 p-2.5 text-[11px] text-[#7d8ea3]">
                <KeyRound size={14} className="shrink-0 text-cyan mt-0.5" />
                <div>
                  <span className="text-paper font-semibold">Default Setup:</span>{' '}
                  <span className="text-cyan font-bold">admin</span> /{' '}
                  <span className="text-cyan font-bold">samarthya2026</span>
                </div>
              </div>
            )}

            {/* Username / Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin_username" className="block text-xs uppercase text-paper/80">
                {mode === 'register' ? 'Admin Username (e.g. lead_kartik)' : 'Username or Email'}
              </label>
              <input
                id="admin_username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  mode === 'register' ? 'Choose username (min 3 chars)' : 'Enter admin username'
                }
                required
                disabled={isAuthorizing || lockoutTimer > 0}
                autoFocus
                className="w-full rounded-lg border border-line bg-[#03060d] px-4 py-2.5 text-xs text-paper placeholder-[#4e6178] transition-all focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,229,224,0.25)] disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin_password" className="block text-xs uppercase text-paper/80">
                {mode === 'register' ? 'Create Password' : 'Password'}
              </label>

              <div className="relative">
                <input
                  id="admin_password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter password'}
                  required
                  disabled={isAuthorizing || lockoutTimer > 0}
                  className="w-full rounded-lg border border-line bg-[#03060d] px-4 py-2.5 pr-11 text-xs text-paper placeholder-[#4e6178] transition-all focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,229,224,0.25)] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d8ea3] hover:text-cyan transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input (Register Mode Only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label
                  htmlFor="admin_confirm_password"
                  className="block text-xs uppercase text-paper/80"
                >
                  Confirm Password
                </label>
                <input
                  id="admin_confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={isAuthorizing}
                  className="w-full rounded-lg border border-line bg-[#03060d] px-4 py-2.5 text-xs text-paper placeholder-[#4e6178] transition-all focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,229,224,0.25)] disabled:opacity-50"
                />
                <div className="flex items-center gap-1.5 text-[10px] text-[#7d8ea3] pt-1">
                  <Info size={12} className="shrink-0 text-cyan" />
                  <span>
                    New accounts require verification by the Head Administrator before login is
                    activated.
                  </span>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={!username.trim() || !password.trim() || isAuthorizing || lockoutTimer > 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan py-3 text-xs font-bold uppercase text-[#03060d] hover:bg-cyan-dim transition-all hover:shadow-[0_0_25px_rgba(0,229,224,0.5)] disabled:opacity-40 disabled:hover:shadow-none"
              >
                {isAuthorizing ? (
                  <span>VERIFYING CREDENTIALS...</span>
                ) : lockoutTimer > 0 ? (
                  <span>LOCKED ({lockoutTimer}s)</span>
                ) : mode === 'signin' ? (
                  <>
                    <span>AUTHENTICATE &amp; ENTER</span>
                    <ArrowRight size={14} />
                  </>
                ) : (
                  <>
                    <span>SUBMIT REGISTRATION</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full text-center text-xs text-[#7d8ea3] hover:text-cyan transition-colors py-1"
              >
                &larr; Return to Public Website
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
