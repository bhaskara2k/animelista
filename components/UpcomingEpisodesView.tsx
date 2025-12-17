import React, { useMemo } from 'react';
import { Anime, ListDensityOption } from '../types';
import { PlusIcon, EyeIcon, CalendarDaysIcon, PlayIcon, BellAlertIcon } from './Icons';
import { parseFromYYYYMMDD } from '../utils/dateUtils';

interface UpcomingAnime {
  anime: Anime;
  nextEpisodeNumber: number;
  nextAiringDate: Date;
}

interface UpcomingAnimeCardProps {
  item: UpcomingAnime;
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
  onEditAnime: (anime: Anime) => void;
  listDensity: ListDensityOption;
}

const UpcomingAnimeCard: React.FC<UpcomingAnimeCardProps> = ({ item, onUpdateEpisode, onEditAnime, listDensity }) => {
  const { anime, nextEpisodeNumber, nextAiringDate } = item;

  const handleMarkAsWatched = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateEpisode(anime.id, nextEpisodeNumber);
  };

  const formattedDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const airDate = new Date(nextAiringDate);
    airDate.setHours(0, 0, 0, 0);

    if (airDate.getTime() === today.getTime()) return "HOJE";
    if (airDate.getTime() === tomorrow.getTime()) return "AMANHÃ";

    // Check if it's within this week to show day name
    const diffTime = airDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 7 && diffDays > 1) {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return days[airDate.getDay()].toUpperCase();
    }

    const day = String(airDate.getDate()).padStart(2, '0');
    const month = String(airDate.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }, [nextAiringDate]);

  const isToday = formattedDate === "HOJE";

  return (
    <div
      onClick={() => onEditAnime(anime)}
      className="group relative overflow-hidden glass-panel rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-accent-glow cursor-pointer border border-white/5 hover:border-accent-500/30"
    >
      {/* Background Image with Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/300/200`}
          alt=""
          className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity blur-[2px] group-hover:blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/95 to-transparent/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex p-4 items-center gap-4">
        {/* Main Cover Image */}
        <div className="relative flex-shrink-0">
          <img
            src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/100/150`}
            alt={anime.title}
            className="w-20 h-28 object-cover rounded-xl shadow-lg shadow-black/50 ring-1 ring-white/10 group-hover:ring-accent-500/50 transition-all"
          />
          {isToday && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
              HOJE
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0 flex flex-col justify-between h-28 py-1">
          <div>
            <h3 className="font-bold text-lg text-white mb-0.5 line-clamp-1 group-hover:text-accent-400 transition-colors">
              {anime.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-gray-300 border border-white/5">
                EP {nextEpisodeNumber}
              </span>
              <span className={`text-xs font-bold flex items-center gap-1 ${isToday ? 'text-green-400' : 'text-accent-300'}`}>
                <CalendarDaysIcon className="w-3 h-3" /> {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <button
              onClick={handleMarkAsWatched}
              className="flex-1 bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-lg shadow-accent-600/20 transition-all flex items-center justify-center gap-2 group/btn"
            >
              <PlayIcon className="w-4 h-4 fill-white" />
              <span>MARCAR VISTO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UpcomingEpisodesViewProps {
  upcomingAnimes: UpcomingAnime[];
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
  onEditAnime: (anime: Anime) => void;
  listDensity: ListDensityOption;
}

const UpcomingEpisodesView: React.FC<UpcomingEpisodesViewProps> = ({
  upcomingAnimes,
  onUpdateEpisode,
  onEditAnime,
  listDensity,
}) => {
  if (upcomingAnimes.length === 0) {
    return (
      <div className="text-center py-20 px-8 glass-panel rounded-2xl flex flex-col items-center justify-center animate-fade-in border border-white/5">
        <div className="w-24 h-24 rounded-full bg-sky-500/10 flex items-center justify-center mb-6 ring-4 ring-sky-500/20 animate-pulse">
          <BellAlertIcon className="w-12 h-12 text-sky-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Tudo em dia!</h2>
        <p className="text-gray-400 max-w-md">
          Você não tem episódios pendentes para os próximos dias. Aproveite para descobrir novos animes ou relaxar!
        </p>
      </div>
    );
  }

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, UpcomingAnime[]> = {
      'HOJE': [],
      'AMANHÃ': [],
      'ESTA SEMANA': [],
      'EM BREVE': []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    upcomingAnimes.forEach(item => {
      const date = new Date(item.nextAiringDate);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups['HOJE'].push(item);
      } else if (date.getTime() === tomorrow.getTime()) {
        groups['AMANHÃ'].push(item);
      } else {
        const diffTime = date.getTime() - today.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays < 7) {
          groups['ESTA SEMANA'].push(item);
        } else {
          groups['EM BREVE'].push(item);
        }
      }
    });

    return groups;
  }, [upcomingAnimes]);

  const hasItems = (key: string) => grouped[key] && grouped[key].length > 0;

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Próximos Lançamentos</h2>
        <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Em tempo real
        </p>
      </div>

      {['HOJE', 'AMANHÃ', 'ESTA SEMANA', 'EM BREVE'].map((groupName) => (
        hasItems(groupName) && (
          <div key={groupName} className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <span className={`w-1.5 h-6 rounded-full ${groupName === 'HOJE' ? 'bg-red-500' :
                  groupName === 'AMANHÃ' ? 'bg-orange-400' :
                    'bg-blue-500'
                }`}></span>
              {groupName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[groupName].sort((a, b) => a.anime.title.localeCompare(b.anime.title)).map(item => (
                <UpcomingAnimeCard
                  key={item.anime.id}
                  item={item}
                  onUpdateEpisode={onUpdateEpisode}
                  onEditAnime={onEditAnime}
                  listDensity={listDensity}
                />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default UpcomingEpisodesView;