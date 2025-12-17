import React, { useState, useMemo } from 'react';
import { Anime, AnimeStatus, AudioType, ListDensityOption } from '../types';
import ProgressBar from './ProgressBar';
import StarRating from './StarRating';
import StreamingPlatformDisplay from './StreamingPlatformDisplay';
import { PencilIcon, TrashIcon, PlusIcon, MinusIcon, ChevronDownIcon, ChevronUpIcon, EyeIcon, BellAlertIcon } from './Icons';
import { calculateExpectedEpisodes } from '../utils/episodeUtils';
import { parseAndFormatToDDMMYYYY } from '../utils/dateUtils'; 

interface AnimeItemProps {
  anime: Anime;
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
  onDelete: (id: string) => void;
  onEdit: (anime: Anime) => void;
  onSetStatus: (id: string, status: AnimeStatus) => void;
  onSetRating: (id: string, rating: number) => void;
  listDensity: ListDensityOption;
}

const getAudioTypeStyle = (audioType?: AudioType): string => {
  if (!audioType || audioType === AudioType.UNKNOWN) return 'hidden';
  switch (audioType) {
    case AudioType.DUBBED: return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case AudioType.SUBTITLED: return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    case AudioType.BOTH: return 'bg-teal-500/20 text-teal-300 border border-teal-500/30';
    case AudioType.ORIGINAL_AUDIO: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    default: return 'hidden';
  }
};

const AnimeItem: React.FC<AnimeItemProps> = ({ anime, onUpdateEpisode, onDelete, onEdit, onSetStatus, onSetRating, listDensity }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  // Animation constants for hover effects handled via CSS classes
  
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = anime.currentEpisode + 1;
    if (anime.totalEpisodes === undefined || newCount <= anime.totalEpisodes) {
      onUpdateEpisode(anime.id, newCount);
    } else if (newCount > anime.totalEpisodes) { 
        onUpdateEpisode(anime.id, anime.totalEpisodes);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateEpisode(anime.id, Math.max(0, anime.currentEpisode - 1));
  };
  
  const getStatusColor = (status: AnimeStatus) => {
    switch (status) {
      case AnimeStatus.WATCHING: return 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
      case AnimeStatus.COMPLETED: return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case AnimeStatus.PLANNED: return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case AnimeStatus.ON_HOLD: return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
      case AnimeStatus.DROPPED: return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const isOverdue = useMemo(() => {
    if (anime.status !== AnimeStatus.WATCHING) return false;
    const expectedEpisodes = calculateExpectedEpisodes(anime, new Date());
    return expectedEpisodes !== null && anime.currentEpisode < expectedEpisodes;
  }, [anime]);

  const { 
    paddingClass, 
    imageContainerWidthClass, 
    titleClass, 
    textSizeClass 
  } = useMemo(() => {
    switch (listDensity) {
      case 'compact':
        return { 
          paddingClass: 'p-3', 
          imageContainerWidthClass: 'w-24 md:w-28', 
          titleClass: 'text-base', 
          textSizeClass: 'text-xs' 
        };
      case 'spaced':
        return { 
          paddingClass: 'p-6 md:p-8', 
          imageContainerWidthClass: 'w-32 md:w-56',
          titleClass: 'text-2xl', 
          textSizeClass: 'text-base' 
        };
      case 'normal':
      default:
        return { 
          paddingClass: 'p-4 md:p-5', 
          imageContainerWidthClass: 'w-28 md:w-40',
          titleClass: 'text-lg', 
          textSizeClass: 'text-sm' 
        };
    }
  }, [listDensity]);

  return (
    <div 
      className="group relative bg-surface-primary rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-accent-glow border border-border-primary hover:border-accent-border flex flex-row h-full min-h-[160px]"
    >
        {/* Image Section */}
        <div className={`relative shrink-0 ${imageContainerWidthClass} overflow-hidden`}>
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/300/400`} 
            alt={anime.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className={`flex-grow flex flex-col ${paddingClass} relative`}>
            
            {/* Header: Title & Badges */}
            <div className="flex justify-between items-start gap-3 mb-2">
                <div className="min-w-0">
                    <h3 className={`${titleClass} font-bold text-gray-100 group-hover:text-accent-400 transition-colors line-clamp-2 leading-tight`} title={anime.title}>
                        {anime.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2 items-center">
                         <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md ${getStatusColor(anime.status)}`}>
                            {anime.status}
                        </span>
                        {anime.audioType && anime.audioType !== AudioType.UNKNOWN && (
                             <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${getAudioTypeStyle(anime.audioType)}`}>
                                {anime.audioType}
                            </span>
                        )}
                         {isOverdue && (
                            <span 
                                className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1"
                                title="Atrasado"
                            >
                                <BellAlertIcon className="w-3 h-3" />
                                <span>ATRASADO</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Episode Controls */}
            <div className={`flex items-center gap-3 my-3 text-gray-300 ${textSizeClass}`}>
              <div className="flex items-center bg-bg-secondary/50 rounded-lg p-1 border border-white/5">
                  <button 
                    onClick={handleDecrement} 
                    className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30" 
                    disabled={anime.currentEpisode <= 0}
                  >
                    <MinusIcon className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <span className={`mx-3 font-mono font-medium ${textSizeClass} text-white`}>
                    {anime.currentEpisode}
                    <span className="text-gray-500"> / {anime.totalEpisodes || '?'}</span>
                  </span>
                  <button 
                    onClick={handleIncrement} 
                    className="p-1.5 rounded-md hover:bg-accent-600 hover:text-white text-accent-400 transition-all disabled:opacity-30 disabled:hover:bg-transparent" 
                    disabled={anime.totalEpisodes !== undefined && anime.currentEpisode >= anime.totalEpisodes}
                  >
                    <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
                  </button>
              </div>
            </div>

            {/* Progress Bar */}
            {(anime.totalEpisodes !== undefined && anime.totalEpisodes > 0) && (
              <div className="mb-3 w-full max-w-[80%]">
                 <ProgressBar current={anime.currentEpisode} total={anime.totalEpisodes} barHeight="h-1.5" showText={false} />
              </div>
            )}
            
            {/* Quick Rating for Completed */}
             {anime.status === AnimeStatus.COMPLETED && (
                <div className="mb-2">
                    <StarRating 
                        rating={anime.rating || 0} 
                        onSetRating={(newRating) => onSetRating(anime.id, newRating)}
                        size="w-4 h-4"
                    />
                </div>
            )}
            
            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <button 
                    onClick={() => setDetailsExpanded(!detailsExpanded)} 
                    className={`flex items-center gap-1 ${textSizeClass} font-medium text-gray-400 hover:text-white transition-colors`}
                >
                    {detailsExpanded ? 'Menos' : 'Detalhes'}
                    {detailsExpanded ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={() => onEdit(anime)} 
                        className="p-2 text-gray-400 hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-all"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(anime.id)} 
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Expanded Details Overlay */}
            {detailsExpanded && (
                <div className="absolute inset-0 bg-surface-primary/95 backdrop-blur-xl z-20 p-4 flex flex-col overflow-y-auto animate-fade-in border border-border-primary rounded-2xl">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                        <h4 className="font-bold text-gray-200">Detalhes</h4>
                        <button onClick={() => setDetailsExpanded(false)} className="text-gray-400 hover:text-white">
                            <ChevronUpIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    
                    <div className="space-y-4 text-sm text-gray-300">
                         {anime.streamingPlatforms && anime.streamingPlatforms.length > 0 && (
                             <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-1">Onde Assistir</span>
                                <div className="flex flex-wrap gap-2">
                                     <StreamingPlatformDisplay platforms={anime.streamingPlatforms} maxVisible={10} />
                                </div>
                             </div>
                         )}

                         <div className="grid grid-cols-2 gap-4">
                            {anime.nextAiringDate && (
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-1">Próximo Ep.</span>
                                    <span className="text-white">{parseAndFormatToDDMMYYYY(anime.nextAiringDate)}</span>
                                </div>
                            )}
                             {anime.airingStartDate && (
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-1">Estreia</span>
                                    <span className="text-white">{parseAndFormatToDDMMYYYY(anime.airingStartDate)}</span>
                                </div>
                            )}
                         </div>

                        {anime.genres && anime.genres.length > 0 && (
                            <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-1">Gêneros</span>
                                <div className="flex flex-wrap gap-1">
                                    {anime.genres.map(g => (
                                        <span key={g} className="text-xs px-2 py-1 bg-white/5 rounded-md border border-white/5">{g}</span>
                                    ))}
                                </div>
                             </div>
                        )}

                        <div>
                             <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-1">Status</span>
                             <select 
                                value={anime.status} 
                                onChange={(e) => onSetStatus(anime.id, e.target.value as AnimeStatus)}
                                className="w-full bg-bg-primary/50 text-white border border-white/10 rounded-md p-2 text-sm focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none"
                            >
                                {Object.values(AnimeStatus).map(s => <option key={s} value={s} className="bg-bg-primary text-gray-200">{s}</option>)}
                            </select>
                        </div>

                         {anime.notes && (
                            <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-1">Notas</span>
                                <p className="bg-black/20 p-2 rounded-md italic text-gray-400 text-xs">{anime.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default AnimeItem;
