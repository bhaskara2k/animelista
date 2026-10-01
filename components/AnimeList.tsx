import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Anime, AnimeStatus, ListDensityOption } from '../types';
import AnimeItem from './AnimeItem';
import { MaterialSymbol } from './Icons';

interface AnimeListProps {
  animeList: Anime[];
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
  onDelete: (id: string) => void;
  onEdit: (anime: Anime) => void;
  onSetStatus: (id: string, status: AnimeStatus) => void;
  onSetRating: (id: string, rating: number) => void;
  listDensity: ListDensityOption;
}

const INITIAL_BATCH = 24;
const BATCH_INCREMENT = 18;

const AnimeList: React.FC<AnimeListProps> = ({
  animeList,
  onUpdateEpisode,
  onDelete,
  onEdit,
  onSetStatus,
  onSetRating,
  listDensity
}) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset visibleCount when the list length changes (search or filter)
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH);
  }, [animeList.length]);

  // Infinite scroll observer to progressively render more items seamlessly
  useEffect(() => {
    if (visibleCount >= animeList.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, animeList.length));
        }
      },
      { rootMargin: '350px' }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [visibleCount, animeList.length]);

  // Calculate quick stats for the header
  const stats = useMemo(() => {
    const total = animeList.length;
    const watching = animeList.filter(a => a.status === AnimeStatus.WATCHING).length;
    return { total, watching };
  }, [animeList]);

  if (animeList.length === 0) {
    return (
      <div className="text-center py-20 px-8 glass-panel rounded-2xl flex flex-col items-center justify-center border border-white/5 mt-6">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-4 ring-white/10 animate-pulse">
          <MaterialSymbol iconName="movie_filter" className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Lista Vazia</h2>
        <p className="text-gray-400 max-w-md">
          Sua coleção está esperando por grandes histórias.
          Use o botão <strong className="text-accent-400">"Novo Anime"</strong> para começar sua jornada.
        </p>
      </div>
    );
  }

  const getGridGapClass = () => {
    switch (listDensity) {
      case 'compact': return 'gap-3';
      case 'normal': return 'gap-6';
      case 'spaced': return 'gap-8';
      default: return 'gap-6';
    }
  };

  const visibleAnimes = animeList.slice(0, visibleCount);

  return (
    <div className="space-y-6 pb-10">

      {/* Premium Header with Stats */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-accent-600">
              Minha Coleção
            </span>
          </h2>
          <p className="text-gray-400 text-sm font-medium flex items-center gap-3">
            <span>
              <strong className="text-white">{stats.total}</strong> títulos
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <strong className="text-white">{stats.watching}</strong> em andamento
            </span>
          </p>
        </div>

        {/* Quick Visual Divider/Decorator */}
        <div className="hidden md:block h-px flex-grow mx-8 bg-gradient-to-r from-white/10 to-transparent"></div>
      </div>

      {/* The Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ${getGridGapClass()}`}>
        {visibleAnimes.map((anime) => (
          <div key={anime.id}>
            <AnimeItem
              anime={anime}
              onUpdateEpisode={onUpdateEpisode}
              onDelete={onDelete}
              onEdit={onEdit}
              onSetStatus={onSetStatus}
              onSetRating={onSetRating}
              listDensity={listDensity}
            />
          </div>
        ))}
      </div>

      {/* Sentinel element to trigger loading the next batch */}
      {visibleCount < animeList.length && (
        <div ref={observerRef} className="py-6 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AnimeList;
