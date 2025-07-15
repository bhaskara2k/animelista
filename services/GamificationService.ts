import { supabase } from './supabaseClient';
import { Rank, XpEvent } from '../types';
import { MaterialSymbol } from '../components/Icons';

// --- XP Configuration ---
export const XP_EVENTS: Record<XpEvent, number> = {
  ADD_ANIME: 10,
  COMPLETE_ANIME: 50,
  RATE_ANIME: 25,
  UNLOCK_ACHIEVEMENT: 100,
  WATCH_EPISODE: 20,
};

// --- Leveling Configuration ---
const BASE_XP_PER_LEVEL = 150;
const XP_GROWTH_FACTOR = 1.4;

export const calculateXpForNextLevel = (level: number): number => {
  if (level <= 0) return BASE_XP_PER_LEVEL;
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(level, XP_GROWTH_FACTOR));
};

// --- Rank Configuration ---
export const RANKS: Rank[] = [
  { minLevel: 50, title: 'Rei/Rainha dos Piratas' },
  { minLevel: 40, title: 'Hokage' },
  { minLevel: 30, title: 'Super Saiyajin' },
  { minLevel: 25, title: 'Alquimista Federal' },
  { minLevel: 20, title: 'Caçador(a) de Onis' },
  { minLevel: 15, title: 'Genin' },
  { minLevel: 10, title: 'Treinador(a) Pokémon' },
  { minLevel: 5, title: 'Estudante da U.A.' },
  { minLevel: 1, title: 'Aventureiro(a) Novato(a)' },
];

export const getRankForLevel = (level: number): Rank => {
  return RANKS.find(rank => level >= rank.minLevel) || RANKS[RANKS.length - 1];
};

/**
 * Adds a specific amount of XP to a user's profile and handles level-ups.
 * @param userId - The ID of the user to grant XP to.
 * @param xpToAdd - The amount of XP to add.
 * @returns An object with the new level, new XP, and whether a level-up occurred.
 */
export const addXp = async (
  userId: string,
  xpToAdd: number
): Promise<{
  newLevel: number;
  newXp: number;
  didLevelUp: boolean;
  xpGained: number;
  newRank?: Rank;
}> => {
  if (!userId) {
    throw new Error("User ID is required to add XP.");
  }
  if (xpToAdd <= 0) {
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('level, xp')
        .eq('id', userId)
        .single();
    if (profileError) throw profileError;
    return {
        newLevel: profile.level,
        newXp: profile.xp,
        didLevelUp: false,
        xpGained: 0
    };
  }

  // Use an RPC function to handle the logic atomically in the database
  const { data, error } = await supabase.rpc('add_xp_and_level_up', {
    user_id_param: userId,
    xp_to_add: xpToAdd,
  });

  if (error) {
    console.error('Error in add_xp_and_level_up RPC. Full error object:', JSON.stringify(error, null, 2));
    throw new Error(`Database error adding XP: ${error.message}. Check browser console for more details.`);
  }

  if (!data) {
    throw new Error("Gamification service RPC returned no data.");
  }

  const result = Array.isArray(data) ? data[0] : data;
  const { new_level, new_xp, did_level_up } = result;

  let newRank: Rank | undefined = undefined;
  if (did_level_up) {
    newRank = getRankForLevel(new_level);
  }

  return {
    newLevel: new_level,
    newXp: new_xp,
    didLevelUp: did_level_up,
    xpGained: xpToAdd,
    newRank: newRank,
  };
};

/**
 * You need to create or replace the `add_xp_and_level_up` function in your Supabase SQL editor.
 * Go to Database -> Functions -> Find and delete the old `add_xp_and_level_up` function, 
 * then run the following code in the SQL Editor to create the corrected version.

CREATE OR REPLACE FUNCTION add_xp_and_level_up(user_id_param uuid, xp_to_add integer)
RETURNS TABLE(new_level int, new_xp int, did_level_up boolean) AS $$
DECLARE
    current_level int;
    current_xp int;
    xp_for_next_level int;
    leveled_up boolean := false;
BEGIN
    -- Select current level and xp for the user.
    -- This function runs with the permissions of the definer, so it bypasses RLS.
    SELECT "level", "xp" INTO current_level, current_xp FROM public.profiles WHERE id = user_id_param;

    -- Safeguard against a non-existent profile, which shouldn't happen for a logged-in user.
    IF current_level IS NULL THEN
        RAISE EXCEPTION 'Gamification Error: Profile not found for user_id: %', user_id_param;
    END IF;

    -- Add the new XP
    current_xp := current_xp + xp_to_add;

    -- Calculate XP needed for the current level
    xp_for_next_level := floor(150 * pow(current_level, 1.4));

    -- Loop to handle multiple level-ups from a single XP gain
    WHILE current_xp >= xp_for_next_level AND xp_for_next_level > 0 LOOP
        current_xp := current_xp - xp_for_next_level;
        current_level := current_level + 1;
        leveled_up := true;
        -- Recalculate for the new current level
        xp_for_next_level := floor(150 * pow(current_level, 1.4));
    END LOOP;

    -- Update the user's profile with the new level and XP
    UPDATE public.profiles
    SET
        level = current_level,
        xp = current_xp,
        updated_at = now()
    WHERE id = user_id_param;
    
    -- Return the results
    RETURN QUERY SELECT current_level, current_xp, leveled_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

 */