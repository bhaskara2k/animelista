import React from 'react';

interface SkeletonCardProps {
  cardType?: 'carousel' | 'grid';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ cardType = 'grid' }) => {
  const imageSizeClass = cardType === 'carousel' ? 'h-72 sm:h-80 md:h-96' : 'h-72';
  const cardWidthClass = cardType === 'carousel' ? 'w-48 sm:w-56 md:w-64' : 'w-full';

  return (
    <div className={`bg-surface-secondary rounded-lg shadow-custom-md overflow-hidden flex flex-col ${cardWidthClass}`}>
      <div className={`${imageSizeClass} w-full bg-bg-tertiary animate-shimmer`}></div>
      <div className="p-3 flex flex-col flex-grow space-y-3">
        <div className="h-4 bg-bg-tertiary rounded animate-shimmer w-3/4"></div>
        <div className="h-3 bg-bg-tertiary rounded animate-shimmer w-1/2"></div>
        {cardType === 'grid' && (
            <>
            <div className="h-3 bg-bg-tertiary rounded animate-shimmer w-5/6"></div>
            <div className="h-3 bg-bg-tertiary rounded animate-shimmer w-2/3 mt-1"></div>
            </>
        )}
         {cardType === 'carousel' && (
            <div className="h-3 bg-bg-tertiary rounded animate-shimmer w-5/6"></div>
        )}
      </div>
    </div>
  );
};

export default SkeletonCard;