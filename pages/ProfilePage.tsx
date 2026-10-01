import React, { useState, useEffect, useMemo } from 'react';
import { FullPublicProfile, PublicUser, Anime, UserAchievement, AnimeStatus, StatisticsData, ViewMode, ListDensityOption, FeedEvent } from '../types';
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
import FeedEventCard from '../components/FeedEventCard';
import ShareProfileModal from '../components/ShareProfileModal';
import { ChevronLeftIcon, ChartPieIcon, TrophyIcon, StarIcon, ClockIcon } from '../components/Icons';

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
  const [activeTab, setActiveTab] = useState<'favorites' | 'stats' | 'achievements' | 'timeline'>('favorites');
  const [timelineEvents, setTimelineEvents] = useState<FeedEvent[]>([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  useEffect(() => {
    if (profileData && activeTab === 'timeline' && timelineEvents.length === 0) {
      setIsLoadingTimeline(true);
      SocialService.getUserTimelineEvents(profileData.profile.id)
        .then(events => setTimelineEvents(events))
        .catch(err => console.error("Error loading timeline:", err))
        .finally(() => setIsLoadingTimeline(false));
    }
  }, [profileData, activeTab, timelineEvents.length]);

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
        onShareProfile={() => setIsShareModalOpen(true)}
      />

      <div className="mt-8">
        {/* Navigation Pills */}
        <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/5 overflow-x-auto custom-scrollbar sticky top-20 z-30 shadow-lg mb-6">
          {[
            { id: 'favorites', label: 'Favoritos', icon: StarIcon },
            { id: 'stats', label: 'Estatísticas', icon: ChartPieIcon },
            { id: 'achievements', label: 'Conquistas', icon: TrophyIcon },
            { id: 'timeline', label: 'Linha do Tempo', icon: ClockIcon },
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
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-accent-400" />
                    Histórico & Linha do Tempo
                  </h3>
                  <p className="text-xs text-gray-400">Episódios assistidos, conquistas e animes concluídos</p>
                </div>
              </div>

              {isLoadingTimeline ? (
                <div className="py-16 flex justify-center">
                  <LoadingSpinner className="w-8 h-8" />
                </div>
              ) : timelineEvents.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <ClockIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Nenhuma atividade registrada ainda nesta linha do tempo.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {timelineEvents.map(event => (
                    <FeedEventCard
                      key={event.id}
                      event={event}
                      isCurrentUser={isOwnProfile}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Profile Card Modal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        user={profile}
        stats={stats}
        animes={animes}
      />
    </div>
  );
};

export default ProfilePage;