
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AniListMedia, AniListPageInfo } from '../types';
import AnimeCardDiscover from './AnimeCardDiscover';
import SkeletonCard from './SkeletonCard'; // Import SkeletonCard
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
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
      setShowLeftArrow(scrollLeft > 5); // Add a small threshold
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // Add a small threshold

      // Load more when near the end
      if (scrollWidth - scrollLeft - clientWidth < 300 && pageInfo.hasNextPage && !isLoading) {
        onLoadMore();
      }
    }
  }, [isLoading, onLoadMore, pageInfo.hasNextPage]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check for arrows
      handleScroll(); 
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);
  
   useEffect(() => {
    // Re-check arrows when animes array changes (e.g., after loading more)
    // or when isLoading becomes false
    handleScroll();
  }, [animes, isLoading, handleScroll]);


  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; // Scroll by 80% of visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  const arrowButtonClass = "absolute top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-opacity duration-300 opacity-0 group-hover/carousel:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed";

  if (error && animes.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-accent mb-3">{title}</h2>
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-md text-red-400 text-center">
          <p>{error}</p>
          <button
            onClick={() => onLoadMore()}
            className="mt-3 px-4 py-1.5 bg-accent-cta hover:bg-accent-cta-hover text-white rounded-md text-sm transition-colors"
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
        <div className="mb-10">
            <h2 className="text-2xl font-semibold text-accent mb-3">{title}</h2>
            <div className="flex space-x-4 overflow-x-hidden pb-4"> {/* overflow-x-hidden for skeletons */}
              {[...Array(4)].map((_, index) => (
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
        <div className="mb-10">
            <h2 className="text-2xl font-semibold text-accent mb-3">{title}</h2>
            <p className="text-text-secondary text-center py-8">Nenhum anime para exibir nesta categoria no momento.</p>
        </div>
    );
  }

  return (
    <div className="mb-10 relative group/carousel">
      <h2 className="text-2xl font-semibold text-accent mb-3">{title}</h2>
      
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className={`${arrowButtonClass} left-2 sm:left-3`}
          aria-label={`Rolar ${title} para esquerda`}
          disabled={!showLeftArrow}
        >
          <ChevronLeftIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {animes.map(anime => (
          <div key={`${title}-${anime.id}`} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
            <AnimeCardDiscover
              anime={anime}
              onAddAnime={onAddAnime}
              onShowDetails={onShowDetails}
              cardType="carousel"
            />
          </div>
        ))}
        {isLoading && pageInfo.hasNextPage && ( // Spinner for loading more, not initial skeletons
            <div className="flex-shrink-0 flex items-center justify-center w-64 h-96 bg-surface-secondary rounded-md">
                <LoadingSpinner className="w-8 h-8 text-accent"/>
            </div>
        )}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className={`${arrowButtonClass} right-2 sm:right-3`}
          aria-label={`Rolar ${title} para direita`}
          disabled={!showRightArrow}
        >
          <ChevronRightIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      )}
    </div>
  );
};

export default Carousel;
