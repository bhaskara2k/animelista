

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Anime, AnimeStatus, AnimeFormData, StreamingPlatform, SortOption, StatisticsData, AudioType, ViewMode, AniListMedia, AppSettings, ThemeOption, AccentColorOption, ListDensityOption, AchievementTier, FeedEventType } from './types';
import AnimeList from './components/AnimeList';
import AnimeForm from './components/AnimeForm';
import Modal from './components/Modal';
import CalendarView from './components/CalendarView';
import RankingView from './components/RankingView';
import StatisticsView from './components/StatisticsView';
import RatingPromptModal from './components/RatingPromptModal';
import ConfirmationModal from './components/ConfirmationModal';
import FilterSortControls from './components/FilterSortControls';
import SettingsModal from './components/SettingsModal';
import DiscoverView from './components/DiscoverView';
import AchievementsView from './components/AchievementsView';
import UpcomingEpisodesView from './components/UpcomingEpisodesView';
import HeaderBanner from './components/HeaderBanner';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';
import AppHeader from './components/AppHeader';

import { useUserAchievements } from './hooks/useUserAchievements';
import { useAuth } from './contexts/AuthContext';
import AvatarDisplay from './components/AvatarDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { supabase } from './services/supabaseClient';
import * as SocialService from './services/SocialService';
import * as GamificationService from './services/GamificationService';
import { Toast, ToastContainer } from './components/ToastNotification';


import { translateGenre } from './utils/translationUtils';
import { PlusIcon, CalendarDaysIcon, ListBulletIcon, TrophyIcon, ChartPieIcon, QuestionMarkCircleIcon, BellIcon, BellSlashIcon, Cog6ToothIcon, ArrowUpTrayIcon, SparklesIcon, MedalIcon, SearchIcon, UsersIcon, ChevronDownIcon } from './components/Icons';
import { prioritizeStreamingPlatforms } from './utils/platformUtils';
import { calculateDateForSpecificEpisode } from './utils/episodeUtils';


import { useNotifications } from './hooks/useNotifications';
import { checkAndShowNotifications } from './services/NotificationService';
import { getTodayDateString, parseDateString, formatToYYYYMMDD, parseFromYYYYMMDD, formatAniListDateForInput } from './utils/dateUtils';

const ACCENT_COLOR_VALUES: Record<AccentColorOption, Record<string, string>> = {
  sky: { '100': '#e0f2fe', '200': '#bae6fd', '300': '#7dd3fc', '400': '#38bdf8', '500': '#0ea5e9', '600': '#0284c7', '700': '#0369a1', '800': '#075985', '900': '#0c4a6e' },
  emerald: { '100': '#d1fae5', '200': '#a7f3d0', '300': '#6ee7b7', '400': '#34d399', '500': '#10b981', '600': '#059669', '700': '#047857', '800': '#065f46', '900': '#064e3b' },
  rose: { '100': '#ffe4e6', '200': '#fecdd3', '300': '#fda4af', '400': '#fb7185', '500': '#f43f5e', '600': '#e11d48', '700': '#be123c', '800': '#9f1239', '900': '#881337' },
  amber: { '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d', '400': '#fbbf24', '500': '#f59e0b', '600': '#d97706', '700': '#b45309', '800': '#92400e', '900': '#78350f' },
  indigo: { '100': '#e0e7ff', '200': '#c7d2fe', '300': '#a5b4fc', '400': '#818cf8', '500': '#6366f1', '600': '#4f46e5', '700': '#4338ca', '800': '#3730a3', '900': '#312e81' },
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: 'sky',
  listDensity: 'normal',
};

const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const appPlatformColorMap: Record<string, { bgColor: string; textColor: string }> = {
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
const defaultAppPlatformColors = { bgColor: '#4A5568', textColor: '#FFFFFF' };

// Helper to convert anime from DB (snake_case) to app format (camelCase)
const formatAnimeFromDb = (dbAnime: any): Anime => ({
  id: dbAnime.id,
  title: dbAnime.title,
  currentEpisode: dbAnime.current_episode,
  totalEpisodes: dbAnime.total_episodes,
  status: dbAnime.status,
  imageUrl: dbAnime.image_url,
  bannerImage: dbAnime.banner_image,
  streamingPlatforms: dbAnime.streaming_platforms || undefined,
  notes: dbAnime.notes,
  nextAiringDate: dbAnime.next_airing_date,
  airingDaysOfWeek: dbAnime.airing_days_of_week || [],
  airingStartDate: dbAnime.airing_start_date,
  rating: dbAnime.rating,
  genres: dbAnime.genres || [],
  audioType: dbAnime.audio_type || AudioType.UNKNOWN,
});

// Helper to convert anime from app format (camelCase) to DB format (snake_case)
const formatAnimeForDb = (appAnime: Anime, userId: string) => ({
  id: appAnime.id,
  user_id: userId,
  title: appAnime.title,
  current_episode: appAnime.currentEpisode,
  total_episodes: appAnime.totalEpisodes,
  status: appAnime.status,
  image_url: appAnime.imageUrl,
  banner_image: appAnime.bannerImage,
  streaming_platforms: appAnime.streamingPlatforms,
  notes: appAnime.notes,
  next_airing_date: appAnime.nextAiringDate || null,
  airing_days_of_week: appAnime.airingDaysOfWeek,
  airing_start_date: appAnime.airingStartDate || null,
  rating: appAnime.rating,
  genres: appAnime.genres,
  audio_type: appAnime.audioType === AudioType.UNKNOWN ? null : appAnime.audioType,
});


const MainApp: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const NOTIFICATION_EXPIRY_DAYS = 30;

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<AnimeStatus | 'ALL'>('ALL');

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [profileViewUsername, setProfileViewUsername] = useState<string | null>(null);
  const [listSubView, setListSubView] = useState<'all' | 'upcoming'>('all');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const [isRatingPromptModalOpen, setIsRatingPromptModalOpen] = useState(false);
  const [animeToPromptRating, setAnimeToPromptRating] = useState<Anime | null>(null);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [animeIdToDelete, setAnimeIdToDelete] = useState<string | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const [isConfirmImportModalOpen, setIsConfirmImportModalOpen] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const { permission: notificationPermission, requestNotificationPermission } = useNotifications();


  const addToast = useCallback((message: string, type: 'xp' | 'level-up') => {
    const newToast: Toast = { id: Date.now(), message, type };
    setToasts(prevToasts => [...prevToasts, newToast]);
  }, []);

  const handleBulkXpGain = useCallback(async (xpAmount: number) => {
    if (!currentUser || xpAmount <= 0) return;
    try {
      const { newLevel, newXp, didLevelUp, xpGained, newRank } = await GamificationService.addXp(currentUser.id, xpAmount);

      setCurrentUser(prevUser => prevUser ? { ...prevUser, level: newLevel, xp: newXp } : null);

      addToast(`+${xpGained} XP!`, 'xp');

      if (didLevelUp && newRank) {
        setTimeout(() => {
          addToast(`<strong>LEVEL UP!</strong><br>Você alcançou o Nível ${newLevel} e a patente de <strong class="text-yellow-200">${newRank.title}</strong>!`, 'level-up');
        }, 500); // Delay level up toast slightly
      }
    } catch (error: any) {
      console.error(`Failed to add ${xpAmount} XP. Error:`, error.message || 'An unknown error occurred.', 'Full error object:', error);
    }
  }, [currentUser, setCurrentUser, addToast]);

  const handleAchievementUnlocked = useCallback(async (achievement: AchievementTier) => {
    if (!currentUser) return;
    try {
      await SocialService.createFeedEvent(currentUser.id, FeedEventType.UNLOCKED_ACHIEVEMENT, {
        achievement_title: achievement.title,
        achievement_description: achievement.description,
      });
      await handleBulkXpGain(GamificationService.XP_EVENTS.UNLOCK_ACHIEVEMENT);
    } catch (error) {
      console.error("Failed to create achievement feed event:", error);
      alert("Não foi possível registrar a nova conquista no feed de atividades.");
    }
  }, [currentUser, handleBulkXpGain]);

  const { userAchievements, achievementDefinitions: staticAchievementDefinitions } = useUserAchievements(animeList, currentUser?.id, handleAchievementUnlocked);


  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('');
  const [filterMinRating, setFilterMinRating] = useState<number>(0);
  const [filterAudioType, setFilterAudioType] = useState<AudioType | 'ALL'>('ALL');
  const [filterNoSpecificAiring, setFilterNoSpecificAiring] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');


  useEffect(() => {
    if (!currentUser) {
      setAnimeList([]);
      setAppSettings(DEFAULT_SETTINGS);
      setIsLoadingData(false);
      return;
    };

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const { data: animes, error: animesError } = await supabase
          .from('animes')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (animesError) throw animesError;
        setAnimeList(animes.map(formatAnimeFromDb));

        const { data: settings, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

        if (settings) {
          setAppSettings({
            theme: settings.theme,
            accentColor: settings.accent_color,
            listDensity: settings.list_density,
          });
        } else {
          setAppSettings(DEFAULT_SETTINGS);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  // Apply UI theme and accent color from settings
  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${appSettings.theme}`);

    const currentAccent = ACCENT_COLOR_VALUES[appSettings.accentColor];
    const rootStyle = document.documentElement.style;
    Object.keys(currentAccent).forEach(shade => {
      rootStyle.setProperty(`--accent-${shade}`, currentAccent[shade]);
    });
  }, [appSettings]);


  const handleUpdateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    if (!currentUser) return;

    const updatedSettings = { ...appSettings, ...newSettings };
    setAppSettings(updatedSettings);

    const settingsForDb = {
      user_id: currentUser.id,
      theme: updatedSettings.theme,
      accent_color: updatedSettings.accentColor,
      list_density: updatedSettings.listDensity,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('settings')
      .upsert(settingsForDb, { onConflict: 'user_id' });

    if (error) {
      console.error("Error saving settings:", error);
      // Optionally revert local state or show an error
    }
  }, [appSettings, currentUser]);


  const cleanupOldNotifications = useCallback(() => {
    if (!currentUser?.username) return;
    const NOTIFICATION_STORAGE_PREFIX = `animeAgendaNotifSent-${currentUser.username}-`;
    const today = new Date();
    // This is a client-side cleanup. If a user uses two browsers, notifications might re-trigger.
    // For a robust solution, notification state should be in the DB. This is a good-enough implementation for now.
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(NOTIFICATION_STORAGE_PREFIX)) {
        const datePartMatch = key.match(/(\d{4}-\d{2}-\d{2})$/);
        if (datePartMatch && datePartMatch[1]) {
          const notificationDate = parseFromYYYYMMDD(datePartMatch[1]);
          if (notificationDate) {
            const diffTime = Math.abs(today.getTime() - notificationDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > NOTIFICATION_EXPIRY_DAYS) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    }
  }, [currentUser?.username]);

  useEffect(() => {
    if (currentUser?.username) {
      cleanupOldNotifications();
    }
  }, [currentUser?.username, cleanupOldNotifications]);


  useEffect(() => {
    if (notificationPermission === 'granted' && animeList.length > 0 && currentUser?.username) {
      const today = getTodayDateString();
      checkAndShowNotifications(animeList, today, currentUser.username);
    }
  }, [animeList, notificationPermission, currentUser?.username]);


  const handleAddOrUpdateAnime = useCallback(async (animeData: Anime) => {
    if (!currentUser) return;

    const originalAnime = animeList.find(a => a.id === animeData.id);
    const animeForDb = formatAnimeForDb(animeData, currentUser.id);

    const { data, error } = await supabase
      .from('animes')
      .upsert(animeForDb)
      .select()
      .single();

    if (error) {
      console.error("Error saving anime:", error);
      alert(`Erro ao salvar anime: ${error.message}`);
      return;
    }

    const returnedAnime = formatAnimeFromDb(data);

    setAnimeList(prevList => {
      const existingIndex = prevList.findIndex(a => a.id === returnedAnime.id);
      if (existingIndex > -1) {
        const newList = [...prevList];
        newList[existingIndex] = returnedAnime;
        return newList;
      } else {
        return [returnedAnime, ...prevList];
      }
    });

    // --- XP & Feed Logic ---
    const isAddingNew = !originalAnime;
    const wasCompleted = originalAnime?.status === AnimeStatus.COMPLETED;
    const isNowCompleted = returnedAnime.status === AnimeStatus.COMPLETED;
    const wasRated = originalAnime?.rating !== undefined && originalAnime.rating > 0;
    const isNowRated = returnedAnime.rating !== undefined && returnedAnime.rating > 0;
    const episodesIncreased = isAddingNew
      ? returnedAnime.currentEpisode
      : Math.max(0, returnedAnime.currentEpisode - (originalAnime?.currentEpisode || 0));

    let totalXpGained = 0;

    if (isAddingNew) {
      totalXpGained += GamificationService.XP_EVENTS.ADD_ANIME;
    }
    if (episodesIncreased > 0) {
      totalXpGained += GamificationService.XP_EVENTS.WATCH_EPISODE * episodesIncreased;
    }
    if (isNowCompleted && !wasCompleted) {
      totalXpGained += GamificationService.XP_EVENTS.COMPLETE_ANIME;
    }
    if (isNowRated && !wasRated) {
      totalXpGained += GamificationService.XP_EVENTS.RATE_ANIME;
    }

    if (totalXpGained > 0) {
      handleBulkXpGain(totalXpGained);
    }

    if (isNowCompleted && !wasCompleted) {
      try {
        await SocialService.createFeedEvent(currentUser.id, FeedEventType.COMPLETED_ANIME, {
          anime_title: returnedAnime.title,
          anime_image_url: returnedAnime.imageUrl,
        });
      } catch (eventError) {
        console.error("Failed to create feed event from form submission:", eventError);
      }

      if (!isNowRated) {
        setAnimeToPromptRating(returnedAnime);
        setIsRatingPromptModalOpen(true);
      }
    }
    // --- End XP & Feed Logic ---

    setIsModalOpen(false);
    setEditingAnime(null);
  }, [currentUser, animeList, handleBulkXpGain]);

  const handleDeleteAnime = useCallback((id: string) => {
    setAnimeIdToDelete(id);
    setIsConfirmDeleteModalOpen(true);
  }, []);

  const executeDeleteAnime = useCallback(async () => {
    if (!animeIdToDelete || !currentUser) return;

    setAnimeList(prevList => prevList.filter(anime => anime.id !== animeIdToDelete));

    const { error } = await supabase.from('animes').delete().eq('id', animeIdToDelete);

    if (error) {
      console.error("Error deleting anime:", error);
      alert(`Erro ao deletar anime: ${error.message}`);
      // Here you might want to re-fetch the list to ensure consistency
    }

    setAnimeIdToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  }, [animeIdToDelete, currentUser]);


  const updateAnimeInDbAndState = useCallback(async (id: string, updates: Partial<Anime>) => {
    if (!currentUser) return;

    const originalAnime = animeList.find(a => a.id === id);
    if (!originalAnime) return;

    const updatedAnime = { ...originalAnime, ...updates };
    setAnimeList(prevList => prevList.map(a => (a.id === id ? updatedAnime : a)));

    const updatesForDb: any = {};
    if (updates.currentEpisode !== undefined) updatesForDb.current_episode = updates.currentEpisode;
    if (updates.status !== undefined) updatesForDb.status = updates.status;
    if (updates.rating !== undefined) {
      updatesForDb.rating = updates.rating;
    } else if (updates.status && updates.status !== AnimeStatus.COMPLETED) {
      updatesForDb.rating = null;
    }

    const { error } = await supabase.from('animes').update(updatesForDb).eq('id', id);

    if (error) {
      console.error("Error updating anime:", error);
      alert(`Erro ao atualizar anime: ${error.message}`);
      setAnimeList(prevList => prevList.map(a => (a.id === id ? originalAnime : a)));
      return;
    }

    // --- XP & Feed Logic ---
    const wasCompleted = originalAnime.status === AnimeStatus.COMPLETED;
    const isNowCompleted = updatedAnime.status === AnimeStatus.COMPLETED;
    const wasRated = originalAnime.rating !== undefined && originalAnime.rating > 0;
    const isNowRated = updatedAnime.rating !== undefined && updatedAnime.rating > 0;
    const episodesIncreased = Math.max(0, updatedAnime.currentEpisode - originalAnime.currentEpisode);

    let totalXpGained = 0;

    if (episodesIncreased > 0) {
      totalXpGained += GamificationService.XP_EVENTS.WATCH_EPISODE * episodesIncreased;
    }
    if (isNowCompleted && !wasCompleted) {
      totalXpGained += GamificationService.XP_EVENTS.COMPLETE_ANIME;
    }
    if (isNowRated && !wasRated) {
      totalXpGained += GamificationService.XP_EVENTS.RATE_ANIME;
    }

    if (totalXpGained > 0) {
      handleBulkXpGain(totalXpGained);
    }

    if (isNowCompleted && !wasCompleted) {
      try {
        await SocialService.createFeedEvent(currentUser.id, FeedEventType.COMPLETED_ANIME, {
          anime_title: updatedAnime.title,
          anime_image_url: updatedAnime.imageUrl,
        });
      } catch (eventError) {
        console.error("Failed to create feed event:", eventError);
      }

      if (!isNowRated) {
        setAnimeToPromptRating(updatedAnime);
        setIsRatingPromptModalOpen(true);
      }
    }
    // --- End XP & Feed Logic ---
  }, [animeList, currentUser, handleBulkXpGain]);

  const handleUpdateEpisode = useCallback((id: string, newEpisodeCount: number) => {
    const anime = animeList.find(a => a.id === id);
    if (!anime) return;

    let updates: Partial<Anime> = { currentEpisode: newEpisodeCount };
    if (anime.totalEpisodes && anime.totalEpisodes > 0 && newEpisodeCount >= anime.totalEpisodes) {
      updates.status = AnimeStatus.COMPLETED;
    }
    updateAnimeInDbAndState(id, updates);
  }, [animeList, updateAnimeInDbAndState]);

  const handleSetStatus = useCallback((id: string, status: AnimeStatus) => {
    updateAnimeInDbAndState(id, { status });
  }, [updateAnimeInDbAndState]);

  const handleSetRating = useCallback((id: string, rating: number) => {
    updateAnimeInDbAndState(id, { rating });
  }, [updateAnimeInDbAndState]);


  const openAddModal = () => {
    setEditingAnime(null);
    setIsModalOpen(true);
  };

  const openEditModal = (anime: Anime) => {
    setEditingAnime(anime);
    setIsModalOpen(true);
  };

  const handleAddAnimeFromDiscover = useCallback((aniListMedia: AniListMedia) => {
    const foundPlatforms: StreamingPlatform[] = [];
    if (aniListMedia.externalLinks) {
      aniListMedia.externalLinks.forEach(link => {
        if (link.type === "STREAMING") {
          const platformKey = link.site.toLowerCase();
          const platformConfig = appPlatformColorMap[platformKey];
          if (platformConfig) {
            let displayName = platformKey.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            if (platformKey === 'disney+') displayName = 'Disney+';
            else if (platformKey === 'youtube') displayName = 'YouTube';
            else if (platformKey === 'official site') displayName = 'Official Site';
            else if (platformKey === 'amazon prime video') displayName = 'Amazon Prime Video';

            if (!foundPlatforms.find(p => p.name.toLowerCase() === platformKey)) {
              foundPlatforms.push({
                name: displayName,
                bgColor: platformConfig.bgColor,
                textColor: platformConfig.textColor,
              });
            }
          }
        }
      });
    }

    let appStatus = AnimeStatus.PLANNED;
    if (aniListMedia.status) {
      switch (aniListMedia.status) {
        case 'RELEASING': appStatus = AnimeStatus.WATCHING; break;
        case 'FINISHED': appStatus = AnimeStatus.COMPLETED; break;
        case 'NOT_YET_RELEASED': appStatus = AnimeStatus.PLANNED; break;
        case 'CANCELLED': appStatus = AnimeStatus.DROPPED; break;
        case 'HIATUS': appStatus = AnimeStatus.ON_HOLD; break;
        default: appStatus = AnimeStatus.PLANNED;
      }
    }

    const animeToEditOrAdd: Anime = {
      id: crypto.randomUUID(),
      title: aniListMedia.title.romaji || aniListMedia.title.english || aniListMedia.title.native || 'Título Desconhecido',
      currentEpisode: 0,
      totalEpisodes: aniListMedia.episodes || undefined,
      status: appStatus,
      imageUrl: aniListMedia.coverImage.extraLarge || aniListMedia.coverImage.large || '',
      bannerImage: aniListMedia.bannerImage || aniListMedia.coverImage.extraLarge || '',
      streamingPlatforms: foundPlatforms.length > 0 ? prioritizeStreamingPlatforms(foundPlatforms) : undefined,
      notes: stripHtml(aniListMedia.description) || '',
      nextAiringDate: undefined,
      airingDaysOfWeek: [],
      airingStartDate: formatAniListDateForInput(aniListMedia.startDate) || undefined,
      rating: appStatus === AnimeStatus.COMPLETED ? 0 : undefined,
      genres: aniListMedia.genres ? aniListMedia.genres.map(translateGenre) : [],
      audioType: AudioType.UNKNOWN,
    };

    setEditingAnime(animeToEditOrAdd);
    setIsModalOpen(true);
  }, []);

  const handleExportData = () => {
    if (!currentUser) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(animeList, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `anime_agenda_backup_${currentUser.username}.json`;
    link.click();
    link.remove();
  };

  const handleImportDataRequest = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentUser) {
      setPendingImportFile(file);
      setIsConfirmImportModalOpen(true);
    } else if (!currentUser) {
      alert("Você precisa estar logado para importar dados.");
    }
    event.target.value = '';
  };

  const executeActualImport = async () => {
    if (!pendingImportFile || !currentUser) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("Falha ao ler o arquivo.");

        const importedAnimes = JSON.parse(text) as Anime[];
        // Basic validation
        if (!Array.isArray(importedAnimes) || !importedAnimes.every(item => item.id && item.title && item.status)) {
          throw new Error("Formato de arquivo inválido.");
        }

        const animesToInsert = importedAnimes.map(anime => formatAnimeForDb(anime, currentUser.id));

        const { error: deleteError } = await supabase.from('animes').delete().eq('user_id', currentUser.id);
        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase.from('animes').insert(animesToInsert);
        if (insertError) throw insertError;

        setAnimeList(importedAnimes);
        alert("Dados importados com sucesso!");

      } catch (error: any) {
        console.error("Erro ao importar dados:", error);
        alert(`Erro ao importar dados: ${error.message}`);
      } finally {
        setIsConfirmImportModalOpen(false);
        setPendingImportFile(null);
      }
    };
    reader.onerror = () => {
      alert("Erro ao ler o arquivo.");
      setIsConfirmImportModalOpen(false);
      setPendingImportFile(null);
    }
    reader.readAsText(pendingImportFile);
  };


  const availablePlatforms = useMemo(() => {
    const platformSet = new Set<string>();
    animeList.forEach(anime => {
      anime.streamingPlatforms?.forEach(p => platformSet.add(p.name));
    });
    return Array.from(platformSet).sort((a, b) => a.localeCompare(b));
  }, [animeList]);


  const getSortableNextAiringDate = (anime: Anime, today: Date): Date | null => {
    if (anime.nextAiringDate) {
      const specificDate = parseFromYYYYMMDD(anime.nextAiringDate);
      if (specificDate && specificDate.getTime() >= today.getTime()) {
        return specificDate;
      }
    }

    if (anime.airingDaysOfWeek && anime.airingDaysOfWeek.length > 0 && anime.airingStartDate) {
      const startDate = parseFromYYYYMMDD(anime.airingStartDate);
      if (!startDate) return null;

      if (anime.totalEpisodes && anime.currentEpisode >= anime.totalEpisodes) {
        return null;
      }

      let checkDate = new Date(Math.max(today.getTime(), startDate.getTime()));
      checkDate.setHours(0, 0, 0, 0);

      if (startDate.getTime() > today.getTime()) {
        checkDate = new Date(startDate);
        checkDate.setHours(0, 0, 0, 0);
      }

      for (let i = 0; i < 365 * 2; i++) {
        const dayOfWeek = checkDate.getDay();
        if (anime.airingDaysOfWeek.includes(dayOfWeek)) {
          if (checkDate.getTime() >= new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()) {
            return checkDate;
          }
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }
    }
    return null;
  };

  const filteredAnimeList = useMemo(() => {
    let animes = [...animeList];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (searchTerm) {
      animes = animes.filter(anime =>
        anime.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'ALL') {
      animes = animes.filter(anime => anime.status === filterStatus);
    }

    if (filterPlatform) {
      animes = animes.filter(anime =>
        anime.streamingPlatforms?.some(p => p.name.toLowerCase() === filterPlatform.toLowerCase())
      );
    }

    if (filterMinRating > 0) {
      const minScore = filterMinRating;
      animes = animes.filter(anime => anime.rating !== undefined && anime.rating >= minScore);
    }

    if (filterAudioType !== 'ALL') {
      animes = animes.filter(anime => {
        if (filterAudioType === AudioType.UNKNOWN) {
          return anime.audioType === undefined || anime.audioType === AudioType.UNKNOWN;
        }
        return anime.audioType === filterAudioType;
      });
    }


    if (filterNoSpecificAiring) {
      animes = animes.filter(anime => {
        const hasSpecificDate = !!anime.nextAiringDate && !!parseFromYYYYMMDD(anime.nextAiringDate);
        const hasWeeklySchedule = anime.airingDaysOfWeek && anime.airingDaysOfWeek.length > 0 && !!parseFromYYYYMMDD(anime.airingStartDate);
        return !hasSpecificDate && !hasWeeklySchedule;
      });
    }

    if (sortOption !== 'default') {
      animes.sort((a, b) => {
        switch (sortOption) {
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'rating-asc':
            return (a.rating ?? -1) - (b.rating ?? -1);
          case 'rating-desc':
            return (b.rating ?? -1) - (a.rating ?? -1);
          case 'nextAiring-asc': {
            const dateA = getSortableNextAiringDate(a, today);
            const dateB = getSortableNextAiringDate(b, today);
            if (dateA === null && dateB === null) return 0;
            if (dateA === null) return 1;
            if (dateB === null) return -1;
            return dateA.getTime() - dateB.getTime();
          }
          case 'nextAiring-desc': {
            const dateA = getSortableNextAiringDate(a, today);
            const dateB = getSortableNextAiringDate(b, today);
            if (dateA === null && dateB === null) return 0;
            if (dateA === null) return 1;
            if (dateB === null) return -1;
            return dateB.getTime() - dateA.getTime();
          }
          default:
            return 0;
        }
      });
    }
    return animes;
  }, [animeList, searchTerm, filterStatus, filterPlatform, filterMinRating, filterAudioType, filterNoSpecificAiring, sortOption]);

  const upcomingAnimesForView = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const candidates = animeList
      .filter(
        (anime) =>
          anime.status === AnimeStatus.WATCHING &&
          (anime.totalEpisodes === undefined ||
            anime.totalEpisodes === 0 ||
            anime.currentEpisode < anime.totalEpisodes)
      )
      .map((anime) => {
        const nextEpisodeNumber = anime.currentEpisode + 1;
        let finalNextAiringDate: Date | null = null;

        const calculatedWeeklyDate = calculateDateForSpecificEpisode(anime, nextEpisodeNumber);

        if (calculatedWeeklyDate) {
          finalNextAiringDate = calculatedWeeklyDate;
        } else if (anime.nextAiringDate) {
          const specificDate = parseFromYYYYMMDD(anime.nextAiringDate);
          if (specificDate && specificDate >= today) {
            finalNextAiringDate = specificDate;
          }
        }

        return {
          anime,
          nextEpisodeNumber,
          nextAiringDate: finalNextAiringDate,
        };
      })
      .filter(
        (item): item is { anime: Anime; nextEpisodeNumber: number; nextAiringDate: Date } =>
          item.nextAiringDate !== null && item.nextAiringDate >= today
      )
      .sort((a, b) => {
        return a.nextAiringDate.getTime() - b.nextAiringDate.getTime();
      });

    return candidates;
  }, [animeList]);


  const rankedAnimesList = useMemo(() =>
    animeList
      .filter(anime => anime.status === AnimeStatus.COMPLETED && typeof anime.rating === 'number' && anime.rating > 0)
      .sort((a, b) => {
        if (b.rating! !== a.rating!) {
          return b.rating! - a.rating!;
        }
        return a.title.localeCompare(b.title);
      }), [animeList]);

  const calculatedStats = useMemo<StatisticsData>(() => {
    const stats: StatisticsData = {
      totalAnimes: animeList.length,
      statusCounts: {
        [AnimeStatus.WATCHING]: 0,
        [AnimeStatus.COMPLETED]: 0,
        [AnimeStatus.PLANNED]: 0,
        [AnimeStatus.ON_HOLD]: 0,
        [AnimeStatus.DROPPED]: 0,
      },
      totalEpisodesWatched: 0,
      genreFrequency: [],
      averageRating: undefined,
      platformFrequency: [],
    };

    const genreMap: { [key: string]: number } = {};
    const platformMap: { [key: string]: number } = {};
    let ratedAnimesCount = 0;
    let totalRatingSum = 0;

    animeList.forEach(anime => {
      stats.statusCounts[anime.status]++;

      if (anime.status === AnimeStatus.WATCHING || anime.status === AnimeStatus.ON_HOLD) {
        stats.totalEpisodesWatched += anime.currentEpisode;
      } else if (anime.status === AnimeStatus.COMPLETED) {
        stats.totalEpisodesWatched += anime.totalEpisodes ? anime.totalEpisodes : anime.currentEpisode;
        if (typeof anime.rating === 'number' && anime.rating > 0) {
          ratedAnimesCount++;
          totalRatingSum += anime.rating;
        }
      }

      anime.genres?.forEach(genre => {
        genreMap[genre] = (genreMap[genre] || 0) + 1;
      });

      anime.streamingPlatforms?.forEach(platform => {
        platformMap[platform.name] = (platformMap[platform.name] || 0) + 1;
      });
    });

    if (ratedAnimesCount > 0) {
      stats.averageRating = parseFloat((totalRatingSum / ratedAnimesCount).toFixed(2));
    }

    stats.genreFrequency = Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    stats.platformFrequency = Object.entries(platformMap)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);

    return stats;
  }, [animeList]);

  const watchingAnimes = useMemo(() =>
    animeList.filter(anime => anime.status === AnimeStatus.WATCHING),
    [animeList]);


  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    setCurrentCalendarDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(1);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleViewProfile = (username: string) => {
    setViewMode('profile');
    setProfileViewUsername(username);
  };

  const handleNavigateBackFromProfile = () => {
    setViewMode('social');
    setProfileViewUsername(null);
  };

  const viewButtonClass = (mode: ViewMode | 'settings', currentViewMode: ViewMode) =>
    `flex-1 md:flex-initial p-3 rounded-md transition-colors flex items-center justify-center
     ${currentViewMode === mode
      ? 'bg-[var(--accent-bg-cta)] text-white'
      : 'bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]'
    }`;

  const renderNotificationButton = () => {
    const baseButtonClass = "p-3 rounded-md flex items-center justify-center bg-[var(--surface-secondary)]";
    if (notificationPermission === 'granted') {
      return (
        <button
          className={`${baseButtonClass} text-green-400`}
          title="Notificações ativadas"
          aria-label="Notificações ativadas"
          disabled
        >
          <BellIcon className="w-5 h-5" opticalSize={20} />
        </button>
      );
    }
    if (notificationPermission === 'denied') {
      return (
        <button
          className={`${baseButtonClass} text-red-400`}
          title="Notificações bloqueadas. Habilite nas configurações do seu navegador."
          aria-label="Notificações bloqueadas"
          disabled
        >
          <BellSlashIcon className="w-5 h-5" opticalSize={20} />
        </button>
      );
    }
    return (
      <button
        onClick={requestNotificationPermission}
        className={`${baseButtonClass} hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors`}
        title="Ativar notificações de lançamento"
        aria-label="Ativar notificações"
      >
        <BellIcon className="w-5 h-5" opticalSize={20} />
      </button>
    );
  };

  if (isLoadingData) {
    return <div className="fixed inset-0 bg-bg-primary flex items-center justify-center"><LoadingSpinner className="w-12 h-12 text-accent" /></div>;
  }

  return (
    <div className="text-text-primary transition-colors duration-300 min-h-screen pb-20">
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />

      <AppHeader
        currentUser={currentUser}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onLogout={() => { /* Implement logout here logic if needed, or pass auth context logout */ }}
      />

      <HeaderBanner
        watchingAnimes={watchingAnimes}
        onUpdateEpisode={handleUpdateEpisode}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">

        {/* Premium Search Bar & Navigation - Streamlined & Icon-Only */}
        <div className="mb-8 p-4 glass-panel rounded-2xl shadow-2xl border border-white/10 flex flex-col xl:flex-row gap-4 items-center">

          {/* Group 1: Search & Filter (Expands on Desktop) */}
          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto xl:flex-1">
            {/* Search Input */}
            <div className="relative group flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white opacity-50 group-focus-within:text-accent-400 group-focus-within:opacity-100 transition-all z-10" />
              <input
                type="text"
                placeholder="Buscar anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/50 rounded-xl outline-none transition-all placeholder-gray-400 text-white font-medium hover:bg-black/30"
                aria-label="Buscar anime"
                disabled={viewMode === 'discover' || viewMode === 'social' || viewMode === 'profile'}
              />
            </div>

            {/* Status Filter */}
            <div className="relative md:w-48 flex-shrink-0">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AnimeStatus | 'ALL')}
                className="w-full appearance-none pl-3 pr-8 py-2.5 bg-black/20 border border-white/10 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/50 rounded-xl outline-none transition-all text-white font-medium hover:bg-black/30 cursor-pointer text-sm truncate"
                aria-label="Filtrar por status"
                disabled={viewMode === 'discover' || viewMode === 'social' || viewMode === 'profile'}
              >
                <option value="ALL">Todos os Status</option>
                {Object.values(AnimeStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-50 pointer-events-none" />
            </div>
          </div>

          {/* Group 2: Navigation Icons & Add Button */}
          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto items-center justify-between xl:justify-end">

            {/* Navigation Icons - Scrollable Row, Left Aligned on Mobile to prevent clipping */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
              {renderNotificationButton()}

              <button
                onClick={() => { setViewMode('list'); setListSubView('all'); }}
                className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${viewMode === 'list'
                  ? 'bg-gradient-to-r from-accent-500 to-purple-600 text-white shadow-lg shadow-accent-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                aria-pressed={viewMode === 'list'}
                title="Minha Lista"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode('discover')}
                className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${viewMode === 'discover'
                  ? 'bg-gradient-to-r from-accent-500 to-purple-600 text-white shadow-lg shadow-accent-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                aria-pressed={viewMode === 'discover'}
                title="Descobrir"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode('social')}
                className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${viewMode === 'social'
                  ? 'bg-gradient-to-r from-accent-500 to-purple-600 text-white shadow-lg shadow-accent-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                aria-pressed={viewMode === 'social'}
                title="Social"
              >
                <UsersIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-accent-500 to-purple-600 text-white shadow-lg shadow-accent-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                aria-pressed={viewMode === 'calendar'}
                title="Calendário"
              >
                <CalendarDaysIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode('ranking')}
                className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${viewMode === 'ranking'
                  ? 'bg-gradient-to-r from-accent-500 to-purple-600 text-white shadow-lg shadow-accent-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                aria-pressed={viewMode === 'ranking'}
                title="Ranking"
              >
                <TrophyIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode('stats')}
                className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${viewMode === 'stats'
                  ? 'bg-gradient-to-r from-accent-500 to-purple-600 text-white shadow-lg shadow-accent-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                aria-pressed={viewMode === 'stats'}
                title="Estatísticas"
              >
                <ChartPieIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode('achievements')}
                className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${viewMode === 'achievements'
                  ? 'bg-gradient-to-r from-accent-500 to-purple-600 text-white shadow-lg shadow-accent-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                aria-pressed={viewMode === 'achievements'}
                title="Conquistas"
              >
                <MedalIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30"
                title="Configurações"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Add Button - Compact on mobile, full on desktop if needed, or keeping it distinct */}
            <button
              onClick={openAddModal}
              className="w-full md:w-auto flex-shrink-0 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              aria-label="Adicionar novo anime"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>


        {(viewMode !== 'discover' && viewMode !== 'social' && viewMode !== 'profile') && (
          <FilterSortControls
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            availablePlatforms={availablePlatforms}
            filterPlatform={filterPlatform}
            onFilterPlatformChange={setFilterPlatform}
            filterMinRating={filterMinRating}
            onFilterMinRatingChange={setFilterMinRating}
            filterAudioType={filterAudioType}
            onFilterAudioTypeChange={setFilterAudioType}
            filterNoSpecificAiring={filterNoSpecificAiring}
            onFilterNoSpecificAiringChange={setFilterNoSpecificAiring}
            sortOption={sortOption}
            onSortOptionChange={setSortOption}
            onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            showAdvancedFilters={showAdvancedFilters}
          />
        )}

        {viewMode === 'list' && (
          <>
            <div className="mb-4 flex space-x-0 border-b border-border-secondary">
              <button
                onClick={() => setListSubView('all')}
                className={`px-4 py-2.5 rounded-t-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring
                          ${listSubView === 'all'
                    ? 'bg-surface-primary text-accent border-t border-x border-border-secondary'
                    : 'text-text-secondary hover:text-accent hover:bg-surface-hover/30'
                  }`}
              >
                Todos os Animes
              </button>
              <button
                onClick={() => setListSubView('upcoming')}
                className={`px-4 py-2.5 rounded-t-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring
                          ${listSubView === 'upcoming'
                    ? 'bg-surface-primary text-accent border-t border-x border-border-secondary'
                    : 'text-text-secondary hover:text-accent hover:bg-surface-hover/30'
                  }`}
              >
                Próximos Episódios
              </button>
            </div>

            {listSubView === 'all' && (
              <AnimeList
                animeList={filteredAnimeList}
                onUpdateEpisode={handleUpdateEpisode}
                onDelete={handleDeleteAnime}
                onEdit={openEditModal}
                onSetStatus={handleSetStatus}
                onSetRating={handleSetRating}
                listDensity={appSettings.listDensity}
              />
            )}
            {listSubView === 'upcoming' && (
              <UpcomingEpisodesView
                upcomingAnimes={upcomingAnimesForView}
                onUpdateEpisode={handleUpdateEpisode}
                onEditAnime={openEditModal}
                listDensity={appSettings.listDensity}
              />
            )}
          </>
        )}
        {viewMode === 'discover' && (
          <DiscoverView
            onAddAnime={handleAddAnimeFromDiscover}
            animeList={animeList}
          />
        )}
        {viewMode === 'social' && (
          <SocialPage onViewProfile={handleViewProfile} />
        )}
        {viewMode === 'profile' && profileViewUsername && (
          <ProfilePage
            username={profileViewUsername}
            onNavigateBack={handleNavigateBackFromProfile}
            onEditAnime={openEditModal}
            listDensity={appSettings.listDensity}
          />
        )}
        {viewMode === 'calendar' && (
          <CalendarView
            animeList={animeList}
            currentDate={currentCalendarDate}
            onNavigateMonth={handleNavigateMonth}
            onEditAnime={openEditModal}
            filterStatus={filterStatus}
          />
        )}
        {viewMode === 'ranking' && (
          <RankingView
            rankedAnimes={rankedAnimesList}
            onEditAnime={openEditModal}
          />
        )}
        {viewMode === 'stats' && (
          <StatisticsView stats={calculatedStats} />
        )}
        {viewMode === 'achievements' && (
          <AchievementsView
            userAchievements={userAchievements}
            achievementDefinitions={staticAchievementDefinitions}
          />
        )}


        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAnime(null);
          }}
          title={editingAnime ? 'Editar Anime' : 'Adicionar Novo Anime'}
          size="3xl"
        >
          <AnimeForm
            onSubmit={handleAddOrUpdateAnime}
            initialData={editingAnime}
            onClose={() => {
              setIsModalOpen(false);
              setEditingAnime(null);
            }}
          />
        </Modal>

        <RatingPromptModal
          isOpen={isRatingPromptModalOpen}
          onClose={() => {
            setIsRatingPromptModalOpen(false);
            setAnimeToPromptRating(null);
          }}
          anime={animeToPromptRating}
          onSaveRating={handleSetRating}
        />

        <ConfirmationModal
          isOpen={isConfirmDeleteModalOpen}
          onClose={() => {
            setIsConfirmDeleteModalOpen(false);
            setAnimeIdToDelete(null);
          }}
          onConfirm={executeDeleteAnime}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o anime "${animeList.find(a => a.id === animeIdToDelete)?.title || 'este anime'}" da sua agenda? Esta ação não pode ser desfeita.`}
          confirmButtonText="Excluir"
          confirmButtonClassName="bg-red-600 hover:bg-red-500"
          icon={<QuestionMarkCircleIcon className="w-16 h-16 text-red-500" opticalSize={48} />}
        />

        <ConfirmationModal
          isOpen={isConfirmImportModalOpen}
          onClose={() => {
            setIsConfirmImportModalOpen(false);
            setPendingImportFile(null);
          }}
          onConfirm={executeActualImport}
          title="Confirmar Importação de Dados"
          message="Atenção: Importar um novo arquivo substituirá TODOS os seus dados atuais da agenda. Esta ação não pode ser desfeita. Deseja continuar?"
          confirmButtonText="Importar e Substituir"
          confirmButtonClassName="bg-accent-cta hover:bg-accent-cta-hover"
          icon={<ArrowUpTrayIcon className="w-16 h-16 text-accent" opticalSize={48} />}
        />


        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onExportData={handleExportData}
          onImportData={handleImportDataRequest}
          currentSettings={appSettings}
          onUpdateSettings={handleUpdateSettings}
          animeList={animeList}
        />

      </div>


      <footer className="text-center mt-12 py-6 border-t border-border-primary">
        <p className="text-text-tertiary text-sm">
          Anime Agenda App &copy; {new Date().getFullYear()}. Feito com <span className="text-red-500">&hearts;</span> para fãs de anime.
        </p>
        <p className="text-xs text-text-tertiary mt-1">
          Dados de animes fornecidos por <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">AniList.co</a>.
        </p>
      </footer>
    </div>
  );
};

export default MainApp;