
import React from 'react';
import { MaterialSymbol } from './Icons';

export const AVATAR_OPTIONS = [
    { id: 'avatar_1', icon: 'face_retouching_natural', title: 'Padrão' },
    { id: 'avatar_2', icon: 'sentiment_very_satisfied', title: 'Feliz' },
    { id: 'avatar_3', icon: 'mood_bad', title: 'Triste' },
    { id: 'avatar_4', icon: 'rocket_launch', title: 'Foguete' },
    { id: 'avatar_5', icon: 'sports_esports', title: 'Gamer' },
    { id: 'avatar_6', icon: 'nightlife', title: 'Noturno' },
    { id: 'avatar_7', icon: 'cruelty_free', title: 'Panda' },
    { id: 'avatar_8', icon: 'self_improvement', title: 'Zen' },
    { id: 'avatar_9', icon: 'psychology', title: 'Cérebro' },
    { id: 'avatar_10', icon: 'temp_preferences_custom', title: 'Ninja' },
    { id: 'avatar_11', icon: 'skull', title: 'Caveira' },
];

interface AvatarDisplayProps {
  avatarId?: string;
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarId, className = "w-10 h-10" }) => {

  if (avatarId && avatarId.startsWith('http')) {
      return (
          <img
              src={avatarId}
              alt="Avatar do usuário"
              className={`flex-shrink-0 object-cover rounded-full bg-bg-tertiary ${className}`}
              onError={(e) => {
                  // Fallback to default icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = `flex-shrink-0 flex items-center justify-center rounded-full bg-bg-tertiary ${className}`;
                      const fallbackIcon = document.createElement('span');
                      fallbackIcon.className = 'material-symbols-outlined text-text-primary';
                      fallbackIcon.textContent = AVATAR_OPTIONS[0].icon;
                      fallbackDiv.appendChild(fallbackIcon);
                      parent.appendChild(fallbackDiv);
                  }
              }}
          />
      );
  }

  const avatar = AVATAR_OPTIONS.find(opt => opt.id === avatarId) || AVATAR_OPTIONS[0];

  // Dynamically determine the optical size based on the className (w-X)
  const sizeMatch = className?.match(/w-(\d+)/);
  const size = sizeMatch ? parseInt(sizeMatch[1], 10) * 4 : 40; // tailwind w-10 = 2.5rem = 40px
  const opticalSize = Math.min(48, Math.max(20, size)); // Clamp optical size between 20 and 48

  return (
    <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-bg-tertiary ${className}`} title={avatar.title}>
      <MaterialSymbol 
        iconName={avatar.icon} 
        className="text-text-primary" 
        opticalSize={opticalSize} 
        weight={300}
      />
    </div>
  );
};

export default AvatarDisplay;