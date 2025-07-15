import { StreamingPlatform } from '../types';

// Defines the desired order. Lower numbers have higher priority.
const platformPriorityMap: Record<string, number> = {
  'crunchyroll': 1,
  'netflix': 2,
  'youcine': 3,
};

/**
 * Sorts an array of streaming platforms based on a predefined priority order.
 * Platforms not in the priority map will be placed after prioritized ones,
 * and then sorted alphabetically among themselves.
 * @param platforms - An array of StreamingPlatform objects.
 * @returns A new array with platforms sorted according to priority.
 */
export const prioritizeStreamingPlatforms = (platforms?: StreamingPlatform[]): StreamingPlatform[] => {
  if (!platforms || platforms.length === 0) {
    return [];
  }

  return [...platforms].sort((a, b) => {
    const aNameLower = a.name.toLowerCase();
    const bNameLower = b.name.toLowerCase();

    const aPriority = platformPriorityMap[aNameLower];
    const bPriority = platformPriorityMap[bNameLower];

    // If both have defined priorities
    if (aPriority !== undefined && bPriority !== undefined) {
      return aPriority - bPriority;
    }
    // If only 'a' has a defined priority, 'a' comes first
    if (aPriority !== undefined) {
      return -1;
    }
    // If only 'b' has a defined priority, 'b' comes first
    if (bPriority !== undefined) {
      return 1;
    }
    // If neither has a defined priority, sort alphabetically
    return a.name.localeCompare(b.name);
  });
};
