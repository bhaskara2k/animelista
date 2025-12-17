
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Anime } from '../types';
import { PlusIcon } from './Icons';
import ProgressBar from './ProgressBar';

interface HeaderBannerProps {
  watchingAnimes: Anime[];
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
}

const HeaderBanner: React.FC<HeaderBannerProps> = ({ watchingAnimes, onUpdateEpisode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const animesToDisplay = useMemo(() =>
    watchingAnimes.filter(a => a.bannerImage || a.imageUrl),
    [watchingAnimes]
  );

  const handleNext = useCallback(() => {
    if (animesToDisplay.length > 0) {
      setCurrentIndex(prevIndex => (prevIndex + 1) % animesToDisplay.length);
    }
  }, [animesToDisplay.length]);

  useEffect(() => {
    if (animesToDisplay.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 8000); // Change banner every 8 seconds

    return () => clearInterval(timer);
  }, [animesToDisplay.length, handleNext]);

  useEffect(() => {
    // Reset index if the list changes to avoid out-of-bounds
    if (currentIndex >= animesToDisplay.length && animesToDisplay.length > 0) {
      setCurrentIndex(0);
    }
  }, [animesToDisplay, currentIndex]);

  if (animesToDisplay.length === 0) {
    return null;
  }

  const currentAnime = animesToDisplay[currentIndex];

  const handleManualNav = (index: number) => {
    setCurrentIndex(index);
  };

  const handleIncrementEpisode = () => {
    const newCount = currentAnime.currentEpisode + 1;
    if (currentAnime.totalEpisodes === undefined || newCount <= currentAnime.totalEpisodes) {
      onUpdateEpisode(currentAnime.id, newCount);
    }
  };

  return (
    <div className="relative w-full h-64 md:h-80 bg-bg-secondary overflow-hidden shadow-lg">
      {animesToDisplay.map((anime, index) => (
        <div
          key={anime.id}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent z-[2]" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/40 to-transparent z-[2]" />

          {/* Texture Overlay to smooth out low-res artifacts */}
          <div
            className="absolute inset-0 z-[2] opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '3px 3px'
            }}
          />

          <img
            src={anime.bannerImage || anime.imageUrl}
            alt={`Banner for ${anime.title}`}
            className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear saturate-125 contrast-110 ${index === currentIndex ? 'scale-110' : 'scale-100'
              }`}
            style={{ objectPosition: 'center 20%' }}
            onError={(e) => {
              e.currentTarget.src = anime.imageUrl || `https://picsum.photos/seed/${anime.id}/1920/1080`;
            }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-[1]"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-[2] text-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg mb-2">{currentAnime.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex-grow max-w-sm">
              {(currentAnime.totalEpisodes !== undefined && currentAnime.totalEpisodes > 0) && (
                <ProgressBar
                  current={currentAnime.currentEpisode}
                  total={currentAnime.totalEpisodes}
                  barHeight="h-1.5"
                  textClassName="text-white text-xs"
                />
              )}
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                Episódio {currentAnime.currentEpisode}{currentAnime.totalEpisodes ? ` / ${currentAnime.totalEpisodes}` : ''}
              </p>
            </div>
            <button
              onClick={handleIncrementEpisode}
              className="bg-white/90 text-slate-900 hover:bg-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 flex-shrink-0"
              disabled={currentAnime.totalEpisodes !== undefined && currentAnime.currentEpisode >= currentAnime.totalEpisodes}
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Episódio</span>
            </button>
          </div>

          {animesToDisplay.length > 1 && (
            <div className="absolute bottom-4 right-4 md:right-8 flex space-x-2">
              {animesToDisplay.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleManualNav(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  aria-label={`Ir para o banner de ${animesToDisplay[index].title}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBanner;
