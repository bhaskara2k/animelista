
import React from 'react';
import { AnimeStatus, SortOption, AudioType } from '../types';
import { AdjustmentsHorizontalIcon } from './Icons';

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

const inputClass = "w-full p-2.5 bg-surface-secondary border border-border-primary rounded-md focus:ring-2 focus:ring-accent-ring focus:border-accent-border outline-none transition-colors placeholder-text-tertiary text-text-primary text-sm";
const labelClass = "block text-xs font-medium text-text-secondary mb-1";

const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  filterStatus, onFilterStatusChange,
  availablePlatforms, filterPlatform, onFilterPlatformChange,
  filterMinRating, onFilterMinRatingChange,
  filterAudioType, onFilterAudioTypeChange,
  filterNoSpecificAiring, onFilterNoSpecificAiringChange,
  sortOption, onSortOptionChange,
  onToggleAdvancedFilters, showAdvancedFilters
}) => {
  return (
    <div className="p-4 bg-surface-primary rounded-lg shadow-custom-md mb-6">
      <button
        onClick={onToggleAdvancedFilters}
        className="w-full flex justify-between items-center p-3 bg-surface-secondary hover:bg-surface-hover rounded-md text-accent font-semibold transition-colors mb-4"
        aria-expanded={showAdvancedFilters}
        aria-controls="advanced-filters-content"
      >
        <span>Filtros Avançados e Ordenação</span>
        <AdjustmentsHorizontalIcon className="w-5 h-5" opticalSize={20} />
      </button>

      {showAdvancedFilters && (
        <div id="advanced-filters-content" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
          <div>
            <label htmlFor="filter-platform" className={labelClass}>Plataforma de Streaming</label>
            <select
              id="filter-platform"
              value={filterPlatform}
              onChange={(e) => onFilterPlatformChange(e.target.value)}
              className={inputClass}
            >
              <option value="" className="text-text-primary bg-surface-secondary">Todas as Plataformas</option>
              {availablePlatforms.map(platform => (
                <option key={platform} value={platform.toLowerCase()} className="text-text-primary bg-surface-secondary">{platform}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-min-rating" className={labelClass}>Nota Mínima (0-10)</label>
            <select
              id="filter-min-rating"
              value={filterMinRating}
              onChange={(e) => onFilterMinRatingChange(parseInt(e.target.value, 10))}
              className={inputClass}
            >
              <option value="0" className="text-text-primary bg-surface-secondary">Qualquer Nota</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
                <option key={r} value={r} className="text-text-primary bg-surface-secondary">{r}+</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filter-audio-type" className={labelClass}>Tipo de Áudio</label>
            <select
              id="filter-audio-type"
              value={filterAudioType}
              onChange={(e) => onFilterAudioTypeChange(e.target.value as AudioType | 'ALL')}
              className={inputClass}
            >
              <option value="ALL" className="text-text-primary bg-surface-secondary">Todos os Áudios</option>
              {Object.values(AudioType).map(type => (
                <option key={type} value={type} className="text-text-primary bg-surface-secondary">{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort-option" className={labelClass}>Ordenar Por</label>
            <select
              id="sort-option"
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
              className={inputClass}
            >
              <option value="default" className="text-text-primary bg-surface-secondary">Padrão (Adição)</option>
              <option value="title-asc" className="text-text-primary bg-surface-secondary">Título (A-Z)</option>
              <option value="title-desc" className="text-text-primary bg-surface-secondary">Título (Z-A)</option>
              <option value="rating-desc" className="text-text-primary bg-surface-secondary">Nota (Maior Primeiro)</option>
              <option value="rating-asc" className="text-text-primary bg-surface-secondary">Nota (Menor Primeiro)</option>
              <option value="nextAiring-asc" className="text-text-primary bg-surface-secondary">Próximo Lançamento (Mais Cedo)</option>
              <option value="nextAiring-desc" className="text-text-primary bg-surface-secondary">Próximo Lançamento (Mais Tarde)</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-end">
            <div className="w-full flex items-center p-3 bg-surface-secondary/50 border border-border-primary rounded-md h-full">
              <input
                type="checkbox"
                id="filter-no-specific-airing"
                checked={filterNoSpecificAiring}
                onChange={(e) => onFilterNoSpecificAiringChange(e.target.checked)}
                className="form-checkbox h-4 w-4 text-[var(--accent-500)] bg-surface-secondary border-border-secondary rounded focus:ring-accent-ring focus:ring-offset-surface-primary cursor-pointer"
              />
              <label htmlFor="filter-no-specific-airing" className="ml-2 text-sm text-text-primary cursor-pointer">
                Sem Lançamento Definido
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSortControls;
