

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
    if (interval > 1) return Math.floor(interval) + "a";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return Math.floor(seconds) + "s";
  };
  
  const userText = isCurrentUser ? "Você" : <strong className="text-accent">{event.user_profile.username}</strong>;

  const renderEventContent = () => {
    switch (event.event_type) {
      case FeedEventType.COMPLETED_ANIME:
        if (!event.metadata?.anime_title) return null; // Safety check
        return (
          <div className="flex items-start space-x-4">
            <div className="mt-1 flex-shrink-0">
                <AvatarDisplay avatarId={event.user_profile.avatar_id} className="w-10 h-10" />
            </div>
            <div className="flex-grow">
              <p className="text-sm text-text-primary">
                {userText} completou o anime <strong className="font-semibold text-accent">{event.metadata.anime_title}</strong>.
              </p>
              <span className="text-xs text-text-tertiary">{timeAgo(event.created_at)} atrás</span>
            </div>
            {event.metadata.anime_image_url && (
              <img 
                src={event.metadata.anime_image_url} 
                alt={`Capa de ${event.metadata.anime_title}`} 
                className="w-14 h-20 object-cover rounded-md flex-shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
          </div>
        );
      case FeedEventType.UNLOCKED_ACHIEVEMENT:
        if (!event.metadata?.achievement_title) return null; // Safety check
        return (
            <div className="flex items-start space-x-4">
                 <div className="mt-1 flex-shrink-0">
                    <AvatarDisplay avatarId={event.user_profile.avatar_id} className="w-10 h-10" />
                </div>
                 <div className="flex-grow">
                    <p className="text-sm text-text-primary">
                        {userText} desbloqueou a conquista: <strong className="font-semibold text-yellow-400">{event.metadata.achievement_title}</strong>.
                    </p>
                    {event.metadata.achievement_description && (
                        <p className="text-xs text-text-secondary italic">"{event.metadata.achievement_description}"</p>
                    )}
                    <span className="text-xs text-text-tertiary mt-1 block">{timeAgo(event.created_at)} atrás</span>
                </div>
                <div className="flex-shrink-0 p-3 bg-yellow-500/10 rounded-full">
                    <MedalIcon className="w-8 h-8 text-yellow-400" />
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-secondary p-4 rounded-lg shadow-sm w-full">
      {renderEventContent()}
    </div>
  );
};

export default FeedEventCard;