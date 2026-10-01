import { Anime } from '../types';

export interface CalendarEventData {
  animeTitle: string;
  episodeNumber: number;
  airingDate: Date;
  hasExactTime: boolean;
  platform?: string;
}

/**
 * Formats a Date object to UTC string for Google Calendar and iCal: YYYYMMDDTHHmmssZ
 */
const formatToUtcCalendarString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

/**
 * Formats a Date object to all-day date string: YYYYMMDD
 */
const formatToAllDayCalendarString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}${month}${day}`;
};

/**
 * Generates a pre-filled Google Calendar event URL.
 */
export const createGoogleCalendarUrl = (event: CalendarEventData): string => {
  const { animeTitle, episodeNumber, airingDate, hasExactTime, platform } = event;

  const title = encodeURIComponent(`[Anime] ${animeTitle} - Ep. ${episodeNumber}`);
  const details = encodeURIComponent(
    `Lançamento do Episódio ${episodeNumber} de "${animeTitle}".\n` +
    (platform ? `Plataforma: ${platform}\n` : '') +
    `Acompanhe e marque como visto no AnimeLista!`
  );

  let datesParam: string;
  if (hasExactTime) {
    const startDateStr = formatToUtcCalendarString(airingDate);
    // Default duration: 30 minutes
    const endDate = new Date(airingDate.getTime() + 30 * 60 * 1000);
    const endDateStr = formatToUtcCalendarString(endDate);
    datesParam = `${startDateStr}/${endDateStr}`;
  } else {
    const startStr = formatToAllDayCalendarString(airingDate);
    const nextDay = new Date(airingDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = formatToAllDayCalendarString(nextDay);
    datesParam = `${startStr}/${endStr}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=AnimeLista`;
};

/**
 * Generates valid iCalendar (RFC 5545) text for one or multiple events.
 */
export const generateIcsContent = (events: CalendarEventData[]): string => {
  const nowUtc = formatToUtcCalendarString(new Date());

  const eventBlocks = events.map((event, index) => {
    const { animeTitle, episodeNumber, airingDate, hasExactTime, platform } = event;
    const uid = `animelista-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}@animelista.app`;
    const summary = `[Anime] ${animeTitle.replace(/,/g, '\\,')} - Ep. ${episodeNumber}`;
    const description = `Lançamento do Episódio ${episodeNumber} de ${animeTitle.replace(/,/g, '\\,')}.${platform ? ` Plataforma: ${platform}.` : ''} Acompanhado via AnimeLista.`;

    let dtStartLine: string;
    let dtEndLine: string;

    if (hasExactTime) {
      dtStartLine = `DTSTART:${formatToUtcCalendarString(airingDate)}`;
      const endDate = new Date(airingDate.getTime() + 30 * 60 * 1000);
      dtEndLine = `DTEND:${formatToUtcCalendarString(endDate)}`;
    } else {
      dtStartLine = `DTSTART;VALUE=DATE:${formatToAllDayCalendarString(airingDate)}`;
      const nextDay = new Date(airingDate);
      nextDay.setDate(nextDay.getDate() + 1);
      dtEndLine = `DTEND;VALUE=DATE:${formatToAllDayCalendarString(nextDay)}`;
    }

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowUtc}`,
      dtStartLine,
      dtEndLine,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Lembrete: Novo episódio de ${animeTitle.replace(/,/g, '\\,')} em 15 minutos!`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AnimeLista//Agenda Otaku//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:AnimeLista - Lançamentos de Animes',
    'X-WR-TIMEZONE:UTC',
    ...eventBlocks,
    'END:VCALENDAR',
  ].join('\r\n');
};

/**
 * Triggers browser download of an .ics file.
 */
export const downloadIcsFile = (filename: string, icsContent: string): void => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports a single episode to a .ics file.
 */
export const exportSingleEpisodeToIcs = (event: CalendarEventData): void => {
  const safeTitle = event.animeTitle.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const filename = `${safeTitle}_ep${event.episodeNumber}.ics`;
  const ics = generateIcsContent([event]);
  downloadIcsFile(filename, ics);
};

/**
 * Exports a list of upcoming episodes into a single comprehensive .ics calendar.
 */
export const exportAllUpcomingToIcs = (events: CalendarEventData[]): void => {
  if (events.length === 0) return;
  const filename = `agenda_animelista_${formatToAllDayCalendarString(new Date())}.ics`;
  const ics = generateIcsContent(events);
  downloadIcsFile(filename, ics);
};
