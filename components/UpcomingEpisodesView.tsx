
import React, { useMemo } from 'react';
import { Anime, ListDensityOption } from '../types';
import { PlusIcon, EyeIcon, CalendarDaysIcon } from './Icons'; // Added CalendarDaysIcon
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

  const handleMarkAsWatched = () => {
    onUpdateEpisode(anime.id, nextEpisodeNumber);
  };

  const formattedDate = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (nextAiringDate.getTime() === today.getTime()) return "Hoje";
    if (nextAiringDate.getTime() === tomorrow.getTime()) return "Amanhã";
    
    const day = String(nextAiringDate.getDate()).padStart(2, '0');
    const month = String(nextAiringDate.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${nextAiringDate.getFullYear()}`;
  }, [nextAiringDate]);

  const { cardClass, imageSizeClass, titleClass, textSizeClass, buttonSizeClass } = useMemo(() => {
    switch (listDensity) {
      case 'compact':
        return { 
            cardClass: 'p-3', 
            imageSizeClass: 'w-16 h-24', 
            titleClass: 'text-base', 
            textSizeClass: 'text-xs',
            buttonSizeClass: 'px-2 py-1 text-xs'
        };
      case 'spaced':
        return { 
            cardClass: 'p-5', 
            imageSizeClass: 'w-24 h-36', 
            titleClass: 'text-lg', 
            textSizeClass: 'text-sm',
            buttonSizeClass: 'px-3 py-1.5 text-sm'
        };
      case 'normal':
      default:
        return { 
            cardClass: 'p-4', 
            imageSizeClass: 'w-20 h-28', 
            titleClass: 'text-md', 
            textSizeClass: 'text-xs',
            buttonSizeClass: 'px-2.5 py-1.5 text-xs'
        };
    }
  }, [listDensity]);


  return (
    <div className={`bg-surface-primary rounded-lg shadow-custom-md overflow-hidden flex ${cardClass} items-center space-x-4 transition-all duration-300 hover:shadow-accent-glow`}>
      <img
        src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/100/150`}
        alt={`Capa de ${anime.title}`}
        className={`${imageSizeClass} object-cover rounded-md flex-shrink-0`}
        onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${anime.id}/100/150`)}
      />
      <div className="flex-grow min-w-0"> {/* Added min-w-0 here for the content block */}
        <h3 
            className={`${titleClass} font-semibold text-accent mb-1 line-clamp-2 break-words min-w-0`} 
            title={anime.title}
        >
          {anime.title}
        </h3>
        <p className={`${textSizeClass} text-text-secondary`}>
          Próximo: <span className="font-medium text-text-primary">Episódio {nextEpisodeNumber}</span>
        </p>
        <p className={`${textSizeClass} text-text-secondary mb-2`}>
          Data Prevista: <span className="font-medium text-text-primary">{formattedDate}</span>
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
          <button
            onClick={handleMarkAsWatched}
            className={`${buttonSizeClass} bg-accent-cta hover:bg-accent-cta-hover text-white rounded-md transition-colors flex items-center justify-center space-x-1.5`}
            aria-label={`Marcar episódio ${nextEpisodeNumber} de ${anime.title} como assistido`}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Assistido</span>
          </button>
          <button
            onClick={() => onEditAnime(anime)}
            className={`${buttonSizeClass} bg-surface-secondary hover:bg-surface-hover text-text-secondary rounded-md transition-colors border border-border-secondary flex items-center justify-center space-x-1.5`}
            aria-label={`Ver detalhes de ${anime.title}`}
          >
            <EyeIcon className="w-4 h-4" />
            <span>Detalhes</span>
          </button>
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
      <div className="text-center py-12 md:py-16 px-6 bg-surface-primary rounded-lg shadow-custom-md border border-border-primary mt-4">
        <CalendarDaysIcon className="w-16 h-16 mx-auto text-text-tertiary mb-6" opticalSize={48}/>
        <p className="text-xl font-semibold text-text-secondary mb-2">Nenhum episódio programado para breve.</p>
        <p className="text-text-tertiary">
          Configure as datas de lançamento dos animes que você está <strong className="text-sky-400">"Assistindo"</strong> para vê-los aqui.
        </p>
      </div>
    );
  }

  const getGridGapClass = () => {
    switch (listDensity) {
      case 'compact': return 'gap-3';
      case 'normal': return 'gap-4';
      case 'spaced': return 'gap-6';
      default: return 'gap-4';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${getGridGapClass()} p-1 mt-4`}>
      {upcomingAnimes.map((item) => (
        <UpcomingAnimeCard
          key={item.anime.id}
          item={item}
          onUpdateEpisode={onUpdateEpisode}
          onEditAnime={onEditAnime}
          listDensity={listDensity}
        />
      ))}
    </div>
  );
};

export default UpcomingEpisodesView;