

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as SocialService from '../services/SocialService';
import * as GamificationService from '../services/GamificationService';
import { PublicUser, Friendship, FeedEvent, FriendshipStatus, Rank } from '../types';
import FriendCard from '../components/FriendCard';
import FeedEventCard from '../components/FeedEventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { SearchIcon } from '../components/Icons';
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
        // Step 1: Get all friendship data (friends and sent requests)
        const friendshipData = await SocialService.getFriendships(currentUser.id);
        setFriends(friendshipData.friends);
        setSentRequests(friendshipData.sentRequests);

        // Step 2: Get all incoming friend requests
        const reqs = await SocialService.getFriendRequests(currentUser.id);
        setReceivedRequests(reqs);

        // Step 3: Use the confirmed friend list to fetch the complete feed in one go
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
      fetchData(); // Refresh all data after any action
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


  const subViewButtonClass = (view: SocialSubView) =>
    `px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary focus-visible:ring-accent-ring
     ${activeSubView === view
        ? 'bg-accent-cta text-white'
        : 'bg-surface-secondary text-text-secondary hover:bg-surface-hover hover:text-text-primary'
     }`;
     
  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center py-10"><LoadingSpinner className="w-10 h-10" /></div>;
    if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

    switch (activeSubView) {
      case 'feed':
        return feedEvents.length > 0 ? (
          <div className="space-y-3">
            {feedEvents.map(event => (
              <FeedEventCard key={event.id} event={event} isCurrentUser={event.user_id === currentUser?.id} />
            ))}
          </div>
        ) : <p className="text-center text-text-secondary py-10">O feed de atividades está vazio. Adicione amigos para ver o que eles estão fazendo!</p>;
      
      case 'friends':
        return friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map(f => (
              <FriendCard key={f.id} user={f.friend_profile} cardType="friend" onRemove={handleRemoveFriend} onViewProfile={onViewProfile} isLoading={actionLoading[`remove-${f.friend_profile.id}`]} friendshipId={f.id} />
            ))}
          </div>
        ) : <p className="text-center text-text-secondary py-10">Você ainda não tem amigos. Encontre alguns na aba "Buscar"!</p>;

      case 'requests':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-accent mb-3">Pedidos Recebidos ({receivedRequests.length})</h3>
              {receivedRequests.length > 0 ? (
                <div className="space-y-3">
                  {receivedRequests.map(req => (
                    <FriendCard key={req.id} user={req.friend_profile} cardType="request" onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} isLoading={actionLoading[`accept-${req.friend_profile.id}`] || actionLoading[`decline-${req.friend_profile.id}`]} friendshipId={req.id} />
                  ))}
                </div>
              ) : <p className="text-sm text-text-secondary">Nenhum pedido de amizade pendente.</p>}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-accent mb-3">Pedidos Enviados ({sentRequests.length})</h3>
              {sentRequests.length > 0 ? (
                <div className="space-y-3">
                  {sentRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-surface-primary rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                         <AvatarDisplay avatarId={req.friend_profile.avatar_id} className="w-10 h-10" />
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-text-primary">{req.friend_profile.username}</span>
                            <span className="text-xs font-bold text-accent bg-accent-cta/20 px-1.5 py-0.5 rounded-md">
                                Nvl {req.friend_profile.level}
                            </span>
                        </div>
                      </div>
                      <span className="text-xs text-text-tertiary italic">Pendente</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-text-secondary">Você não enviou nenhum pedido de amizade.</p>}
            </div>
          </div>
        );

      case 'find':
        return (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar usuário..." className="w-full p-2.5 bg-surface-primary border border-border-primary rounded-md focus:ring-2 focus:ring-accent-ring outline-none" />
              <button type="submit" disabled={isSearching || searchTerm.length < 2} className="px-4 py-2 bg-accent-cta text-white rounded-md flex-shrink-0 disabled:bg-slate-600"><SearchIcon className="w-5 h-5"/></button>
            </form>
            {isSearching && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
            
            {!isSearching && searchError && (
              <p className="text-center text-red-400 py-6">{searchError}</p>
            )}

            {!isSearching && !searchError && searchAttempted && searchResults.length === 0 && (
              <p className="text-center text-text-secondary py-6">Nenhum usuário encontrado para "{searchTerm}".</p>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map(user => (
                  <FriendCard key={user.id} user={user} cardType="search_result" onAdd={handleAddFriend} isLoading={actionLoading[`add-${user.id}`]} />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  if (!currentUser || !userRank) {
     return <div className="p-4 md:p-6 bg-bg-tertiary rounded-lg shadow-custom-xl min-h-[500px] flex items-center justify-center"><LoadingSpinner/></div>;
  }


  return (
    <div className="p-4 md:p-6 bg-bg-tertiary rounded-lg shadow-custom-xl min-h-[500px]">
      <div className="mb-6">
        <UserProfileCard 
            user={currentUser} 
            rank={userRank} 
            xpForNextLevel={xpForNextLevel} 
            onViewProfile={onViewProfile}
            isCurrentUser={true}
        />
      </div>

      <div className="mb-6 flex space-x-2 border-b border-border-primary pb-3">
        <button onClick={() => setActiveSubView('feed')} className={subViewButtonClass('feed')}>Feed</button>
        <button onClick={() => setActiveSubView('friends')} className={subViewButtonClass('friends')}>Amigos</button>
        <button onClick={() => setActiveSubView('requests')} className={subViewButtonClass('requests')}>Pedidos</button>
        <button onClick={() => setActiveSubView('find')} className={subViewButtonClass('find')}>Buscar</button>
      </div>

      <div className="animate-fade-in">
        {renderContent()}
      </div>
      
    </div>
  );
};

export default SocialPage;
