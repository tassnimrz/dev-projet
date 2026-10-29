import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  Package, 
  Users, 
  TrendingUp, 
  Check, 
  X, 
  Eye, 
  RotateCcw,
  Download,
  AlertTriangle,
  Heart,
  BarChart3,
  Database,
  UserCheck,
  UserPlus,
  RefreshCw,
  Clock,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGifts } from '../context/GiftsContext';
import { api } from '../services/api';
import { Gift, BudgetBracket, InterestType, UserProfile } from '../types';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, openAuthModal, loginAsAdmin } = useAuth();
  const { gifts, addGift, updateGift, deleteGift, resetCatalog } = useGifts();

  const [activeTab, setActiveTab] = useState<'catalog' | 'users' | 'analytics' | 'database'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Dynamic Users State from MySQL
  const [dbUsers, setDbUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Dynamic Live Stats from MySQL
  const [liveStats, setLiveStats] = useState<any>(null);

  // Modal State for Add / Edit Gift
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  // Modal State for Add User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('client123');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');

  // Form State for Gifts
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState('Beauty & Home');
  const [formPriceTND, setFormPriceTND] = useState<number>(45);
  const [formOriginalPriceTND, setFormOriginalPriceTND] = useState<number>(55);
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formWhyMatches, setFormWhyMatches] = useState('');
  const [formWrappingIdea, setFormWrappingIdea] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formSellerName, setFormSellerName] = useState('Atelier Artisanal');
  const [formBudgetBracket, setFormBudgetBracket] = useState<BudgetBracket>('20-50');
  const [formInterests, setFormInterests] = useState<InterestType[]>(['beauty', 'handmade']);
  const [formIsVerified, setFormIsVerified] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch users & stats from MySQL
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersList = await api.getUsers();
      setDbUsers(usersList);
    } catch (e) {
      console.warn('Failed to fetch MySQL users:', e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await api.getAdminStats();
      setLiveStats(stats);
    } catch (e) {
      console.warn('Failed to fetch live admin stats:', e);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStats();
    }
  }, [isAdmin, gifts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      handleOpenAddModal();
    }
  }, [location.search]);

  // If not admin, show login prompt
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 min-h-screen hero-gradient flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-4xl p-8 shadow-card border border-giftly-border text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-giftly-dark">
              Espace Administrateur GIFTLY
            </h1>
            <p className="text-xs text-giftly-muted mt-2 leading-relaxed">
              Cet espace est strictement réservé à la direction pour gérer le catalogue de cadeaux, les prix en TND, et les utilisateurs en base de données MySQL.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={loginAsAdmin}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-giftly-purple to-pink-600 text-white font-bold text-xs shadow-soft hover:shadow-hover transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-giftly-peach" />
              <span>Connexion Admin en 1 Clic</span>
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 rounded-full border border-giftly-border text-giftly-dark font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Se connecter avec un email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Open modal for new gift
  const handleOpenAddModal = () => {
    setEditingGift(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('Beauty & Home');
    setFormPriceTND(45);
    setFormOriginalPriceTND(55);
    setFormImage('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80');
    setFormDescription('Coffret cadeau soigneusement composé par un artisan tunisien.');
    setFormWhyMatches('Parfait pour quelqu’un qui apprécie l’élégance subtile et les moments de bien-être.');
    setFormWrappingIdea('Papier kraft blush noué d’un ruban satin violet et cachet de cire.');
    setFormTags('Artisanal, Fait Main, Cadeau Raffiné');
    setFormSellerName('Artisanat Local');
    setFormBudgetBracket('20-50');
    setFormInterests(['beauty', 'handmade']);
    setFormIsVerified(true);
    setFormIsFeatured(false);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (gift: Gift) => {
    setEditingGift(gift);
    setFormTitle(gift.title);
    setFormSubtitle(gift.subtitle || '');
    setFormCategory(gift.category);
    setFormPriceTND(gift.priceTND);
    setFormOriginalPriceTND(gift.originalPriceTND || gift.priceTND + 15);
    setFormImage(gift.image);
    setFormDescription(gift.description);
    setFormWhyMatches(gift.whyMatches);
    setFormWrappingIdea(gift.wrappingIdea);
    setFormTags(gift.tags.join(', '));
    setFormSellerName(gift.sellerName || 'Artisan');
    setFormBudgetBracket(gift.budgetBracket);
    setFormInterests(gift.interests || ['handmade']);
    setFormIsVerified(Boolean(gift.isVerifiedSeller));
    setFormIsFeatured(Boolean(gift.isFeatured));
    setIsModalOpen(true);
  };

  // Save Gift (Create or Update)
  const handleSaveGift = async (e?: React.FormEvent, keepOpenToAddAnother: boolean = false) => {
    if (e) e.preventDefault();
    if (!formTitle.trim() || !formImage.trim()) {
      alert('Veuillez renseigner au moins le titre et l’image du cadeau.');
      return;
    }

    const tagsArray = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingGift) {
      await updateGift(editingGift.id, {
        title: formTitle,
        subtitle: formSubtitle,
        category: formCategory,
        priceTND: Number(formPriceTND),
        originalPriceTND: Number(formOriginalPriceTND),
        image: formImage,
        description: formDescription,
        whyMatches: formWhyMatches,
        wrappingIdea: formWrappingIdea,
        tags: tagsArray,
        sellerName: formSellerName,
        budgetBracket: formBudgetBracket,
        interests: formInterests,
        isVerifiedSeller: formIsVerified,
        isFeatured: formIsFeatured,
      });
      showToast(`Cadeau "${formTitle}" mis à jour dans MySQL !`);
      setIsModalOpen(false);
    } else {
      await addGift({
        title: formTitle,
        subtitle: formSubtitle,
        category: formCategory,
        priceTND: Number(formPriceTND),
        originalPriceTND: Number(formOriginalPriceTND),
        image: formImage,
        description: formDescription,
        whyMatches: formWhyMatches,
        wrappingIdea: formWrappingIdea,
        tags: tagsArray,
        sellerName: formSellerName,
        budgetBracket: formBudgetBracket,
        interests: formInterests,
        isVerifiedSeller: formIsVerified,
        isFeatured: formIsFeatured,
        rating: 5.0,
        reviewsCount: 1,
        sampleCardMessage: 'Un cadeau choisi spécialement pour illuminer votre journée.',
        compatibleRecipients: ['friend', 'best-friend', 'partner', 'parent'],
        compatibleOccasions: ['birthday', 'thank-you', 'spontaneous'],
      });

      if (keepOpenToAddAnother) {
        showToast(`Cadeau "${formTitle}" inséré dans MySQL ! Formulaire prêt pour un autre cadeau.`);
        // Reset fields to easily input another gift
        setFormTitle('');
        setFormSubtitle('');
        setFormPriceTND(50);
        setFormOriginalPriceTND(65);
        setFormImage('');
        setFormDescription('');
        setFormWhyMatches('');
        setFormWrappingIdea('');
        setFormTags('');
      } else {
        showToast(`Nouveau cadeau "${formTitle}" inséré dans MySQL !`);
        setIsModalOpen(false);
      }
    }

    fetchStats();
  };

  // Add User to MySQL
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserName.trim()) {
      alert('Veuillez renseigner le nom et l’email.');
      return;
    }

    const res = await api.createUser({
      fullName: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
    });

    if (res.success) {
      showToast(`Utilisateur "${newUserName}" créé dans MySQL !`);
      setIsUserModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      await fetchUsers();
      await fetchStats();
    } else {
      alert(res.error || 'Erreur lors de la création de l’utilisateur');
    }
  };

  // Change User Role in MySQL
  const handleToggleUserRole = async (targetUser: UserProfile) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const res = await api.updateUserRole(targetUser.id, newRole);
    if (res.success) {
      showToast(`Rôle de ${targetUser.fullName} mis à jour : ${newRole}`);
      await fetchUsers();
      await fetchStats();
    }
  };

  // Delete User from MySQL
  const handleDeleteUser = async (targetUser: UserProfile) => {
    if (targetUser.id === 'admin-giftly-master' || targetUser.email === 'admin@giftly.tn') {
      alert('Impossible de supprimer le super-administrateur principal.');
      return;
    }
    if (window.confirm(`Confirmer la suppression de l’utilisateur "${targetUser.fullName}" ?`)) {
      const res = await api.deleteUser(targetUser.id);
      if (res.success) {
        showToast(`Utilisateur supprimé de MySQL.`);
        await fetchUsers();
        await fetchStats();
      }
    }
  };

  // Filtered gifts in admin table
  const filteredGifts = gifts.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered users in admin table
  const filteredUsers = dbUsers.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.role || 'user').toLowerCase().includes(q)
    );
  });

  const categories = Array.from(new Set(gifts.map((g) => g.category)));
  const totalValueTND = gifts.reduce((acc, g) => acc + g.priceTND, 0);

  // Dynamic distribution stats
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    gifts.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / (gifts.length || 1)) * 100),
    }));
  }, [gifts]);

  const budgetStats = useMemo(() => {
    const counts: Record<string, number> = {
      '< 20 TND': 0,
      '20 – 50 TND': 0,
      '50 – 100 TND': 0,
      '100 – 200 TND': 0,
      '> 200 TND': 0,
    };
    gifts.forEach((g) => {
      if (g.priceTND < 20) counts['< 20 TND']++;
      else if (g.priceTND <= 50) counts['20 – 50 TND']++;
      else if (g.priceTND <= 100) counts['50 – 100 TND']++;
      else if (g.priceTND <= 200) counts['100 – 200 TND']++;
      else counts['> 200 TND']++;
    });
    return Object.entries(counts).map(([label, count]) => ({
      label,
      count,
      pct: Math.round((count / (gifts.length || 1)) * 100),
    }));
  }, [gifts]);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-giftly-dark text-white text-xs font-bold shadow-modal border border-giftly-purple flex items-center gap-2 animate-bounce-short">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
              <span>Tableau de Bord Administrateur • 100% MySQL Dynamique</span>
            </div>
            <h1 className="font-display font-black text-3xl text-giftly-dark tracking-tight">
              Gestion de GIFTLY
            </h1>
            <p className="text-xs text-giftly-muted mt-1">
              Connecté en tant que <strong>{user?.fullName}</strong> ({user?.email}) • Base MySQL : <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">giftly_db</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-giftly-border text-giftly-dark font-bold text-xs hover:border-giftly-purple transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-giftly-purple" />
              <span>Voir le Store Public</span>
            </Link>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-giftly-purple to-pink-600 text-white font-bold text-xs shadow-soft hover:shadow-hover transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Cadeau</span>
            </button>
          </div>
        </div>

        {/* KPI Statistics Cards (100% Live MySQL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-giftly-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-giftly-muted">
                Articles en Base MySQL
              </p>
              <h3 className="font-display font-extrabold text-2xl text-giftly-dark mt-1">
                {gifts.length} <span className="text-xs font-semibold text-giftly-purple">cadeaux</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-giftly-lavender-light flex items-center justify-center text-giftly-purple">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-giftly-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-giftly-muted">
                Valeur Totale (TND)
              </p>
              <h3 className="font-display font-extrabold text-2xl text-giftly-dark mt-1">
                {liveStats ? liveStats.totalGMVTND : totalValueTND} <span className="text-xs font-semibold text-emerald-600">TND</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-giftly-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-giftly-muted">
                Utilisateurs MySQL
              </p>
              <h3 className="font-display font-extrabold text-2xl text-giftly-dark mt-1">
                {dbUsers.length} <span className="text-xs font-semibold text-pink-600">comptes</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-giftly-pink-light flex items-center justify-center text-pink-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-giftly-border shadow-card flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-giftly-muted">
                Favoris Sauvegardés
              </p>
              <h3 className="font-display font-extrabold text-2xl text-giftly-dark mt-1">
                {liveStats ? liveStats.totalFavorites : 2} <span className="text-xs font-semibold text-pink-500">sauvegardes</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
              <Heart className="w-6 h-6 fill-pink-400" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-giftly-border/80 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'border-giftly-purple text-giftly-purple'
                : 'border-transparent text-giftly-muted hover:text-giftly-dark'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalogue Cadeaux ({gifts.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              fetchUsers();
            }}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-giftly-purple text-giftly-purple'
                : 'border-transparent text-giftly-muted hover:text-giftly-dark'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Comptes MySQL ({dbUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-giftly-purple text-giftly-purple'
                : 'border-transparent text-giftly-muted hover:text-giftly-dark'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytique Dynamique</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'database'
                ? 'border-giftly-purple text-giftly-purple'
                : 'border-transparent text-giftly-muted hover:text-giftly-dark'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Serveur MySQL & Sauvegardes</span>
          </button>
        </div>

        {/* TAB 1: CATALOG MANAGEMENT */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Filter toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-giftly-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, catégorie ou tag..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-giftly-border focus:outline-none focus:border-giftly-purple"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-56 px-3 py-2 rounded-xl text-xs bg-slate-50 border border-giftly-border focus:outline-none focus:border-giftly-purple font-medium"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-giftly-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-giftly-border text-giftly-muted font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Cadeau</th>
                      <th className="py-3.5 px-4">Catégorie</th>
                      <th className="py-3.5 px-4">Prix (TND)</th>
                      <th className="py-3.5 px-4">Artisan / Vendeur</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-giftly-border/70 text-giftly-dark font-medium">
                    {filteredGifts.map((gift) => (
                      <tr key={gift.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={gift.image}
                            alt={gift.title}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-giftly-border"
                          />
                          <div className="max-w-xs">
                            <Link
                              to={`/gift/${gift.id}`}
                              className="font-bold text-giftly-dark hover:text-giftly-purple transition-colors line-clamp-1"
                            >
                              {gift.title}
                            </Link>
                            <p className="text-[11px] text-giftly-muted line-clamp-1">{gift.subtitle}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-giftly-dark">
                            {gift.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-sm text-giftly-purple">
                          {gift.priceTND} TND
                        </td>
                        <td className="py-3 px-4 text-giftly-muted">
                          {gift.sellerName || 'Artisan Indépendant'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            En Ligne (MySQL)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(gift)}
                              className="p-2 rounded-lg hover:bg-giftly-lavender-light text-giftly-purple transition-colors"
                              title="Modifier ce cadeau"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Confirmer la suppression de "${gift.title}" ?`)) {
                                  await deleteGift(gift.id);
                                  showToast(`Cadeau supprimé de MySQL.`);
                                  fetchStats();
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              title="Supprimer ce cadeau"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT (100% DYNAMIC MYSQL) */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-giftly-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Rechercher un utilisateur par nom, email ou rôle..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-giftly-border focus:outline-none focus:border-giftly-purple"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={fetchUsers}
                  disabled={isLoadingUsers}
                  className="p-2 rounded-xl border border-giftly-border hover:bg-slate-50 text-giftly-dark transition-colors"
                  title="Actualiser la liste MySQL"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-giftly-purple text-white font-bold text-xs hover:bg-giftly-purple-hover transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nouveau Membre</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-giftly-border shadow-card overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-giftly-border text-giftly-muted font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Utilisateur</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Rôle</th>
                    <th className="py-3.5 px-4">Date Inscription</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-giftly-border/70 text-giftly-dark font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-giftly-purple to-pink-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-giftly-dark">{u.fullName}</p>
                          <p className="text-[10px] text-giftly-muted">ID: {u.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-giftly-muted">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-slate-100 text-giftly-dark'
                          }`}
                        >
                          {u.role === 'admin' ? 'Super-Admin' : 'Client'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-giftly-muted text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Récent'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            className="px-2.5 py-1 rounded-lg border border-giftly-border hover:bg-giftly-lavender-light text-[11px] font-bold text-giftly-purple transition-colors"
                            title="Basculer le rôle Admin / Client"
                          >
                            {u.role === 'admin' ? 'Passer Client' : 'Promouvoir Admin'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Supprimer cet utilisateur"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories Distribution */}
              <div className="bg-white p-6 rounded-3xl border border-giftly-border shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-giftly-dark">
                    Distribution par Catégorie
                  </h3>
                  <span className="text-xs text-giftly-muted font-bold">{categories.length} catégories</span>
                </div>
                <div className="space-y-3 pt-2">
                  {categoryStats.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-giftly-dark">
                        <span>{cat.name}</span>
                        <span className="text-giftly-purple">{cat.count} cadeaux ({cat.pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-giftly-purple to-pink-500 rounded-full"
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Brackets Distribution */}
              <div className="bg-white p-6 rounded-3xl border border-giftly-border shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-giftly-dark">
                    Répartition des Prix (TND)
                  </h3>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Moyenne : {Math.round(totalValueTND / (gifts.length || 1))} TND
                  </span>
                </div>
                <div className="space-y-3 pt-2">
                  {budgetStats.map((b) => (
                    <div key={b.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-giftly-dark">
                        <span>{b.label}</span>
                        <span className="text-pink-600">{b.count} articles ({b.pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Dynamic Activity Feed from MySQL */}
            <div className="bg-white p-6 rounded-3xl border border-giftly-border shadow-card space-y-4">
              <h3 className="font-display font-bold text-base text-giftly-dark flex items-center gap-2">
                <Clock className="w-4 h-4 text-giftly-purple" />
                <span>Dernières Activités Enregistrées dans MySQL</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-giftly-border space-y-2">
                  <p className="font-bold text-giftly-dark uppercase tracking-wider text-[10px]">
                    Derniers Utilisateurs Inscrits
                  </p>
                  {dbUsers.slice(0, 4).map((u) => (
                    <div key={u.id} className="flex justify-between py-1 border-b border-giftly-border/50 last:border-0">
                      <span className="font-semibold text-giftly-dark">{u.fullName}</span>
                      <span className="text-giftly-muted font-mono">{u.email}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-giftly-border space-y-2">
                  <p className="font-bold text-giftly-dark uppercase tracking-wider text-[10px]">
                    Derniers Cadeaux Modifiés ou Ajoutés
                  </p>
                  {gifts.slice(0, 4).map((g) => (
                    <div key={g.id} className="flex justify-between py-1 border-b border-giftly-border/50 last:border-0">
                      <span className="font-semibold text-giftly-dark truncate max-w-[200px]">{g.title}</span>
                      <span className="text-giftly-purple font-bold">{g.priceTND} TND</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE & BACKUP */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-3xl border border-giftly-border shadow-card p-6 space-y-6 max-w-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Serveur MySQL Actif sur localhost:3306</span>
              </div>
              <p className="text-xs text-giftly-muted">
                Toutes les modifications du catalogue et des utilisateurs sont instantanément écrites dans la base <strong>giftly_db</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gifts, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `giftly-catalog-backup-${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  showToast('Catalogue exporté en JSON !');
                }}
                className="w-full py-3 px-4 rounded-2xl border border-giftly-border hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 text-giftly-dark"
              >
                <Download className="w-4 h-4 text-giftly-purple" />
                <span>Exporter le Catalogue Actuel en JSON</span>
              </button>

              <button
                onClick={async () => {
                  if (window.confirm('Voulez-vous vraiment réinitialiser le catalogue MySQL avec les 22 cadeaux d’origine ?')) {
                    await resetCatalog();
                    showToast('Catalogue MySQL réinitialisé avec succès !');
                    fetchStats();
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 font-bold text-xs flex items-center justify-center gap-2 text-red-700"
              >
                <RotateCcw className="w-4 h-4 text-red-600" />
                <span>Réinitialiser aux 22 cadeaux d'origine</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL: CREATE NEW USER IN MYSQL */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal border border-giftly-border overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-giftly-lavender-light to-giftly-pink-light border-b border-giftly-border flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-giftly-dark">
                    Créer un Nouvel Utilisateur
                  </h3>
                  <p className="text-xs text-giftly-muted">
                    L'utilisateur sera inséré dans la table MySQL `users`.
                  </p>
                </div>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-giftly-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-giftly-dark mb-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="ex: Ines Karoui"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-giftly-dark mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="ines@giftly.tn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-giftly-dark mb-1">Mot de Passe</label>
                  <input
                    type="password"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-giftly-dark mb-1">Rôle</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none font-bold"
                  >
                    <option value="user">Membre Client</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-giftly-border font-bold hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-giftly-purple text-white font-bold hover:bg-giftly-purple-hover"
                  >
                    Créer dans MySQL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT GIFT */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-white rounded-4xl shadow-modal border border-giftly-border overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-giftly-pink via-giftly-lavender to-giftly-peach border-b border-giftly-border flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-giftly-dark">
                    {editingGift ? 'Modifier le Cadeau' : 'Ajouter un Nouveau Cadeau'}
                  </h3>
                  <p className="text-xs text-giftly-muted">
                    Configurez les informations détaillées, prix en TND et idées d'emballage.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-giftly-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveGift} className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-bold text-giftly-dark mb-1">Nom du Cadeau</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="ex: Coffret Bougie Jasmin & Neroli Artisanal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block font-bold text-giftly-dark mb-1">Sous-titre / Accroche</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="ex: Cire de soja naturelle coulée à la main"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                  />
                </div>

                {/* Category & Prices */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-giftly-dark mb-1">Catégorie</label>
                    <input
                      type="text"
                      required
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="ex: Beauty & Home"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-giftly-dark mb-1">Prix Estimé (TND)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPriceTND}
                      onChange={(e) => setFormPriceTND(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none font-bold text-giftly-purple"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-giftly-dark mb-1">Prix Original (TND)</label>
                    <input
                      type="number"
                      min={1}
                      value={formOriginalPriceTND}
                      onChange={(e) => setFormOriginalPriceTND(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none text-giftly-muted"
                    />
                  </div>
                </div>

                {/* Image URL + File Upload + Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-giftly-dark">
                      Photo du Cadeau (URL ou Fichier local)
                    </label>
                    <span className="text-[11px] text-giftly-purple font-semibold bg-giftly-purple/10 px-2 py-0.5 rounded-full">
                      Liée à MySQL
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... ou choisissez un fichier"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                    />
                    <label className="px-3.5 py-2.5 rounded-xl bg-giftly-lavender-light border border-giftly-border text-giftly-purple font-bold text-xs cursor-pointer hover:bg-giftly-lavender transition-colors flex items-center gap-1.5 shrink-0 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Parcourir</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setFormImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {formImage && (
                    <div className="mt-2.5 flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-giftly-border">
                      <div className="w-20 h-16 rounded-xl overflow-hidden border border-giftly-border bg-slate-200 shrink-0 shadow-sm">
                        <img src={formImage} alt="Aperçu du cadeau" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[11px] space-y-0.5 overflow-hidden">
                        <p className="font-bold text-giftly-dark flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Photo prête pour la base de données MySQL</span>
                        </p>
                        <p className="text-giftly-muted truncate max-w-sm">
                          Cette image sera enregistrée avec le cadeau dans la table `gifts`.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-giftly-dark mb-1">Histoire & Description détaillée</label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Décrivez l'origine, les matériaux et le savoir-faire..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Why matches & Wrapping Idea */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-giftly-dark mb-1">Pourquoi ce cadeau correspond</label>
                    <textarea
                      rows={2}
                      value={formWhyMatches}
                      onChange={(e) => setFormWhyMatches(e.target.value)}
                      placeholder="Pour les amoureux de lecture et d'objets intemporels..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-giftly-dark mb-1">Idée d'emballage cadeau</label>
                    <textarea
                      rows={2}
                      value={formWrappingIdea}
                      onChange={(e) => setFormWrappingIdea(e.target.value)}
                      placeholder="Papier de soie lilas avec branche d'olivier séchée..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Tags & Seller */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-giftly-dark mb-1">Tags (séparés par des virgules)</label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="Aromathérapie, Artisanal, Bio"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-giftly-dark mb-1">Vendeur / Artisan</label>
                    <input
                      type="text"
                      value={formSellerName}
                      onChange={(e) => setFormSellerName(e.target.value)}
                      placeholder="Maison Jasmin Craft"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-giftly-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    {!editingGift && (
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Enregistrement direct dans MySQL</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-full border border-giftly-border text-giftly-dark font-bold hover:bg-slate-50 transition-colors text-xs"
                    >
                      Fermer
                    </button>
                    {!editingGift && (
                      <button
                        type="button"
                        onClick={(e) => handleSaveGift(e, true)}
                        className="px-4 py-2.5 rounded-full bg-giftly-lavender-light border border-giftly-purple/30 text-giftly-purple font-bold hover:bg-giftly-lavender transition-all text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Enregistrer & ajouter un autre</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-giftly-purple to-pink-600 text-white font-bold shadow-soft hover:shadow-hover transition-all text-xs"
                    >
                      {editingGift ? 'Mettre à jour le cadeau' : 'Enregistrer ce cadeau'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
