import { useState, useEffect, useMemo } from 'react';

export interface EpisodeCountdownResult {
  formattedCountdown: string;
  isPast: boolean;
  isToday: boolean;
  isImminent: boolean; // Less than 1 hour away
  timeFormatted: string | null; // e.g. "14:30"
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const useEpisodeCountdown = (targetDate: Date, hasExactTime: boolean = false): EpisodeCountdownResult => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // If exact time is available and it's within 48h, tick every second
    // Otherwise tick every 30 seconds
    const diff = targetDate.getTime() - now;
    const isClose = Math.abs(diff) < 48 * 60 * 60 * 1000;
    const intervalMs = hasExactTime && isClose ? 1000 : 30000;

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [targetDate, hasExactTime]);

  return useMemo(() => {
    const targetMs = targetDate.getTime();
    const diffMs = targetMs - now;
    const isPast = diffMs <= 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const isToday = targetDate >= todayStart && targetDate < todayEnd;
    const isImminent = !isPast && diffMs <= 60 * 60 * 1000; // < 1 hour

    const timeFormatted = hasExactTime
      ? targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;

    if (isPast) {
      return {
        formattedCountdown: 'Disponível!',
        isPast: true,
        isToday,
        isImminent: false,
        timeFormatted,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    let formattedCountdown: string;
    if (days > 0) {
      formattedCountdown = `${days}d ${pad(hours)}h ${pad(minutes)}m`;
    } else if (hasExactTime) {
      formattedCountdown = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    } else {
      formattedCountdown = `${pad(hours)}h ${pad(minutes)}m`;
    }

    return {
      formattedCountdown,
      isPast: false,
      isToday,
      isImminent,
      timeFormatted,
      days,
      hours,
      minutes,
      seconds,
    };
  }, [targetDate, now, hasExactTime]);
};
