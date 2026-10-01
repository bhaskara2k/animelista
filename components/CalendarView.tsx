import React, { useState, useMemo } from 'react';
import { Anime, AnimeStatus, StreamingPlatform } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, ClockIcon } from './Icons';
import { parseDateString } from '../utils/dateUtils';

interface CalendarViewProps {
  animeList: Anime[];
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onEditAnime: (anime: Anime) => void;
  filterStatus: AnimeStatus | 'ALL';
}

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const fullDaysOfWeek = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const portugueseMonths = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const getAnimesForDate = (animeList: Anime[], targetDate: Date, filterStatus: AnimeStatus | 'ALL'): Anime[] => {
  const targetDayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const targetDayOfWeek = targetDayStart.getDay();
  const msPerDay = 1000 * 60 * 60 * 24;

  const scheduledAnimes = animeList.filter(anime => {
    // 1. Verificação de Data Específica (exceções ou lançamentos únicos)
    if (anime.nextAiringDate) {
      const specificAirDate = parseDateString(anime.nextAiringDate);
      if (specificAirDate) {
        const specificAirDayStart = new Date(specificAirDate.getFullYear(), specificAirDate.getMonth(), specificAirDate.getDate());
        if (specificAirDayStart.getTime() === targetDayStart.getTime()) {
          return true;
        }
      }
    }

    // 2. Lógica de Recorrência Semanal
    const parsedAiringStartDate = anime.airingStartDate ? parseDateString(anime.airingStartDate) : null;
    if (!parsedAiringStartDate || !anime.airingDaysOfWeek || anime.airingDaysOfWeek.length === 0) return false;

    const airingStartDayOnly = new Date(parsedAiringStartDate.getFullYear(), parsedAiringStartDate.getMonth(), parsedAiringStartDate.getDate());
    if (targetDayStart.getTime() < airingStartDayOnly.getTime()) return false;
    if (!anime.airingDaysOfWeek.includes(targetDayOfWeek)) return false;

    if (!anime.totalEpisodes || anime.totalEpisodes <= 0) return true;

    // 3. Cálculo de Limite de Episódios
    const diffTime = targetDayStart.getTime() - airingStartDayOnly.getTime();
    const diffDays = Math.round(diffTime / msPerDay);
    const weeksPassed = Math.floor(diffDays / 7);
    const daysRemainder = diffDays % 7;

    let episodesShown = weeksPassed * anime.airingDaysOfWeek.length;
    const startDayOfWeekIndex = airingStartDayOnly.getDay();
    for (let i = 0; i <= daysRemainder; i++) {
      const currentToCheckDay = (startDayOfWeekIndex + i) % 7;
      if (anime.airingDaysOfWeek.includes(currentToCheckDay)) {
        episodesShown++;
      }
    }

    return episodesShown <= anime.totalEpisodes;
  });

  if (filterStatus === 'ALL') return scheduledAnimes;
  return scheduledAnimes.filter(anime => anime.status === filterStatus);
};

// Platform badge solid styling
const getPlatformBadgeStyle = (platformName: string, defaultBg?: string, defaultText?: string): React.CSSProperties => {
  const name = platformName.toLowerCase().trim();
  if (name.includes('youtube')) return { backgroundColor: '#FF0000', color: '#FFFFFF' };
  if (name.includes('crunchyroll')) return { backgroundColor: '#F47521', color: '#000000' };
  if (name.includes('disney')) return { backgroundColor: '#0063E5', color: '#FFFFFF' };
  if (name.includes('netflix')) return { backgroundColor: '#E50914', color: '#FFFFFF' };
  if (name.includes('prime') || name.includes('amazon')) return { backgroundColor: '#00A8E1', color: '#000000' };
  return { backgroundColor: defaultBg || '#334155', color: defaultText || '#FFFFFF' };
};

const CalendarView: React.FC<CalendarViewProps> = ({
  animeList,
  currentDate,
  onNavigateMonth,
  onEditAnime,
  filterStatus,
}) => {
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week');
  const [weekOffset, setWeekOffset] = useState<number>(0);

  if (animeList.length === 0) {
    return (
      <div className="text-center py-20 px-8 glass-panel rounded-2xl flex flex-col items-center justify-center animate-fade-in border border-white/5">
        <div className="w-20 h-20 rounded-full bg-accent-500/10 flex items-center justify-center mb-6">
          <CalendarDaysIcon className="w-10 h-10 text-accent-400" />
        </div>
        <p className="text-2xl font-bold text-white mb-2">Sua agenda está vazia</p>
        <p className="text-gray-400 max-w-md">
          Adicione animes e defina suas datas de lançamento para visualizar o calendário completo de estreias.
        </p>
      </div>
    );
  }

  // Monthly View Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ key: `empty-prev-${i}`, isEmpty: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const animesToday = getAnimesForDate(animeList, date, filterStatus);
    const isToday = new Date().toDateString() === date.toDateString();
    calendarDays.push({ key: date.toISOString(), date, animes: animesToday, isToday, isEmpty: false });
  }

  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  for (let i = calendarDays.length; i < totalCells; i++) {
    calendarDays.push({ key: `empty-next-${i}`, isEmpty: true });
  }

  // Weekly / Simulcast View Calculations (Monday to Sunday)
  const currentWeekDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Apply week offset
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + weekOffset * 7);

    // Calculate Monday
    const dayOfWeek = targetDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(targetDate);
    monday.setDate(targetDate.getDate() + diffToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const isToday = dayDate.toDateString() === today.toDateString();
      const animes = getAnimesForDate(animeList, dayDate, filterStatus);

      days.push({
        date: dayDate,
        dayName: fullDaysOfWeek[dayDate.getDay()],
        dayShort: daysOfWeek[dayDate.getDay()],
        isToday,
        animes,
      });
    }
    return days;
  }, [animeList, filterStatus, weekOffset]);

  const weekRangeTitle = useMemo(() => {
    if (currentWeekDays.length === 0) return '';
    const start = currentWeekDays[0].date;
    const end = currentWeekDays[6].date;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(start.getDate())}/${pad(start.getMonth() + 1)} — ${pad(end.getDate())}/${pad(end.getMonth() + 1)} (${start.getFullYear()})`;
  }, [currentWeekDays]);

  const platformLegend = useMemo(() => {
    const uniquePlatforms = new Map<string, StreamingPlatform>();
    animeList.forEach(anime => {
      anime.streamingPlatforms?.forEach(platform => {
        if (!uniquePlatforms.has(platform.name)) uniquePlatforms.set(platform.name, platform);
      });
    });
    return Array.from(uniquePlatforms.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [animeList]);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in shadow-2xl border border-white/5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-white/5 bg-white/5 gap-4">
        {/* Title and date info */}
        <div>
          {calendarMode === 'month' ? (
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="text-accent-400">{portugueseMonths[month]}</span>
              <span className="text-gray-500 font-light">{year}</span>
            </h2>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Grade Semanal (Simulcast)</h2>
              </div>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">{weekRangeTitle}</p>
            </div>
          )}
        </div>

        {/* Controls: Mode Toggle & Navigation */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => setCalendarMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                calendarMode === 'week'
                  ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Semanal</span>
            </button>
            <button
              onClick={() => setCalendarMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                calendarMode === 'month'
                  ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Mensal</span>
            </button>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1 bg-black/30 rounded-xl p-1 border border-white/10">
            {calendarMode === 'month' ? (
              <>
                <button
                  onClick={() => onNavigateMonth('prev')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  aria-label="Mês anterior"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10" />
                <button
                  onClick={() => onNavigateMonth('next')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  aria-label="Próximo mês"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setWeekOffset(prev => prev - 1)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title="Semana anterior"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                {weekOffset !== 0 && (
                  <button
                    onClick={() => setWeekOffset(0)}
                    className="px-2 py-0.5 text-[10px] font-bold text-accent-400 hover:text-white bg-accent-500/10 rounded-md"
                  >
                    Hoje
                  </button>
                )}
                <div className="w-px h-4 bg-white/10" />
                <button
                  onClick={() => setWeekOffset(prev => prev + 1)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title="Próxima semana"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- VIEW MODE 1: WEEKLY SIMULCAST GRID (7 COLUMNS) --- */}
      {calendarMode === 'week' && (
        <div className="overflow-x-auto p-4 md:p-6">
          <div className="min-w-[900px] grid grid-cols-7 gap-3">
            {currentWeekDays.map((dayItem) => {
              const { date, dayName, isToday, animes } = dayItem;
              const pad = (n: number) => String(n).padStart(2, '0');
              const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;

              return (
                <div
                  key={date.toISOString()}
                  className={`flex flex-col rounded-2xl p-3 border transition-all duration-300 min-h-[480px] ${
                    isToday
                      ? 'bg-gradient-to-b from-accent-600/15 via-bg-primary/95 to-bg-primary border-accent-500/40 shadow-xl shadow-accent-600/10 ring-1 ring-accent-500/30'
                      : 'bg-surface-secondary/70 border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Column Header */}
                  <div className="pb-3 mb-3 border-b border-white/10 flex flex-col justify-between items-center text-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black tracking-wider uppercase ${isToday ? 'text-accent-300' : 'text-gray-300'}`}>
                        {dayName.replace('-feira', '')}
                      </span>
                      {isToday && (
                        <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-sm">
                          HOJE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between w-full px-1 mt-1 text-[11px]">
                      <span className="font-mono text-gray-400 font-semibold">{formattedDate}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-bold">
                        {animes.length}
                      </span>
                    </div>
                  </div>

                  {/* Anime Cards in this day */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                    {animes.length === 0 ? (
                      <div className="h-full flex items-center justify-center py-10 text-center text-gray-600 text-[11px] italic">
                        Nenhum anime
                      </div>
                    ) : (
                      animes.map((anime) => (
                        <div
                          key={anime.id}
                          onClick={() => onEditAnime(anime)}
                          className="group/card relative overflow-hidden bg-slate-900/90 hover:bg-slate-850 p-2.5 rounded-xl border border-white/10 hover:border-accent-500/40 transition-all cursor-pointer shadow-md hover:scale-[1.02] flex flex-col gap-2"
                        >
                          <div className="flex gap-2.5 items-start">
                            {/* Anime Cover */}
                            <img
                              src={anime.imageUrl || `https://picsum.photos/seed/${anime.id}/80/110`}
                              alt={anime.title}
                              className="w-12 h-16 object-cover rounded-lg flex-shrink-0 shadow-md ring-1 ring-white/10 group-hover/card:ring-accent-500/50"
                            />
                            {/* Title & info */}
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover/card:text-accent-400 transition-colors" title={anime.title}>
                                {anime.title}
                              </h4>
                              <p className="text-[10px] font-bold text-accent-300 mt-1">
                                EP {anime.currentEpisode + 1}
                              </p>
                            </div>
                          </div>

                          {/* Platform Solid Chip */}
                          {anime.streamingPlatforms && anime.streamingPlatforms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-white/5">
                              {anime.streamingPlatforms.slice(0, 2).map((p) => {
                                const style = getPlatformBadgeStyle(p.name, p.bgColor, p.textColor);
                                return (
                                  <span
                                    key={p.name}
                                    style={style}
                                    className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                                  >
                                    {p.name}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- VIEW MODE 2: MONTHLY CALENDAR GRID --- */}
      {calendarMode === 'month' && (
        <>
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
            {daysOfWeek.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 bg-bg-primary/30">
            {calendarDays.map((dayInfo, index) => {
              const isLastRow = index >= totalCells - 7;
              const borderClasses = `border-r border-white/5 ${isLastRow ? '' : 'border-b'}`;

              return (
                <div
                  key={dayInfo.key}
                  className={`min-h-[140px] p-2 transition-all duration-200 group relative
                    ${borderClasses}
                    ${dayInfo.isEmpty ? 'bg-black/20' : 'hover:bg-white/5'}
                    ${!dayInfo.isEmpty && dayInfo.isToday ? 'bg-accent-500/5 shadow-inner shadow-accent-500/10' : ''}`}
                >
                  {!dayInfo.isEmpty && dayInfo.date && (
                    <>
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mb-2 transition-colors
                            ${dayInfo.isToday
                          ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/40'
                          : 'text-gray-400 group-hover:text-white bg-transparent group-hover:bg-white/10'}`}>
                        {dayInfo.date.getDate()}
                      </div>

                      <div className="space-y-1.5 overflow-y-auto max-h-[100px] pr-1">
                        {dayInfo.animes?.map(anime => {
                          const firstPlatform = anime.streamingPlatforms?.[0];
                          const badgeStyle = firstPlatform
                            ? getPlatformBadgeStyle(firstPlatform.name, firstPlatform.bgColor, firstPlatform.textColor)
                            : { backgroundColor: 'rgba(255,255,255,0.1)', color: '#e2e8f0' };

                          return (
                            <button
                              key={anime.id}
                              style={badgeStyle}
                              className="w-full text-left text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm hover:scale-105 hover:shadow-md transition-all truncate block opacity-90 hover:opacity-100"
                              title={anime.title}
                              onClick={() => onEditAnime(anime)}
                            >
                              {anime.title}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer / Legend */}
      {platformLegend.length > 0 && (
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Legenda:</span>
            {platformLegend.map(platform => {
              const style = getPlatformBadgeStyle(platform.name, platform.bgColor, platform.textColor);
              return (
                <div key={platform.name} className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-help" title={platform.name}>
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-white/10"
                    style={{ backgroundColor: style.backgroundColor }}
                  />
                  <span className="text-[10px] uppercase font-bold text-gray-400">{platform.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
