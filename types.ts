

import React from 'react';

export enum AnimeStatus {
  WATCHING = 'Assistindo',
  COMPLETED = 'Completo',
  PLANNED = 'Planejado',
  ON_HOLD = 'Em Pausa',
  DROPPED = 'Abandonado',
}

export enum AudioType {
  DUBBED = 'Dublado',
  SUBTITLED = 'Legendado',
  BOTH = 'Dub/Leg', // Dubbed and Subtitled available
  ORIGINAL_AUDIO = 'Áudio Original', // For when it's just Japanese, no specific sub/dub mentioned or for non-anime content
  UNKNOWN = 'Não Especificado',
}

export interface StreamingPlatform {
  name: string;
  bgColor: string;   // Background color for the platform badge
  textColor: string; // Text color for the platform badge
}

export interface Anime {
  id: string;
  title: string;
  currentEpisode: number;
  totalEpisodes?: number;
  status: AnimeStatus;
  imageUrl?: string;
  bannerImage?: string;
  streamingPlatforms?: StreamingPlatform[];
  notes?: string;
  nextAiringDate?: string;
  airingDaysOfWeek?: number[];
  airingStartDate?: string;
  rating?: number;
  genres?: string[];
  audioType?: AudioType;
}

export type AnimeFormData = Omit<Anime, 'id'>;

// --- AniList API Specific Types ---

export interface AniListTitle {
  romaji: string;
  english?: string;
  native?: string;
}

export interface AniListCoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color?: string;
}

export interface AniListDate {
  year?: number;
  month?: number; // 1-12
  day?: number;   // 1-31
}

export interface AniListStreamingEpisode {
  title: string;
  thumbnail?: string;
  url: string;
  site: string; // e.g., "Crunchyroll", "Netflix"
}
export interface AniListExternalLink {
    id: number;
    url: string;
    site: string; // e.g. "Official Site", "Twitter", "Crunchyroll"
    type: string; // e.g. "STREAMING", "INFO", "SOCIAL"
    language?: string;
}

export type AniListSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
export type AniListMediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
export type AniListMediaFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC';

export type AniListMediaSort =
  | 'ID' | 'ID_DESC'
  | 'TITLE_ROMAJI' | 'TITLE_ROMAJI_DESC'
  | 'TITLE_ENGLISH' | 'TITLE_ENGLISH_DESC'
  | 'TITLE_NATIVE' | 'TITLE_NATIVE_DESC'
  | 'TYPE' | 'TYPE_DESC'
  | 'FORMAT' | 'FORMAT_DESC'
  | 'START_DATE' | 'START_DATE_DESC'
  | 'END_DATE' | 'END_date_DESC'
  | 'SCORE' | 'SCORE_DESC'
  | 'POPULARITY' | 'POPULARITY_DESC'
  | 'TRENDING' | 'TRENDING_DESC'
  | 'EPISODES' | 'EPISODES_DESC'
  | 'DURATION' | 'DURATION_DESC'
  | 'STATUS' | 'STATUS_DESC'
  | 'CHAPTERS' | 'CHAPTERS_DESC'
  | 'VOLUMES' | 'VOLUMES_DESC'
  | 'UPDATED_AT' | 'UPDATED_AT_DESC'
  | 'SEARCH_MATCH'
  | 'FAVOURITES' | 'FAVOURITES_DESC';


export interface AniListMedia {
  id: number;
  title: AniListTitle;
  description?: string; // HTML content, to be translated
  format?: AniListMediaFormat; 
  status?: AniListMediaStatus;
  episodes?: number; // Total episodes
  duration?: number; // Episode duration in minutes (will not be used per user request)
  coverImage: AniListCoverImage;
  bannerImage?: string;
  startDate?: AniListDate;
  endDate?: AniListDate;
  season?: AniListSeason;
  seasonYear?: number;
  genres?: string[];
  averageScore?: number; // 0-100
  studios?: {
    nodes: Array<{ name: string; isAnimationStudio: boolean }>;
  };
  streamingEpisodes?: AniListStreamingEpisode[]; 
  externalLinks?: AniListExternalLink[]; 
  siteUrl?: string; 
}

export interface AniListPageInfo {
  total?: number;
  perPage?: number;
  currentPage?: number;
  lastPage?: number;
  hasNextPage?: boolean;
}

export interface AniListSearchResult {
  Page: {
    pageInfo: AniListPageInfo;
    media: AniListMedia[];
  };
}


// --- AniList Character Types ---
export interface AniListCharacterImage {
  large: string;
  medium: string;
}

export interface AniListCharacterName {
  full: string;
  native?: string;
}

export interface AniListCharacter {
    id: number;
    name: AniListCharacterName;
    image: AniListCharacterImage;
}

export interface AniListCharacterSearchResult {
    Page: {
        pageInfo: AniListPageInfo;
        characters: AniListCharacter[];
    };
}


export type SortOption =
  | 'default'
  | 'title-asc'
  | 'title-desc'
  | 'rating-asc'
  | 'rating-desc'
  | 'nextAiring-asc'
  | 'nextAiring-desc';

// --- App Specific Types ---
export type ListDensityOption = 'compact' | 'normal' | 'spaced';

export interface StatisticsData {
  totalAnimes: number;
  statusCounts: Record<AnimeStatus, number>;
  totalEpisodesWatched: number;
  genreFrequency: Array<{ genre: string; count: number }>;
  averageRating?: number;
  platformFrequency: Array<{ platform: string; count: number }>;
}

export type ViewMode = 'list' | 'calendar' | 'ranking' | 'stats' | 'discover' | 'achievements' | 'social' | 'profile';

export type ThemeOption = 'light' | 'dark';
export type AccentColorOption = 'sky' | 'emerald' | 'rose' | 'amber' | 'indigo';

export interface AppSettings {
  theme: ThemeOption;
  accentColor: AccentColorOption;
  listDensity: ListDensityOption;
}

// --- Auth Types ---
export interface User {
  id: string; // from auth.users
  email: string; // from auth.users
  username: string; // from profiles table
  avatarId?: string; // from profiles table
  level: number; // from profiles table
  xp: number; // from profiles table
  bio?: string; // from profiles table
  favoriteAnimes?: string[]; // from profiles table
}


// --- Achievement Types ---
export type AchievementId =
  | 'FIRST_ANIME_STARTED'
  | 'COMPLETED_1_ANIME' | 'COMPLETED_5_ANIMES' | 'COMPLETED_10_ANIMES' | 'COMPLETED_25_ANIMES' | 'COMPLETED_50_ANIMES' | 'COMPLETED_100_ANIMES'
  | 'WATCHED_50_EPISODES' | 'WATCHED_100_EPISODES' | 'WATCHED_250_EPISODES' | 'WATCHED_500_EPISODES' | 'WATCHED_1000_EPISODES'
  | 'RATED_1_ANIME' | 'RATED_5_ANIMES' | 'RATED_10_ANIMES' | 'RATED_25_ANIMES'
  | 'EXPLORED_3_GENRES' | 'EXPLORED_5_GENRES' | 'EXPLORED_10_GENRES' | 'EXPLORED_15_GENRES';

export interface AchievementTier {
  id: AchievementId;
  title: string;
  description: string;
  target: number;
  icon?: React.FC<{ className?: string; opticalSize?: number; filled?: boolean }>;
}

export interface AchievementDefinition {
  categoryId: string;
  categoryTitle: string;
  categoryIcon: React.FC<{ className?: string; opticalSize?: number; filled?: boolean }>;
  tiers: AchievementTier[];
  calculateProgress: (animeList: Anime[]) => number;
}

export interface UserAchievement {
  id: AchievementId;
  unlocked: boolean;
  unlockedAt?: string; // ISO date string
  currentProgress: number;
}

// --- Discover View Specific Types ---
export type DiscoverSubView = 'carousels' | 'allAnimes';

export interface DiscoverFilters {
  genres?: string[];
  year?: number;
  format?: AniListMediaFormat[];
  minScore?: number; // 0-100
  searchTerm?: string;
  season?: AniListSeason; // Added season filter
}

export type CarouselCategory = 'trending' | 'popularThisSeason' | 'upcomingNextSeason';

export interface CarouselData {
  category: CarouselCategory;
  title: string;
  items: AniListMedia[];
  pageInfo: AniListPageInfo;
  isLoading: boolean;
  error?: string | null;
}

export const ALL_ANILIST_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror",
  "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance",
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller", "Boys Love",
  "Girls Love", "Gourmet", "Harem", "Josei", "Kids", "Martial Arts", "School",
  "Seinen", "Shoujo", "Shounen", "Space", "Super Power", "Vampire", "Historical",
  "Military", "Police", "Demons", "Game", "Cars", "Parody", "Samurai",
  "Adult Cast", "Anthropomorphic", "CGDCT", "Childcare", "Combat Sports",
  "Delinquents", "Detective", "Educational", "Gag Humor", "High Stakes Game",
  "Idols (Female)", "Idols (Male)", "Isekai", "Iyashikei", "Love Polygon",
  "Magical Sex Shift", "Medical", "Mythology", "Organized Crime", "Otaku Culture",
  "Performing Arts", "Pets", "Reincarnation", "Reverse Harem", "Romantic Comedy",
  "Showbiz", "Strategy Game", "Survival", "Team Sports", "Time Travel",
  "Video Game", "Villainess", "Visual Arts", "Workplace"
].sort();

export const ALL_ANILIST_FORMATS: { label: string; value: AniListMediaFormat }[] = [
  { label: "TV", value: "TV" },
  { label: "TV Curta", value: "TV_SHORT" },
  { label: "Filme", value: "MOVIE" },
  { label: "Especial", value: "SPECIAL" },
  { label: "OVA", value: "OVA" },
  { label: "ONA", value: "ONA" },
  { label: "Música", value: "MUSIC" },
];

export const ALL_ANILIST_SEASONS: { label: string; value: AniListSeason }[] = [
  { label: "Inverno", value: "WINTER" },
  { label: "Primavera", value: "SPRING" },
  { label: "Verão", value: "SUMMER" },
  { label: "Outono", value: "FALL" },
];

// --- Gemini AI Types ---
export interface Recommendation {
  title: string;
  justification: string;
  genres: string[];
}

// --- Social Feature Types ---

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED', // This status is usually just for logic, not stored long-term
  BLOCKED = 'BLOCKED',   // Optional for future use
}

// Represents a user profile in a social context
export interface PublicUser {
  id: string;
  username: string;
  avatar_id?: string;
  level: number;
  xp: number;
  bio?: string;
  favoriteAnimes?: string[]; // Array of Anime IDs
}

export interface Friendship {
  id: number; // The unique ID of the friendship record
  requester_id: string;
  receiver_id: string;
  status: FriendshipStatus;
  created_at: string;
  // This structure will be hydrated with the actual user info
  friend_profile: PublicUser; 
}

export enum FeedEventType {
  COMPLETED_ANIME = 'COMPLETED_ANIME',
  UNLOCKED_ACHIEVEMENT = 'UNLOCKED_ACHIEVEMENT',
  // Future ideas:
  // STARTED_ANIME = 'STARTED_ANIME',
  // RATED_ANIME = 'RATED_ANIME',
}

export interface FeedEvent {
  id: number;
  user_id: string;
  event_type: FeedEventType;
  metadata?: {
    anime_title?: string;
    anime_image_url?: string;
    achievement_title?: string;
    achievement_description?: string;
  };
  created_at: string;
  // Hydrated from the user_id
  user_profile: PublicUser;
}

// --- Gamification Types ---
export interface Rank {
  title: string;
  minLevel: number;
  icon?: React.FC<{ className?: string; opticalSize?: number }>;
}

export type XpEvent = 
  | 'ADD_ANIME'
  | 'COMPLETE_ANIME'
  | 'RATE_ANIME'
  | 'UNLOCK_ACHIEVEMENT'
  | 'WATCH_EPISODE';
  
// --- Profile Page Types ---
export interface FullPublicProfile {
    profile: PublicUser;
    animes: Anime[];
    achievements: UserAchievement[];
}
