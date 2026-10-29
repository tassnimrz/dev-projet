import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Heart, Sparkles, User, Menu, X, Database, ShieldCheck, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

interface NavbarProps {
  onOpenSupabaseDocs?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSupabaseDocs }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, openAuthModal, logout, isDemoMode } = useAuth();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-soft border-b border-giftly-border/70 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-giftly-purple to-giftly-lavender-dark flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-300">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-tight text-giftly-dark flex items-center gap-1">
                GIFTLY
                <span className="w-2 h-2 rounded-full bg-giftly-purple animate-pulse"></span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-giftly-muted -mt-1 hidden sm:block">
                Art of Gifting
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/discover"
              className={`text-sm font-semibold transition-colors duration-200 hover:text-giftly-purple ${
                location.pathname === '/discover'
                  ? 'text-giftly-purple border-b-2 border-giftly-purple pb-1'
                  : 'text-giftly-dark/80'
              }`}
            >
              Discover
            </Link>
            <Link
              to="/finder"
              className={`text-sm font-semibold transition-colors duration-200 hover:text-giftly-purple ${
                location.pathname === '/finder'
                  ? 'text-giftly-purple border-b-2 border-giftly-purple pb-1'
                  : 'text-giftly-dark/80'
              }`}
            >
              Gift Finder
            </Link>
            <Link
              to="/#occasions"
              className="text-sm font-semibold text-giftly-dark/80 hover:text-giftly-purple transition-colors duration-200"
              onClick={() => {
                const el = document.getElementById('occasions');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Occasions
            </Link>
            <Link
              to="/#how-it-works"
              className="text-sm font-semibold text-giftly-dark/80 hover:text-giftly-purple transition-colors duration-200"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              How It Works
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3.5">
            {/* Admin Shortcuts if Admin */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin?action=add"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-giftly-purple to-pink-600 text-white shadow-soft hover:opacity-95 transition-all"
                  title="Ajouter un autre cadeau au catalogue"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Ajouter un Cadeau</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-pink-100 text-pink-800 hover:bg-pink-200 transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
                  <span>Admin</span>
                </Link>
              </div>
            )}

            {/* MySQL Status Pill */}
            <div
              title="Serveur MySQL actif sur localhost:3306 (giftly_db)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MySQL Connecté</span>
            </div>

            {/* Favorites Icon Button */}
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-full hover:bg-giftly-pink-light text-giftly-dark transition-all duration-200"
              aria-label="View Favorites"
            >
              <Heart className="w-5 h-5 text-giftly-dark/80 hover:text-pink-600 transition-colors" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-giftly-purple text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-scale-in">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-giftly-border hover:border-giftly-purple/40 bg-white transition-all">
                  <div className="w-7 h-7 rounded-full bg-giftly-lavender flex items-center justify-center text-giftly-purple font-bold text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-giftly-dark max-w-[90px] truncate hidden sm:inline">
                    {user.fullName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-hover border border-giftly-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-giftly-border/60">
                    <p className="text-xs font-bold text-giftly-dark truncate">{user.fullName}</p>
                    <p className="text-[11px] text-giftly-muted truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700">
                        Admin
                      </span>
                    )}
                  </div>
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin?action=add"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-giftly-purple hover:bg-giftly-lavender-light"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        + Ajouter un Cadeau
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-pink-600 hover:bg-pink-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </Link>
                    </>
                  )}
                  <Link
                    to="/favorites"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-giftly-dark hover:bg-giftly-pink-light"
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-500" />
                    Saved Favorites ({favoritesCount})
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-giftly-dark hover:text-giftly-purple px-3 py-2 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Find a Gift CTA Button */}
            <Link
              to="/finder"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-giftly-purple to-giftly-lavender-dark text-white text-xs sm:text-sm font-semibold shadow-soft hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-giftly-peach animate-spin-slow" />
              <span>Find a Gift</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-giftly-dark hover:bg-giftly-pink-light transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 rounded-3xl bg-white shadow-modal border border-giftly-border animate-fade-in space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/discover"
                className="text-base font-semibold text-giftly-dark hover:text-giftly-purple py-1"
              >
                Discover All Gifts
              </Link>
              <Link
                to="/finder"
                className="text-base font-semibold text-giftly-purple py-1 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Interactive Gift Finder
              </Link>
              <Link
                to="/favorites"
                className="text-base font-semibold text-giftly-dark hover:text-giftly-purple py-1 flex items-center justify-between"
              >
                <span>My Favorites</span>
                {favoritesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-giftly-purple text-white text-xs">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </nav>

            <div className="pt-3 border-t border-giftly-border flex flex-col gap-2">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      <p className="font-bold text-giftly-dark">{user.fullName}</p>
                      <p className="text-giftly-muted">{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="text-xs font-semibold text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      Log Out
                    </button>
                  </div>
                  {isAdmin && (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-giftly-border/60">
                      <Link
                        to="/admin?action=add"
                        className="flex items-center gap-2 text-xs font-bold text-giftly-purple py-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Ajouter un Cadeau</span>
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 text-xs font-bold text-pink-600 py-1"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Dashboard Administrateur</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full py-2.5 rounded-xl border border-giftly-purple text-giftly-purple font-semibold text-sm hover:bg-giftly-lavender-light"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
