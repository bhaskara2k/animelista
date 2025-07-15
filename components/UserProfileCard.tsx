import React from 'react';
import { User, Rank, PublicUser } from '../types';
import AvatarDisplay from './AvatarDisplay';
import ProgressBar from './ProgressBar';
import { EyeIcon } from './Icons';

interface UserProfileCardProps {
  user: User | PublicUser;
  rank: Rank;
  xpForNextLevel: number;
  onViewProfile?: (username: string) => void;
  isCurrentUser?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, rank, xpForNextLevel, onViewProfile, isCurrentUser = false }) => {
  
  const CardContent = (
      <div className="bg-surface-primary rounded-xl shadow-custom-lg p-5 flex flex-col sm:flex-row items-center gap-5 border border-border-primary w-full">
        <AvatarDisplay avatarId={'email' in user ? user.avatarId : user.avatar_id} className="w-20 h-20 flex-shrink-0" />
        <div className="flex-grow w-full text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-text-primary">{user.username}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 sm:mt-0">
                  <span 
                      className="font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full text-sm"
                      title={`Patente para Nível ${rank.minLevel}+`}
                  >
                      {rank.title}
                  </span>
                   {isCurrentUser && onViewProfile && (
                        <button
                            onClick={() => onViewProfile(user.username)}
                            className="p-2 rounded-full text-text-secondary hover:bg-surface-secondary transition-colors"
                            aria-label={`Ver seu perfil público`}
                            title="Ver seu perfil"
                        >
                            <EyeIcon className="w-5 h-5"/>
                        </button>
                    )}
              </div>
          </div>
          
          {user.bio && (
              <p className="text-sm text-text-secondary mt-2 italic line-clamp-2">"{user.bio}"</p>
          )}
          
          <div className="mt-3">
            <div className="flex justify-between items-end mb-1">
              <span className="text-lg font-bold text-accent">Nível {user.level}</span>
              <span className="text-xs text-text-secondary font-medium">
                {user.xp} / {xpForNextLevel} XP
              </span>
            </div>
            <ProgressBar
              current={user.xp}
              total={xpForNextLevel}
              barHeight="h-2"
            />
          </div>
        </div>
      </div>
  );

  return CardContent;
};

export default UserProfileCard;