
import { useState, useEffect, useCallback } from 'react';
import { Anime, UserAchievement, AchievementTier } from '../types';
import { achievementDefinitions } from '../utils/achievementDefinitions';
import { supabase } from '../services/supabaseClient';

export const useUserAchievements = (
    animeList: Anime[], 
    userId: string | null | undefined, 
    onAchievementUnlocked?: (achievement: AchievementTier) => void
) => {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Effect to load and initialize achievements
  useEffect(() => {
    if (!userId) {
        setUserAchievements([]); // Clear achievements if no user
        setIsInitialLoadComplete(false); // Reset load state
        return;
    }

    const loadAchievements = async () => {
        const { data: storedAchievements, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error loading achievements from Supabase:", error);
        }

        const loadedAchievementsMap = new Map<string, UserAchievement>();
        if (storedAchievements) {
            storedAchievements.forEach(ach => {
                loadedAchievementsMap.set(ach.achievement_id, {
                    id: ach.achievement_id,
                    unlocked: ach.unlocked,
                    unlockedAt: ach.unlocked_at,
                    currentProgress: ach.current_progress
                });
            });
        }
        
        const initialAchievements = achievementDefinitions.flatMap(category => 
          category.tiers.map(tier => {
            const existing = loadedAchievementsMap.get(tier.id);
            return existing || {
              id: tier.id,
              unlocked: false,
              currentProgress: 0,
            };
          })
        );
        setUserAchievements(initialAchievements);
        setIsInitialLoadComplete(true);
    };
    
    loadAchievements();
  }, [userId]);


  const checkAndUnlockAchievements = useCallback(() => {
    if (!isInitialLoadComplete || !userId) {
        return;
    }
    
    let hasChanges = false;
    const updatedAchievements = userAchievements.map(userAch => {
      const achievementTierDef = achievementDefinitions
        .flatMap(cat => cat.tiers)
        .find(tier => tier.id === userAch.id);

      if (!achievementTierDef) return userAch;

      const categoryDef = achievementDefinitions.find(cat => cat.tiers.some(t => t.id === userAch.id));
      if (!categoryDef) return userAch;

      const currentProgress = categoryDef.calculateProgress(animeList);
      
      const updatedAch = { ...userAch };
      let madeUpdate = false;

      if (!updatedAch.unlocked && currentProgress >= achievementTierDef.target) {
        updatedAch.unlocked = true;
        updatedAch.unlockedAt = new Date().toISOString();
        madeUpdate = true;
        // Call the callback when an achievement is unlocked for the first time
        if (onAchievementUnlocked) {
            onAchievementUnlocked(achievementTierDef);
        }
      }
      
      if (updatedAch.currentProgress !== currentProgress) {
        updatedAch.currentProgress = currentProgress;
        madeUpdate = true;
      }

      if(madeUpdate) hasChanges = true;

      return updatedAch;
    });
    
    if (hasChanges) {
        setUserAchievements(updatedAchievements);
    }

  }, [animeList, userAchievements, isInitialLoadComplete, userId, onAchievementUnlocked]);


  useEffect(() => {
    if (isInitialLoadComplete && userId) {
      checkAndUnlockAchievements();
    }
  }, [animeList, isInitialLoadComplete, userId, checkAndUnlockAchievements]);


  useEffect(() => {
    if (!isInitialLoadComplete || !userId || userAchievements.length === 0) {
        return;
    }

    const saveAchievements = async () => {
        const achievementsToUpsert = userAchievements.map(ach => ({
            user_id: userId,
            achievement_id: ach.id,
            unlocked: ach.unlocked,
            unlocked_at: ach.unlockedAt || null,
            current_progress: ach.currentProgress,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase.from('achievements').upsert(achievementsToUpsert);

        if (error) {
            console.error("Error saving achievements to Supabase:", error);
        }
    };

    saveAchievements();
  }, [userAchievements, isInitialLoadComplete, userId]);

  return { userAchievements, achievementDefinitions };
};
