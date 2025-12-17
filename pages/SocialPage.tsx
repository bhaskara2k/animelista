import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as SocialService from '../services/SocialService';
import * as GamificationService from '../services/GamificationService';
import { PublicUser, Friendship, FeedEvent, FriendshipStatus, Rank } from '../types';
import FriendCard from '../components/FriendCard';
import FeedEventCard from '../components/FeedEventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { SearchIcon, UsersIcon, BellIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon } from '../components/Icons'; // Assuming generic icons or similar exist
import UserProfileCard from '../components/UserProfileCard';
import AvatarDisplay from '../components/AvatarDisplay';

type SocialSubView = 'feed' | 'friends' | 'requests' | 'find';

interface SocialPageProps {
  onViewProfile: (username: string) => void;
}

const SocialPage: React.FC<SocialPageProps> = ({ onViewProfile }) => {
  const { currentUser } = useAuth();
  const [activeSubView, setActiveSubView] = useState<SocialSubView>('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [friends, setFriends] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const [userRank, setUserRank] = useState<Rank | null>(null);
  const [xpForNextLevel, setXpForNextLevel] = useState(0);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const friendshipData = await SocialService.getFriendships(currentUser.id);
      setFriends(friendshipData.friends);
      setSentRequests(friendshipData.sentRequests);

      const reqs = await SocialService.getFriendRequests(currentUser.id);
      setReceivedRequests(reqs);

      const friendIds = friendshipData.friends.map(f => f.friend_profile.id);
      const allFeedEvents = await SocialService.getFeedEvents(currentUser.id, friendIds);
      setFeedEvents(allFeedEvents);

    } catch (err: any) {
      console.error("Error fetching social data:", err);
      setError("Falha ao carregar dados sociais. Tente recarregar a página.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (currentUser) {
      setUserRank(GamificationService.getRankForLevel(currentUser.level));
      setXpForNextLevel(GamificationService.calculateXpForNextLevel(currentUser.level));
    }
  }, [currentUser]);


  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentUser) return;
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setSearchAttempted(false);
      return;
    }

    setIsSearching(true);
    setSearchAttempted(false);
    setSearchError(null);

    try {
      const results = await SocialService.searchUsers(searchTerm, currentUser.id);
      const existingSocialIds = new Set([
        ...friends.map(f => f.friend_profile.id),
        ...sentRequests.map(r => r.friend_profile.id),
        ...receivedRequests.map(r => r.friend_profile.id)
      ]);
      const filteredResults = results.filter(r => !existingSocialIds.has(r.id));
      setSearchResults(filteredResults);
    } catch (err: any) {
      setSearchError("Falha ao buscar usuários. Tente novamente.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setSearchAttempted(true);
    }
  };

  const handleAction = async (action: () => Promise<any>, key: string) => {
    setActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      await action();
      fetchData();
    } catch (err) {
      console.error("Social action failed:", err);
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleAddFriend = (receiverId: string) => {
    if (!currentUser) return;
    handleAction(() => SocialService.sendFriendRequest(currentUser.id, receiverId), `add-${receiverId}`);
  };

  const handleAcceptRequest = (friendshipId: number, userId: string) => {
    handleAction(() => SocialService.respondToFriendRequest(friendshipId, FriendshipStatus.ACCEPTED), `accept-${userId}`);
  };

  const handleDeclineRequest = (friendshipId: number, userId: string) => {
    handleAction(() => SocialService.respondToFriendRequest(friendshipId, FriendshipStatus.DECLINED), `decline-${userId}`);
  };

  const handleRemoveFriend = (friendshipId: number, userId: string) => {
    if (window.confirm("Tem certeza que deseja remover este amigo?")) {
      handleAction(() => SocialService.removeFriend(friendshipId), `remove-${userId}`);
    }
  };


  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner className="w-12 h-12" /></div>;
    if (error) return <div className="text-center py-10 text-red-400 bg-red-400/10 rounded-xl">{error}</div>;

    switch (activeSubView) {
      case 'feed':
        return feedEvents.length > 0 ? (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-accent-400" />
              Atividade Recente
            </h3>
            {feedEvents.map(event => (
              <FeedEventCard key={event.id} event={event} isCurrentUser={event.user_id === currentUser?.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-surface-primary rounded-xl border border-white/5 animate-fade-in">
            <SparklesIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium text-lg">O feed está silencioso...</p>
            <p className="text-gray-500 text-sm mt-2">Adicione amigos para ver suas conquistas e animes assistidos aqui!</p>
          </div>
        );

      case 'friends':
        return friends.length > 0 ? (
          <div className="animate-fade-in-up">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-accent-400" />
              Seus Amigos ({friends.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {friends.map(f => (
                <FriendCard key={f.id} user={f.friend_profile} cardType="friend" onRemove={handleRemoveFriend} onViewProfile={onViewProfile} isLoading={actionLoading[`remove-${f.friend_profile.id}`]} friendshipId={f.id} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-surface-primary rounded-xl border border-white/5 animate-fade-in">
            <UsersIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium text-lg">Você ainda não tem amigos.</p>
            <button onClick={() => setActiveSubView('find')} className="text-accent-400 font-bold hover:underline mt-2">Encontrar pessoas</button>
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Received Requests */}
              <div className="bg-surface-secondary/30 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-accent-500/10 rounded-lg">
                    <BellIcon className="w-5 h-5 text-accent-400" />
                  </div>
                  Pedidos Recebidos
                  <span className="text-xs font-bold bg-accent-500 text-white px-2 py-0.5 rounded-full">{receivedRequests.length}</span>
                </h3>

                {receivedRequests.length > 0 ? (
                  <div className="space-y-3">
                    {receivedRequests.map(req => (
                      <FriendCard key={req.id} user={req.friend_profile} cardType="request" onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} isLoading={actionLoading[`accept-${req.friend_profile.id}`] || actionLoading[`decline-${req.friend_profile.id}`]} friendshipId={req.id} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-sm">Nenhum pedido pendente.</p>
                  </div>
                )}
              </div>

              {/* Sent Requests */}
              <div className="bg-surface-secondary/30 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <span className="w-5 h-5 flex items-center justify-center font-bold text-gray-500">↗</span>
                  </div>
                  Pedidos Enviados
                  <span className="text-xs font-bold bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{sentRequests.length}</span>
                </h3>

                {sentRequests.length > 0 ? (
                  <div className="space-y-3">
                    {sentRequests.map(req => (
                      <FriendCard key={req.id} user={req.friend_profile} cardType="sent_request" friendshipId={req.id} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-sm">Você não enviou nenhum pedido.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'find':
        return (
          <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-white">Encontre novos amigos</h2>
              <p className="text-gray-400">Busque por nome de usuário e conecte-se com outros fãs de anime.</p>
            </div>

            <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-accent-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Digite o nome de usuário..."
                className="w-full pl-14 pr-32 py-5 bg-surface-primary border border-white/10 rounded-2xl focus:ring-2 focus:ring-accent-500/50 outline-none text-white text-lg placeholder-gray-500 shadow-xl transition-all relative z-10"
              />
              <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-accent-400 transition-colors z-20" />

              <button
                type="submit"
                disabled={isSearching || searchTerm.length < 2}
                className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-accent-600 hover:bg-accent-500 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-800 transition-all font-bold text-sm shadow-lg z-20 flex items-center gap-2"
              >
                {isSearching ? <LoadingSpinner size="w-4 h-4" /> : (
                  <>
                    Buscar
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              {!isSearching && searchError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 animate-shake">
                  {searchError}
                </div>
              )}

              {!isSearching && !searchError && searchAttempted && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-xl font-bold text-white">Nenhum resultado encontrado</p>
                  <p className="text-gray-500 mt-2">Não encontramos ninguém com o nome "<span className="text-white font-semibold">{searchTerm}</span>".</p>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-4 animate-fade-in-up">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Resultados ({searchResults.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.map(user => (
                      <FriendCard key={user.id} user={user} cardType="search_result" onAdd={handleAddFriend} isLoading={actionLoading[`add-${user.id}`]} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State / Suggestions */}
              {!searchAttempted && !isSearching && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-default">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-2xl">🏆</div>
                    <h4 className="font-bold text-white mb-2">Compita no Rank</h4>
                    <p className="text-sm text-gray-400">Adicione amigos para ver quem assiste mais animes e sobe de nível mais rápido.</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-default">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-2xl">🤝</div>
                    <h4 className="font-bold text-white mb-2">Conexão Social</h4>
                    <p className="text-sm text-gray-400">Veja o que seus amigos estão assistindo e descubra novos títulos através deles.</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-default">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-2xl">🌟</div>
                    <h4 className="font-bold text-white mb-2">Compartilhe Gostos</h4>
                    <p className="text-sm text-gray-400">Troque recomendações e discuta sobre os episódios mais recentes.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  if (!currentUser || !userRank) {
    return <div className="p-8 flex items-center justify-center min-h-[400px]"><LoadingSpinner size="w-12 h-12" /></div>;
  }


  return (
    <div className="space-y-6 pb-12 animate-fade-in">

      {/* 1. Hero Profile Section */}
      <UserProfileCard
        user={currentUser}
        rank={userRank}
        xpForNextLevel={xpForNextLevel}
        onViewProfile={onViewProfile}
        isCurrentUser={true}
      />

      {/* 2. Navigation Tabs */}
      <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/5 overflow-x-auto custom-scrollbar sticky top-20 z-30 shadow-lg">
        {[
          { id: 'feed', label: 'Feed', icon: SparklesIcon },
          { id: 'friends', label: 'Amigos', icon: UsersIcon },
          { id: 'requests', label: 'Pedidos', icon: BellIcon, count: receivedRequests.length },
          { id: 'find', label: 'Buscar', icon: SearchIcon },
        ].map((tab) => {
          const isActive = activeSubView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubView(tab.id as SocialSubView)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 relative whitespace-nowrap
                        ${isActive
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce-subtle' : ''}`} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          )
        })}
      </div>

      {/* 3. Main Content Area */}
      <div className="bg-bg-tertiary/30 backdrop-blur-sm p-6 rounded-2xl border border-white/5 min-h-[400px] shadow-inner">
        {renderContent()}
      </div>

    </div>
  );
};

export default SocialPage;
