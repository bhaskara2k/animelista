
import React, { useState, useEffect } from 'react';
import { DiscoverFilters, AniListMediaFormat, ALL_ANILIST_GENRES, ALL_ANILIST_FORMATS, ALL_ANILIST_SEASONS, AniListSeason } from '../types';
import { AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from './Icons';
import { translateGenre } from '../utils/translationUtils';

interface DiscoverFiltersPanelProps {
  initialFilters: DiscoverFilters;
  onApplyFilters: (filters: DiscoverFilters) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const inputClass = "w-full p-2.5 bg-surface-secondary border border-border-primary rounded-md focus:ring-2 focus:ring-accent-ring focus:border-accent-border outline-none transition-colors placeholder-text-tertiary text-text-primary text-sm";
const labelClass = "block text-sm font-medium text-text-secondary mb-1.5";
const buttonClass = "px-4 py-2 rounded-md text-sm font-medium transition-colors";

const DiscoverFiltersPanel: React.FC<DiscoverFiltersPanelProps> = ({
  initialFilters,
  onApplyFilters,
  isVisible,
  onToggleVisibility
}) => {
  const [filters, setFilters] = useState<DiscoverFilters>(initialFilters);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = currentYear + 2; y >= 1950; y--) { // Go back to 1950, and forward 2 years
      years.push(y);
    }
    setAvailableYears(years);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "season") {
        setFilters(prev => ({ ...prev, [name]: value ? (value as AniListSeason) : undefined }));
    } else { // For year and minScore
        setFilters(prev => ({ 
            ...prev, 
            [name]: value && value.trim() !== '' ? parseInt(value, 10) : undefined 
        }));
    }
  };
  
  const handleMultiSelectChange = (name: 'genres' | 'format', value: string) => {
    setFilters(prev => {
      const currentSelection = prev[name] || [];
      const newSelection = currentSelection.includes(value as never)
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value as never];
      return { ...prev, [name]: newSelection.length > 0 ? newSelection : undefined };
    });
  };

  const handleResetFilters = () => {
    // Reset panel-specific filters, preserving the searchTerm from initialFilters (typically from DiscoverView's main search).
    const resetPanelFilters: DiscoverFilters = { 
        searchTerm: initialFilters.searchTerm, 
        genres: undefined,
        year: undefined,
        format: undefined,
        minScore: undefined,
        season: undefined
    }; 
    setFilters(resetPanelFilters); // Update panel's local state
    onApplyFilters(resetPanelFilters); // Trigger fetch with these cleared panel filters
  };
  
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onApplyFilters(filters);
  };
  
  // Removed debounced useEffect for auto-applying filters. Application is now explicit.

  return (
    <div className="mb-6 bg-surface-primary rounded-lg shadow-custom-md">
      <button
        onClick={onToggleVisibility}
        className="w-full flex justify-between items-center p-3 bg-surface-secondary hover:bg-surface-hover rounded-t-lg text-accent font-semibold transition-colors"
        aria-expanded={isVisible}
        aria-controls="discover-filters-content"
      >
        <span>Filtros Avançados</span>
        {isVisible ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>

      {isVisible && (
        <form onSubmit={handleSubmit} id="discover-filters-content" className="p-4 border-t border-border-primary animate-fade-in space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div>
              <label htmlFor="year" className={labelClass}>Ano de Lançamento</label>
              <select name="year" id="year" value={filters.year || ''} onChange={handleInputChange} className={inputClass}>
                <option value="">Todos os Anos</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Season Filter */}
            <div>
              <label htmlFor="season" className={labelClass}>Temporada</label>
              <select name="season" id="season" value={filters.season || ''} onChange={handleInputChange} className={inputClass}>
                <option value="">Todas as Temporadas</option>
                {ALL_ANILIST_SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Min Score Filter */}
            <div>
              <label htmlFor="minScore" className={labelClass}>Nota Mínima (0-100)</label>
              <input type="number" name="minScore" id="minScore" value={filters.minScore || ''} onChange={handleInputChange} className={inputClass} placeholder="Ex: 75" min="0" max="100" />
            </div>
            
            {/* Format Filter - Checkboxes */}
            <div className="md:col-span-1">
              <label className={labelClass}>Formato</label>
              <div className="grid grid-cols-2 gap-2 p-2 bg-bg-tertiary/30 rounded-md max-h-32 overflow-y-auto">
                {ALL_ANILIST_FORMATS.map(formatOpt => (
                  <label key={formatOpt.value} className="flex items-center space-x-2 p-1.5 hover:bg-surface-hover rounded transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="format"
                      value={formatOpt.value}
                      checked={filters.format?.includes(formatOpt.value) || false}
                      onChange={() => handleMultiSelectChange('format', formatOpt.value)}
                      className="form-checkbox h-4 w-4 text-accent bg-surface-secondary border-border-secondary rounded focus:ring-accent-ring focus:ring-offset-surface-primary"
                    />
                    <span className="text-xs text-text-primary">{formatOpt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Genre Filter - Checkboxes */}
          <div>
            <label className={labelClass}>Gêneros</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2 bg-bg-tertiary/30 rounded-md max-h-48 overflow-y-auto">
              {ALL_ANILIST_GENRES.map(genre => (
                <label key={genre} className="flex items-center space-x-2 p-1.5 hover:bg-surface-hover rounded transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="genres"
                    value={genre} // Value sent to API is English
                    checked={filters.genres?.includes(genre) || false}
                    onChange={() => handleMultiSelectChange('genres', genre)}
                    className="form-checkbox h-4 w-4 text-accent bg-surface-secondary border-border-secondary rounded focus:ring-accent-ring focus:ring-offset-surface-primary"
                  />
                  <span className="text-xs text-text-primary">{translateGenre(genre)}</span> {/* Display translated genre */}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className={`${buttonClass} bg-bg-tertiary hover:bg-surface-hover text-text-secondary flex items-center justify-center space-x-1.5`}
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Limpar Filtros do Painel</span>
            </button>
            <button 
              type="submit" 
              className={`${buttonClass} bg-accent-cta hover:bg-accent-cta-hover text-white flex items-center justify-center space-x-1.5`}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              <span>Aplicar Filtros</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DiscoverFiltersPanel;
