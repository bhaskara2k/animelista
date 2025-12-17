import React, { useState, useEffect, useCallback } from 'react';
import { Anime, AnimeStatus, AnimeFormData, StreamingPlatform, AniListMedia, AniListDate, AudioType } from '../types';
import { CheckIcon, XMarkIcon, SearchIcon, SparklesIcon, CalendarDaysIcon, QuestionMarkCircleIcon } from './Icons';
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
  { label: 'Domingo', short: 'Dom', value: 0 }, { label: 'Segunda', short: 'Seg', value: 1 },
  { label: 'Terça', short: 'Ter', value: 2 }, { label: 'Quarta', short: 'Qua', value: 3 },
  { label: 'Quinta', short: 'Qui', value: 4 }, { label: 'Sexta', short: 'Sex', value: 5 },
  { label: 'Sábado', short: 'Sáb', value: 6 },
];

const platformColorMap: Record<string, { bgColor: string; textColor: string }> = {
  'crunchyroll': { bgColor: '#F47521', textColor: '#FFFFFF' },
  'netflix': { bgColor: '#E50914', textColor: '#FFFFFF' },
  'youcine': { bgColor: '#000000', textColor: '#FFFFFF' },
  'funimation': { bgColor: '#6A0DAD', textColor: '#FFFFFF' },
  'hidive': { bgColor: '#00A4D6', textColor: '#FFFFFF' },
  'amazon prime video': { bgColor: '#00A8E1', textColor: '#000000' },
  'disney+': { bgColor: '#01153D', textColor: '#FFFFFF' },
  'hulu': { bgColor: '#1CE783', textColor: '#000000' },
  'vrv': { bgColor: '#F47521', textColor: '#FFFFFF' },
  'official site': { bgColor: '#667EEA', textColor: '#FFFFFF' },
  'youtube': { bgColor: '#FF0000', textColor: '#FFFFFF' },
  'animelab': { bgColor: '#F15A24', textColor: '#FFFFFF' },
};
const defaultPlatformColors = { bgColor: '#4A5568', textColor: '#FFFFFF' };

const inputClass = "w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all placeholder-gray-500 text-white shadow-inner";
const labelClass = "block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase text-[11px]";

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
  // --- State Definitions ---
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

    // Reset search state
    setAniListSearchTerm('');
    setAniListResults([]);
    setIsAniListLoading(false);
    setAniListError(null);
  };

  useEffect(() => {
    resetFormFields(initialData);
  }, [initialData]);

  // --- Handlers ---
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

  // --- AniList Integration ---
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

    setAudioType(AudioType.UNKNOWN); // Reset audio type

    // Clear search
    setAniListSearchTerm('');
    setAniListResults([]);
    setAniListError(null);
  };


  // --- Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("O título do anime é obrigatório."); // Could be a toast
      return;
    }

    let constructedPlatformsArray: StreamingPlatform[] = selectedPlatforms
      .map(platformKey => {
        const displayNameParts = platformKey.split(' ');
        let finalDisplayName = displayNameParts.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

        if (platformKey === 'disney+') finalDisplayName = 'Disney+';
        else if (platformKey === 'youtube') finalDisplayName = 'YouTube';
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

  // Keyboard shortcut for Enter to submit
  // Usually <form> handles this, but we make sure the button triggers it.

  return (
    <div className="space-y-6">

      {/* 1. Intelligent Search Header */}
      <div className="bg-gradient-to-br from-accent-900/40 to-black/40 p-5 rounded-2xl border border-accent-500/20 shadow-inner">
        <div className="flex items-center gap-3 mb-3">
          <SparklesIcon className="w-5 h-5 text-accent-300 animate-pulse" />
          <span className="text-sm font-bold text-accent-100 uppercase tracking-widest">Preenchimento Automático</span>
        </div>
        <div className="relative group">
          <input
            type="text"
            value={aniListSearchTerm}
            onChange={handleAniListSearchChange}
            className="w-full pl-12 pr-4 py-4 bg-black/60 border border-accent-500/30 rounded-xl focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all font-medium"
            placeholder="Digite o nome do anime para buscar no AniList..."
            autoComplete="off"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent-400 transition-colors" />
          {isAniListLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {aniListResults.length > 0 && (
          <div className="mt-2 absolute left-0 right-0 z-50 mx-6 -mt-1 bg-gray-900/95 backdrop-blur-xl rounded-b-xl border-x border-b border-white/10 shadow-2xl max-h-80 overflow-y-auto custom-scrollbar">
            {aniListResults.map(anime => (
              <button
                key={anime.id}
                type="button"
                onClick={() => handleSelectAniListAnime(anime)}
                className="w-full text-left p-3 hover:bg-accent-600/20 hover:border-l-4 hover:border-accent-500 transition-all flex items-center space-x-4 border-b border-white/5 last:border-0"
              >
                <img src={anime.coverImage.medium || anime.coverImage.large} alt="" className="w-10 h-14 object-cover rounded shadow-md" />
                <div>
                  <p className="font-bold text-white text-sm line-clamp-1">{anime.title.romaji || anime.title.english}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    <span className="bg-white/10 px-1.5 py-0.5 rounded uppercase text-[10px] tracking-wide">{anime.format || 'TV'}</span>
                    {anime.seasonYear && <span>{anime.seasonYear}</span>}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 2. Main Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image & Basic Info */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className={labelClass}>Título Principal</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} font-bold text-lg`} placeholder="Ex: One Piece" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as AnimeStatus;
                    setStatus(newStatus);
                    if (newStatus !== AnimeStatus.COMPLETED) setRating(0);
                  }}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {Object.values(AnimeStatus).map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Áudio</label>
                <select value={audioType} onChange={(e) => setAudioType(e.target.value as AudioType)} className={`${inputClass} appearance-none cursor-pointer`}>
                  {Object.values(AudioType).map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Capa do Anime (URL)</label>
              <div className="flex gap-4">
                <div className="w-20 h-28 flex-shrink-0 bg-black/40 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                  {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-600">Sem Imagem</span>}
                </div>
                <div className="flex-grow space-y-2">
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="https://..." />
                  <input type="url" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} className={inputClass} placeholder="Banner opcional (URL)" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Progress & Specifics */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="col-span-2 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
                Progresso
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Assistidos</label>
                <input type="number" value={currentEpisode} onChange={(e) => setCurrentEpisode(Math.max(0, parseInt(e.target.value, 10)))} min="0" className={`${inputClass} text-center font-mono text-xl`} />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Total</label>
                <input type="number" value={totalEpisodes === undefined ? '' : totalEpisodes} onChange={(e) => setTotalEpisodes(e.target.value ? Math.max(0, parseInt(e.target.value, 10)) : undefined)} min="0" placeholder="?" className={`${inputClass} text-center font-mono text-xl`} />
              </div>
            </div>

            {status === AnimeStatus.COMPLETED && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-4 rounded-2xl border border-yellow-500/20">
                <label className={`${labelClass} text-yellow-500 mb-0`}>Sua Avaliação Final</label>
                <div className="flex justify-center py-2">
                  <StarRating rating={rating} onSetRating={setRating} size="w-8 h-8" />
                </div>
              </div>
            )}

            {selectedGenres.length > 0 && (
              <div>
                <label className={labelClass}>Gêneros</label>
                <div className="flex flex-wrap gap-2">
                  {selectedGenres.map(genre => (
                    <span key={genre} className="px-2.5 py-1 text-xs font-bold border border-white/10 rounded-lg text-gray-300 bg-white/5">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Schedule & Platforms (Advanced) */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-gray-400" /> Detalhes de Lançamento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClass}>Dias de Exibição (Semanal)</label>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeekMap.map(day => (
                  <button
                    type="button"
                    key={day.value}
                    onClick={() => handleToggleAiringDay(day.value)}
                    className={`w-10 h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center
                                    ${airingDaysOfWeek.includes(day.value)
                        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30 scale-105'
                        : 'bg-black/20 text-gray-500 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="airingStartDate" className={labelClass}>Data de Estreia</label>
              <input type="date" value={airingStartDate} onChange={(e) => setAiringStartDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="mt-6">
            <label className={labelClass}>Onde Assistir</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
              {Object.keys(platformColorMap).map((key) => {
                let displayPlatformName = key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                if (key === 'disney+') displayPlatformName = 'Disney+';
                else if (key === 'youtube') displayPlatformName = 'YouTube';
                else if (key === 'official site') displayPlatformName = 'Official Site';
                else if (key === 'amazon prime video') displayPlatformName = 'Amazon Prime';

                const isSelected = selectedPlatforms.includes(key);
                const color = platformColorMap[key];

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handlePlatformToggle(key)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 text-left group
                                     ${isSelected
                        ? `bg-[#${color.bgColor}]/10 border-[${color.bgColor}] shadow-inner`
                        : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                    style={isSelected ? { backgroundColor: `${color.bgColor}20`, borderColor: color.bgColor } : {}}
                  >
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 transition-transform ${isSelected ? 'scale-110' : 'scale-75 opacity-50'}`}
                      style={{ backgroundColor: color.bgColor }}
                    />
                    <span className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {displayPlatformName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Notes */}
        <div>
          <label htmlFor="notes" className={labelClass}>Notas Pessoais</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Escreva suas observações, teorias ou lembretes..."
          />
        </div>

        {/* 5. Actions Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 sticky bottom-0 bg-surface-primary/95 backdrop-blur-sm -mx-6 -mb-6 p-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 hidden sm:inline-block">Pressione <strong className="text-gray-300">Enter ↵</strong> para salvar</span>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-white bg-accent-600 hover:bg-accent-500 transition-all font-bold shadow-lg shadow-accent-600/20 hover:shadow-accent-500/40 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <CheckIcon className="w-5 h-5" />
              <span>{initialData ? 'Salvar Alterações' : 'Adicionar à Lista'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AnimeForm;
