
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

const inputClass = "w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 outline-none transition-all placeholder-gray-500 text-white text-sm backdrop-blur-sm hover:bg-black/30";
const labelClass = "block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider";
const buttonClass = "px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 transform hover:scale-[1.02]";

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
    for (let y = currentYear + 2; y >= 1950; y--) {
      years.push(y);
    }
    setAvailableYears(years);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "season") {
      setFilters(prev => ({ ...prev, [name]: value ? (value as AniListSeason) : undefined }));
    } else {
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
    const resetPanelFilters: DiscoverFilters = {
      searchTerm: initialFilters.searchTerm,
      genres: undefined,
      year: undefined,
      format: undefined,
      minScore: undefined,
      season: undefined
    };
    setFilters(resetPanelFilters);
    onApplyFilters(resetPanelFilters);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onApplyFilters(filters);
  };

  const activeFiltersCount = [
    filters.genres?.length,
    filters.format?.length,
    filters.year,
    filters.season,
    filters.minScore
  ].filter(Boolean).length;

  return (
    <div className="mb-6 bg-surface-primary/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 overflow-hidden">
      <button
        onClick={onToggleVisibility}
        className="group w-full flex justify-between items-center p-5 bg-gradient-to-r from-accent-600/20 to-purple-600/20 hover:from-accent-600/30 hover:to-purple-600/30 text-white font-bold transition-all duration-300"
        aria-expanded={isVisible}
        aria-controls="discover-filters-content"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </div>
          <span className="text-lg">Filtros Avançados</span>
          {activeFiltersCount > 0 && (
            <span className="px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full animate-pulse-subtle">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:block">
            {isVisible ? 'Ocultar' : 'Mostrar'}
          </span>
          {isVisible ?
            <ChevronUpIcon className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" /> :
            <ChevronDownIcon className="w-5 h-5 group-hover:translate-y-[2px] transition-transform" />
          }
        </div>
      </button>

      {isVisible && (
        <form onSubmit={handleSubmit} id="discover-filters-content" className="p-6 border-t border-white/10 animate-fade-in-up space-y-6">
          {/* Basic Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Year Filter */}
            <div className="space-y-2">
              <label htmlFor="year" className={labelClass}>
                📅 Ano de Lançamento
              </label>
              <select
                name="year"
                id="year"
                value={filters.year || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Todos os Anos</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Season Filter */}
            <div className="space-y-2">
              <label htmlFor="season" className={labelClass}>
                🌸 Temporada
              </label>
              <select
                name="season"
                id="season"
                value={filters.season || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Todas as Temporadas</option>
                {ALL_ANILIST_SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Min Score Filter */}
            <div className="space-y-2">
              <label htmlFor="minScore" className={labelClass}>
                ⭐ Nota Mínima
              </label>
              <input
                type="number"
                name="minScore"
                id="minScore"
                value={filters.minScore || ''}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Ex: 75"
                min="0"
                max="100"
              />
            </div>

            {/* Format Filter */}
            <div className="space-y-2">
              <label className={labelClass}>
                🎬 Formato
              </label>
              <div className="bg-black/20 border border-white/10 rounded-xl p-3 max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                {ALL_ANILIST_FORMATS.map(formatOpt => (
                  <label
                    key={formatOpt.value}
                    className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      name="format"
                      value={formatOpt.value}
                      checked={filters.format?.includes(formatOpt.value) || false}
                      onChange={() => handleMultiSelectChange('format', formatOpt.value)}
                      className="w-4 h-4 text-accent-500 bg-black/40 border-white/20 rounded focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{formatOpt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Genre Filter - Full Width */}
          <div className="space-y-3">
            <label className={labelClass}>
              🎭 Gêneros
            </label>
            <div className="bg-black/20 border border-white/10 rounded-xl p-4 max-h-64 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {ALL_ANILIST_GENRES.map(genre => (
                  <label
                    key={genre}
                    className="flex items-center space-x-2 p-2.5 hover:bg-white/5 rounded-lg transition-all cursor-pointer group border border-transparent hover:border-white/10"
                  >
                    <input
                      type="checkbox"
                      name="genres"
                      value={genre}
                      checked={filters.genres?.includes(genre) || false}
                      onChange={() => handleMultiSelectChange('genres', genre)}
                      className="w-4 h-4 text-accent-500 bg-black/40 border-white/20 rounded focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors font-medium">
                      {translateGenre(genre)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleResetFilters}
              className={`${buttonClass} bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-2 shadow-lg`}
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Limpar Filtros</span>
            </button>
            <button
              type="submit"
              className={`${buttonClass} bg-gradient-to-r from-accent-600 to-purple-600 hover:from-accent-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl`}
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
