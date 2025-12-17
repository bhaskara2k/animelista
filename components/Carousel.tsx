
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AniListMedia, AniListPageInfo } from '../types';
import AnimeCardDiscover from './AnimeCardDiscover';
import SkeletonCard from './SkeletonCard';
import { ChevronLeftIcon, ChevronRightIcon, FireIcon, SparklesIcon, TrendingUpIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface CarouselProps {
  title: string;
  animes: AniListMedia[];
  pageInfo: AniListPageInfo;
  isLoading: boolean;
  onLoadMore: () => void;
  onAddAnime: (anime: AniListMedia) => void;
  onShowDetails: (anime: AniListMedia) => void;
  error?: string | null;
}

const Carousel: React.FC<CarouselProps> = ({
  title,
  animes,
  pageInfo,
  isLoading,
  onLoadMore,
  onAddAnime,
  onShowDetails,
  error,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);

      if (scrollWidth - scrollLeft - clientWidth < 300 && pageInfo.hasNextPage && !isLoading) {
        onLoadMore();
      }
    }
  }, [isLoading, onLoadMore, pageInfo.hasNextPage]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    handleScroll();
  }, [animes, isLoading, handleScroll]);


  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Determine icon based on title
  const getCarouselIcon = () => {
    if (title.includes('Alta') || title.includes('Trending')) {
      return <SparklesIcon className="w-6 h-6" />;
    }
    if (title.includes('Populares')) {
      return <SparklesIcon className="w-6 h-6" />;
    }
    if (title.includes('Próxima')) {
      return <SparklesIcon className="w-6 h-6" />;
    }
    return <SparklesIcon className="w-6 h-6" />;
  };

  const arrowButtonClass = "absolute top-1/2 -translate-y-1/2 z-20 p-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white rounded-full transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed shadow-xl border border-white/10 hover:scale-110";

  if (error && animes.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            {getCarouselIcon()}
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-center backdrop-blur-sm">
          <p className="font-medium mb-3">{error}</p>
          <button
            onClick={() => onLoadMore()}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Skeleton loading state
  if (isLoading && animes.length === 0 && !error) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/5 rounded-lg animate-pulse">
            {getCarouselIcon()}
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex space-x-4 overflow-x-hidden pb-4">
          {[...Array(5)].map((_, index) => (
            <div key={`skeleton-${title}-${index}`} className="flex-shrink-0" >
              <SkeletonCard cardType="carousel" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (animes.length === 0 && !isLoading && !error) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/5 rounded-lg">
            {getCarouselIcon()}
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="text-center py-12 bg-surface-primary/50 rounded-xl border border-white/10">
          <p className="text-white opacity-70">Nenhum anime para exibir nesta categoria no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 relative group/carousel">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-accent-500 to-purple-600 rounded-lg shadow-lg">
            {getCarouselIcon()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-xs text-white opacity-60 uppercase tracking-wider">
              {animes.length} {animes.length === 1 ? 'Título' : 'Títulos'}
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        {pageInfo.hasNextPage && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <SparklesIcon className="w-4 h-4 text-accent-400" />
            <span className="text-sm text-white font-medium">Mais disponíveis</span>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className={`${arrowButtonClass} left-2 sm:left-4`}
          aria-label={`Rolar ${title} para esquerda`}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {animes.map((anime, index) => (
          <div
            key={`${title}-${anime.id}`}
            className="flex-shrink-0 animate-fade-in-up"
            style={{
              scrollSnapAlign: 'start',
              animationDelay: `${index * 50}ms`
            }}
          >
            <AnimeCardDiscover
              anime={anime}
              onAddAnime={onAddAnime}
              onShowDetails={onShowDetails}
              cardType="carousel"
            />
          </div>
        ))}

        {/* Loading More Indicator */}
        {isLoading && pageInfo.hasNextPage && (
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-64 h-96 bg-surface-primary/50 backdrop-blur-md rounded-xl border border-white/10">
            <div className="relative">
              <LoadingSpinner className="w-10 h-10 text-accent-400" />
              <div className="absolute inset-0 blur-xl bg-accent-500/30 animate-pulse"></div>
            </div>
            <p className="text-white opacity-70 mt-4 text-sm font-medium">Carregando mais...</p>
          </div>
        )}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className={`${arrowButtonClass} right-2 sm:right-4`}
          aria-label={`Rolar ${title} para direita`}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}

      {/* Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default Carousel;
