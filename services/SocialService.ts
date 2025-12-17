

import { supabase } from './supabaseClient';
import { PublicUser, Friendship, FriendshipStatus, FeedEvent, FeedEventType, StatisticsData, FullPublicProfile, Anime, UserAchievement, AnimeStatus } from '../types';

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
    audioType: dbAnime.audio_type,
});

// --- User & Friend Search ---

export const searchUsers = async (searchTerm: string, currentUserId: string): Promise<PublicUser[]> => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_id, level, xp, bio, favorite_animes')
    .ilike('username', `%${searchTerm}%`)
    .neq('id', currentUserId) // Don't show the current user in search results
    .limit(10);

  if (error) {
    console.error("Error searching users:", error);
    throw new Error(error.message);
  }

  return data.map(p => ({
    id: p.id,
    username: p.username,
    avatar_id: p.avatar_id,
    level: p.level,
    xp: p.xp,
    bio: p.bio,
    favoriteAnimes: p.favorite_animes || [],
  }));
};

// Helper function to fetch profiles in bulk
const getProfilesByIds = async (userIds: string[]): Promise<Map<string, PublicUser>> => {
    if (userIds.length === 0) {
        return new Map();
    }
    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_id, level, xp, bio, favorite_animes')
        .in('id', userIds);

    if (error) {
        console.error("Error fetching profiles by IDs:", error);
        throw error;
    }

    const profileMap = new Map<string, PublicUser>();
    data.forEach(profile => {
        profileMap.set(profile.id, {
            id: profile.id,
            username: profile.username,
            avatar_id: profile.avatar_id,
            level: profile.level,
            xp: profile.xp,
            bio: profile.bio,
            favoriteAnimes: profile.favorite_animes || [],
        });
    });
    return profileMap;
};


// Fetches all friendships (accepted, pending requests sent by user)
export const getFriendships = async (userId: string): Promise<{ friends: Friendship[], sentRequests: Friendship[] }> => {
    // 1. Fetch raw friendship data
    const { data: rawFriendships, error } = await supabase
        .from('friends')
        .select('id, requester_id, receiver_id, status, created_at')
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
        console.error("Error fetching friendships:", error);
        throw error;
    }

    // 2. Collect all necessary profile IDs
    const profileIds = new Set<string>();
    rawFriendships.forEach(f => {
        profileIds.add(f.requester_id);
        profileIds.add(f.receiver_id);
    });

    // 3. Fetch all required profiles in one go
    const profiles = await getProfilesByIds(Array.from(profileIds));

    // 4. Hydrate the data
    const friends: Friendship[] = [];
    const sentRequests: Friendship[] = [];

    rawFriendships.forEach(item => {
        const requesterProfile = profiles.get(item.requester_id);
        const receiverProfile = profiles.get(item.receiver_id);

        // A friendship is only valid if both profiles exist
        if (!requesterProfile || !receiverProfile) {
            return;
        }

        if (item.status === FriendshipStatus.ACCEPTED) {
            friends.push({
                ...item,
                friend_profile: item.requester_id === userId ? receiverProfile : requesterProfile,
            });
        } else if (item.status === FriendshipStatus.PENDING && item.requester_id === userId) {
            sentRequests.push({
                ...item,
                friend_profile: receiverProfile,
            });
        }
    });

    return { friends, sentRequests };
};


// Fetches all incoming friend requests
export const getFriendRequests = async (userId: string): Promise<Friendship[]> => {
    // 1. Fetch raw requests
    const { data: rawRequests, error } = await supabase
        .from('friends')
        .select('id, requester_id, receiver_id, status, created_at')
        .eq('receiver_id', userId)
        .eq('status', FriendshipStatus.PENDING);

    if (error) {
        console.error("Error fetching friend requests:", error);
        throw error;
    }
    
    if (rawRequests.length === 0) return [];

    // 2. Collect requester IDs
    const requesterIds = rawRequests.map(r => r.requester_id);

    // 3. Fetch profiles
    const profiles = await getProfilesByIds(requesterIds);

    // 4. Hydrate and return
    return rawRequests.map(item => {
        const requesterProfile = profiles.get(item.requester_id);
        const fallbackUser: PublicUser = { id: item.requester_id, username: 'Usuário Desconhecido', level: 1, xp: 0 };
        return {
            ...item,
            friend_profile: requesterProfile || fallbackUser
        };
    }).filter(item => item.friend_profile.username !== 'Usuário Desconhecido'); // Filter out invalid ones
};


export const sendFriendRequest = async (requesterId: string, receiverId: string): Promise<any> => {
  const { data, error } = await supabase
    .from('friends')
    .insert({
      requester_id: requesterId,
      receiver_id: receiverId,
      status: FriendshipStatus.PENDING,
    });
  
  if (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
  return data;
};

export const respondToFriendRequest = async (friendshipId: number, newStatus: FriendshipStatus.ACCEPTED | FriendshipStatus.DECLINED): Promise<any> => {
  if (newStatus === FriendshipStatus.DECLINED) {
    // For declined, we just delete the request
    const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipId);
    if (error) {
        console.error("Error declining friend request:", error);
        throw error;
    }
    return;
  }
  
  // For accepted, we update the status
  const { data, error } = await supabase
    .from('friends')
    .update({ status: newStatus })
    .eq('id', friendshipId);

  if (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
  return data;
};

export const removeFriend = async (friendshipId: number): Promise<void> => {
    const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipId);

    if (error) {
        console.error("Error removing friend:", error);
        throw error;
    }
};


// --- Feed Management ---

export const getFeedEvents = async (userId: string, friendIds: string[]): Promise<FeedEvent[]> => {
    const userAndFriendsIds = [userId, ...friendIds];

    // 1. Fetch raw feed events
    const { data: rawEvents, error } = await supabase
        .from('feed_events')
        .select('*')
        .in('user_id', userAndFriendsIds)
        .order('created_at', { ascending: false })
        .limit(50);
    
    if (error) {
        console.error("Error fetching feed events:", error);
        throw error;
    }

    if (rawEvents.length === 0) return [];

    // 2. Get profile IDs
    const profileIds = rawEvents.map(e => e.user_id);
    
    // 3. Fetch profiles
    const profiles = await getProfilesByIds(profileIds);
    
    // 4. Hydrate
    return rawEvents.map(event => {
        const userProfile = profiles.get(event.user_id);
        const fallbackUser: PublicUser = { id: event.user_id, username: 'Usuário Desconhecido', level: 1, xp: 0 };
        return {
            ...event,
            user_profile: userProfile || fallbackUser
        }
    }).filter(e => e.user_profile.username !== 'Usuário Desconhecido') as unknown as FeedEvent[];
};

export const createFeedEvent = async (userId: string, eventType: FeedEventType, metadata: object): Promise<void> => {
    const { error } = await supabase
        .from('feed_events')
        .insert({
            user_id: userId,
            event_type: eventType,
            metadata: metadata,
        });

    if (error) {
        console.error("Error creating feed event:", error);
        throw error;
    }
};

// --- Public Profile Page Data ---

export const getPublicProfileData = async (username: string): Promise<FullPublicProfile> => {
    // Step 1: Get the user's profile by username
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_id, level, xp, bio, favorite_animes')
        .eq('username', username)
        .single();

    if (profileError) {
        console.error("Error fetching public profile:", profileError);
        if (profileError.code === 'PGRST116') {
            throw new Error("Usuário não encontrado.");
        }
        throw new Error(profileError.message);
    }
    
    const publicProfile: PublicUser = {
        id: profileData.id,
        username: profileData.username,
        avatar_id: profileData.avatar_id,
        level: profileData.level,
        xp: profileData.xp,
        bio: profileData.bio,
        favoriteAnimes: profileData.favorite_animes || [],
    };

    // Step 2: Get the user's anime list
    const { data: animesData, error: animesError } = await supabase
        .from('animes')
        .select('*')
        .eq('user_id', publicProfile.id)
        .order('created_at', { ascending: false });

    if (animesError) {
        console.error("Error fetching animes for public profile:", animesError);
        throw new Error(animesError.message);
    }

    // Step 3: Get the user's achievements
    const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('achievement_id, unlocked, unlocked_at, current_progress')
        .eq('user_id', publicProfile.id);

    if (achievementsError) {
        console.error("Error fetching achievements for public profile:", achievementsError);
        throw new Error(achievementsError.message);
    }

    const animes: Anime[] = animesData.map(formatAnimeFromDb);
    const achievements: UserAchievement[] = achievementsData.map(ach => ({
        id: ach.achievement_id,
        unlocked: ach.unlocked,
        unlockedAt: ach.unlocked_at,
        currentProgress: ach.current_progress,
    }));
    
    return {
        profile: publicProfile,
        animes,
        achievements,
    };
};

export const getPublicUserStats = async (userId: string): Promise<StatisticsData> => {
    const { data: animeData, error } = await supabase
        .from('animes')
        .select('status, current_episode, total_episodes, rating, genres')
        .eq('user_id', userId);

    if (error) {
        console.error("Error fetching public user animes:", error);
        throw error;
    }
    
    const stats: StatisticsData = {
        totalAnimes: animeData.length,
        statusCounts: {
            'Assistindo': 0, 'Completo': 0, 'Planejado': 0, 'Em Pausa': 0, 'Abandonado': 0
        },
        totalEpisodesWatched: 0,
        genreFrequency: [],
        averageRating: undefined,
        platformFrequency: [], // Not available in this public view
    };

    let ratedAnimesCount = 0;
    let totalRatingSum = 0;
    const genreMap: Record<string, number> = {};

    animeData.forEach(anime => {
        stats.statusCounts[anime.status as keyof typeof stats.statusCounts]++;
        if (anime.status === 'Assistindo' || anime.status === 'Em Pausa') {
            stats.totalEpisodesWatched += anime.current_episode;
        } else if (anime.status === 'Completo') {
            stats.totalEpisodesWatched += anime.total_episodes || anime.current_episode;
            if (typeof anime.rating === 'number' && anime.rating > 0) {
                ratedAnimesCount++;
                totalRatingSum += anime.rating;
            }
        }
        anime.genres?.forEach((genre: string) => {
            genreMap[genre] = (genreMap[genre] || 0) + 1;
        });
    });

    if (ratedAnimesCount > 0) {
        stats.averageRating = parseFloat((totalRatingSum / ratedAnimesCount).toFixed(2));
    }

    stats.genreFrequency = Object.entries(genreMap)
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count);

    return stats;
};