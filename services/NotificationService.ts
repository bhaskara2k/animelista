
import { Anime, AnimeStatus } from '../types';
import { parseDateString } from '../utils/dateUtils';

const hasBeenNotifiedToday = (key: string, username: string): boolean => {
  const NOTIFICATION_STORAGE_PREFIX = `animeAgendaNotifSent-${username}-`;
  return localStorage.getItem(NOTIFICATION_STORAGE_PREFIX + key) === 'true';
};

const markAsNotifiedToday = (key: string, username: string): void => {
  const NOTIFICATION_STORAGE_PREFIX = `animeAgendaNotifSent-${username}-`;
  localStorage.setItem(NOTIFICATION_STORAGE_PREFIX + key, 'true');
};

const showNotification = (title: string, options: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

export const checkAndShowNotifications = (animeList: Anime[], todayDateString: string, username: string) => {
  if (Notification.permission !== 'granted' || !username) return;

  const today = new Date();
  const todayDayOfWeek = today.getDay();

  animeList.forEach(anime => {
    if (anime.status === AnimeStatus.WATCHING) {
      const isAiringDay = anime.airingDaysOfWeek && anime.airingDaysOfWeek.includes(todayDayOfWeek);
      const hasMoreEpisodes = anime.totalEpisodes === undefined || anime.totalEpisodes === 0 || anime.currentEpisode < anime.totalEpisodes;

      if (isAiringDay && hasMoreEpisodes) {
        const nextEpisodeNumber = anime.currentEpisode + 1;
        const notificationKey = `watching-${anime.id}-ep${nextEpisodeNumber}-${todayDateString}`;
        
        if (!hasBeenNotifiedToday(notificationKey, username)) {
          showNotification(`Novo episódio de ${anime.title}!`, {
            body: `O episódio ${nextEpisodeNumber} pode estar disponível hoje.`,
            icon: anime.imageUrl || undefined,
            badge: '/assets/icons/notification-badge.png',
            tag: notificationKey,
          });
          markAsNotifiedToday(notificationKey, username);
        }
      }
    }

    if (anime.status === AnimeStatus.PLANNED && anime.airingStartDate) {
      const parsedAnimeStartDate = parseDateString(anime.airingStartDate);
      if (parsedAnimeStartDate) {
        const animeStartDateString = `${parsedAnimeStartDate.getFullYear()}-${String(parsedAnimeStartDate.getMonth() + 1).padStart(2, '0')}-${String(parsedAnimeStartDate.getDate()).padStart(2, '0')}`;
        
        if (animeStartDateString === todayDateString) {
          const notificationKey = `planned-${anime.id}-${todayDateString}`;
          if (!hasBeenNotifiedToday(notificationKey, username)) {
            showNotification(`${anime.title} começa hoje!`, {
              body: `Acompanhe ${anime.title} a partir de hoje.`,
              icon: anime.imageUrl || undefined,
              badge: '/assets/icons/notification-badge.png',
              tag: notificationKey,
            });
            markAsNotifiedToday(notificationKey, username);
          }
        }
      }
    }
  });
};
