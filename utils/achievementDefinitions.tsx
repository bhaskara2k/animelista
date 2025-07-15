import React from 'react';
import { Anime, AnimeStatus, AchievementDefinition, AchievementTier, AchievementId } from '../types';
import { FilmIcon, BookOpenIcon, StarIcon, AcademicCapIcon, TrendingUpIcon, MedalIcon } from '../components/Icons'; // Assuming MedalIcon is a generic one.

const calculateTotalEpisodesWatched = (animeList: Anime[]): number => {
  return animeList.reduce((acc, anime) => {
    if (anime.status === AnimeStatus.COMPLETED && typeof anime.totalEpisodes === 'number' && anime.totalEpisodes > 0) {
      return acc + anime.totalEpisodes;
    } else if (anime.currentEpisode > 0 && (anime.status === AnimeStatus.WATCHING || anime.status === AnimeStatus.ON_HOLD)) {
      // Include currentEpisode for animes being watched or on hold
      return acc + anime.currentEpisode;
    }
    return acc;
  }, 0);
};

const calculateCompletedAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => a.status === AnimeStatus.COMPLETED).length;
};

const calculateRatedAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => a.status === AnimeStatus.COMPLETED && typeof a.rating === 'number' && a.rating > 0).length;
};

const calculateUniqueGenresExplored = (animeList: Anime[]): number => {
  const uniqueGenres = new Set<string>();
  animeList.forEach(anime => {
    // Consider a genre "explored" if the anime is completed or at least started
    if (anime.status === AnimeStatus.COMPLETED || (anime.currentEpisode > 0 && anime.status !== AnimeStatus.PLANNED && anime.status !== AnimeStatus.DROPPED)) {
      anime.genres?.forEach(genre => uniqueGenres.add(genre));
    }
  });
  return uniqueGenres.size;
};

const calculateFirstAnimeStarted = (animeList: Anime[]): number => {
  return animeList.some(a => a.currentEpisode > 0 || a.status === AnimeStatus.COMPLETED) ? 1 : 0;
};


export const achievementDefinitions: AchievementDefinition[] = [
  {
    categoryId: 'firstSteps',
    categoryTitle: 'Jornada Inicial',
    categoryIcon: TrendingUpIcon,
    tiers: [
      { id: 'FIRST_ANIME_STARTED', title: 'Primeiros Passos', description: 'Você começou a assistir seu primeiro anime!', target: 1, icon: TrendingUpIcon },
    ],
    calculateProgress: calculateFirstAnimeStarted,
  },
  {
    categoryId: 'completedAnimes',
    categoryTitle: 'Animes Completos',
    categoryIcon: FilmIcon,
    tiers: [
      { id: 'COMPLETED_1_ANIME', title: 'Concluidor Iniciante', description: 'Você completou seu primeiro anime!', target: 1 },
      { id: 'COMPLETED_5_ANIMES', title: 'Colecionador Bronze', description: 'Você completou 5 animes!', target: 5 },
      { id: 'COMPLETED_10_ANIMES', title: 'Colecionador Prata', description: 'Você completou 10 animes!', target: 10 },
      { id: 'COMPLETED_25_ANIMES', title: 'Colecionador Ouro', description: 'Você completou 25 animes!', target: 25 },
      { id: 'COMPLETED_50_ANIMES', title: 'Mestre Colecionador', description: 'Você completou 50 animes!', target: 50 },
      { id: 'COMPLETED_100_ANIMES', title: 'Lenda Colecionadora', description: 'Você completou 100 animes!', target: 100 },
    ],
    calculateProgress: calculateCompletedAnimes,
  },
  {
    categoryId: 'watchedEpisodes',
    categoryTitle: 'Episódios Assistidos',
    categoryIcon: BookOpenIcon,
    tiers: [
      { id: 'WATCHED_50_EPISODES', title: 'Maratonista Casual', description: 'Você assistiu 50 episódios!', target: 50 },
      { id: 'WATCHED_100_EPISODES', title: 'Maratonista Dedicado', description: 'Você assistiu 100 episódios!', target: 100 },
      { id: 'WATCHED_250_EPISODES', title: 'Maratonista Hardcore', description: 'Você assistiu 250 episódios!', target: 250 },
      { id: 'WATCHED_500_EPISODES', title: 'Senhor(a) das Maratonas', description: 'Você assistiu 500 episódios!', target: 500 },
      { id: 'WATCHED_1000_EPISODES', title: 'Divindade das Maratonas', description: 'Você assistiu 1000 episódios!', target: 1000 },
    ],
    calculateProgress: calculateTotalEpisodesWatched,
  },
  {
    categoryId: 'ratedAnimes',
    categoryTitle: 'Animes Avaliados',
    categoryIcon: StarIcon,
    tiers: [
      { id: 'RATED_1_ANIME', title: 'Primeira Opinião', description: 'Você avaliou seu primeiro anime!', target: 1 },
      { id: 'RATED_5_ANIMES', title: 'Crítico Bronze', description: 'Você avaliou 5 animes!', target: 5 },
      { id: 'RATED_10_ANIMES', title: 'Crítico Prata', description: 'Você avaliou 10 animes!', target: 10 },
      { id: 'RATED_25_ANIMES', title: 'Crítico Ouro', description: 'Você avaliou 25 animes!', target: 25 },
    ],
    calculateProgress: calculateRatedAnimes,
  },
  {
    categoryId: 'exploredGenres',
    categoryTitle: 'Gêneros Explorados',
    categoryIcon: AcademicCapIcon,
    tiers: [
      { id: 'EXPLORED_3_GENRES', title: 'Aventureiro de Gêneros', description: 'Você explorou 3 gêneros diferentes!', target: 3 },
      { id: 'EXPLORED_5_GENRES', title: 'Explorador de Gêneros', description: 'Você explorou 5 gêneros diferentes!', target: 5 },
      { id: 'EXPLORED_10_GENRES', title: 'Mestre dos Gêneros', description: 'Você explorou 10 gêneros diferentes!', target: 10 },
      { id: 'EXPLORED_15_GENRES', title: 'Connaisseur de Gêneros', description: 'Você explorou 15 gêneros diferentes!', target: 15 },
    ],
    calculateProgress: calculateUniqueGenresExplored,
  },
];
