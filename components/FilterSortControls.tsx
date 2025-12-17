import React, { useState } from 'react';
import { AnimeStatus, SortOption, AudioType } from '../types';
import { AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';
import { MaterialSymbol } from './Icons';

interface FilterSortControlsProps {
  filterStatus: AnimeStatus | 'ALL';
  onFilterStatusChange: (status: AnimeStatus | 'ALL') => void;

  availablePlatforms: string[];
  filterPlatform: string;
  onFilterPlatformChange: (platform: string) => void;

  filterMinRating: number;
  onFilterMinRatingChange: (rating: number) => void;

  filterAudioType: AudioType | 'ALL';
  onFilterAudioTypeChange: (type: AudioType | 'ALL') => void;

  filterNoSpecificAiring: boolean;
  onFilterNoSpecificAiringChange: (checked: boolean) => void;

  sortOption: SortOption;
  onSortOptionChange: (option: SortOption) => void;

  onToggleAdvancedFilters: () => void;
  showAdvancedFilters: boolean;
}

const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  filterStatus, onFilterStatusChange,
  availablePlatforms, filterPlatform, onFilterPlatformChange,
  filterMinRating, onFilterMinRatingChange,
  filterAudioType, onFilterAudioTypeChange,
  filterNoSpecificAiring, onFilterNoSpecificAiringChange,
  sortOption, onSortOptionChange,
  onToggleAdvancedFilters, showAdvancedFilters
}) => {

  const hasActiveFilters = filterPlatform || filterMinRating > 0 || filterAudioType !== 'ALL' || filterNoSpecificAiring;

  return (
    <div className="mb-6 relative z-30">
      <button
        onClick={onToggleAdvancedFilters}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all w-full md:w-auto justify-between md:justify-start ${showAdvancedFilters || hasActiveFilters
          ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
          }`}
      >
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span className="font-semibold">Filtros & Ordenação</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-accent-600 text-[10px] font-bold">
              !
            </span>
          )}
        </div>
        {showAdvancedFilters ? <ChevronUpIcon className="w-4 h-4 opacity-70" /> : <ChevronDownIcon className="w-4 h-4 opacity-70" />}
      </button>

      {showAdvancedFilters && (
        <div className="absolute top-full left-0 right-0 mt-3 p-6 glass-panel rounded-2xl animate-fade-in-up border border-white/10 shadow-2xl backdrop-blur-xl z-30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Platform Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MaterialSymbol iconName="live_tv" className="text-accent-400 w-4 h-4" /> Plataforma
              </label>
              <div className="relative">
                <select
                  value={filterPlatform}
                  onChange={(e) => onFilterPlatformChange(e.target.value)}
                  className="w-full appearance-none bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all cursor-pointer hover:bg-black/30 font-medium"
                >
                  <option value="">Todas as Plataformas</option>
                  {availablePlatforms.map(platform => (
                    <option key={platform} value={platform.toLowerCase()}>{platform}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-50 pointer-events-none" />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MaterialSymbol iconName="star" className="text-amber-400 w-4 h-4" /> Nota Mínima
              </label>
              <div className="relative">
                <select
                  value={filterMinRating}
                  onChange={(e) => onFilterMinRatingChange(parseInt(e.target.value, 10))}
                  className="w-full appearance-none bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all cursor-pointer hover:bg-black/30 font-medium"
                >
                  <option value="0">Qualquer Nota</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}+ Estrelas</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-50 pointer-events-none" />
              </div>
            </div>

            {/* Audio Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MaterialSymbol iconName="headphones" className="text-purple-400 w-4 h-4" /> Áudio
              </label>
              <div className="relative">
                <select
                  value={filterAudioType}
                  onChange={(e) => onFilterAudioTypeChange(e.target.value as AudioType | 'ALL')}
                  className="w-full appearance-none bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all cursor-pointer hover:bg-black/30 font-medium"
                >
                  <option value="ALL">Todos os Tipos</option>
                  {Object.values(AudioType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-50 pointer-events-none" />
              </div>
            </div>

            {/* Sort Option */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MaterialSymbol iconName="sort" className="text-emerald-400 w-4 h-4" /> Ordenação
              </label>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
                  className="w-full appearance-none bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all cursor-pointer hover:bg-black/30 font-medium"
                >
                  <option value="default">Padrão</option>
                  <option value="title-asc">A-Z</option>
                  <option value="title-desc">Z-A</option>
                  <option value="rating-desc">Melhores Avaliados</option>
                  <option value="rating-asc">Piores Avaliados</option>
                  <option value="nextAiring-asc">Próximos Lançamentos</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-50 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Toggle Filters Footer */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4">
            <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filterNoSpecificAiring}
                  onChange={(e) => onFilterNoSpecificAiringChange(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-10 h-6 bg-black/40 rounded-full peer-checked:bg-accent-500 transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white select-none">Mostrar animes sem data definida</span>
            </label>
          </div>

        </div>
      )}
    </div>
  );
};

export default FilterSortControls;
