

import React from 'react';
import { PublicUser } from '../types';
import AvatarDisplay from './AvatarDisplay';
import { CheckIcon, PlusIcon, TrashIcon, XMarkIcon, EyeIcon } from './Icons';

type CardType = 'friend' | 'request' | 'search_result';

interface FriendCardProps {
  user: PublicUser;
  cardType: CardType;
  onAdd?: (userId: string) => void;
  onAccept?: (requestId: number, userId: string) => void;
  onDecline?: (requestId: number, userId: string) => void;
  onRemove?: (friendshipId: number, userId: string) => void;
  onViewProfile?: (username: string) => void;
  isLoading?: boolean;
  friendshipId?: number; // Needed for remove/decline actions
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
    const buttonBaseClass = "p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-wait";

    switch (cardType) {
      case 'search_result':
        return (
          <button
            onClick={() => onAdd?.(user.id)}
            disabled={isLoading}
            className={`${buttonBaseClass} text-text-secondary hover:bg-emerald-500/20 hover:text-emerald-400`}
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
              className={`${buttonBaseClass} text-text-secondary hover:bg-red-500/20 hover:text-red-400`}
              title="Recusar pedido"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onAccept?.(friendshipId!, user.id)}
              disabled={isLoading}
              className={`${buttonBaseClass} text-text-secondary hover:bg-emerald-500/20 hover:text-emerald-400`}
              title="Aceitar pedido"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          </div>
        );
      case 'friend':
        return (
            <div className="flex items-center space-x-1">
                {onViewProfile && (
                    <button
                        onClick={() => onViewProfile?.(user.username)}
                        className={`${buttonBaseClass} text-text-secondary hover:bg-accent-cta/20 hover:text-accent`}
                        title="Ver perfil"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>
                )}
                <button
                onClick={() => onRemove?.(friendshipId!, user.id)}
                disabled={isLoading}
                className={`${buttonBaseClass} text-text-secondary hover:bg-red-500/20 hover:text-red-400`}
                title="Remover amigo"
                >
                <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        );
      default:
        return null;
    }
  };
  
  const CardContent = (
    <div className="flex items-center justify-between p-3 bg-surface-primary rounded-lg shadow-sm w-full">
      <div className="flex items-center space-x-3 min-w-0">
        <AvatarDisplay avatarId={user.avatar_id} className="w-10 h-10 flex-shrink-0" />
        <div className="flex items-baseline space-x-2 min-w-0">
            <span className="font-semibold text-text-primary truncate">{user.username}</span>
            <span className="text-xs font-bold text-accent bg-accent-cta/20 px-1.5 py-0.5 rounded-md flex-shrink-0">
                Nvl {user.level}
            </span>
        </div>
      </div>
      <div className="flex-shrink-0">
        {renderActions()}
      </div>
    </div>
  );
  
  return CardContent;
};

export default FriendCard;
