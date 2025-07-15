

import React from 'react';
import { StatisticsData, AnimeStatus } from '../types';
import { ChartPieIcon, EyeIcon, StarIcon } from './Icons';
import { MaterialSymbol } from './Icons';

interface StatisticsViewProps {
  stats: StatisticsData;
  username?: string; // Optional: To display whose stats these are
}

const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; className?: string }> = ({ title, value, icon, className = "" }) => (
  <div className={`bg-surface-secondary p-6 rounded-lg shadow-custom-md flex items-center space-x-4 ${className}`}>
    {icon && <div className="text-accent">{icon}</div>}
    <div>
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="text-2xl font-semibold text-accent">{value}</p>
    </div>
  </div>
);

const StatisticsView: React.FC<StatisticsViewProps> = ({ stats, username }) => {
  if (stats.totalAnimes === 0) {
    return (
      <div className="text-center py-12 md:py-16 px-6 bg-surface-primary rounded-lg shadow-custom-xl border border-border-primary">
        <ChartPieIcon className="w-20 h-20 mx-auto text-text-tertiary mb-6" opticalSize={48} />
        <h2 className="text-2xl font-semibold text-accent mb-3">Sem Dados para Estatísticas</h2>
        <p className="text-text-secondary">
          {username ? `${username} ainda não tem dados públicos.` : "Adicione animes à sua agenda e atualize seus status para ver suas estatísticas aqui."}
        </p>
      </div>
    );
  }

  const topGenres = stats.genreFrequency.slice(0, 5);
  const topPlatforms = stats.platformFrequency.slice(0, 5);
  const titleText = username ? `Estatísticas de ${username}` : "Suas Estatísticas de Anime";

  return (
    <div className="space-y-8 p-4 md:p-6 bg-surface-primary rounded-lg shadow-custom-xl">
      <h2 className="text-3xl font-bold text-accent mb-8 text-center">{titleText}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total de Animes na Agenda" value={stats.totalAnimes} icon={<EyeIcon className="w-8 h-8" opticalSize={32}/>} />
        <StatCard title="Total de Episódios Assistidos" value={stats.totalEpisodesWatched} icon={<MaterialSymbol iconName="slideshow" className="w-8 h-8" opticalSize={32}/>} />
        {stats.averageRating !== undefined ? (
           <StatCard title="Nota Média (Completos)" value={`${stats.averageRating.toFixed(1)} / 10`} icon={<StarIcon className="w-8 h-8" opticalSize={32} filled={true}/>} />
        ) : (
          <StatCard title="Nota Média (Completos)" value="N/A" icon={<StarIcon className="w-8 h-8" opticalSize={32}/>} />
        )}
      </div>

      <div className="bg-surface-secondary p-6 rounded-lg shadow-custom-md">
        <h3 className="text-xl font-semibold text-accent mb-4">Animes por Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
          {Object.entries(stats.statusCounts).map(([statusKey, count]) => (
            <div key={statusKey} className="bg-bg-tertiary/70 p-3 rounded-md">
              <p className="text-sm text-text-secondary">{statusKey as AnimeStatus}</p>
              <p className="text-2xl font-bold text-accent">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {topGenres.length > 0 && (
          <div className="bg-surface-secondary p-6 rounded-lg shadow-custom-md">
            <h3 className="text-xl font-semibold text-accent mb-4">Gêneros Mais Comuns (Top {topGenres.length})</h3>
            <ul className="space-y-2">
              {topGenres.map(item => (
                <li key={item.genre} className="flex justify-between items-center p-3 bg-bg-tertiary/70 rounded-md">
                  <span className="text-text-primary">{item.genre}</span>
                  <span className="font-semibold text-accent">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {topPlatforms.length > 0 && (
          <div className="bg-surface-secondary p-6 rounded-lg shadow-custom-md">
            <h3 className="text-xl font-semibold text-accent mb-4">Plataformas Mais Usadas (Top {topPlatforms.length})</h3>
            <ul className="space-y-2">
              {topPlatforms.map(item => (
                <li key={item.platform} className="flex justify-between items-center p-3 bg-bg-tertiary/70 rounded-md">
                  <span className="text-text-primary">{item.platform}</span>
                  <span className="font-semibold text-accent">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsView;
