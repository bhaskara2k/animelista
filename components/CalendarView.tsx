
import React, { useMemo } from 'react';
import { Anime, AnimeStatus, StreamingPlatform } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from './Icons'; // Added CalendarDaysIcon
import { parseDateString } from '../utils/dateUtils'; 

interface CalendarViewProps {
  animeList: Anime[];
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onEditAnime: (anime: Anime) => void;
  filterStatus: AnimeStatus | 'ALL'; 
}

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const portugueseMonths = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const getAnimesForDate = (animeList: Anime[], targetDate: Date, filterStatus: AnimeStatus | 'ALL'): Anime[] => {
  const targetDayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const scheduledAnimes = animeList.filter(anime => {
    if (anime.nextAiringDate) {
      const specificAirDate = parseDateString(anime.nextAiringDate);
      if (specificAirDate) {
        const specificAirDayStart = new Date(specificAirDate.getFullYear(), specificAirDate.getMonth(), specificAirDate.getDate());
        if (specificAirDayStart.getTime() === targetDayStart.getTime()) {
          return true; 
        }
      }
    }

    const parsedAiringStartDate = anime.airingStartDate ? parseDateString(anime.airingStartDate) : null;

    if (!parsedAiringStartDate || !anime.airingDaysOfWeek || anime.airingDaysOfWeek.length === 0) {
      return false;
    }

    const airingStartDayOnly = new Date(parsedAiringStartDate.getFullYear(), parsedAiringStartDate.getMonth(), parsedAiringStartDate.getDate());

    if (targetDayStart.getTime() < airingStartDayOnly.getTime()) {
      return false;
    }

    const targetDayOfWeek = targetDayStart.getDay(); 
    if (!anime.airingDaysOfWeek.includes(targetDayOfWeek)) {
      return false;
    }

    if (anime.totalEpisodes && anime.totalEpisodes > 0) {
      let episodeCount = 0;
      let currentDateIter = new Date(airingStartDayOnly);
      
      while (currentDateIter.getTime() <= targetDayStart.getTime()) {
        if (anime.airingDaysOfWeek.includes(currentDateIter.getDay())) {
          episodeCount++;
        }
        if (currentDateIter.getTime() === targetDayStart.getTime()) {
          return episodeCount <= anime.totalEpisodes;
        }
        currentDateIter.setDate(currentDateIter.getDate() + 1);
        if (episodeCount > (anime.totalEpisodes + anime.airingDaysOfWeek.length * 4)) { 
            return false;
        }
      }
      return false; 
    } else {
      return true; 
    }
  });

  if (filterStatus === 'ALL') {
    return scheduledAnimes;
  }
  return scheduledAnimes.filter(anime => anime.status === filterStatus);
};


const CalendarView: React.FC<CalendarViewProps> = ({ animeList, currentDate, onNavigateMonth, onEditAnime, filterStatus }) => {
  if (animeList.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 px-6 bg-surface-primary rounded-lg shadow-custom-md border border-border-primary">
        <CalendarDaysIcon className="w-16 h-16 mx-auto text-text-tertiary mb-6" opticalSize={48} />
        <p className="text-xl font-semibold text-text-secondary mb-2">Sua agenda está vazia.</p>
        <p className="text-text-tertiary">
          Adicione animes e defina suas datas de lançamento para vê-los no calendário.
        </p>
      </div>
    );
  }
  
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

  const platformLegend = useMemo(() => {
    const uniquePlatforms = new Map<string, StreamingPlatform>();
    animeList.forEach(anime => {
      anime.streamingPlatforms?.forEach(platform => {
        if (!uniquePlatforms.has(platform.name)) {
          uniquePlatforms.set(platform.name, platform);
        }
      });
    });
    return Array.from(uniquePlatforms.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [animeList]);
  
  const noAnimesThisMonth = useMemo(() => {
    return calendarDays.every(dayInfo => dayInfo.isEmpty || (dayInfo.animes && dayInfo.animes.length === 0));
  }, [calendarDays]);


  return (
    <div className="bg-surface-primary p-4 md:p-6 rounded-lg shadow-custom-xl">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onNavigateMonth('prev')}
          className="p-2 rounded-md hover:bg-surface-hover transition-colors"
          aria-label="Mês anterior"
        >
          <ChevronLeftIcon className="w-6 h-6 text-accent" />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-accent">
          {portugueseMonths[month]} {year}
        </h2>
        <button
          onClick={() => onNavigateMonth('next')}
          className="p-2 rounded-md hover:bg-surface-hover transition-colors"
          aria-label="Próximo mês"
        >
          <ChevronRightIcon className="w-6 h-6 text-accent" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-medium text-text-secondary mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="p-2 text-xs sm:text-base">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo) => (
          <div
            key={dayInfo.key}
            className={`h-28 md:h-32 p-1.5 border border-border-primary rounded-md transition-colors
              ${dayInfo.isEmpty ? 'bg-bg-secondary/50' : 'bg-surface-secondary/80 hover:bg-surface-hover/70'}
              ${!dayInfo.isEmpty && dayInfo.isToday ? 'ring-2 ring-accent-ring bg-accent-500/10' : ''}`}
          >
            {!dayInfo.isEmpty && dayInfo.date && (
              <>
                <div className={`text-xs md:text-sm font-semibold ${dayInfo.isToday ? 'text-accent' : 'text-text-primary'}`}>
                  {dayInfo.date.getDate()}
                </div>
                <ul className="mt-1 space-y-0.5 text-left overflow-y-auto max-h-[calc(100%-1.5rem)] text-[10px] md:text-xs">
                  {dayInfo.animes?.slice(0, 3).map(anime => {
                    let platformStyle: React.CSSProperties = { 
                        backgroundColor: 'var(--surface-hover)', 
                        color: 'var(--text-primary)',
                        padding: '2px 4px',
                        borderRadius: '0.125rem',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    };

                    if (anime.streamingPlatforms && anime.streamingPlatforms.length > 0) {
                        const firstPlatform = anime.streamingPlatforms[0];
                        platformStyle.backgroundColor = firstPlatform.bgColor;
                        platformStyle.color = firstPlatform.textColor;

                        const hex = firstPlatform.bgColor.replace('#', '');
                        if (hex.length === 6) {
                            const r = parseInt(hex.substring(0, 2), 16);
                            const g = parseInt(hex.substring(2, 4), 16);
                            const b = parseInt(hex.substring(4, 6), 16);
                            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                            if (brightness > 200 && firstPlatform.textColor.toLowerCase() === '#ffffff') {
                                platformStyle.color = '#000000';
                            }
                        }
                    }

                    return (
                        <li key={anime.id} 
                            style={platformStyle}
                            className="hover:opacity-80 transition-opacity"
                            title={anime.title}
                            onClick={() => onEditAnime(anime)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && onEditAnime(anime)}
                            aria-label={`Editar ${anime.title}`}
                        >
                        {anime.title}
                        </li>
                    );
                  })}
                  {dayInfo.animes && dayInfo.animes.length > 3 && (
                    <li className="text-text-tertiary text-[10px] md:text-xs italic p-0.5">
                      + {dayInfo.animes.length - 3} mais
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
      
      {noAnimesThisMonth && animeList.length > 0 && (
        <div className="text-center py-6 mt-4">
          <p className="text-text-secondary">
            Nenhum anime programado para este mês com os filtros atuais.
          </p>
          <p className="text-text-tertiary text-sm">Tente limpar os filtros ou verifique outros meses.</p>
        </div>
      )}

      {platformLegend.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border-primary">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 text-center">Legenda de Cores das Plataformas</h3>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {platformLegend.map(platform => (
              <div key={platform.name} className="flex items-center space-x-1.5">
                <span
                  className="w-3 h-3 rounded-xs inline-block border border-border-secondary shadow-sm"
                  style={{ backgroundColor: platform.bgColor }}
                  title={platform.name}
                ></span>
                <span className="text-xs text-text-secondary">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
