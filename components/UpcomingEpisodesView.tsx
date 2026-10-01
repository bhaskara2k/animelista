import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Anime, ListDensityOption } from '../types';
import {
  CalendarDaysIcon,
  PlayIcon,
  BellAlertIcon,
  ClockIcon,
  CalendarPlusIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  CheckIcon
} from './Icons';
import { useEpisodeCountdown } from '../hooks/useEpisodeCountdown';
import {
  createGoogleCalendarUrl,
  exportSingleEpisodeToIcs,
  exportAllUpcomingToIcs,
  CalendarEventData
} from '../utils/calendarExportUtils';
import { fetchNextAiringEpisodeByTitle } from '../services/AniListService';

export interface UpcomingAnime {
  anime: Anime;
  nextEpisodeNumber: number;
  nextAiringDate: Date;
  hasExactTime?: boolean;
}

// Solid color palette mapping for streaming platforms requested by user
const getPlatformSolidBadgeStyle = (platformName: string, defaultBg?: string, defaultText?: string): React.CSSProperties => {
  const name = platformName.toLowerCase().trim();
  if (name.includes('youtube')) {
    return { backgroundColor: '#FF0000', color: '#FFFFFF' };
  }
  if (name.includes('crunchyroll')) {
    return { backgroundColor: '#F47521', color: '#000000' };
  }
  if (name.includes('disney')) {
    return { backgroundColor: '#0063E5', color: '#FFFFFF' };
  }
  if (name.includes('netflix')) {
    return { backgroundColor: '#E50914', color: '#FFFFFF' };
  }
  if (name.includes('prime') || name.includes('amazon')) {
    return { backgroundColor: '#00A8E1', color: '#000000' };
  }
  if (name.includes('youcine')) {
    return { backgroundColor: '#111827', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' };
  }
  if (name.includes('max') || name.includes('hbo')) {
    return { backgroundColor: '#5822B4', color: '#FFFFFF' };
  }
  return {
    backgroundColor: defaultBg || '#334155',
    color: defaultText || '#FFFFFF',
  };
};

interface UpcomingAnimeCardProps {
  item: UpcomingAnime;
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
  onEditAnime: (anime: Anime) => void;
  listDensity: ListDensityOption;
}

const UpcomingAnimeCard: React.FC<UpcomingAnimeCardProps> = ({
  item,
  onUpdateEpisode,
  onEditAnime,
}) => {
  const { anime, nextEpisodeNumber, nextAiringDate, hasExactTime = false } = item;
  const [isCalendarMenuOpen, setIsCalendarMenuOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close calendar menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCalendarMenuOpen(false);
      }
    };
    if (isCalendarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarMenuOpen]);

  const countdown = useEpisodeCountdown(nextAiringDate, hasExactTime);

  const handleMarkAsWatched = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateEpisode(anime.id, nextEpisodeNumber);
  };

  const formattedDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const airDate = new Date(nextAiringDate);
    airDate.setHours(0, 0, 0, 0);

    if (airDate.getTime() === today.getTime()) return 'HOJE';
    if (airDate.getTime() === tomorrow.getTime()) return 'AMANHÃ';

    const diffTime = airDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7 && diffDays > 1) {
      const days = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
      return days[airDate.getDay()];
    }

    const day = String(airDate.getDate()).padStart(2, '0');
    const month = String(airDate.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }, [nextAiringDate]);

  const isToday = formattedDate === 'HOJE';

  const calendarEventData: CalendarEventData = useMemo(() => ({
    animeTitle: anime.title,
    episodeNumber: nextEpisodeNumber,
    airingDate: nextAiringDate,
    hasExactTime,
    platform: anime.streamingPlatforms?.[0]?.name,
  }), [anime.title, anime.streamingPlatforms, nextEpisodeNumber, nextAiringDate, hasExactTime]);

  const handleOpenGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = createGoogleCalendarUrl(calendarEventData);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsCalendarMenuOpen(false);
  };

  const handleDownloadIcs = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportSingleEpisodeToIcs(calendarEventData);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
    setIsCalendarMenuOpen(false);
  };

  return (
    <div
      onClick={() => onEditAnime(anime)}
      className="group relative overflow-hidden glass-panel rounded-2xl transition-all duration-300 hover:scale-[1.015] hover:shadow-accent-glow cursor-pointer border border-white/5 hover:border-accent-500/30 flex flex-col justify-between"
    >
      {/* Background Image with Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/300/200`}
          alt=""
          className="w-full h-full object-cover opacity-30 group-hover:opacity-25 transition-opacity blur-[3px] group-hover:blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/95 to-bg-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
      </div>

      <div className="relative z-10 p-4 flex flex-col gap-3">
        {/* Top: Cover, Titles & Badges */}
        <div className="flex gap-4 items-start">
          {/* Main Cover Image */}
          <div className="relative flex-shrink-0">
            <img
              src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/100/150`}
              alt={anime.title}
              className="w-20 h-28 object-cover rounded-xl shadow-lg shadow-black/50 ring-1 ring-white/10 group-hover:ring-accent-500/50 transition-all"
            />
            {isToday && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                HOJE
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="flex-grow min-w-0 flex flex-col justify-between min-h-[7rem]">
            <div>
              <h3 className="font-bold text-base md:text-lg text-white mb-1 line-clamp-1 group-hover:text-accent-400 transition-colors" title={anime.title}>
                {anime.title}
              </h3>

              {/* Episode & Date Badges with refined, compact icons */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white/10 text-gray-200 border border-white/10 shadow-sm uppercase tracking-wider">
                  EP {nextEpisodeNumber}
                </span>

                <span
                  className={`text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                    isToday
                      ? 'text-red-400 bg-red-500/10 border-red-500/30 shadow-sm shadow-red-500/10'
                      : 'text-accent-300 bg-accent-500/10 border-accent-500/20'
                  }`}
                >
                  <CalendarDaysIcon className="w-3 h-3 !text-[11px] leading-none shrink-0" opticalSize={16} />
                  <span>{formattedDate}</span>
                </span>

                {/* Exact Airing Time Badge with refined, smaller clock icon */}
                {countdown.timeFormatted && (
                  <span
                    className="text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 shadow-sm shadow-amber-500/10"
                    title={`Horário de exibição no seu fuso horário local: ${countdown.timeFormatted}`}
                  >
                    <ClockIcon className="w-3 h-3 !text-[11px] leading-none shrink-0 text-amber-400" opticalSize={16} />
                    <span className="font-semibold">{countdown.timeFormatted}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Countdown Badge: Redesigned with micro-badge and high-contrast monospace time */}
            <div className="mt-0.5">
              {countdown.isPast ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold shadow-sm shadow-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Já disponível!</span>
                </div>
              ) : countdown.isToday ? (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border shadow-sm ${
                  countdown.isImminent
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-red-500/20 animate-pulse'
                    : 'bg-orange-500/15 text-orange-200 border-orange-500/30 shadow-orange-500/10'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${countdown.isImminent ? 'bg-red-400' : 'bg-orange-400'} animate-ping shrink-0`} />
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Faltam</span>
                  <span className="font-mono font-bold text-white tracking-wider">{countdown.formattedCountdown}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/10 text-[11px] shadow-sm">
                  <ClockIcon className="w-3 h-3 !text-[11px] leading-none text-accent-400 shrink-0" opticalSize={16} />
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Faltam</span>
                  <span className="font-mono font-bold text-gray-100 tracking-wide">{countdown.formattedCountdown}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Streaming platforms tags with SOLID colors (requested by user) */}
        {anime.streamingPlatforms && anime.streamingPlatforms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-0.5">
            <span className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider">Onde ver:</span>
            {anime.streamingPlatforms.slice(0, 3).map((p) => {
              const solidStyle = getPlatformSolidBadgeStyle(p.name, p.bgColor, p.textColor);
              return (
                <span
                  key={p.name}
                  className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm transition-transform hover:scale-105"
                  style={solidStyle}
                >
                  {p.name}
                </span>
              );
            })}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          {/* Mark as Watched Button */}
          <button
            onClick={handleMarkAsWatched}
            className="flex-1 bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-md shadow-accent-600/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            title={`Marcar episódio ${nextEpisodeNumber} como assistido`}
          >
            <PlayIcon className="w-3.5 h-3.5 fill-white shrink-0" opticalSize={18} />
            <span>VISTO (+1)</span>
          </button>

          {/* Calendar Export Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCalendarMenuOpen(prev => !prev);
              }}
              className="bg-surface-secondary hover:bg-surface-hover text-text-secondary hover:text-white text-xs font-semibold py-2 px-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center gap-1 active:scale-95"
              title="Adicionar lembrete à sua agenda"
            >
              {downloadSuccess ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" opticalSize={18} />
                  <span className="text-emerald-400 hidden sm:inline">Salvo!</span>
                </>
              ) : (
                <>
                  <CalendarPlusIcon className="w-3.5 h-3.5 text-accent-400" opticalSize={18} />
                  <span className="hidden sm:inline">Agenda</span>
                  <ChevronDownIcon className="w-3 h-3 text-gray-400" opticalSize={16} />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {isCalendarMenuOpen && (
              <div
                className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
                  Adicionar Lembrete
                </div>

                <button
                  type="button"
                  onClick={handleOpenGoogleCalendar}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-xs text-white font-medium flex items-center justify-between transition-colors group/item"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sky-400">📅</span>
                    Google Agenda
                  </span>
                  <ArrowTopRightOnSquareIcon className="w-3 h-3 text-gray-400 group-hover/item:text-white" />
                </button>

                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-xs text-white font-medium flex items-center justify-between transition-colors group/item"
                >
                  <span className="flex items-center gap-2">
                    <ArrowDownTrayIcon className="w-3.5 h-3.5 text-emerald-400" />
                    Baixar arquivo .ics
                  </span>
                  <span className="text-[10px] text-gray-400">Apple/Outlook</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface UpcomingEpisodesViewProps {
  upcomingAnimes: UpcomingAnime[];
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
  onEditAnime: (anime: Anime) => void;
  listDensity: ListDensityOption;
}

const UpcomingEpisodesView: React.FC<UpcomingEpisodesViewProps> = ({
  upcomingAnimes,
  onUpdateEpisode,
  onEditAnime,
  listDensity,
}) => {
  const [enrichedAnimes, setEnrichedAnimes] = useState<UpcomingAnime[]>(upcomingAnimes);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [exportedAllSuccess, setExportedAllSuccess] = useState(false);

  // Sync with prop and enrich with real-time AniList airing schedules
  useEffect(() => {
    let isMounted = true;
    setEnrichedAnimes(upcomingAnimes);

    if (upcomingAnimes.length === 0) return;

    const enrichSchedules = async () => {
      setIsLoadingSchedules(true);

      const updated = await Promise.all(
        upcomingAnimes.map(async (item) => {
          // If already has exact time, keep it
          if (item.hasExactTime) return item;

          try {
            const airingInfo = await fetchNextAiringEpisodeByTitle(item.anime.title);
            if (airingInfo && airingInfo.airingAt) {
              const exactDate = new Date(airingInfo.airingAt * 1000);
              return {
                ...item,
                nextAiringDate: exactDate,
                nextEpisodeNumber: airingInfo.episode || item.nextEpisodeNumber,
                hasExactTime: true,
              };
            }
          } catch (e) {
            console.warn(`Error resolving exact schedule for ${item.anime.title}:`, e);
          }
          return item;
        })
      );

      if (isMounted) {
        setEnrichedAnimes(updated);
        setIsLoadingSchedules(false);
      }
    };

    enrichSchedules();

    return () => {
      isMounted = false;
    };
  }, [upcomingAnimes]);

  // Group by date and sort chronologically (closest to farthest)
  const grouped = useMemo(() => {
    const groups: Record<string, UpcomingAnime[]> = {
      'HOJE': [],
      'AMANHÃ': [],
      'ESTA SEMANA': [],
      'EM BREVE': [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    enrichedAnimes.forEach((item) => {
      const date = new Date(item.nextAiringDate);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups['HOJE'].push(item);
      } else if (date.getTime() === tomorrow.getTime()) {
        groups['AMANHÃ'].push(item);
      } else {
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7 && diffDays > 0) {
          groups['ESTA SEMANA'].push(item);
        } else {
          groups['EM BREVE'].push(item);
        }
      }
    });

    // Sort chronologically within each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        const timeA = new Date(a.nextAiringDate).getTime();
        const timeB = new Date(b.nextAiringDate).getTime();
        if (timeA !== timeB) {
          return timeA - timeB;
        }
        return a.anime.title.localeCompare(b.anime.title);
      });
    });

    return groups;
  }, [enrichedAnimes]);

  const hasItems = (key: string) => grouped[key] && grouped[key].length > 0;

  const handleExportAllUpcoming = () => {
    if (enrichedAnimes.length === 0) return;

    const events: CalendarEventData[] = enrichedAnimes.map((item) => ({
      animeTitle: item.anime.title,
      episodeNumber: item.nextEpisodeNumber,
      airingDate: item.nextAiringDate,
      hasExactTime: !!item.hasExactTime,
      platform: item.anime.streamingPlatforms?.[0]?.name,
    }));

    exportAllUpcomingToIcs(events);
    setExportedAllSuccess(true);
    setTimeout(() => setExportedAllSuccess(false), 3000);
  };

  if (upcomingAnimes.length === 0) {
    return (
      <div className="text-center py-20 px-8 glass-panel rounded-2xl flex flex-col items-center justify-center animate-fade-in border border-white/5">
        <div className="w-24 h-24 rounded-full bg-sky-500/10 flex items-center justify-center mb-6 ring-4 ring-sky-500/20 animate-pulse">
          <BellAlertIcon className="w-12 h-12 text-sky-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Tudo em dia!</h2>
        <p className="text-gray-400 max-w-md">
          Você não tem episódios pendentes para os próximos dias. Aproveite para descobrir novos animes ou relaxar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header and Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Próximos Lançamentos</h2>
            {isLoadingSchedules ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Sincronizando horários...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Tempo real
              </span>
            )}
          </div>
          <p className="text-text-secondary text-sm mt-1">
            Contagem regressiva e horários exatos para os próximos episódios da sua lista.
          </p>
        </div>

        {/* Export All Calendar Button */}
        <button
          onClick={handleExportAllUpcoming}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-lg transition-all active:scale-95 ${
            exportedAllSuccess
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-surface-secondary hover:bg-surface-hover text-white border border-white/10 hover:border-accent-500/40 shadow-black/40'
          }`}
          title="Exporta todos os episódios agendados em um arquivo de calendário (.ics)"
        >
          {exportedAllSuccess ? (
            <>
              <CheckIcon className="w-4 h-4 text-white" />
              <span>Agenda Baixada (.ics)!</span>
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-4 h-4 text-accent-400" />
              <span>Exportar Todos para Calendário (.ics)</span>
            </>
          )}
        </button>
      </div>

      {/* Sections by Date Group */}
      {['HOJE', 'AMANHÃ', 'ESTA SEMANA', 'EM BREVE'].map((groupName) =>
        hasItems(groupName) && (
          <div key={groupName} className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <span
                className={`w-1.5 h-6 rounded-full ${
                  groupName === 'HOJE'
                    ? 'bg-red-500 shadow-lg shadow-red-500/50'
                    : groupName === 'AMANHÃ'
                    ? 'bg-orange-400 shadow-lg shadow-orange-400/50'
                    : 'bg-accent-500 shadow-lg shadow-accent-500/50'
                }`}
              />
              <span>{groupName}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                {grouped[groupName].length}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[groupName].map((item) => (
                <UpcomingAnimeCard
                  key={`${item.anime.id}-ep${item.nextEpisodeNumber}`}
                  item={item}
                  onUpdateEpisode={onUpdateEpisode}
                  onEditAnime={onEditAnime}
                  listDensity={listDensity}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UpcomingEpisodesView;