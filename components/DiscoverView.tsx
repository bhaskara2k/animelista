
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AniListMedia, AniListPageInfo, DiscoverFilters, CarouselData, CarouselCategory, DiscoverSubView, ALL_ANILIST_GENRES, ALL_ANILIST_FORMATS, AniListMediaFormat, Recommendation, Anime, AnimeStatus } from '../types';
import { fetchAniListMedia, FetchAniListParams } from '../services/AniListService';
import { getRecommendations } from '../services/GeminiService';
import { getCurrentSeasonAndYear, getNextSeasonAndYear, translateAniListSeasonToPortuguese } from '../utils/seasonUtils';
import { translateGenre } from '../utils/translationUtils';
import AnimeCardDiscover from './AnimeCardDiscover';
import SkeletonCard from './SkeletonCard';
import Carousel from './Carousel';
import DiscoverFiltersPanel from './DiscoverFiltersPanel';
import AnimeDetailsModal from './AnimeDetailsModal';
import LoadingSpinner from './LoadingSpinner';
import { SearchIcon, PlusIcon, SparklesIcon } from './Icons';

interface DiscoverViewProps {
  onAddAnime: (anime: AniListMedia) => void; // This will open AnimeForm pre-filled
  animeList: Anime[];
}

const ITEMS_PER_CAROUSEL_PAGE = 15; // Number of items to fetch per "load more" in carousels
const ITEMS_PER_ALL_ANIME_PAGE = 20;


const DiscoverView: React.FC<DiscoverViewProps> = ({ onAddAnime, animeList }) => {
  const [activeSubView, setActiveSubView] = useState<DiscoverSubView>('carousels');

  const [carousels, setCarousels] = useState<CarouselData[]>(() => [
    { category: 'trending', title: "Em Alta Agora", items: [], pageInfo: { currentPage: 0, hasNextPage: true }, isLoading: false },
    { category: 'popularThisSeason', title: `Populares de ${translateAniListSeasonToPortuguese(getCurrentSeasonAndYear().season)} ${getCurrentSeasonAndYear().year}`, items: [], pageInfo: { currentPage: 0, hasNextPage: true }, isLoading: false },
    { category: 'upcomingNextSeason', title: `Próxima Temporada (${translateAniListSeasonToPortuguese(getNextSeasonAndYear().season)} ${getNextSeasonAndYear().year})`, items: [], pageInfo: { currentPage: 0, hasNextPage: true }, isLoading: false },
  ]);

  const [allAnimes, setAllAnimes] = useState<AniListMedia[]>([]);
  const [allAnimesPageInfo, setAllAnimesPageInfo] = useState<AniListPageInfo>({ currentPage: 0, hasNextPage: true, total: 0 });
  const [isAllAnimesLoading, setIsAllAnimesLoading] = useState(false);
  const [allAnimesError, setAllAnimesError] = useState<string | null>(null);

  const [discoverFilters, setDiscoverFilters] = useState<DiscoverFilters>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const [selectedAnimeForDetails, setSelectedAnimeForDetails] = useState<AniListMedia | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // State for AI Recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);

  const canGenerateRecs = useMemo(() => {
    const qualifiedAnimes = animeList.filter(a => a.status === AnimeStatus.COMPLETED && a.rating && a.rating >= 7);
    return qualifiedAnimes.length >= 3;
  }, [animeList]);


  const fetchCarouselData = useCallback(async (category: CarouselCategory, page: number = 1) => {
    setCarousels(prev => prev.map(c => c.category === category ? { ...c, isLoading: true, error: null } : c));

    let params: FetchAniListParams = { page, perPage: ITEMS_PER_CAROUSEL_PAGE };
    switch (category) {
      case 'trending':
        params.sort = ['TRENDING_DESC', 'POPULARITY_DESC'];
        break;
      case 'popularThisSeason':
        const currentSI = getCurrentSeasonAndYear();
        params.season = currentSI.season;
        params.seasonYear = currentSI.year;
        params.sort = ['POPULARITY_DESC'];
        params.status = 'RELEASING';
        break;
      case 'upcomingNextSeason':
        const nextSI = getNextSeasonAndYear();
        params.season = nextSI.season;
        params.seasonYear = nextSI.year;
        params.sort = ['POPULARITY_DESC'];
        params.status = 'NOT_YET_RELEASED';
        break;
    }

    try {
      const result = await fetchAniListMedia(params);
      setCarousels(prev => prev.map(c => {
        if (c.category === category) {
          return {
            ...c,
            items: page === 1 ? result.media : [...c.items, ...result.media],
            pageInfo: result.pageInfo,
            isLoading: false,
          };
        }
        return c;
      }));
    } catch (err: any) {
      console.error(`Error fetching ${category} animes:`, err);
      setCarousels(prev => prev.map(c => c.category === category ? { ...c, isLoading: false, error: err.message || "Falha ao carregar." } : c));
    }
  }, []);

  useEffect(() => {
    if (activeSubView === 'carousels') {
      carousels.forEach((carousel, index) => {
        if (carousel.items.length === 0 && !carousel.isLoading && !carousel.error) {
          // Stagger requests to be nice to the API
          setTimeout(() => {
            fetchCarouselData(carousel.category, 1);
          }, index * 250);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubView, fetchCarouselData]); // Intentionally omitting 'carousels'

  const handleLoadMoreCarousel = (category: CarouselCategory) => {
    const carousel = carousels.find(c => c.category === category);
    if (carousel && carousel.pageInfo.hasNextPage && !carousel.isLoading) {
      fetchCarouselData(category, (carousel.pageInfo.currentPage || 0) + 1);
    }
  };

  const fetchAllAnimes = useCallback(async (page: number = 1, filters: DiscoverFilters) => {
    setIsAllAnimesLoading(true);
    if (page === 1) setAllAnimesError(null); // Clear previous error on new search/filter

    const params: FetchAniListParams = {
      page,
      perPage: ITEMS_PER_ALL_ANIME_PAGE,
      searchTerm: filters.searchTerm,
      genres: filters.genres,
      season: filters.season, // Pass season filter
      seasonYear: filters.year,
      formats: filters.format,
      minScore: filters.minScore,
      sort: filters.searchTerm ? ['SEARCH_MATCH', 'POPULARITY_DESC'] : ['POPULARITY_DESC'],
    };

    try {
      const result = await fetchAniListMedia(params);
      setAllAnimes(prev => page === 1 ? result.media : [...prev, ...result.media]);
      setAllAnimesPageInfo(result.pageInfo);
    } catch (err: any) {
      console.error("Error fetching all animes:", err);
      setAllAnimesError(err.message || "Falha ao buscar animes.");
      if (page === 1) setAllAnimes([]); // Clear list on error for new search
    } finally {
      setIsAllAnimesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSubView === 'allAnimes') {
      // Fetch only if list is empty or filters changed substantially (e.g. search term)
      // This logic can be refined, but for now, fetch if switching to this view with potentially new filters.
      fetchAllAnimes(1, discoverFilters);
    }
  }, [activeSubView, discoverFilters, fetchAllAnimes]);


  const handleApplyFilters = (newFilters: DiscoverFilters) => {
    const updatedFilters = { ...discoverFilters, ...newFilters };
    if (newFilters.searchTerm === "" && discoverFilters.searchTerm) {
      updatedFilters.searchTerm = undefined;
    }
    setDiscoverFilters(updatedFilters);
    if (activeSubView === 'allAnimes') {
      fetchAllAnimes(1, updatedFilters);
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const newFilters = { ...discoverFilters, searchTerm: term || undefined }
    setDiscoverFilters(newFilters);
    if (activeSubView === 'allAnimes') {
      fetchAllAnimes(1, newFilters);
    }
  };


  const handleLoadMoreAllAnimes = () => {
    if (allAnimesPageInfo.hasNextPage && !isAllAnimesLoading) {
      fetchAllAnimes((allAnimesPageInfo.currentPage || 0) + 1, discoverFilters);
    }
  };

  const handleShowDetails = (anime: AniListMedia) => {
    setSelectedAnimeForDetails(anime);
    setIsDetailsModalOpen(true);
  };

  const handleGenerateRecommendations = async () => {
    setIsRecsLoading(true);
    setRecsError(null);
    setRecommendations([]);
    try {
      const recs = await getRecommendations(animeList);
      setRecommendations(recs);
    } catch (err: any) {
      setRecsError(err.message || "Um erro inesperado ocorreu.");
    } finally {
      setIsRecsLoading(false);
    }
  };

  const handleSearchRecommendation = (title: string) => {
    setActiveSubView('allAnimes');
    handleApplyFilters({ searchTerm: title });
  };


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Navigation Pills */}
      <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/5 overflow-x-auto custom-scrollbar sticky top-20 z-30 shadow-lg">
        {[
          { id: 'carousels', label: 'Destaques', icon: SparklesIcon },
          { id: 'allAnimes', label: 'Explorar Tudo', icon: SearchIcon },
        ].map((tab) => {
          const isActive = activeSubView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubView(tab.id as DiscoverSubView)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 relative whitespace-nowrap
                ${isActive
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce-subtle' : ''}`} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeSubView === 'carousels' && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Premium AI Recommendations Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-blue-900/30 p-8 rounded-2xl shadow-2xl border border-white/10">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift opacity-50"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <SparklesIcon className="w-8 h-8 text-white animate-pulse-subtle" />
              </div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-accent-300 to-purple-300 bg-clip-text text-transparent mb-3">
                Recomendações com IA
              </h2>

              <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-base leading-relaxed">
                Receba sugestões de animes personalizadas com base nos títulos que você completou e mais gostou.
              </p>

              <button
                onClick={handleGenerateRecommendations}
                disabled={isRecsLoading || !canGenerateRecs}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-accent-600 to-purple-600 hover:from-accent-500 hover:to-purple-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:from-gray-700 disabled:to-gray-600"
                title={!canGenerateRecs ? "Você precisa ter pelo menos 3 animes completos com nota 7 ou superior." : "Gerar recomendações"}
              >
                {isRecsLoading ? (
                  <>
                    <LoadingSpinner className="w-5 h-5" />
                    <span>Gerando Magia...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Gerar Recomendações</span>
                  </>
                )}
              </button>

              {!canGenerateRecs && !isRecsLoading && (
                <p className="text-xs text-gray-400 mt-3 bg-black/20 inline-block px-4 py-2 rounded-lg">
                  💡 Adicione mais animes completos com notas altas para habilitar
                </p>
              )}
            </div>

            {isRecsLoading && (
              <div className="flex justify-center items-center py-12 relative z-10">
                <div className="relative">
                  <LoadingSpinner className="w-12 h-12 text-accent-400" />
                  <div className="absolute inset-0 blur-xl bg-accent-500/30 animate-pulse"></div>
                </div>
              </div>
            )}

            {recsError && (
              <div className="relative z-10 text-center mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-red-300 text-sm font-medium">{recsError}</p>
              </div>
            )}

            {recommendations.length > 0 && !isRecsLoading && (
              <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.title}
                    className="group bg-surface-primary/80 backdrop-blur-md p-5 rounded-xl shadow-lg border border-white/10 hover:border-accent-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-500/20 flex flex-col"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <h3 className="font-bold text-xl text-white group-hover:text-accent-400 transition-colors flex-grow">{rec.title}</h3>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-grow">{rec.justification}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {rec.genres.map(genre => (
                        <span key={genre} className="px-3 py-1 text-xs font-semibold bg-white/5 text-accent-300 rounded-full border border-white/10">
                          {genre}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSearchRecommendation(rec.title)}
                      className="mt-auto w-full text-sm bg-accent-600 hover:bg-accent-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <SearchIcon className="w-4 h-4" />
                      Buscar e Adicionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Carousels Section */}
          <div className="space-y-8">
            {carousels.map(carousel => (
              <Carousel
                key={carousel.category}
                title={carousel.title}
                animes={carousel.items}
                pageInfo={carousel.pageInfo}
                isLoading={carousel.isLoading}
                error={carousel.error}
                onLoadMore={() => handleLoadMoreCarousel(carousel.category)}
                onAddAnime={onAddAnime}
                onShowDetails={handleShowDetails}
              />
            ))}
          </div>
        </div>
      )}

      {activeSubView === 'allAnimes' && (
        <div className="animate-fade-in-up space-y-6">
          {/* Premium Search Bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-accent-500/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar em todos os animes..."
                value={discoverFilters.searchTerm || ''}
                onChange={handleSearchTermChange}
                className="w-full p-5 pl-14 pr-6 bg-surface-primary border-2 border-white/10 rounded-2xl focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 outline-none transition-all placeholder-gray-500 text-white text-lg shadow-xl backdrop-blur-sm"
                aria-label="Buscar animes no AniList"
              />
              <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-accent-400 transition-colors pointer-events-none" />
            </div>
          </div>

          <DiscoverFiltersPanel
            initialFilters={discoverFilters}
            onApplyFilters={handleApplyFilters}
            isVisible={showFiltersPanel}
            onToggleVisibility={() => setShowFiltersPanel(!showFiltersPanel)}
          />

          {/* Loading Skeletons */}
          {isAllAnimesLoading && allAnimes.length === 0 && !allAnimesError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(ITEMS_PER_ALL_ANIME_PAGE)].map((_, index) => (
                <SkeletonCard key={`skeleton-all-${index}`} cardType="grid" />
              ))}
            </div>
          )}

          {/* Error State */}
          {allAnimesError && (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <p className="text-red-300 text-lg font-medium mb-4">{allAnimesError}</p>
              <button
                onClick={() => fetchAllAnimes(1, discoverFilters)}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isAllAnimesLoading && !allAnimesError && allAnimes.length === 0 && (
            <div className="text-center py-20 bg-surface-primary/50 rounded-2xl border border-white/5">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="w-12 h-12 text-gray-600" />
              </div>
              <p className="text-gray-300 text-2xl font-bold mb-2">
                {discoverFilters.searchTerm ? `Nenhum anime encontrado para "${discoverFilters.searchTerm}"` : 'Nenhum anime encontrado'}
              </p>
              <p className="text-gray-500">Tente ajustar seus filtros ou o termo de busca.</p>
            </div>
          )}

          {/* Results Grid */}
          {allAnimes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {allAnimes.map(anime => (
                <AnimeCardDiscover
                  key={anime.id}
                  anime={anime}
                  onAddAnime={onAddAnime}
                  onShowDetails={handleShowDetails}
                  cardType="grid"
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {allAnimesPageInfo.hasNextPage && !isAllAnimesLoading && allAnimes.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={handleLoadMoreAllAnimes}
                className="group bg-accent-600 hover:bg-accent-500 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                disabled={isAllAnimesLoading}
              >
                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Carregar Mais Animes
              </button>
            </div>
          )}

          {/* Loading Spinner for Pagination */}
          {isAllAnimesLoading && allAnimes.length > 0 && (
            <div className="flex justify-center items-center pt-8">
              <div className="relative">
                <LoadingSpinner className="w-10 h-10 text-accent-400" />
                <div className="absolute inset-0 blur-xl bg-accent-500/30 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        anime={selectedAnimeForDetails}
        onAddToList={onAddAnime}
      />
    </div>
  );
};

export default DiscoverView;
