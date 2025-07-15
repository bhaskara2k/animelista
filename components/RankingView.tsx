
import React from 'react';
import { Anime } from '../types';
import StarRating from './StarRating';
import { TrophyIcon, PencilIcon } from './Icons';

interface RankingViewProps {
  rankedAnimes: Anime[];
  onEditAnime: (anime: Anime) => void;
}

const getRankAccentColorClass = (rank: number): string => {
  if (rank === 1) return 'border-yellow-400 shadow-yellow-400/30';
  if (rank === 2) return 'border-slate-400 shadow-slate-400/30'; // Keep silver-ish for slate
  if (rank === 3) return 'border-yellow-600 shadow-yellow-600/30'; // Bronze-like
  return 'border-border-primary'; // Use theme variable
};

const getRankTextColorClass = (rank: number): string => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-slate-300'; // Keep silver-ish for slate
  if (rank === 3) return 'text-yellow-600';
  return 'text-accent'; // Use theme variable
}

const RankingView: React.FC<RankingViewProps> = ({ rankedAnimes, onEditAnime }) => {
  if (rankedAnimes.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 px-6 bg-surface-primary rounded-lg shadow-custom-xl border border-border-primary">
        <TrophyIcon className="w-20 h-20 mx-auto text-text-tertiary mb-6" opticalSize={48} />
        <h2 className="text-2xl font-semibold text-accent mb-3">Seu Ranking de Animes está Vazio!</h2>
        <p className="text-text-secondary">
          Para ver animes aqui, marque-os como <strong className="text-emerald-400">"Completo"</strong> e dê uma nota a eles.
        </p>
        <p className="text-text-tertiary mt-1">Os melhores aparecerão no topo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rankedAnimes.map((anime, index) => {
        const rank = index + 1;
        return (
          <div
            key={anime.id}
            className={`bg-surface-primary rounded-xl shadow-custom-lg overflow-hidden transition-all duration-300 hover:shadow-accent-glow border-2 ${getRankAccentColorClass(rank)}`}
          >
            <div className="md:flex">
              <div className="md:shrink-0 relative">
                <img
                  className="h-48 w-full object-cover md:h-full md:w-40"
                  src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/200/300`}
                  alt={`Capa de ${anime.title}`}
                  onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${anime.id}/200/300`)}
                />
                <div 
                  className={`absolute top-2 left-2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-md
                    ${rank === 1 ? 'bg-yellow-400 text-slate-800' : 
                      rank === 2 ? 'bg-slate-400 text-slate-800' :
                      rank === 3 ? 'bg-yellow-600 text-slate-100' :
                      'bg-accent-cta text-white'}`}
                >
                  #{rank}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className={`text-2xl font-bold mb-1 ${getRankTextColorClass(rank)}`}>{anime.title}</h3>
                  <div className="mb-3">
                    <StarRating rating={anime.rating || 0} size="w-6 h-6" color={
                        rank === 1 ? "text-yellow-400" : 
                        rank === 2 ? "text-slate-300" :
                        rank === 3 ? "text-yellow-500" :
                        "text-accent" // Use themed accent for other ranks
                    } />
                  </div>
                  {anime.notes && (
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      <strong>Notas:</strong> {anime.notes}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                   <button 
                      onClick={() => onEditAnime(anime)} 
                      className="p-2 text-text-secondary hover:text-accent transition-colors" 
                      aria-label={`Editar ${anime.title}`}
                    >
                    <PencilIcon className="w-5 h-5" opticalSize={20}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankingView;
