import React, { useState, useMemo } from 'react';
import { UserAchievement, AchievementDefinition, AchievementTier, AchievementRank } from '../types';
import {
  LockClosedIcon,
  CheckCircleIcon,
  TrophyIcon,
  SparklesIcon,
  CrownIcon,
  BoltIcon,
  FireIcon,
  ShieldIcon,
  StarIcon,
  AcademicCapIcon,
  TrendingUpIcon,
  BookOpenIcon,
  FilmIcon,
  MiniLockIcon,
  SparkIcon
} from './Icons';

interface AchievementsViewProps {
  userAchievements: UserAchievement[];
  achievementDefinitions: AchievementDefinition[];
}

// Styling configurations per rank
const RANK_CONFIG: Record<AchievementRank, {
  label: string;
  badgeBg: string;
  borderClass: string;
  glowClass: string;
  textClass: string;
  icon: string;
}> = {
  MONARCH: {
    label: 'MONARCA',
    badgeBg: 'bg-gradient-to-r from-amber-500 via-purple-600 to-amber-400 text-black font-black tracking-widest',
    borderClass: 'border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    glowClass: 'from-purple-950/70 via-slate-900/90 to-amber-950/50',
    textClass: 'text-amber-300 font-extrabold',
    icon: '👑',
  },
  S: {
    label: 'RANK S',
    badgeBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold',
    borderClass: 'border-purple-500/70 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    glowClass: 'from-purple-950/60 via-slate-900/90 to-indigo-950/40',
    textClass: 'text-purple-300 font-bold',
    icon: '💎',
  },
  A: {
    label: 'RANK A',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold',
    borderClass: 'border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    glowClass: 'from-amber-950/40 via-slate-900/90 to-slate-950',
    textClass: 'text-amber-400 font-bold',
    icon: '⭐',
  },
  B: {
    label: 'RANK B',
    badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold',
    borderClass: 'border-sky-500/60 shadow-[0_0_15px_rgba(14,165,233,0.15)]',
    glowClass: 'from-sky-950/40 via-slate-900/90 to-slate-950',
    textClass: 'text-sky-300 font-bold',
    icon: '⚡',
  },
  C: {
    label: 'RANK C',
    badgeBg: 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold',
    borderClass: 'border-teal-500/50',
    glowClass: 'from-teal-950/30 via-slate-900/90 to-slate-950',
    textClass: 'text-teal-300 font-semibold',
    icon: '🛡️',
  },
  D: {
    label: 'RANK D',
    badgeBg: 'bg-slate-700 text-slate-200 font-medium',
    borderClass: 'border-slate-600/40',
    glowClass: 'from-slate-900 via-slate-900/90 to-slate-950',
    textClass: 'text-slate-300 font-medium',
    icon: '🗡️',
  },
  E: {
    label: 'RANK E',
    badgeBg: 'bg-slate-800 text-slate-400 font-medium',
    borderClass: 'border-slate-700/40',
    glowClass: 'from-slate-900/60 via-slate-900/90 to-slate-950',
    textClass: 'text-slate-400 font-medium',
    icon: '🎯',
  },
};

const AchievementsView: React.FC<AchievementsViewProps> = ({ userAchievements, achievementDefinitions }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked' | 'high_rank'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map tiers with their category and definition
  const allTiers = useMemo(() => {
    return achievementDefinitions.flatMap(category =>
      category.tiers.map(tier => ({
        ...tier,
        categoryTitle: category.categoryTitle,
        categoryId: category.categoryId,
        categoryIcon: category.categoryIcon,
      }))
    );
  }, [achievementDefinitions]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = allTiers.length;
    const unlockedTiers = allTiers.filter(t => {
      const ua = userAchievements.find(a => a.id === tierId(t.id));
      return ua?.unlocked;
    });

    const unlockedCount = unlockedTiers.length;
    const percentage = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

    // Total XP earned
    const totalXpEarned = unlockedTiers.reduce((acc, t) => acc + (t.xpReward || 50), 0);
    const totalPossibleXp = allTiers.reduce((acc, t) => acc + (t.xpReward || 50), 0);

    // High rank counts (Monarch & S)
    const highRankUnlocked = unlockedTiers.filter(t => t.rank === 'MONARCH' || t.rank === 'S').length;
    const totalHighRanks = allTiers.filter(t => t.rank === 'MONARCH' || t.rank === 'S').length;

    // Highest rank achieved
    let highestRankAchieved: AchievementRank = 'E';
    const ranksOrder: AchievementRank[] = ['MONARCH', 'S', 'A', 'B', 'C', 'D', 'E'];
    for (const r of ranksOrder) {
      if (unlockedTiers.some(t => t.rank === r)) {
        highestRankAchieved = r;
        break;
      }
    }

    return {
      total,
      unlockedCount,
      percentage,
      totalXpEarned,
      totalPossibleXp,
      highRankUnlocked,
      totalHighRanks,
      highestRankAchieved,
    };
  }, [allTiers, userAchievements]);

  function tierId(id: string): string {
    return id;
  }

  if (!userAchievements || userAchievements.length === 0 || !achievementDefinitions || achievementDefinitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-cyan-500/20 shadow-2xl">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse">
          <BoltIcon className="w-12 h-12 text-white" />
        </div>
        <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono mb-2">[ O SISTEMA ESTÁ CONECTANDO ]</div>
        <p className="text-2xl font-bold text-white mb-2">Sincronizando Dados de Caçador...</p>
        <p className="text-slate-400 text-sm">Carregando suas proezas e classificações de rank.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* ======================================================== */}
      {/* 1. SOLO LEVELING / SYSTEM HUD HERO BANNER                */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 p-6 md:p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        {/* Futuristic glowing grid / scanline effect */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* System Notification Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              SISTEMA DE DESPERTAR OTAKU // PAINEL DO JOGADOR
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">PATENTE ATUAL:</span>
              <span className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wider ${RANK_CONFIG[stats.highestRankAchieved].badgeBg}`}>
                {RANK_CONFIG[stats.highestRankAchieved].icon} {RANK_CONFIG[stats.highestRankAchieved].label}
              </span>
            </div>
          </div>

          {/* Main Title & Lore Text */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200 tracking-tight">
                Sistema de Conquistas
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                Desbloqueie títulos lendários inspirados em clássicos dos animes, suba seu <span className="text-cyan-400 font-semibold">Rank de Caçador</span> de <span className="text-slate-400">Rank E</span> até o mítico <span className="text-amber-400 font-semibold">Rank Monarca</span> e acumule XP épico!
              </p>
            </div>

            {/* Quick Summary XP Capsule */}
            <div className="flex-shrink-0 bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.15)] text-center min-w-[180px]">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold mb-1 flex items-center justify-center gap-1.5">
                <SparkIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>XP de Conquistas</span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-amber-300 font-mono">
                +{stats.totalXpEarned.toLocaleString('pt-BR')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                de {stats.totalPossibleXp.toLocaleString('pt-BR')} XP disponíveis
              </div>
            </div>
          </div>

          {/* Player Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Desbloqueadas</span>
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                {stats.unlockedCount} <span className="text-sm font-normal text-slate-500">/ {stats.total}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Taxa de conclusão: {stats.percentage}%
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Monarca & Rank S</span>
                <CrownIcon className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-purple-300 font-mono">
                {stats.highRankUnlocked} <span className="text-sm font-normal text-slate-500">/ {stats.totalHighRanks}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Desafios Lendários
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Categorias</span>
                <AcademicCapIcon className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-cyan-300 font-mono">
                {achievementDefinitions.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Trilhas de Maestria
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Conclusão Total</span>
                <TrophyIcon className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
                {stats.percentage}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {stats.total - stats.unlockedCount} restantes para zerar
              </div>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">PROGRESSO DO MULTIVERSO</span>
              <span className="text-cyan-400 font-bold">{stats.unlockedCount} DE {stats.total} CONQUISTADAS ({stats.percentage}%)</span>
            </div>
            <div className="h-3.5 bg-black/50 rounded-full overflow-hidden border border-white/15 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                style={{ width: `${Math.max(stats.percentage, 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FILTERS & SEARCH CONTROLS                             */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Status Filter Chips & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `Todas (${stats.total})`, icon: SparklesIcon },
              { id: 'unlocked', label: `Desbloqueadas (${stats.unlockedCount})`, icon: CheckCircleIcon },
              { id: 'locked', label: `Bloqueadas (${stats.total - stats.unlockedCount})`, icon: MiniLockIcon },
              { id: 'high_rank', label: `Monarca & Rank S 👑 (${stats.totalHighRanks})`, icon: CrownIcon },
            ].map(btn => {
              const isActive = statusFilter === btn.id;
              const Icon = btn.icon;
              return (
                <button
                  key={btn.id}
                  onClick={() => setStatusFilter(btn.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-95
                    ${isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-cyan-600/25 border border-cyan-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-white/10'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conquista..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Mobile Category Dropdown Selector */}
        <div className="block sm:hidden">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Todas as Trilhas ({achievementDefinitions.length} Categorias - {stats.total} Desafios)</option>
            {achievementDefinitions.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryTitle} ({cat.tiers.length} desafios)
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Category Horizontal Filter Pills */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
          >
            Todas as Categorias ({achievementDefinitions.length})
          </button>

          {achievementDefinitions.map(cat => {
            const isCatActive = selectedCategory === cat.categoryId;
            const CategoryIcon = cat.categoryIcon;
            return (
              <button
                key={cat.categoryId}
                onClick={() => setSelectedCategory(cat.categoryId)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${isCatActive
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{cat.categoryTitle.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ACHIEVEMENT CATEGORIES & TIERS GRID                   */}
      {/* ======================================================== */}
      <div className="space-y-8">
        {achievementDefinitions
          .filter(cat => selectedCategory === 'all' || cat.categoryId === selectedCategory)
          .map(category => {
            // Filter category tiers based on current filters
            const filteredTiers = category.tiers.filter(tierDef => {
              const userTierData = userAchievements.find(ua => ua.id === tierDef.id);
              const isUnlocked = !!userTierData?.unlocked;

              // Status filter
              if (statusFilter === 'unlocked' && !isUnlocked) return false;
              if (statusFilter === 'locked' && isUnlocked) return false;
              if (statusFilter === 'high_rank' && tierDef.rank !== 'MONARCH' && tierDef.rank !== 'S') return false;

              // Search query filter
              if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const matchTitle = tierDef.title.toLowerCase().includes(query);
                const matchDesc = tierDef.description.toLowerCase().includes(query);
                const matchAnime = tierDef.animeReference?.toLowerCase().includes(query);
                const matchRank = tierDef.rank?.toLowerCase().includes(query);
                if (!matchTitle && !matchDesc && !matchAnime && !matchRank) {
                  return false;
                }
              }

              return true;
            });

            if (filteredTiers.length === 0) return null;

            // Stats for this category
            const totalInCat = category.tiers.length;
            const unlockedInCat = category.tiers.filter(t => {
              const ua = userAchievements.find(a => a.id === t.id);
              return ua?.unlocked;
            }).length;

            const CategoryIcon = category.categoryIcon;

            return (
              <div
                key={category.categoryId}
                className="bg-slate-900/60 backdrop-blur-md p-5 md:p-7 rounded-3xl border border-white/10 shadow-xl transition-all"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-500/30 text-cyan-300 shadow-md">
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        {category.categoryTitle}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {unlockedInCat} de {totalInCat} conquistas desbloqueadas nesta trilha
                      </p>
                    </div>
                  </div>

                  {/* Category Progress Pill */}
                  <div className="flex items-center gap-3">
                    <div className="w-32 hidden sm:block">
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${(unlockedInCat / totalInCat) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300">
                      {Math.round((unlockedInCat / totalInCat) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Tiers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredTiers.map(tierDef => {
                    const userTierData = userAchievements.find(ua => ua.id === tierDef.id);
                    const isUnlocked = !!userTierData?.unlocked;
                    const progress = userTierData?.currentProgress || 0;
                    const target = tierDef.target;
                    const rank = tierDef.rank || 'E';
                    const rankStyle = RANK_CONFIG[rank];
                    const IconComponent = tierDef.icon || category.categoryIcon;
                    const percentComplete = Math.min(Math.round((progress / target) * 100), 100);

                    const isHighRank = rank === 'MONARCH' || rank === 'S';

                    return (
                      <div
                        key={tierDef.id}
                        className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between
                          ${isUnlocked
                            ? `bg-gradient-to-br ${rankStyle.glowClass} ${rankStyle.borderClass}`
                            : isHighRank
                              ? 'bg-slate-950/80 border-purple-900/30 hover:border-purple-500/40 opacity-85 hover:opacity-100'
                              : 'bg-slate-900/40 border-white/5 hover:border-white/15 opacity-80 hover:opacity-100'
                          }`}
                      >
                        {/* Top Badges Bar: Rank Badge + XP Reward */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Rank Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] uppercase ${rankStyle.badgeBg}`}>
                              <span>{rankStyle.icon}</span>
                              <span>{rankStyle.label}</span>
                            </span>
                          </div>

                          {/* XP Reward Capsule */}
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                            <SparkIcon className="w-3 h-3 text-amber-400 flex-shrink-0" />
                            <span>+{tierDef.xpReward || 50} XP</span>
                          </div>
                        </div>

                        {/* Middle Content: Icon + Title + Description */}
                        <div className="flex items-start gap-4 mb-4">
                          {/* Achievement Icon */}
                          <div className={`flex-shrink-0 p-3.5 rounded-2xl border transition-all
                            ${isUnlocked
                              ? rank === 'MONARCH'
                                ? 'bg-gradient-to-br from-amber-500/30 to-purple-600/30 border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/20'
                                : 'bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 border-emerald-500/40 text-emerald-300 shadow-md'
                              : 'bg-black/30 border-white/10 text-slate-500'
                            }`}
                          >
                            <IconComponent className="w-7 h-7" />
                          </div>

                          {/* Text info */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base md:text-lg font-bold leading-snug tracking-tight ${isUnlocked ? rankStyle.textClass : 'text-white'}`}>
                                {tierDef.title}
                              </h3>
                            </div>
                            <p className="text-xs md:text-sm text-slate-300/90 mt-1 leading-relaxed">
                              {tierDef.description}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Status / Progress Section */}
                        <div className="pt-3 border-t border-white/10">
                          {isUnlocked ? (
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>DESBLOQUEADO</span>
                              </div>
                              {userTierData?.unlockedAt && (
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {new Date(userTierData.unlockedAt).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                  <MiniLockIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                  <span>Progresso</span>
                                </span>
                                <span className="text-slate-200 font-bold">
                                  {progress.toLocaleString('pt-BR')} / {target.toLocaleString('pt-BR')} ({percentComplete}%)
                                </span>
                              </div>
                              <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                                <div
                                  className={`h-full transition-all duration-500 ${isHighRank
                                      ? 'bg-gradient-to-r from-purple-500 to-amber-400'
                                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                    }`}
                                  style={{ width: `${percentComplete}%` }}
                                />
                              </div>
                              {/* Remaining distance message */}
                              <div className="text-[10px] text-slate-400 text-right font-mono">
                                Faltam {(target - progress > 0 ? target - progress : 0).toLocaleString('pt-BR')} para desbloquear
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AchievementsView;