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
import { ChevronLeftIcon, ChartPieIcon, TrophyIcon, StarIcon } from '../components/Icons';

interface ProfilePageProps {
  username: string;
  onNavigateBack: () => void;
  onEditAnime: (anime: Anime) => void;
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
        return a.title.localeCompare(b.title);
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner className="w-12 h-12" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-primary rounded-xl border border-white/5">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <p className="text-red-400 font-medium text-lg mb-4">{error}</p>
        <button
          onClick={onNavigateBack}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
        >
          Voltar ao Hub
        </button>
      </div>
    );
  }

  if (!profileData) return null;

  const { profile, animes, achievements } = profileData;
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header / Nav */}
      <div className="flex items-center mb-2">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all border border-white/5"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Voltar para o Hub Social
        </button>
      </div>

      <UserProfileCard
        user={profile}
        rank={GamificationService.getRankForLevel(profile.level)}
        xpForNextLevel={GamificationService.calculateXpForNextLevel(profile.level)}
      />

      <div className="mt-8">
        {/* Navigation Pills */}
        <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/5 overflow-x-auto custom-scrollbar sticky top-20 z-30 shadow-lg mb-6">
          {[
            { id: 'favorites', label: 'Favoritos', icon: StarIcon },
            { id: 'stats', label: 'Estatísticas', icon: ChartPieIcon },
            { id: 'achievements', label: 'Conquistas', icon: TrophyIcon },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 relative whitespace-nowrap
                        ${isActive
                    ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="bg-bg-tertiary/30 backdrop-blur-sm p-6 rounded-2xl border border-white/5 min-h-[400px] shadow-inner">
          {activeTab === 'favorites' && (
            <FavoriteAnimesDisplay
              favoriteAnimes={top5RankedAnimes}
              onEditAnime={isOwnProfile ? onEditAnime : () => { }}
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