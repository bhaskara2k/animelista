
import React, { useState, useEffect, useCallback } from 'react';
import { Anime, AnimeStatus, AnimeFormData, StreamingPlatform, AniListMedia, AniListDate, AudioType } from '../types';
import { CheckIcon, XMarkIcon, SearchIcon } from './Icons';
import StarRating from './StarRating';
import { searchAniList } from '../services/AniListService';
import LoadingSpinner from './LoadingSpinner';
import { translateGenre, translateFormat } from '../utils/translationUtils';
import { parseAndFormatToYYYYMMDD } from '../utils/dateUtils';
import { prioritizeStreamingPlatforms } from '../utils/platformUtils';

interface AnimeFormProps {
  onSubmit: (animeData: Anime) => void;
  initialData?: Anime | null;
  onClose: () => void;
}

const daysOfWeekMap = [
  { label: 'Dom', value: 0 }, { label: 'Seg', value: 1 }, { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 }, { label: 'Qui', value: 4 }, { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 },
];

const platformColorMap: Record<string, { bgColor: string; textColor: string }> = {
  'crunchyroll': { bgColor: '#F47521', textColor: '#FFFFFF' },
  'netflix': { bgColor: '#E50914', textColor: '#FFFFFF' },
  'youcine': { bgColor: '#000000', textColor: '#FFFFFF' },
  'funimation': { bgColor: '#6A0DAD', textColor: '#FFFFFF' },
  'hidive': { bgColor: '#00A4D6', textColor: '#FFFFFF'},
  'amazon prime video': { bgColor: '#00A8E1', textColor: '#000000' },
  'disney+': { bgColor: '#01153D', textColor: '#FFFFFF' },
  // 'star+': { bgColor: '#E6007E', textColor: '#FFFFFF' }, // Removed
  'hulu': { bgColor: '#1CE783', textColor: '#000000'},
  'vrv': { bgColor: '#F47521', textColor: '#FFFFFF' }, 
  'official site': { bgColor: '#667EEA', textColor: '#FFFFFF' }, 
  'youtube': { bgColor: '#FF0000', textColor: '#FFFFFF' },
  // 'bilibili tv': { bgColor: '#00A1F1', textColor: '#FFFFFF'}, // Removed
  'animelab': { bgColor: '#F15A24', textColor: '#FFFFFF'},
};
const defaultPlatformColors = { bgColor: '#4A5568', textColor: '#FFFFFF' };

const inputClass = "w-full p-3 bg-surface-secondary border border-border-primary rounded-md focus:ring-2 focus:ring-accent-ring focus:border-accent-border outline-none transition-colors placeholder-text-tertiary text-text-primary";
const labelClass = "block text-sm font-medium text-text-secondary mb-1";
const checkboxLabelClass = "ml-2 text-sm text-text-primary cursor-pointer";
const checkboxContainerClass = "flex items-center p-2 bg-surface-secondary border border-border-primary rounded-md hover:bg-surface-hover transition-colors";

const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const formatAniListDateForInput = (date: AniListDate | undefined): string => {
  if (!date || !date.year || !date.month || !date.day) return '';
  const day = String(date.day).padStart(2, '0');
  const month = String(date.month).padStart(2, '0');
  return `${date.year}-${month}-${day}`;
};


const AnimeForm: React.FC<AnimeFormProps> = ({ onSubmit, initialData, onClose }) => {
  const [title, setTitle] = useState('');
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<AnimeStatus>(AnimeStatus.PLANNED);
  const [imageUrl, setImageUrl] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [nextAiringDate, setNextAiringDate] = useState('');
  const [airingDaysOfWeek, setAiringDaysOfWeek] = useState<number[]>([]);
  const [airingStartDate, setAiringStartDate] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [audioType, setAudioType] = useState<AudioType>(AudioType.UNKNOWN);

  const [aniListSearchTerm, setAniListSearchTerm] = useState('');
  const [aniListResults, setAniListResults] = useState<AniListMedia[]>([]);
  const [isAniListLoading, setIsAniListLoading] = useState(false);
  const [aniListError, setAniListError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const resetFormFields = (data?: Anime | null) => {
    setTitle(data?.title || '');
    setCurrentEpisode(data?.currentEpisode || 0);
    setTotalEpisodes(data?.totalEpisodes);
    setStatus(data?.status || AnimeStatus.PLANNED);
    setImageUrl(data?.imageUrl || '');
    setBannerImage(data?.bannerImage || '');
    setSelectedPlatforms(data?.streamingPlatforms?.map(p => p.name.toLowerCase()) || []);
    setNotes(data?.notes || '');
    setNextAiringDate(parseAndFormatToYYYYMMDD(data?.nextAiringDate));
    setAiringDaysOfWeek(data?.airingDaysOfWeek || []);
    setAiringStartDate(parseAndFormatToYYYYMMDD(data?.airingStartDate));
    setRating(data?.rating || 0);
    setSelectedGenres(data?.genres || []);
    setAudioType(data?.audioType || AudioType.UNKNOWN);

    setAniListSearchTerm('');
    setAniListResults([]);
    setIsAniListLoading(false);
    setAniListError(null);
  };
  
  useEffect(() => {
    resetFormFields(initialData);
  }, [initialData]);

  const handleToggleAiringDay = (dayValue: number) => {
    setAiringDaysOfWeek(prevDays =>
      prevDays.includes(dayValue) ? prevDays.filter(d => d !== dayValue) : [...prevDays, dayValue]
    );
  };

  const handlePlatformToggle = (platformKey: string) => {
    setSelectedPlatforms(prevSelected =>
      prevSelected.includes(platformKey) ? prevSelected.filter(p => p !== platformKey) : [...prevSelected, platformKey]
    );
  };

  const debouncedSearchAniList = useCallback((searchTerm: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(async () => {
      if (searchTerm.trim().length < 3) {
        setAniListResults([]);
        setAniListError(null);
        return;
      }
      setIsAniListLoading(true);
      setAniListError(null);
      try {
        const results = await searchAniList(searchTerm);
        setAniListResults(results);
      } catch (error) {
        console.error("AniList search error:", error);
        setAniListError("Falha ao buscar animes. Tente novamente.");
        setAniListResults([]);
      } finally {
        setIsAniListLoading(false);
      }
    }, 500); 
    setDebounceTimeout(newTimeout);
  }, [debounceTimeout]);

  const handleAniListSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setAniListSearchTerm(term);
    debouncedSearchAniList(term);
  };

  const handleSelectAniListAnime = (anime: AniListMedia) => {
    const currentUserSelectedPlatforms = [...selectedPlatforms]; 

    setTitle(anime.title.romaji || anime.title.english || anime.title.native || 'Título Desconhecido');
    setTotalEpisodes(anime.episodes || undefined);
    setImageUrl(anime.coverImage.extraLarge || anime.coverImage.large || '');
    setBannerImage(anime.bannerImage || anime.coverImage.extraLarge || '');
    setNotes(stripHtml(anime.description) || '');
    setAiringStartDate(formatAniListDateForInput(anime.startDate));
    setSelectedGenres(anime.genres ? anime.genres.map(translateGenre) : []); 

    let appStatus = AnimeStatus.PLANNED;
    if (anime.status) {
      switch (anime.status) {
        case 'RELEASING': appStatus = AnimeStatus.WATCHING; break;
        case 'FINISHED': appStatus = AnimeStatus.COMPLETED; setRating(0); break;
        case 'NOT_YET_RELEASED': appStatus = AnimeStatus.PLANNED; break;
        case 'CANCELLED': appStatus = AnimeStatus.DROPPED; break;
        case 'HIATUS': appStatus = AnimeStatus.ON_HOLD; break;
        default: appStatus = AnimeStatus.PLANNED;
      }
    }
    setStatus(appStatus);

    const platformsFromAniList: string[] = [];
    if (anime.externalLinks) {
        anime.externalLinks.forEach(link => {
            if (link.type === "STREAMING") {
                const platformKey = link.site.toLowerCase();
                if (platformColorMap[platformKey]) { 
                    if (!platformsFromAniList.includes(platformKey)) {
                        platformsFromAniList.push(platformKey);
                    }
                }
            }
        });
    }
    
    const mergedPlatformsSet = new Set<string>([...currentUserSelectedPlatforms]);
    platformsFromAniList.forEach(pKey => mergedPlatformsSet.add(pKey));
    setSelectedPlatforms(Array.from(mergedPlatformsSet));

    setAudioType(AudioType.UNKNOWN);

    setAniListSearchTerm('');
    setAniListResults([]);
    setAniListError(null);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("O título do anime é obrigatório.");
      return;
    }

    let constructedPlatformsArray: StreamingPlatform[] = selectedPlatforms
      .map(platformKey => {
        const displayNameParts = platformKey.split(' ');
        let finalDisplayName = displayNameParts.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        
        if (platformKey === 'disney+') finalDisplayName = 'Disney+';
        // else if (platformKey === 'star+') finalDisplayName = 'Star+'; // Removed
        else if (platformKey === 'youtube') finalDisplayName = 'YouTube';
        // else if (platformKey === 'bilibili tv') finalDisplayName = 'Bilibili TV'; // Removed
        else if (platformKey === 'official site') finalDisplayName = 'Official Site';
        else if (platformKey === 'amazon prime video') finalDisplayName = 'Amazon Prime Video';

        const colors = platformColorMap[platformKey] || defaultPlatformColors;
        return { name: finalDisplayName, bgColor: colors.bgColor, textColor: colors.textColor };
      });
    
    constructedPlatformsArray = prioritizeStreamingPlatforms(constructedPlatformsArray);

    const submittedData: AnimeFormData = {
      title,
      currentEpisode: Number(currentEpisode),
      totalEpisodes: totalEpisodes ? Number(totalEpisodes) : undefined,
      status,
      imageUrl: imageUrl || `https://picsum.photos/seed/${initialData?.id || title.replace(/\s+/g, '')}/200/300`,
      bannerImage: bannerImage || undefined,
      streamingPlatforms: constructedPlatformsArray.length > 0 ? constructedPlatformsArray : undefined,
      notes,
      nextAiringDate: nextAiringDate || undefined,
      airingDaysOfWeek,
      airingStartDate: airingStartDate || undefined,
      rating: status === AnimeStatus.COMPLETED ? rating : undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      audioType: audioType === AudioType.UNKNOWN ? undefined : audioType,
    };
    onSubmit({ ...submittedData, id: initialData?.id || crypto.randomUUID() });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 p-4 bg-bg-tertiary/50 rounded-lg">
        <label htmlFor="anilist-search" className={`${labelClass} text-accent`}>Buscar no AniList (opcional)</label>
        <div className="relative">
          <input
            type="text"
            id="anilist-search"
            value={aniListSearchTerm}
            onChange={handleAniListSearchChange}
            className={`${inputClass} pr-10`}
            placeholder="Ex: Attack on Titan, Kimi no Na wa..."
            autoComplete="off"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        </div>
        {isAniListLoading && <div className="py-2 flex justify-center"><LoadingSpinner /></div>}
        {aniListError && <p className="text-red-400 text-sm mt-1">{aniListError}</p>}
        {aniListResults.length > 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto bg-surface-primary rounded-md shadow-lg border border-border-primary">
            <ul className="divide-y divide-border-primary">
              {aniListResults.map(anime => (
                <li key={anime.id}
                  onClick={() => handleSelectAniListAnime(anime)}
                  className="p-3 hover:bg-surface-hover cursor-pointer transition-colors flex items-center space-x-3"
                >
                  <img src={anime.coverImage.medium || anime.coverImage.large} alt={anime.title.romaji || anime.title.english || ""} className="w-12 h-16 object-cover rounded-sm flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold text-accent text-sm">{anime.title.romaji || anime.title.english}</p>
                    {anime.title.native && <p className="text-xs text-text-secondary">{anime.title.native}</p>}
                    <p className="text-xs text-text-secondary">{translateFormat(anime.format || 'N/A')} - {anime.seasonYear || anime.startDate?.year || 'N/A'}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <hr className="border-border-primary my-4" />

      <div>
        <label htmlFor="title" className={labelClass}>Título do Anime</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Shingeki no Kyojin" required />
      </div>

      {selectedGenres.length > 0 && (
        <div>
          <label className={labelClass}>Gêneros (do AniList)</label>
          <div className="flex flex-wrap gap-2 p-3 bg-bg-tertiary/50 border border-border-primary rounded-md">
            {selectedGenres.map(genre => (
              <span key={genre} className="px-2 py-1 text-xs font-medium bg-[var(--accent-700)] text-[var(--accent-100)] rounded-full">
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="currentEpisode" className={labelClass}>Episódio Atual</label>
          <input type="number" id="currentEpisode" value={currentEpisode} onChange={(e) => setCurrentEpisode(Math.max(0, parseInt(e.target.value, 10)))} min="0" className={inputClass} />
        </div>
        <div>
          <label htmlFor="totalEpisodes" className={labelClass}>Total de Episódios (opcional)</label>
          <input type="number" id="totalEpisodes" value={totalEpisodes === undefined ? '' : totalEpisodes} onChange={(e) => setTotalEpisodes(e.target.value ? Math.max(0, parseInt(e.target.value, 10)) : undefined)} min="0" className={inputClass} placeholder="Ex: 12 ou deixe em branco" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" value={status} 
            onChange={(e) => {
              const newStatus = e.target.value as AnimeStatus;
              setStatus(newStatus);
              if (newStatus !== AnimeStatus.COMPLETED) {
                setRating(0);
              }
            }} 
            className={inputClass}
          >
            {Object.values(AnimeStatus).map(s => <option key={s} value={s} className="text-text-primary bg-surface-secondary">{s}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="audioType" className={labelClass}>Idioma do Áudio</label>
          <select 
            id="audioType" 
            value={audioType} 
            onChange={(e) => setAudioType(e.target.value as AudioType)} 
            className={inputClass}
          >
            {Object.values(AudioType).map(type => (
              <option key={type} value={type} className="text-text-primary bg-surface-secondary">{type}</option>
            ))}
          </select>
        </div>
      </div>

      {status === AnimeStatus.COMPLETED && (
        <div>
            <label className={labelClass}>Sua Avaliação (Nota de 0 a 10, com meia estrela)</label>
            <StarRating rating={rating} onSetRating={setRating} size="w-6 h-6" />
            <p className="text-xs text-text-tertiary mt-1">Dê uma nota para este anime já que você o completou!</p>
        </div>
      )}

      <div>
        <label className={labelClass}>Dias de Exibição (Semanal)</label>
        <div className="flex space-x-1 sm:space-x-2 mt-2 flex-wrap">
          {daysOfWeekMap.map(day => (
            <button
              type="button"
              key={day.value}
              onClick={() => handleToggleAiringDay(day.value)}
              className={`px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors border mb-1
                ${airingDaysOfWeek.includes(day.value)
                  ? 'bg-accent-cta text-white border-accent-border'
                  : 'bg-surface-secondary hover:bg-surface-hover text-text-secondary border-border-secondary'
                }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="airingStartDate" className={labelClass}>Data de Início da Exibição (para semanais)</label>
        <input type="date" id="airingStartDate" value={airingStartDate} onChange={(e) => setAiringStartDate(e.target.value)} className={inputClass} />
        <p className="text-xs text-text-tertiary mt-1">Quando o anime começou a ser exibido semanalmente. (Formato: AAAA-MM-DD)</p>
      </div>

      <div>
        <label htmlFor="nextAiringDate" className={labelClass}>Data Específica de Lançamento (opcional)</label>
        <input type="date" id="nextAiringDate" value={nextAiringDate} onChange={(e) => setNextAiringDate(e.target.value)} className={inputClass} />
         <p className="text-xs text-text-tertiary mt-1">Use para datas únicas que não seguem padrão semanal. (Formato: AAAA-MM-DD)</p>
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClass}>URL da Imagem (opcional)</label>
        <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="https://exemplo.com/imagem.jpg"/>
      </div>
      
      <div>
        <label className={labelClass}>Onde Assistir (opcional)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {Object.keys(platformColorMap).map((key) => {
                 let displayPlatformName = key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                 if (key === 'disney+') displayPlatformName = 'Disney+';
                 // else if (key === 'star+') displayPlatformName = 'Star+'; // Removed
                 else if (key === 'youtube') displayPlatformName = 'YouTube';
                 // else if (key === 'bilibili tv') displayPlatformName = 'Bilibili TV'; // Removed
                 else if (key === 'official site') displayPlatformName = 'Official Site';
                 else if (key === 'amazon prime video') displayPlatformName = 'Amazon Prime Video';

                return (
                    <div key={key} className={checkboxContainerClass}>
                        <input
                            type="checkbox"
                            id={`platform-${key}`}
                            value={key}
                            checked={selectedPlatforms.includes(key)}
                            onChange={() => handlePlatformToggle(key)}
                            className="form-checkbox h-4 w-4 text-[var(--accent-500)] bg-surface-secondary border-border-secondary rounded focus:ring-accent-ring focus:ring-offset-surface-primary cursor-pointer"
                        />
                        <label htmlFor={`platform-${key}`} className={checkboxLabelClass}>
                            {displayPlatformName}
                        </label>
                    </div>
                );
            })}
        </div>
        <p className="text-xs text-text-tertiary mt-1">Selecione as plataformas. As cores são baseadas nas plataformas conhecidas.</p>
      </div>
      
      <div>
        <label htmlFor="notes" className={labelClass}>Notas (opcional)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} placeholder="Alguma anotação sobre o anime..."></textarea>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-md text-text-primary bg-surface-secondary hover:bg-surface-hover transition-colors flex items-center justify-center space-x-2"
        >
            <XMarkIcon className="w-5 h-5"/>
            <span>Cancelar</span>
        </button>
        <button 
            type="submit" 
            className="px-6 py-2.5 rounded-md text-white bg-accent-cta hover:bg-accent-cta-hover transition-colors flex items-center justify-center space-x-2"
        >
            <CheckIcon className="w-5 h-5"/>
            <span>{initialData ? 'Atualizar Anime' : 'Adicionar Anime'}</span>
        </button>
      </div>
    </form>
  );
};

export default AnimeForm;
