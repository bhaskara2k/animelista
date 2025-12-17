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

  return (
    <div className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-accent-500 via-accent-300 to-accent-500 bg-[length:200%_auto] animate-gradient-xy shadow-lg">
      <div className="bg-surface-primary rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 h-full relative z-10">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-accent-500/5 rounded-2xl rounded-tr-[40px] pointer-events-none" />

        {/* Avatar Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent-400 blur-xl opacity-20 rounded-full scale-110"></div>
          <AvatarDisplay avatarId={'email' in user ? user.avatarId : user.avatar_id} className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 ring-4 ring-bg-primary relative z-10" />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border-2 border-bg-primary z-20 uppercase tracking-wider">
            Nível {user.level}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow w-full text-center sm:text-left z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">{user.username}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 uppercase text-xs tracking-widest"
                  title={`Patente para Nível ${rank.minLevel}+`}
                >
                  {rank.title}
                </span>
              </div>
            </div>

            {isCurrentUser && onViewProfile && (
              <button
                onClick={() => onViewProfile(user.username)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-white/20 group/btn"
              >
                <EyeIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                <span>Ver Perfil</span>
              </button>
            )}
          </div>

          {user.bio && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2 italic font-medium">"{user.bio}"</p>
          )}

          {/* XP Bar */}
          <div className="mt-auto bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progresso</span>
              <span className="text-xs font-mono text-accent-300">
                <span className="text-white">{user.xp}</span> / {xpForNextLevel} XP
              </span>
            </div>
            <ProgressBar
              current={user.xp}
              total={xpForNextLevel}
              barHeight="h-2.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;