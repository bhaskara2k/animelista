
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AniListMedia, AniListPageInfo, DiscoverFilters, CarouselData, CarouselCategory, DiscoverSubView, ALL_ANILIST_GENRES, ALL_ANILIST_FORMATS, AniListMediaFormat, Recommendation, Anime, AnimeStatus } from '../types';
import { fetchAniListMedia, FetchAniListParams } from '../services/AniListService';
import { getRecommendations } from '../services/GeminiService';
import { getCurrentSeasonAndYear, getNextSeasonAndYear, translateAniListSeasonToPortuguese } from '../utils/seasonUtils';
import { translateGenre } from '../utils/translationUtils';
import AnimeCardDiscover from './AnimeCardDiscover';
import SkeletonCard from './SkeletonCard'; // Import SkeletonCard
import Carousel from './Carousel';
import DiscoverFiltersPanel from './DiscoverFiltersPanel';
import AnimeDetailsModal from './AnimeDetailsModal';
import LoadingSpinner from './LoadingSpinner';
import { SearchIcon, PlusIcon, SparklesIcon } from './Icons'; // Added SparklesIcon

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
  const [allAnimesPageInfo, setAllAnimesPageInfo] = useState<AniListPageInfo>({ currentPage: 0, hasNextPage: true, total:0 });
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
    const updatedFilters = { ...discoverFilters, ...newFilters};
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
    const newFilters = {...discoverFilters, searchTerm: term || undefined }
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
    } catch(err: any) {
      setRecsError(err.message || "Um erro inesperado ocorreu.");
    } finally {
      setIsRecsLoading(false);
    }
  };

  const handleSearchRecommendation = (title: string) => {
    setActiveSubView('allAnimes');
    handleApplyFilters({ searchTerm: title });
  };
  
  const subViewButtonClass = (view: DiscoverSubView) =>
    `px-4 py-2.5 rounded-t-md text-sm sm:text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring
     ${activeSubView === view 
        ? 'bg-surface-primary text-accent border-b-2 border-accent-border' 
        : 'bg-transparent text-text-secondary hover:text-accent hover:bg-surface-hover/50'
     }`;


  return (
    <div className="space-y-6">
      <div className="flex border-b border-border-primary mb-1">
        <button onClick={() => setActiveSubView('carousels')} className={subViewButtonClass('carousels')}>
          Destaques
        </button>
        <button onClick={() => setActiveSubView('allAnimes')} className={subViewButtonClass('allAnimes')}>
          Explorar Tudo
        </button>
      </div>

      {activeSubView === 'carousels' && (
        <div className="space-y-8 animate-fade-in">
          {/* AI Recommendations Section */}
          <div className="bg-gradient-to-br from-surface-primary to-bg-tertiary/30 p-5 rounded-xl shadow-custom-xl border border-accent-border/30">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-accent mb-2 flex items-center justify-center gap-2">
                <SparklesIcon className="w-6 h-6" /> Recomendações com IA
              </h2>
              <p className="text-text-secondary mb-5 max-w-2xl mx-auto text-sm">
                Receba sugestões de animes personalizadas com base nos títulos que você completou e mais gostou.
              </p>
              <button
                onClick={handleGenerateRecommendations}
                disabled={isRecsLoading || !canGenerateRecs}
                className="bg-accent-cta hover:bg-accent-cta-hover text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-md"
                title={!canGenerateRecs ? "Você precisa ter pelo menos 3 animes completos com nota 7 ou superior." : "Gerar recomendações"}
              >
                {isRecsLoading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner className="w-5 h-5" /> Gerando...
                  </span>
                ) : (
                   <span className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" /> Gerar Recomendações
                  </span>
                )}
              </button>
               {!canGenerateRecs && !isRecsLoading && <p className="text-xs text-text-tertiary mt-2">Adicione mais animes completos com notas altas para habilitar.</p>}
            </div>

            {isRecsLoading && (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner className="w-10 h-10 text-accent" />
                </div>
            )}
            {recsError && (
              <div className="text-center mt-4 p-3 bg-red-900/20 border border-red-700 rounded-md">
                <p className="text-red-400 text-sm">{recsError}</p>
              </div>
            )}
            {recommendations.length > 0 && !isRecsLoading && (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
                {recommendations.map((rec) => (
                  <div key={rec.title} className="bg-surface-secondary/80 p-4 rounded-lg shadow-sm border border-border-primary flex flex-col">
                    <h3 className="font-bold text-lg text-accent">{rec.title}</h3>
                    <p className="text-sm text-text-secondary my-2 flex-grow">{rec.justification}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                      {rec.genres.map(genre => (
                        <span key={genre} className="px-2 py-0.5 text-[10px] font-medium bg-bg-tertiary text-text-secondary rounded-full">{genre}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleSearchRecommendation(rec.title)}
                      className="mt-auto w-full text-sm bg-accent-cta/20 text-accent hover:bg-accent-cta/40 font-semibold py-2 px-3 rounded-md transition-colors"
                    >
                      Buscar e Adicionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Carousels Section */}
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
      )}

      {activeSubView === 'allAnimes' && (
        <div className="animate-fade-in">
          <div className="mb-5 relative">
            <input
              type="text"
              placeholder="Buscar em todos os animes..."
              value={discoverFilters.searchTerm || ''}
              onChange={handleSearchTermChange}
              className="w-full p-3.5 pl-12 bg-surface-primary border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-accent-ring focus:border-accent-border outline-none transition-colors placeholder-text-tertiary text-text-primary text-base shadow-sm"
              aria-label="Buscar animes no AniList"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-text-tertiary pointer-events-none" />
          </div>
        
          <DiscoverFiltersPanel
            initialFilters={discoverFilters}
            onApplyFilters={handleApplyFilters}
            isVisible={showFiltersPanel}
            onToggleVisibility={() => setShowFiltersPanel(!showFiltersPanel)}
          />

          {isAllAnimesLoading && allAnimes.length === 0 && !allAnimesError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(ITEMS_PER_ALL_ANIME_PAGE)].map((_, index) => (
                <SkeletonCard key={`skeleton-all-${index}`} cardType="grid" />
              ))}
            </div>
          )}
          {allAnimesError && (
            <div className="text-center py-10 px-4 bg-red-900/20 border border-red-700 rounded-md">
              <p className="text-red-400 text-lg">{allAnimesError}</p>
              <button
                onClick={() => fetchAllAnimes(1, discoverFilters)}
                className="mt-4 px-4 py-2 bg-accent-cta hover:bg-accent-cta-hover text-white rounded-md transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {!isAllAnimesLoading && !allAnimesError && allAnimes.length === 0 && (
            <div className="text-center py-16">
              <SparklesIcon className="w-20 h-20 mx-auto text-text-tertiary mb-4" opticalSize={60} />
              <p className="text-text-secondary text-xl">
                {discoverFilters.searchTerm ? `Nenhum anime encontrado para "${discoverFilters.searchTerm}".` : 'Nenhum anime encontrado com os filtros atuais.'}
              </p>
              <p className="text-text-tertiary">Tente ajustar seus filtros ou o termo de busca.</p>
            </div>
          )}

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

          {allAnimesPageInfo.hasNextPage && !isAllAnimesLoading && allAnimes.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={handleLoadMoreAllAnimes}
                className="bg-accent-cta hover:bg-accent-cta-hover text-white font-semibold py-3 px-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-all duration-150 ease-in-out"
                disabled={isAllAnimesLoading}
              >
                {isAllAnimesLoading ? 'Carregando...' : 'Carregar Mais Animes'}
              </button>
            </div>
          )}
          {isAllAnimesLoading && allAnimes.length > 0 && ( // Spinner for subsequent loads, not initial skeletons
            <div className="flex justify-center items-center pt-8">
              <LoadingSpinner className="w-10 h-10 text-accent" />
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
