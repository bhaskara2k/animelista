
import React from 'react';
import { PublicUser } from '../types';
import AvatarDisplay from './AvatarDisplay';
import { CheckIcon, PlusIcon, TrashIcon, XMarkIcon, EyeIcon } from './Icons';

type CardType = 'friend' | 'request' | 'search_result' | 'sent_request';

// ... interface ...

interface FriendCardProps {
  user: PublicUser;
  cardType: CardType;
  onAdd?: (userId: string) => void;
  onAccept?: (friendshipId: string, userId: string) => void;
  onDecline?: (friendshipId: string, userId: string) => void;
  onRemove?: (friendshipId: string, userId: string) => void;
  onViewProfile?: (username: string) => void;
  isLoading?: boolean;
  friendshipId?: string;
}

const FriendCard: React.FC<FriendCardProps> = ({
  user,
  cardType,
  onAdd,
  onAccept,
  onDecline,
  onRemove,
  onViewProfile,
  isLoading = false,
  friendshipId,
}) => {

  const renderActions = () => {
    const buttonBaseClass = "p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center";

    switch (cardType) {
      case 'search_result':
        return (
          <button
            onClick={() => onAdd?.(user.id)}
            disabled={isLoading}
            className={`${buttonBaseClass} bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20`}
            title="Adicionar amigo"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        );
      case 'request':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => onDecline?.(friendshipId!, user.id)}
              disabled={isLoading}
              className={`${buttonBaseClass} bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20`}
              title="Recusar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onAccept?.(friendshipId!, user.id)}
              disabled={isLoading}
              className={`${buttonBaseClass} bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20`}
              title="Aceitar"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          </div>
        );
      case 'friend':
        return (
          <div className="flex items-center space-x-2">
            {onViewProfile && (
              <button
                onClick={() => onViewProfile?.(user.username)}
                className={`${buttonBaseClass} bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5`}
                title="Ver perfil"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => onRemove?.(friendshipId!, user.id)}
              disabled={isLoading}
              className={`${buttonBaseClass} bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 group-hover:opacity-100 opacity-60 transition-opacity`}
              title="Remover amigo"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        );
      case 'sent_request':
        return (
          <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-gray-400 uppercase tracking-wider">
            Pendente
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group flex items-center justify-between p-4 bg-surface-primary hover:bg-surface-hover/50 rounded-xl mb-3 border border-border-primary hover:border-accent-500/30 transition-all duration-300 w-full animate-fade-in-up">
      <div className="flex items-center space-x-4 min-w-0">
        <div className="relative">
          <AvatarDisplay avatarId={user.avatar_id} className="w-12 h-12 flex-shrink-0 ring-2 ring-white/10 group-hover:ring-accent-500/50 transition-all" />
          <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-white text-base truncate group-hover:text-accent-400 transition-colors">{user.username}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-accent-300 bg-accent-500/10 px-2 py-0.5 rounded-full border border-accent-500/10 uppercase tracking-widest">
              Nível {user.level}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 pl-3">
        {renderActions()}
      </div>
    </div>
  );
};

export default FriendCard;
