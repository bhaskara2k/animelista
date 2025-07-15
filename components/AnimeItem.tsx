
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
  if (!audioType || audioType === AudioType.UNKNOWN) return '';
  // These specific Tailwind classes are fine as they are not theme-dependent in the same way as primary/accent.
  switch (audioType) {
    case AudioType.DUBBED: return 'bg-blue-500 text-blue-50';
    case AudioType.SUBTITLED: return 'bg-purple-500 text-purple-50';
    case AudioType.BOTH: return 'bg-teal-500 text-teal-50';
    case AudioType.ORIGINAL_AUDIO: return 'bg-gray-500 text-gray-50';
    default: return 'bg-gray-400 text-gray-800';
  }
};


const AnimeItem: React.FC<AnimeItemProps> = ({ anime, onUpdateEpisode, onDelete, onEdit, onSetStatus, onSetRating, listDensity }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const handleIncrement = () => {
    const newCount = anime.currentEpisode + 1;
    if (anime.totalEpisodes === undefined || newCount <= anime.totalEpisodes) {
      onUpdateEpisode(anime.id, newCount);
    } else if (newCount > anime.totalEpisodes) { 
        onUpdateEpisode(anime.id, anime.totalEpisodes);
    }
  };

  const handleDecrement = () => {
    onUpdateEpisode(anime.id, Math.max(0, anime.currentEpisode - 1));
  };
  
  const getStatusColor = (status: AnimeStatus) => {
    // These specific Tailwind classes are fine as they represent fixed status colors.
    switch (status) {
      case AnimeStatus.WATCHING: return 'bg-sky-500 text-sky-50';
      case AnimeStatus.COMPLETED: return 'bg-emerald-500 text-emerald-50';
      case AnimeStatus.PLANNED: return 'bg-amber-500 text-amber-50';
      case AnimeStatus.ON_HOLD: return 'bg-slate-500 text-slate-50';
      case AnimeStatus.DROPPED: return 'bg-red-500 text-red-50';
      default: return 'bg-gray-500 text-gray-50';
    }
  };

  const isOverdue = useMemo(() => {
    if (anime.status !== AnimeStatus.WATCHING) {
      return false;
    }
    const expectedEpisodes = calculateExpectedEpisodes(anime, new Date());
    return expectedEpisodes !== null && anime.currentEpisode < expectedEpisodes;
  }, [anime, anime.currentEpisode, anime.status, anime.airingStartDate, anime.airingDaysOfWeek]);

  const { 
    paddingClass, 
    imageContainerWidthClass, 
    imageWellHeightClass, 
    titleClass, 
    textSizeClass 
  } = useMemo(() => {
    switch (listDensity) {
      case 'compact':
        return { 
          paddingClass: 'p-3 md:p-4', 
          imageContainerWidthClass: 'md:w-32', 
          imageWellHeightClass: 'h-48', 
          titleClass: 'text-lg', 
          textSizeClass: 'text-xs' 
        };
      case 'spaced':
        return { 
          paddingClass: 'p-8', 
          imageContainerWidthClass: 'md:w-56',
          imageWellHeightClass: 'h-72', 
          titleClass: 'text-2xl', 
          textSizeClass: 'text-base' 
        };
      case 'normal':
      default:
        return { 
          paddingClass: 'p-6', 
          imageContainerWidthClass: 'md:w-48',
          imageWellHeightClass: 'h-60', 
          titleClass: 'text-xl', 
          textSizeClass: 'text-sm' 
        };
    }
  }, [listDensity]);

  return (
    <div className="bg-surface-primary rounded-xl shadow-custom-lg overflow-hidden transition-all duration-300 hover:shadow-accent-glow flex flex-col">
      <div className="md:flex md:flex-grow"> {/* Main flex row container */}
        {/* Image Well / Container */}
        <div className={`md:shrink-0 ${imageContainerWidthClass} md:flex md:flex-col md:self-stretch`}> 
          <img 
            className={`w-full ${imageWellHeightClass} md:h-full object-cover`} 
            src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/200/300`} 
            alt={`Capa de ${anime.title}`} 
            onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${anime.id}/200/300`)}
          />
        </div>
        <div className={`${paddingClass} flex-grow flex flex-col`}>
          <div>
            <div className="flex justify-between items-start mb-1 gap-2">
                <h3 className={`${titleClass} font-bold text-accent line-clamp-2 break-words min-w-0`} title={anime.title}>{anime.title}</h3>
                <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(anime.status)} whitespace-nowrap`}>
                        {anime.status}
                    </span>
                    {anime.audioType && anime.audioType !== AudioType.UNKNOWN && (
                         <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getAudioTypeStyle(anime.audioType)} whitespace-nowrap`}>
                            {anime.audioType}
                        </span>
                    )}
                    {isOverdue && (
                      <span 
                        className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-orange-500 text-white flex items-center whitespace-nowrap"
                        title="Você tem episódios pendentes para assistir."
                      >
                        <BellAlertIcon className="w-3 h-3 mr-1" opticalSize={16} />
                        Atrasado
                      </span>
                    )}
                </div>
            </div>


            <div className={`flex items-center space-x-3 my-2 text-text-primary ${textSizeClass}`}>
              <button 
                onClick={handleDecrement} 
                className="p-1.5 rounded-full hover:bg-surface-hover transition-colors disabled:opacity-50 flex items-center justify-center" 
                disabled={anime.currentEpisode <= 0} 
                aria-label="Diminuir episódio"
              >
                <MinusIcon className="w-5 h-5" opticalSize={20}/>
              </button>
              <span className={textSizeClass}>
                Ep. {anime.currentEpisode}
                {anime.totalEpisodes !== undefined && anime.totalEpisodes > 0 ? ` / ${anime.totalEpisodes}` : ''}
              </span>
              <button 
                onClick={handleIncrement} 
                className="p-1.5 rounded-full hover:bg-surface-hover transition-colors disabled:opacity-50 flex items-center justify-center" 
                disabled={anime.totalEpisodes !== undefined && anime.currentEpisode >= anime.totalEpisodes}
                aria-label="Aumentar episódio"
              >
                <PlusIcon className="w-5 h-5" opticalSize={20}/>
              </button>
            </div>
            {(anime.totalEpisodes !== undefined && anime.totalEpisodes > 0) && (
              <ProgressBar current={anime.currentEpisode} total={anime.totalEpisodes} textClassName={`text-text-primary ${textSizeClass === 'text-xs' ? 'text-[10px]' : textSizeClass }`} />
            )}
             {anime.status === AnimeStatus.COMPLETED && (
                <div className="mt-3">
                    <StarRating 
                        rating={anime.rating || 0} 
                        onSetRating={(newRating) => onSetRating(anime.id, newRating)}
                        size="w-4 h-4"
                    />
                </div>
            )}
            {anime.streamingPlatforms && anime.streamingPlatforms.length > 0 && (
              <div className="mt-3">
                <StreamingPlatformDisplay platforms={anime.streamingPlatforms} maxVisible={3} />
              </div>
            )}
          </div>

          <div className="mt-4">
            <button onClick={() => setDetailsExpanded(!detailsExpanded)} className={`${textSizeClass} text-accent hover:opacity-80 flex items-center`}>
              {detailsExpanded ? 'Menos Detalhes' : 'Mais Detalhes'}
              {detailsExpanded ? <ChevronUpIcon className="ml-1 w-4 h-4" opticalSize={20}/> : <ChevronDownIcon className="ml-1 w-4 h-4" opticalSize={20}/>}
            </button>
          </div>
          
          {detailsExpanded && (
            <div className={`mt-3 space-y-2 ${textSizeClass} text-text-secondary animate-fade-in`}>
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <strong>Gêneros:</strong>
                  {anime.genres.map(genre => (
                    <span key={genre} className="px-2 py-0.5 text-xs font-medium bg-[var(--accent-700)] text-[var(--accent-100)] rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
               {anime.audioType && anime.audioType !== AudioType.UNKNOWN && (
                <p><strong>Áudio:</strong> <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getAudioTypeStyle(anime.audioType)}`}>{anime.audioType}</span></p>
              )}
              {anime.streamingPlatforms && anime.streamingPlatforms.length > 0 && (
                 <div className="flex flex-wrap gap-1.5 items-center">
                   <strong>Onde Assistir:</strong>
                   <StreamingPlatformDisplay platforms={anime.streamingPlatforms} maxVisible={10} />
                 </div>
              )}
              {anime.nextAiringDate && <p><strong>Próximo Lançamento:</strong> {parseAndFormatToDDMMYYYY(anime.nextAiringDate)}</p>}
              {anime.airingStartDate && <p><strong>Início da Exibição Semanal:</strong> {parseAndFormatToDDMMYYYY(anime.airingStartDate)}</p>}
              {anime.notes && <p className="whitespace-pre-wrap"><strong>Notas:</strong> {anime.notes}</p>}
              <div className="mt-2">
                <label htmlFor={`status-${anime.id}`} className={`block text-xs font-medium text-text-secondary mb-1`}>Alterar Status:</label>
                <select 
                    id={`status-${anime.id}`}
                    value={anime.status} 
                    onChange={(e) => onSetStatus(anime.id, e.target.value as AnimeStatus)}
                    className={`w-full p-2 bg-surface-secondary border border-border-primary rounded-md ${textSizeClass} focus:ring-1 focus:ring-accent-ring focus:border-accent-border outline-none text-text-primary`}
                >
                    {Object.values(AnimeStatus).map(s => <option key={s} value={s} className="text-text-primary bg-surface-secondary">{s}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 flex items-center justify-end space-x-3">
            <button 
              onClick={() => onEdit(anime)} 
              className="p-2 text-text-secondary hover:text-accent transition-colors flex items-center justify-center" 
              aria-label="Editar anime"
            >
              <PencilIcon className="w-5 h-5" opticalSize={20}/>
            </button>
            <button 
              onClick={() => onDelete(anime.id)} 
              className="p-2 text-text-secondary hover:text-red-500 transition-colors flex items-center justify-center" 
              aria-label="Excluir anime"
            >
              <TrashIcon className="w-5 h-5" opticalSize={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeItem;
