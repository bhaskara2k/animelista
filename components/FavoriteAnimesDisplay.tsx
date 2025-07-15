import React from 'react';
import { Anime } from '../types';
import { StarIcon } from './Icons'; 

interface FavoriteAnimesDisplayProps {
  favoriteAnimes: Anime[];
  onEditAnime: (anime: Anime) => void;
}

const FavoriteAnimesDisplay: React.FC<FavoriteAnimesDisplayProps> = ({ favoriteAnimes, onEditAnime }) => {
  if (favoriteAnimes.length === 0) {
    return (
        <div className="mt-8">
             <h3 className="text-xl font-semibold text-text-secondary mb-4 flex items-center gap-2">
                <StarIcon className="w-6 h-6 text-yellow-400" filled />
                Animes Favoritos (Top 5 do Ranking)
            </h3>
            <div className="text-center py-8 bg-surface-primary rounded-lg">
                <p className="text-text-secondary">Nenhum anime avaliado como "Completo" para exibir aqui.</p>
                <p className="text-text-tertiary text-sm">Avalie seus animes concluídos para que seu Top 5 apareça!</p>
            </div>
        </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-text-secondary mb-4 flex items-center gap-2">
        <StarIcon className="w-6 h-6 text-yellow-400" filled />
        Animes Favoritos (Top 5 do Ranking)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {favoriteAnimes.map(anime => (
          <button
            key={anime.id}
            onClick={() => onEditAnime(anime)}
            className="group relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-accent-glow focus:outline-none focus:ring-2 focus:ring-accent-ring focus:ring-offset-2 focus:ring-offset-bg-tertiary"
            aria-label={`Ver detalhes de ${anime.title}`}
          >
            <img 
              src={anime.imageUrl} 
              alt={anime.title} 
              className="w-full h-64 object-cover"
              onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${anime.id}/200/300`)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3 text-white">
              <h4 className="font-bold text-md line-clamp-2">{anime.title}</h4>
              {anime.rating && anime.rating > 0 && (
                <div className="flex items-center mt-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" filled />
                  <span className="ml-1 text-sm font-semibold">{anime.rating}/10</span>
                </div>
              )}
            </div>
          </button>
        ))}
        {/* Fill empty spots if less than 5 to maintain grid structure */}
        {Array.from({ length: Math.max(0, 5 - favoriteAnimes.length) }).map((_, index) => (
            <div key={`placeholder-${index}`} className="h-64 rounded-lg bg-surface-secondary/50 border-2 border-dashed border-border-primary flex items-center justify-center">
                <StarIcon className="w-10 h-10 text-text-tertiary" />
            </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteAnimesDisplay;
