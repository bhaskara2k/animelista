import { AniListSeason } from '../types';

export interface SeasonInfo {
  season: AniListSeason;
  year: number;
}

export const getCurrentSeasonAndYear = (): SeasonInfo => {
  const now = new Date();
  let year = now.getFullYear();
  let season: AniListSeason;
   
   const currentMonth = now.getMonth(); // 0-11
   const currentYear = now.getFullYear();

   if (currentMonth >= 0 && currentMonth <= 2) { // January, February, March
       season = 'WINTER';
       year = currentYear;
   } else if (currentMonth >= 3 && currentMonth <= 5) { // April, May, June
       season = 'SPRING';
       year = currentYear;
   } else if (currentMonth >= 6 && currentMonth <= 8) { // July, August, September
       season = 'SUMMER';
       year = currentYear;
   } else { // October, November, December
       season = 'FALL';
       year = currentYear;
   }

  return { season, year };
};

export const getNextSeasonAndYear = (): SeasonInfo => {
  const { season: currentSeason, year: currentYear } = getCurrentSeasonAndYear();
  let nextSeason: AniListSeason;
  let nextYear = currentYear;

  switch (currentSeason) {
    case 'WINTER':
      nextSeason = 'SPRING';
      break;
    case 'SPRING':
      nextSeason = 'SUMMER';
      break;
    case 'SUMMER':
      nextSeason = 'FALL';
      break;
    case 'FALL':
      nextSeason = 'WINTER';
      nextYear += 1;
      break;
    default: // Should not happen
      nextSeason = 'SPRING'; // Default fallback, though unreachable with typed AniListSeason
      break;
  }
  return { season: nextSeason, year: nextYear };
};

export const translateAniListSeasonToPortuguese = (season?: AniListSeason): string => {
  if (!season) return '';
  switch (season) {
    case 'WINTER': return 'Inverno';
    case 'SPRING': return 'Primavera';
    case 'SUMMER': return 'Verão';
    case 'FALL': return 'Outono';
    default: return season;
  }
};
