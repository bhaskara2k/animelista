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
  return (
    <span
      title={platform.name}
      className="px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap shadow-sm"
      style={{ 
        backgroundColor: platform.bgColor, 
        color: platform.textColor,
        border: platform.bgColor === '#FFFFFF' || platform.bgColor === '#ffffff' ? `1px solid ${platform.textColor === '#FFFFFF' || platform.textColor === '#ffffff' ? '#DDDDDD' : platform.textColor}` : 'none' // Add border for very light bg
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