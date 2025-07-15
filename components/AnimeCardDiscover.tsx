
import React from 'react';
import { AniListMedia } from '../types';
import { PlusIcon, EyeIcon } from './Icons';
import { translateFormat, translateGenre } from '../utils/translationUtils';
import { translateAniListSeasonToPortuguese } from '../utils/seasonUtils';

interface AnimeCardDiscoverProps {
  anime: AniListMedia;
  onAddAnime: (anime: AniListMedia) => void;
  onShowDetails: (anime: AniListMedia) => void;
  cardType?: 'carousel' | 'grid';
}

const AnimeCardDiscover: React.FC<AnimeCardDiscoverProps> = ({ anime, onAddAnime, onShowDetails, cardType = 'grid' }) => {
  const { title, coverImage, format, season, seasonYear, averageScore, genres } = anime;

  const imageSizeClass = cardType === 'carousel' ? 'h-72 sm:h-80 md:h-96' : 'h-72'; // Larger for carousel
  const cardWidthClass = cardType === 'carousel' ? 'w-48 sm:w-56 md:w-64' : 'w-full'; // Fixed width for carousel items

  return (
    <div 
        className={`bg-surface-secondary rounded-lg shadow-custom-lg overflow-hidden flex flex-col group transform transition-all duration-300 hover:scale-105 hover:shadow-accent-glow ${cardWidthClass}`}
        role="group"
        aria-label={`Informações sobre ${title.romaji || title.english}`}
    >
      <div className="relative">
        <img
          src={coverImage.extraLarge || coverImage.large || `https://picsum.photos/seed/${anime.id}/400/600`}
          alt={title.romaji || title.english || 'Anime Cover'}
          className={`w-full ${imageSizeClass} object-cover transition-transform duration-300 group-hover:opacity-80`}
          onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${anime.id}/400/600`)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="flex space-x-2 justify-center mb-2">
                <button
                  onClick={() => onShowDetails(anime)}
                  className="bg-black/60 backdrop-blur-sm text-white hover:bg-accent-cta-hover text-xs font-semibold py-1.5 px-3 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 flex items-center space-x-1.5"
                  aria-label={`Ver detalhes de ${title.romaji || title.english}`}
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span>Detalhes</span>
                </button>
                 <button
                  onClick={() => onAddAnime(anime)}
                  className="bg-accent-cta text-white hover:bg-accent-cta-hover text-xs font-semibold py-1.5 px-3 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 flex items-center space-x-1.5"
                  aria-label={`Adicionar ${title.romaji || title.english} à lista`}
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
            </div>
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 
            className="text-sm font-semibold text-accent truncate transition-colors group-hover:text-accent-400" 
            title={title.romaji || title.english || title.native}
        >
          {title.romaji || title.english || title.native}
        </h3>
        
        <div className="text-xs text-text-secondary mt-1 space-y-0.5">
          <p className="truncate">
            {translateFormat(format || 'N/A')}
            {seasonYear && ` • ${translateAniListSeasonToPortuguese(season)} ${seasonYear}`}
          </p>
          {averageScore && averageScore > 0 && (
            <p>Nota: <span className="font-medium text-amber-400">{(averageScore / 10).toFixed(1)}/10</span></p>
          )}
        </div>

        {genres && genres.length > 0 && cardType === 'grid' && (
           <div className="mt-2 text-xs text-text-tertiary">
            <p className="truncate" title={genres.map(g => translateGenre(g)).join(', ')}>
                {genres.slice(0, 2).map(g => translateGenre(g)).join(', ')}{genres.length > 2 ? '...' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeCardDiscover;
