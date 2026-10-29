import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { GiftsProvider } from './context/GiftsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';
import { HomePage } from './pages/HomePage';
import { FinderPage } from './pages/FinderPage';
import { ResultsPage } from './pages/ResultsPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { GiftDetailPage } from './pages/GiftDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminPage } from './pages/AdminPage';

// Scroll to top on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-giftly-bg text-giftly-dark selection:bg-giftly-pink selection:text-giftly-dark">
      <ScrollToTop />
      <Navbar onOpenSupabaseDocs={() => setIsSupabaseModalOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/finder" element={<FinderPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/gift/:giftId" element={<GiftDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
      <AuthModal />
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <GiftsProvider>
        <FavoritesProvider>
          <Router>
            <AppContent />
          </Router>
        </FavoritesProvider>
      </GiftsProvider>
    </AuthProvider>
  );
};

export default App;
