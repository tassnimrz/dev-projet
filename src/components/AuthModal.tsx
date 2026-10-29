import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Lock, Mail, User, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    login,
    signup,
    loginAsDemoUser,
    isDemoMode,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync mode when opened
  React.useEffect(() => {
    setMode(authModalMode);
    setAuthError(null);
  }, [authModalMode, isAuthModalOpen]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  if (!isAuthModalOpen) return null;

  const handleClientDemoClick = async () => {
    setSubmitting(true);
    setAuthError(null);
    loginForm.setValue('email', 'sarah.mansour@giftly.tn');
    loginForm.setValue('password', 'client123');
    const result = await login('sarah.mansour@giftly.tn', 'client123');
    setSubmitting(false);
    if (!result.success) {
      setAuthError(result.error || 'Erreur de connexion client');
    }
  };

  const handleAdminDemoClick = async () => {
    setSubmitting(true);
    setAuthError(null);
    loginForm.setValue('email', 'admin@giftly.tn');
    loginForm.setValue('password', 'admin123');
    const result = await login('admin@giftly.tn', 'admin123');
    setSubmitting(false);
    if (!result.success) {
      setAuthError(result.error || 'Erreur de connexion admin');
    }
  };

  const handleLoginSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    setAuthError(null);
    const result = await login(data.email, data.password);
    setSubmitting(false);
    if (!result.success) {
      setAuthError(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleSignupSubmit = async (data: SignupFormData) => {
    setSubmitting(true);
    setAuthError(null);
    const result = await signup(data.email, data.password, data.fullName);
    setSubmitting(false);
    if (!result.success) {
      setAuthError(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal border border-giftly-border overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-giftly-pink via-giftly-lavender to-giftly-peach p-6 pb-5 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-giftly-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-giftly-purple"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-giftly-purple">
              {isDemoMode ? 'GIFTLY Member Access' : 'Supabase Authenticated'}
            </span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-giftly-dark">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-giftly-muted mt-1">
            {mode === 'login'
              ? 'Access saved favorites and tailored gift recommendations.'
              : 'Join GIFTLY to curate unforgettable gifts for everyone you cherish.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-giftly-border bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setAuthError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'login'
                ? 'text-giftly-purple border-b-2 border-giftly-purple bg-white'
                : 'text-giftly-muted hover:text-giftly-dark'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setAuthError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'signup'
                ? 'text-giftly-purple border-b-2 border-giftly-purple bg-white'
                : 'text-giftly-muted hover:text-giftly-dark'
            }`}
          >
            New Account
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Demo Shortcuts Pill */}
          <div className="space-y-2">
            <div className="p-3 bg-giftly-lavender-light border border-giftly-lavender rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-giftly-purple flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-giftly-dark">Compte Client Test</p>
                  <p className="text-[11px] text-giftly-muted">sarah.mansour@giftly.tn / client123</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClientDemoClick}
                disabled={submitting}
                className="px-3.5 py-1.5 rounded-full bg-giftly-purple text-white text-xs font-bold hover:bg-giftly-purple-hover transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? '...' : '1-Click Client'}
              </button>
            </div>

            <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">★</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-giftly-dark">Compte Administrateur</p>
                  <p className="text-[11px] text-giftly-muted">admin@giftly.tn / admin123</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdminDemoClick}
                disabled={submitting}
                className="px-3.5 py-1.5 rounded-full bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? '...' : '1-Click Admin'}
              </button>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-giftly-dark mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    placeholder="sarah.mansour@giftly.tn ou votre email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-giftly-dark mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
                  <input
                    {...loginForm.register('password')}
                    type="password"
                    placeholder="client123 (ou votre mot de passe)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all"
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-gradient-to-r from-giftly-purple to-giftly-lavender-dark text-white font-bold text-xs shadow-soft hover:shadow-hover transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-giftly-dark mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
                  <input
                    {...signupForm.register('fullName')}
                    type="text"
                    placeholder="Sarah Mansour"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all"
                  />
                </div>
                {signupForm.formState.errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {signupForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-giftly-dark mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
                  <input
                    {...signupForm.register('email')}
                    type="email"
                    placeholder="sarah@giftly.tn"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all"
                  />
                </div>
                {signupForm.formState.errors.email && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-giftly-dark mb-1">
                  Choose a Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
                  <input
                    {...signupForm.register('password')}
                    type="password"
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all"
                  />
                </div>
                {signupForm.formState.errors.password && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {signupForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-gradient-to-r from-giftly-purple to-giftly-lavender-dark text-white font-bold text-xs shadow-soft hover:shadow-hover transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-giftly-peach" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
