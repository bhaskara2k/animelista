import React from 'react';
import { FeedEvent, FeedEventType } from '../types';
import AvatarDisplay from './AvatarDisplay';
import { FilmIcon, MedalIcon } from './Icons';

interface FeedEventCardProps {
  event: FeedEvent;
  isCurrentUser: boolean;
}

const FeedEventCard: React.FC<FeedEventCardProps> = ({ event, isCurrentUser }) => {
  const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      const val = Math.floor(interval);
      return val === 1 ? "1 ano" : `${val} anos`;
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      const val = Math.floor(interval);
      return val === 1 ? "1 mês" : `${val} meses`;
    }

    interval = seconds / 86400;
    if (interval > 1) {
      const val = Math.floor(interval);
      return val === 1 ? "1 dia" : `${val} dias`;
    }

    interval = seconds / 3600;
    if (interval > 1) {
      const val = Math.floor(interval);
      return val === 1 ? "1 hora" : `${val} horas`;
    }

    interval = seconds / 60;
    if (interval > 1) {
      const val = Math.floor(interval);
      return val === 1 ? "1 minuto" : `${val} minutos`;
    }

    return "agora mesmo";
  };

  const userText = isCurrentUser ? (
    <span className="font-bold text-gray-400">Você</span>
  ) : (
    <strong className="font-bold text-accent-400 hover:text-accent-300 transition-colors cursor-pointer">{event.user_profile.username}</strong>
  );

  const renderEventContent = () => {
    switch (event.event_type) {
      case FeedEventType.COMPLETED_ANIME:
        if (!event.metadata?.anime_title) return null;
        return (
          <div className="flex gap-4 p-4">
            {/* Icon Indicator */}
            <div className="flex-shrink-0 mt-1">
              <div className="relative">
                <AvatarDisplay avatarId={event.user_profile.avatar_id} className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20" />
                <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-0.5 border-2 border-surface-primary">
                  <FilmIcon className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-grow min-w-0">
              <div className="text-sm text-gray-300 leading-relaxed">
                {userText} completou <span className="font-bold text-white">"{event.metadata.anime_title}"</span>.
              </div>
              <div className="text-xs text-indigo-400 mt-1 font-medium flex items-center gap-1">
                {timeAgo(event.created_at)} atrás
              </div>
            </div>

            {event.metadata.anime_image_url && (
              <div className="flex-shrink-0">
                <img
                  src={event.metadata.anime_image_url}
                  alt=""
                  className="w-10 h-14 object-cover rounded-md shadow-md ring-1 ring-white/10"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        );
      case FeedEventType.UNLOCKED_ACHIEVEMENT:
        if (!event.metadata?.achievement_title) return null;
        return (
          <div className="flex gap-4 p-4 relative overflow-hidden group">
            {/* Subtle BG Gradient */}
            <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-yellow-400/10 transition-colors" />

            <div className="flex-shrink-0 mt-1 relative z-10">
              <div className="relative">
                <AvatarDisplay avatarId={event.user_profile.avatar_id} className="w-8 h-8 rounded-full ring-2 ring-yellow-500/20" />
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-surface-primary">
                  <MedalIcon className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-grow min-w-0 relative z-10">
              <div className="text-sm text-gray-300 leading-relaxed">
                {userText} desbloqueou a conquista:
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <MedalIcon className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-yellow-400 uppercase tracking-wide text-xs">
                  {event.metadata.achievement_title}
                </span>
              </div>

              {event.metadata.achievement_description && (
                <p className="text-xs text-gray-500 italic mt-1 font-medium max-w-[90%]">
                  {event.metadata.achievement_description}
                </p>
              )}

              <div className="text-xs text-yellow-600/70 mt-2 font-medium">
                {timeAgo(event.created_at)} atrás
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-primary rounded-xl border border-border-primary overflow-hidden shadow-sm hover:border-border-secondary transition-colors mb-3">
      {renderEventContent()}
    </div>
  );
};

export default FeedEventCard;