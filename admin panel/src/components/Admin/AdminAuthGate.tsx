import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { soundEffects } from '../../utils/soundEffects';
import { SamarthyaLogoShowcase } from './SamarthyaLogoShowcase';

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
        setErrorMsg('Passwords do not match. Please verify confirmation password.');
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
            'Registration submitted! Awaiting Head Admin approval before signing in.'
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
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#03060d] text-[#e8f0f8] font-sans overflow-x-hidden flex flex-col justify-between selection:bg-cyan selection:text-[#03060d]">
      {/* Subtle Atmospheric Ambient Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[20%] -left-[10%] h-[650px] w-[650px] rounded-full bg-[#00FBF8]/8 blur-[190px]" />
        <div className="absolute top-[25%] -right-[5%] h-[800px] w-[800px] rounded-full bg-[#00FBF8]/12 blur-[230px]" />
      </div>

      {/* ══════════════════════════════════════════════════
          TOP BRAND HEADER
          ══════════════════════════════════════════════════ */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 lg:px-16 py-5 border-b border-white/[0.06] bg-[#03060d]/80 backdrop-blur-md">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/30 bg-[#07111c] p-1.5 shadow-[0_0_20px_rgba(0,229,224,0.2)]">
            <img
              src="/logo.svg"
              alt="SAMARTHYA"
              className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,229,224,0.5)]"
            />
          </div>

          <span className="font-display font-black text-xl tracking-wider text-white leading-none">
            SAMARTHYA
          </span>
        </div>

        {/* Right side minimal clean link */}
        <div className="flex items-center gap-3 text-xs text-[#7d8ea3] font-mono">
          <button
            type="button"
            onClick={onCancel}
            className="text-[#7d8ea3] hover:text-cyan transition-colors"
          >
            &larr; Public Website
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          MAIN SPLIT VIEW (Left: Card | Right: 3D Website Model)
          ══════════════════════════════════════════════════ */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 items-center px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          
          {/* ──────────────────────────────────────────────
              LEFT COLUMN: Sign In / Command Authentication Card (Shifted left & enlarged)
              ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full lg:col-span-6 xl:col-span-5 flex justify-start items-center"
          >
            <div className="relative w-full max-w-[500px] xl:max-w-[530px] rounded-2xl border border-white/[0.08] bg-[#070d18]/95 p-8 sm:p-10 lg:p-11 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(0,229,224,0.08)]">
              
              {/* Corner HUD Markers in Neon Cyan (Enlarged) */}
              <div className="absolute top-4 left-4 h-5 w-5 border-t-2 border-l-2 border-cyan shadow-[0_0_12px_rgba(0,229,224,0.5)]" />
              <div className="absolute top-4 right-4 h-5 w-5 border-t-2 border-r-2 border-cyan shadow-[0_0_12px_rgba(0,229,224,0.5)]" />

              {isGranted ? (
                /* Access Granted Success State */
                <div className="py-14 text-center space-y-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-cyan bg-cyan/20 text-cyan shadow-[0_0_45px_rgba(0,229,224,0.55)]"
                  >
                    <ShieldCheck size={52} />
                  </motion.div>
                  <h2 className="font-display text-3xl sm:text-4xl font-black tracking-wider uppercase text-cyan">
                    ACCESS GRANTED
                  </h2>
                  <p className="font-mono text-xs sm:text-sm text-[#7d8ea3]">
                    Credentials verified. Initializing SAMARTHYA Controller...
                  </p>
                </div>
              ) : (
                /* Sign In Form */
                <form onSubmit={handleSubmit} className="space-y-7">
                  
                  {/* Eyebrow & Title */}
                  <div className="space-y-2.5">
                    <div className="font-mono text-xs font-bold tracking-[0.22em] uppercase flex items-center gap-1.5 text-cyan">
                      <span>&gt;_ COMMAND PORTAL AUTHENTICATION</span>
                    </div>

                    <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-none">
                      {mode === 'signin' ? 'Sign In' : 'Register Admin'}
                    </h1>

                    <p className="text-xs sm:text-sm text-[#8b9bb0] leading-relaxed pt-1">
                      {mode === 'signin'
                        ? 'Enter enterprise credentials to access the SOC command terminal'
                        : 'Submit your credentials for administrator authorization'}
                    </p>
                  </div>

                  {/* Success Banner */}
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 rounded-xl border border-cyan/40 bg-cyan/10 p-3.5 text-xs sm:text-sm text-cyan font-mono"
                    >
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}

                  {/* Error Notification Banner */}
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 rounded-xl border border-[#ff3b5c]/40 bg-[#ff3b5c]/10 p-3.5 text-xs sm:text-sm text-[#ff6b85] font-mono"
                    >
                      <AlertTriangle size={18} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  {/* Input Fields */}
                  <div className="space-y-5">
                    {/* Administrator Email / Username */}
                    <div className="space-y-2">
                      <label
                        htmlFor="admin_login_username"
                        className="block text-xs sm:text-sm font-semibold text-[#8b9bb0]"
                      >
                        {mode === 'register' ? 'Admin Username' : 'Administrator Email'}
                      </label>

                      <div className="relative flex items-center">
                        <div className="pointer-events-none absolute left-4 text-[#5e7087]">
                          <Mail size={18} />
                        </div>

                        <input
                          id="admin_login_username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={
                            mode === 'register' ? 'admin_name' : 'admin@vantix.com'
                          }
                          required
                          disabled={isAuthorizing || lockoutTimer > 0}
                          autoFocus
                          className="w-full rounded-xl border border-white/[0.08] bg-[#03060d] py-3.5 sm:py-4 pl-12 pr-4 text-xs sm:text-sm font-mono text-white placeholder-[#3f4d60] transition-all focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan focus:shadow-[0_0_18px_rgba(0,229,224,0.22)]"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="admin_login_password"
                        className="block text-xs sm:text-sm font-semibold text-[#8b9bb0]"
                      >
                        Password
                      </label>

                      <div className="relative flex items-center">
                        <div className="pointer-events-none absolute left-4 text-[#5e7087]">
                          <Lock size={18} />
                        </div>

                        <input
                          id="admin_login_password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          disabled={isAuthorizing || lockoutTimer > 0}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#03060d] py-3.5 sm:py-4 pl-12 pr-12 text-xs sm:text-sm font-mono text-white placeholder-[#3f4d60] transition-all focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan focus:shadow-[0_0_18px_rgba(0,229,224,0.22)]"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-[#5e7087] hover:text-cyan transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password (Register Mode Only) */}
                    {mode === 'register' && (
                      <div className="space-y-2">
                        <label
                          htmlFor="admin_confirm_password"
                          className="block text-xs sm:text-sm font-semibold text-[#8b9bb0]"
                        >
                          Confirm Password
                        </label>
                        <div className="relative flex items-center">
                          <div className="pointer-events-none absolute left-4 text-[#5e7087]">
                            <Lock size={18} />
                          </div>
                          <input
                            id="admin_confirm_password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            required
                            disabled={isAuthorizing}
                            className="w-full rounded-xl border border-white/[0.08] bg-[#03060d] py-3.5 sm:py-4 pl-12 pr-4 text-xs sm:text-sm font-mono text-white placeholder-[#3f4d60] transition-all focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={
                        !username.trim() ||
                        !password.trim() ||
                        isAuthorizing ||
                        lockoutTimer > 0
                      }
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl py-4 sm:py-4.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#03060d] bg-cyan hover:bg-cyan-dim transition-all shadow-[0_0_35px_rgba(0,229,224,0.45)] transform active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isAuthorizing ? (
                        <span>AUTHENTICATING...</span>
                      ) : lockoutTimer > 0 ? (
                        <span>LOCKED ({lockoutTimer}s)</span>
                      ) : mode === 'signin' ? (
                        <>
                          <span>AUTHENTICATE COMMAND ACCESS</span>
                          <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          <span>SUBMIT REGISTRATION</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mode & Navigation Footer */}
                  <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playHover();
                        setMode(mode === 'signin' ? 'register' : 'signin');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-cyan hover:underline transition-colors"
                    >
                      {mode === 'signin'
                        ? '+ Register New Admin'
                        : '&larr; Back to Sign In'}
                    </button>

                    <button
                      type="button"
                      onClick={onCancel}
                      className="text-[#64748b] hover:text-white transition-colors"
                    >
                      &larr; Public Website
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* ──────────────────────────────────────────────
              RIGHT COLUMN: Standalone 3D SAMARTHYA Model from Website
              ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="w-full lg:col-span-6 xl:col-span-7 flex items-center justify-center relative min-h-[500px] lg:min-h-[660px]"
          >
            <SamarthyaLogoShowcase className="w-full h-[500px] lg:h-[660px]" />
          </motion.div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="relative z-20 border-t border-white/[0.06] bg-[#03060d]/80 px-6 sm:px-12 lg:px-16 py-3.5 text-[11px] font-mono text-[#5e7087] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">SAMARTHYA</span>
          <span>&bull;</span>
          <span>&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
        </div>
        <div className="flex items-center gap-4 text-[#7d8ea3]">
          <span>RESTRICTED ACCESS TERMINAL</span>
          <span>&bull;</span>
          <span className="text-cyan">ENC: SHA-256</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminAuthGate;
