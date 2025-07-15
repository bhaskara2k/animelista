import { Anime } from '../types';
import { parseDateString } from './dateUtils';

export const calculateExpectedEpisodes = (anime: Anime, forDate: Date): number | null => {
  if (!anime.airingStartDate || !anime.airingDaysOfWeek || anime.airingDaysOfWeek.length === 0) {
    return null; // Not enough info for weekly schedule
  }

  const startDate = parseDateString(anime.airingStartDate);
  if (!startDate) {
    return null;
  }

  // Normalize forDate to the start of its day for consistent comparison
  const today = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate());

  if (today < startDate) {
    return 0; // Hasn't started airing yet according to its start date
  }

  let expectedCount = 0;
  let currentDateIter = new Date(startDate);

  // Iterate from start date up to 'today' (inclusive)
  while (currentDateIter <= today) {
    if (anime.airingDaysOfWeek.includes(currentDateIter.getDay())) {
      expectedCount++;
    }

    // If totalEpisodes is known and expectedCount has reached it,
    // we don't expect more episodes than totalEpisodes.
    if (anime.totalEpisodes && anime.totalEpisodes > 0 && expectedCount >= anime.totalEpisodes) {
      // Return totalEpisodes as the cap, regardless of further airing days within the loop up to 'today'.
      // This ensures we don't count beyond the known total.
      return anime.totalEpisodes;
    }
    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }
  
  // Final cap, if totalEpisodes is known and positive.
  if (anime.totalEpisodes && anime.totalEpisodes > 0) {
    return Math.min(expectedCount, anime.totalEpisodes);
  }

  // If totalEpisodes is not defined or zero, return the raw count based on airing schedule.
  return expectedCount;
};

export const calculateDateForSpecificEpisode = (anime: Anime, targetEpisodeNumber: number): Date | null => {
  if (
    !anime.airingStartDate ||
    !anime.airingDaysOfWeek ||
    anime.airingDaysOfWeek.length === 0 ||
    targetEpisodeNumber <= 0
  ) {
    return null; // Not enough info or invalid target episode
  }

  const startDate = parseDateString(anime.airingStartDate);
  if (!startDate) {
    return null; // Invalid start date
  }

  // If the target episode is beyond total episodes (and totalEpisodes is known), it won't air
  if (anime.totalEpisodes && anime.totalEpisodes > 0 && targetEpisodeNumber > anime.totalEpisodes) {
    return null;
  }

  let episodeCount = 0;
  let currentDate = new Date(startDate); // Start from the anime's airing start date
  currentDate.setHours(0, 0, 0, 0); // Normalize to start of day

  // Iterate for a reasonable limit to avoid infinite loops (e.g., 5 years for very long series)
  const maxIterations = 365 * 5 + 7; // Max 5 years + buffer for safety
  for (let i = 0; i < maxIterations; i++) {
    if (anime.airingDaysOfWeek.includes(currentDate.getDay())) {
      episodeCount++;
      if (episodeCount === targetEpisodeNumber) {
        return new Date(currentDate); // Return a new Date object to avoid mutations
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return null; // Target episode not found within the reasonable timeframe
};
