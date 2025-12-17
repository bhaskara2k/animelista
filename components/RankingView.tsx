import React from 'react';
import { Anime } from '../types';
import StarRating from './StarRating';
import { TrophyIcon, PencilIcon, MedalIcon, SparklesIcon } from './Icons';

interface RankingViewProps {
  rankedAnimes: Anime[];
  onEditAnime: (anime: Anime) => void;
}

const RankingView: React.FC<RankingViewProps> = ({ rankedAnimes, onEditAnime }) => {
  if (rankedAnimes.length === 0) {
    return (
      <div className="text-center py-20 px-6 glass-panel rounded-2xl flex flex-col items-center justify-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6 ring-4 ring-yellow-500/20">
          <TrophyIcon className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Ranking Vazio</h2>
        <p className="text-gray-400 max-w-md">
          Complete seus animes e dê uma nota para que eles apareçam aqui. O <span className="text-yellow-400 font-bold">Hall da Fama</span> aguarda seus favoritos!
        </p>
      </div>
    );
  }

  const top3 = rankedAnimes.slice(0, 3);
  const others = rankedAnimes.slice(3);

  return (
    <div className="space-y-12 animate-fade-in pb-10">

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mb-2 drop-shadow-sm pb-2">
          HALL DA FAMA
        </h2>
        <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">Seus Animes Melhores Avaliados</p>
      </div>

      {/* Podium (Top 3) */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 mb-16 px-4">
        {/* 2nd Place */}
        {top3.length >= 2 && (
          <div className="order-2 md:order-1 w-full md:w-1/3 flex flex-col items-center group">
            <div className="relative mb-4 w-32 h-44 md:w-40 md:h-56 rounded-xl overflow-hidden shadow-2xl shadow-slate-400/20 border-2 border-slate-300 transform group-hover:-translate-y-2 transition-transform duration-300">
              <img src={top3[1].imageUrl || ''} className="w-full h-full object-cover" alt={top3[1].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-1 bg-slate-300 text-slate-900 px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-lg">
                  <MedalIcon className="w-4 h-4" /> #2 Prata
                </div>
                <h3 className="text-white font-bold text-lg leading-tight px-2 line-clamp-2">{top3[1].title}</h3>
              </div>
            </div>
            <div className="h-24 w-full bg-gradient-to-t from-slate-400/20 to-transparent rounded-t-xl flex items-end justify-center pb-4 backdrop-blur-sm border-x border-t border-slate-400/30">
              <StarRating rating={top3[1].rating || 0} size="w-4 h-4" />
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top3.length >= 1 && (
          <div className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center z-10 -mt-8 md:-mt-12 group">
            <div className="relative mb-4 w-40 h-56 md:w-52 md:h-72 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.4)] border-2 border-yellow-400 transform group-hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-2 z-20">
                <TrophyIcon className="w-8 h-8 text-yellow-400 drop-shadow-md animate-bounce" />
              </div>
              <img src={top3[0].imageUrl || ''} className="w-full h-full object-cover" alt={top3[0].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                <div className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-black mb-2 shadow-lg">
                  <SparklesIcon className="w-4 h-4" /> #1 OURO
                </div>
                <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg line-clamp-2">{top3[0].title}</h3>
              </div>
            </div>
            <div className="h-32 w-full bg-gradient-to-t from-yellow-400/20 to-transparent rounded-t-2xl flex items-end justify-center pb-6 backdrop-blur-md border-x border-t border-yellow-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-400/5 animate-pulse"></div>
              <StarRating rating={top3[0].rating || 0} size="w-6 h-6" />
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3.length >= 3 && (
          <div className="order-3 w-full md:w-1/3 flex flex-col items-center group">
            <div className="relative mb-4 w-32 h-44 md:w-40 md:h-56 rounded-xl overflow-hidden shadow-2xl shadow-amber-700/20 border-2 border-amber-700 transform group-hover:-translate-y-2 transition-transform duration-300">
              <img src={top3[2].imageUrl || ''} className="w-full h-full object-cover" alt={top3[2].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-1 bg-amber-700 text-amber-100 px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-lg">
                  <MedalIcon className="w-4 h-4" /> #3 Bronze
                </div>
                <h3 className="text-white font-bold text-lg leading-tight px-2 line-clamp-2">{top3[2].title}</h3>
              </div>
            </div>
            <div className="h-16 w-full bg-gradient-to-t from-amber-700/20 to-transparent rounded-t-xl flex items-end justify-center pb-4 backdrop-blur-sm border-x border-t border-amber-700/30">
              <StarRating rating={top3[2].rating || 0} size="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* The Rest List */}
      <div className="max-w-4xl mx-auto space-y-3">
        {others.map((anime, index) => {
          const rank = index + 4;
          return (
            <div key={anime.id} className="glass-panel p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-white/5 hover:translate-x-2 group">
              <div className="flex-shrink-0 w-12 text-center font-black text-2xl text-white/20 group-hover:text-white/40 transition-colors">
                #{rank}
              </div>

              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-md">
                <img src={anime.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={anime.title} />
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="text-lg font-bold text-gray-200 truncate group-hover:text-accent-400 transition-colors">{anime.title}</h4>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{anime.genres?.slice(0, 2).join(', ')}</div>
              </div>

              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <StarRating rating={anime.rating || 0} size="w-4 h-4" />
                <button
                  onClick={() => onEditAnime(anime)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
};

export default RankingView;
