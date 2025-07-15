import React, { useState, useEffect, useMemo } from 'react';
import { FullPublicProfile, PublicUser, Anime, UserAchievement, AnimeStatus, StatisticsData, ViewMode, ListDensityOption } from '../types';
import * as SocialService from '../services/SocialService';
import * as GamificationService from '../services/GamificationService';
import { useAuth } from '../contexts/AuthContext';
import { achievementDefinitions } from '../utils/achievementDefinitions';

import LoadingSpinner from '../components/LoadingSpinner';
import UserProfileCard from '../components/UserProfileCard';
import FavoriteAnimesDisplay from '../components/FavoriteAnimesDisplay';
import StatisticsView from '../components/StatisticsView';
import AchievementsView from '../components/AchievementsView';
import AnimeList from '../components/AnimeList';
import { ChevronLeftIcon } from '../components/Icons';

interface ProfilePageProps {
  username: string;
  onNavigateBack: () => void;
  onEditAnime: (anime: Anime) => void; // To open the form modal
  listDensity: ListDensityOption;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ username, onNavigateBack, onEditAnime, listDensity }) => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState<FullPublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'favorites' | 'stats' | 'achievements'>('favorites');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await SocialService.getPublicProfileData(username);
        setProfileData(data);
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar o perfil.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);
  
  const top5RankedAnimes = useMemo(() => {
    if (!profileData) return [];
    
    return profileData.animes
      .filter(anime => anime.status === AnimeStatus.COMPLETED && anime.rating && anime.rating > 0)
      .sort((a, b) => {
        if (b.rating! !== a.rating!) {
          return b.rating! - a.rating!;
        }
        return a.title.localeCompare(b.title); // tie-breaker
      })
      .slice(0, 5);
  }, [profileData]);

  const stats = useMemo<StatisticsData | null>(() => {
    if (!profileData) return null;
    
    const { animes } = profileData;
    const statsResult: StatisticsData = {
      totalAnimes: animes.length,
      statusCounts: { [AnimeStatus.WATCHING]: 0, [AnimeStatus.COMPLETED]: 0, [AnimeStatus.PLANNED]: 0, [AnimeStatus.ON_HOLD]: 0, [AnimeStatus.DROPPED]: 0 },
      totalEpisodesWatched: 0,
      genreFrequency: [],
      averageRating: undefined,
      platformFrequency: [],
    };

    const genreMap: { [key: string]: number } = {};
    const platformMap: { [key: string]: number } = {};
    let ratedAnimesCount = 0;
    let totalRatingSum = 0;

    animes.forEach(anime => {
      statsResult.statusCounts[anime.status]++;
      if (anime.status === AnimeStatus.WATCHING || anime.status === AnimeStatus.ON_HOLD) {
        statsResult.totalEpisodesWatched += anime.currentEpisode;
      } else if (anime.status === AnimeStatus.COMPLETED) {
        statsResult.totalEpisodesWatched += anime.totalEpisodes || anime.currentEpisode;
        if (anime.rating && anime.rating > 0) {
          ratedAnimesCount++;
          totalRatingSum += anime.rating;
        }
      }
      anime.genres?.forEach(genre => { genreMap[genre] = (genreMap[genre] || 0) + 1; });
      anime.streamingPlatforms?.forEach(p => { platformMap[p.name] = (platformMap[p.name] || 0) + 1; });
    });

    if (ratedAnimesCount > 0) statsResult.averageRating = totalRatingSum / ratedAnimesCount;
    statsResult.genreFrequency = Object.entries(genreMap).map(([genre, count]) => ({ genre, count })).sort((a, b) => b.count - a.count);
    statsResult.platformFrequency = Object.entries(platformMap).map(([platform, count]) => ({ platform, count })).sort((a, b) => b.count - a.count);

    return statsResult;
  }, [profileData]);

  const tabButtonClass = (tabName: typeof activeTab) =>
    `px-4 py-2.5 rounded-t-md text-sm sm:text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring
     ${activeTab === tabName
        ? 'bg-surface-primary text-accent border-b-2 border-accent-border'
        : 'bg-transparent text-text-secondary hover:text-accent hover:bg-surface-hover/50'
     }`;

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner className="w-12 h-12" /></div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400">{error}</p>
        <button onClick={onNavigateBack} className="mt-4 px-4 py-2 bg-accent-cta text-white rounded-md">Voltar</button>
      </div>
    );
  }

  if (!profileData) return null;

  const { profile, animes, achievements } = profileData;
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="p-4 md:p-6 bg-bg-tertiary rounded-lg shadow-custom-xl min-h-[500px] animate-fade-in">
      <button onClick={onNavigateBack} className="flex items-center gap-1 text-sm text-accent mb-4 hover:underline">
        <ChevronLeftIcon className="w-5 h-5" />
        Voltar para o Hub Social
      </button>

      <UserProfileCard
        user={profile}
        rank={GamificationService.getRankForLevel(profile.level)}
        xpForNextLevel={GamificationService.calculateXpForNextLevel(profile.level)}
      />
      
      <div className="mt-8">
        <div className="flex border-b border-border-primary mb-1">
          <button onClick={() => setActiveTab('favorites')} className={tabButtonClass('favorites')}>Animes Favoritos</button>
          <button onClick={() => setActiveTab('stats')} className={tabButtonClass('stats')}>Estatísticas</button>
          <button onClick={() => setActiveTab('achievements')} className={tabButtonClass('achievements')}>Conquistas</button>
        </div>

        <div className="py-4">
          {activeTab === 'favorites' && (
             <FavoriteAnimesDisplay 
                favoriteAnimes={top5RankedAnimes}
                onEditAnime={isOwnProfile ? onEditAnime : () => {}}
             />
          )}
          {activeTab === 'stats' && stats && (
            <StatisticsView stats={stats} username={profile.username} />
          )}
          {activeTab === 'achievements' && (
            <AchievementsView userAchievements={achievements} achievementDefinitions={achievementDefinitions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;