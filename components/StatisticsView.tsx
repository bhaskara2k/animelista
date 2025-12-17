import React, { useMemo } from 'react';
import { StatisticsData, AnimeStatus } from '../types';
import { ChartPieIcon, EyeIcon, StarIcon, TrophyIcon, FilmIcon, SparklesIcon } from './Icons';
import { MaterialSymbol } from './Icons';

interface StatisticsViewProps {
  stats: StatisticsData;
  username?: string;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  trend?: string; // Optional trend indicator logic
}> = ({ title, value, icon, className = "", trend }) => (
  <div className={`glass-panel p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${className}`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-500/10 transition-colors"></div>

    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{value}</h3>
        {trend && <p className="text-xs text-accent-400 mt-2">{trend}</p>}
      </div>
      <div className="p-3 bg-white/5 rounded-xl text-accent-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  </div>
);

const ProgressBar: React.FC<{ label: string; value: number; max: number; color?: string }> = ({ label, value, max, color = "bg-accent-500" }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5 font-medium">
        <span className="text-gray-300">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const StatisticsView: React.FC<StatisticsViewProps> = ({ stats, username }) => {
  if (stats.totalAnimes === 0) {
    return (
      <div className="text-center py-20 px-8 glass-panel rounded-2xl flex flex-col items-center justify-center animate-fade-in border border-white/5">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
          <ChartPieIcon className="w-12 h-12 text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Sem dados suficientes</h2>
        <p className="text-gray-400 max-w-lg">
          {username
            ? `${username} ainda não começou a catalogar sua jornada de animes.`
            : "Comece a adicionar animes e atualize seus progressos para desbloquear este painel analítico."}
        </p>
      </div>
    );
  }

  const topGenres = stats.genreFrequency.slice(0, 5);
  const topPlatforms = stats.platformFrequency.slice(0, 5);
  const maxGenreCount = topGenres.length > 0 ? topGenres[0].count : 1;
  const maxPlatformCount = topPlatforms.length > 0 ? topPlatforms[0].count : 1;

  // Custom colors for specific statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case AnimeStatus.WATCHING: return 'bg-sky-500';
      case AnimeStatus.COMPLETED: return 'bg-emerald-500';
      case AnimeStatus.PLANNED: return 'bg-amber-500';
      case AnimeStatus.ON_HOLD: return 'bg-slate-500';
      case AnimeStatus.DROPPED: return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Painel Analítico
        </h2>
        <p className="text-gray-400 text-lg">
          {username ? `Visão geral do perfil de ${username}` : "Métricas detalhadas da sua jornada otaku"}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Animes"
          value={stats.totalAnimes}
          icon={<EyeIcon className="w-8 h-8" />}
          trend="Títulos catalogados"
        />
        <StatCard
          title="Episódios Vistos"
          value={stats.totalEpisodesWatched.toLocaleString()}
          icon={<MaterialSymbol iconName="slideshow" className="w-8 h-8" />}
          trend="Tempo total investido"
        />
        <StatCard
          title="Nota Média"
          value={stats.averageRating !== undefined ? stats.averageRating.toFixed(1) : "N/A"}
          icon={<StarIcon className="w-8 h-8" filled />}
          className="border-accent-500/30"
          trend="Baseado em completados"
        />
        <StatCard
          title="Conquistas"
          value="N/A" // Placeholder for now, could be passed in stats
          icon={<TrophyIcon className="w-8 h-8" />}
          trend="Em breve"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Status Distribution - Donut Chart Representation (Visual only via bars for now) */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1 h-full">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-accent-400" />
            Distribuição por Status
          </h3>
          <div className="space-y-5">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              count > 0 && (
                <div key={status} className="group cursor-default">
                  <div className="flex justify-between items-end mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-300 group-hover:bg-white/10 transition-colors`}>
                      {status}
                    </span>
                    <span className="text-xl font-bold text-white">{count}</span>
                  </div>
                  <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(status)} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                      style={{ width: `${(count / stats.totalAnimes) * 100}%` }}
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Top Genres & Platforms */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col gap-8">

          {/* Genres */}
          {topGenres.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FilmIcon className="w-5 h-5 text-accent-400" />
                Gêneros Favoritos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {topGenres.map(item => (
                  <ProgressBar
                    key={item.genre}
                    label={item.genre}
                    value={item.count}
                    max={maxGenreCount}
                    color="bg-gradient-to-r from-accent-600 to-accent-400"
                  />
                ))}
              </div>
            </div>
          )}

          {topPlatforms.length > 0 && topGenres.length > 0 && <div className="h-px bg-white/5 w-full"></div>}

          {/* Platforms */}
          {topPlatforms.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MaterialSymbol iconName="live_tv" className="w-5 h-5 text-accent-400" />
                Plataformas
              </h3>
              <div className="space-y-3">
                {topPlatforms.map(item => (
                  <div key={item.platform} className="flex items-center gap-4 group">
                    <div className="w-32 text-sm font-medium text-gray-300 truncate text-right">{item.platform}</div>
                    <div className="flex-grow h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:brightness-110 transition-all"
                        style={{ width: `${(item.count / maxPlatformCount) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-bold text-white text-left">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StatisticsView;
