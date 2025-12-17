import React, { useMemo } from 'react';
import { Anime, AnimeStatus, StreamingPlatform } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from './Icons';
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

    // Se não tem configuração de exibição semanal, ignorar (a menos que tenha caído no if acima)
    if (!parsedAiringStartDate || !anime.airingDaysOfWeek || anime.airingDaysOfWeek.length === 0) return false;

    const airingStartDayOnly = new Date(parsedAiringStartDate.getFullYear(), parsedAiringStartDate.getMonth(), parsedAiringStartDate.getDate());

    // Se a data alvo é ANTES do início da exibição, não mostra
    if (targetDayStart.getTime() < airingStartDayOnly.getTime()) return false;

    // Se o dia da semana da data alvo não está na lista de dias de exibição, não mostra
    if (!anime.airingDaysOfWeek.includes(targetDayOfWeek)) return false;

    // Se não tem limite de episódios definido, assume que continua indefinidamente (One Piece style)
    if (!anime.totalEpisodes || anime.totalEpisodes <= 0) return true;

    // 3. Cálculo de Limite de Episódios
    // Calcula quantos episódios já passaram desde o início até a data alvo
    const diffTime = targetDayStart.getTime() - airingStartDayOnly.getTime();
    const diffDays = Math.round(diffTime / msPerDay);

    const weeksPassed = Math.floor(diffDays / 7);
    const daysRemainder = diffDays % 7;

    // Episódios completos nas semanas inteiras que passaram
    let episodesShown = weeksPassed * anime.airingDaysOfWeek.length;

    // Somar episódios nos dias residuais da última semana (incompleta)
    const startDayOfWeekIndex = airingStartDayOnly.getDay();
    for (let i = 0; i <= daysRemainder; i++) {
      const currentToCheckDay = (startDayOfWeekIndex + i) % 7;
      if (anime.airingDaysOfWeek.includes(currentToCheckDay)) {
        episodesShown++;
      }
    }

    // Se o nª do episódio calculado para hoje for maior que o total, o anime já acabou.
    return episodesShown <= anime.totalEpisodes;
  });

  if (filterStatus === 'ALL') return scheduledAnimes;
  return scheduledAnimes.filter(anime => anime.status === filterStatus);
};


const CalendarView: React.FC<CalendarViewProps> = ({ animeList, currentDate, onNavigateMonth, onEditAnime, filterStatus }) => {
  if (animeList.length === 0) {
    return (
      <div className="text-center py-20 px-8 glass-panel rounded-2xl flex flex-col items-center justify-center animate-fade-in">
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
        if (!uniquePlatforms.has(platform.name)) uniquePlatforms.set(platform.name, platform);
      });
    });
    return Array.from(uniquePlatforms.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [animeList]);

  const noAnimesThisMonth = useMemo(() => {
    return calendarDays.every(dayInfo => dayInfo.isEmpty || (dayInfo.animes && dayInfo.animes.length === 0));
  }, [calendarDays]);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className="text-accent-400">{portugueseMonths[month]}</span>
          <span className="text-gray-500 font-light">{year}</span>
        </h2>
        <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
          <button
            onClick={() => onNavigateMonth('prev')}
            className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="w-px h-4 bg-white/10"></div>
          <button
            onClick={() => onNavigateMonth('next')}
            className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

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
                      let platformStyle: React.CSSProperties = {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: '#e2e8f0'
                      };

                      if (anime.streamingPlatforms && anime.streamingPlatforms.length > 0) {
                        const firstPlatform = anime.streamingPlatforms[0];
                        // Use raw color with opacity for glass looking chips
                        platformStyle.backgroundColor = firstPlatform.bgColor;
                        platformStyle.color = firstPlatform.textColor;
                        // Add a subtle border to platform chips
                        platformStyle.border = `1px solid ${firstPlatform.textColor}20`;
                      }

                      return (
                        <button
                          key={anime.id}
                          style={platformStyle}
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

      {/* Footer / Legend */}
      {(noAnimesThisMonth && animeList.length > 0) ? (
        <div className="p-6 text-center border-t border-white/5 bg-black/20">
          <p className="text-gray-400">Nenhum lançamento previsto para este mês.</p>
        </div>
      ) : (
        platformLegend.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {platformLegend.map(platform => (
                <div key={platform.name} className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-help" title={platform.name}>
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-white/10"
                    style={{ backgroundColor: platform.bgColor }}
                  />
                  <span className="text-[10px] uppercase font-bold text-gray-400">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CalendarView;
