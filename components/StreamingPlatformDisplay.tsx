import React from 'react';
import { StreamingPlatform } from '../types';

interface PlatformItemProps {
  platform: StreamingPlatform;
}

interface StreamingPlatformDisplayProps {
  platforms: StreamingPlatform[];
  maxVisible?: number;
  className?: string;
}

const PlatformItem: React.FC<PlatformItemProps> = ({ platform }) => {
  const [imgError, setImgError] = React.useState(false);

  const logoMap: Record<string, string> = {
    'crunchyroll': '/logos/crunchyroll.png',
    'netflix': '/logos/netflix.png',
    'youcine': '/logos/youcine.png',
    'disney+': '/logos/disney_plus.png',
    'disney plus': '/logos/disney_plus.png',
    'prime video': '/logos/prime_video.png',
    'amazon prime': '/logos/prime_video.png',
    'amazon prime video': '/logos/prime_video.png',
    'hbo max': '/logos/hbo_max.png',
    'max': '/logos/hbo_max.png',
  };

  const normalizedName = platform.name.toLowerCase().trim();
  const logoUrl = logoMap[normalizedName];

  if (logoUrl && !imgError) {
    return (
      <div className="bg-white rounded-md p-0.5 shadow-sm hover:scale-105 transition-transform" title={platform.name}>
        <img
          src={`${logoUrl}?v=3`}
          alt={platform.name}
          className="h-5 w-auto object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <span
      title={platform.name}
      className="px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap shadow-sm"
      style={{
        backgroundColor: platform.bgColor,
        color: platform.textColor,
        border: platform.bgColor === '#FFFFFF' || platform.bgColor === '#ffffff' ? `1px solid ${platform.textColor === '#FFFFFF' || platform.textColor === '#ffffff' ? '#DDDDDD' : platform.textColor}` : 'none'
      }}
    >
      {platform.name}
    </span>
  );
};

const StreamingPlatformDisplay: React.FC<StreamingPlatformDisplayProps> = ({
  platforms,
  maxVisible = 3,
  className = "",
}) => {
  if (!platforms || platforms.length === 0) {
    return null;
  }

  const visiblePlatforms = platforms.slice(0, maxVisible);
  const hiddenCount = platforms.length - visiblePlatforms.length;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {visiblePlatforms.map((platform) => (
        <PlatformItem key={platform.name} platform={platform} />
      ))}
      {hiddenCount > 0 && (
        <span className="text-xs text-slate-400 bg-slate-700 px-1.5 py-0.5 rounded-sm">+{hiddenCount}</span>
      )}
    </div>
  );
};

export default StreamingPlatformDisplay;