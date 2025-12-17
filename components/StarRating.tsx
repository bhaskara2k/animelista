import React, { useState, useRef, useEffect } from 'react';
import { StarIcon, StarHalfIcon } from './Icons';

interface StarRatingProps {
  rating: number; // Current rating (0-10)
  onSetRating?: (rating: number) => void;
  size?: string;
  color?: string;
  interactiveColor?: string;
  className?: string;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onSetRating,
  color = "text-yellow-400",
  interactiveColor = "text-yellow-500",
  readOnly = false,
  className = ""
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalStars = 10;

  const calculateRating = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return 0;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

    // Calculate relative position (0 to 1)
    let x = clientX - rect.left;
    const width = rect.width;

    // Clamp values
    if (x < 0) x = 0;
    if (x > width) x = width;

    // Convert to 0-10 scale
    const rawRating = (x / width) * totalStars;

    // Snap to nearest 0.5
    const snappedRating = Math.ceil(rawRating * 2) / 2;

    return Math.max(0, Math.min(10, snappedRating));
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly || !onSetRating) return;
    setIsDragging(true);
    const newRating = calculateRating(e);
    setHoverRating(newRating);
    onSetRating(newRating);
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly || !onSetRating) return;
    const newRating = calculateRating(e);
    setHoverRating(newRating);
    if (isDragging) {
      onSetRating(newRating);
    }
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
    setHoverRating(null);
  };

  // Global event listeners for drag release outside component
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging]);


  const activeRating = hoverRating !== null ? hoverRating : rating;

  if (readOnly || !onSetRating) {
    // Render static stars for display-only mode
    return (
      <div className={`flex items-center gap-0.5 ${className}`}>
        <span className="font-bold text-yellow-400 mr-1 text-sm">{rating > 0 ? rating : '-'}</span>
        <StarIcon className="w-4 h-4 text-yellow-400" filled />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center select-none touch-none ${className}`}>
      {/* Visual Feedback Number */}
      <div className={`text-2xl font-black mb-2 transition-all duration-200 ${activeRating > 0 ? interactiveColor : 'text-gray-600'
        }`}>
        {activeRating > 0 ? activeRating : 0}
        <span className="text-sm text-gray-500 font-normal ml-1">/ 10</span>
      </div>

      {/* Interactive Slider Area */}
      <div
        ref={containerRef}
        className="flex items-center gap-1 cursor-pointer p-2 relative group"
        onMouseDown={handleInteractionStart}
        onMouseMove={handleInteractionMove}
        onMouseLeave={() => !isDragging && setHoverRating(null)}
        onTouchStart={handleInteractionStart}
        onTouchMove={handleInteractionMove}
      >
        {/* Discrete Stars Rendering */}
        <div className="flex gap-1">
          {[...Array(totalStars)].map((_, i) => {
            const starValue = i + 1;
            const isFull = activeRating >= starValue;
            const isHalf = !isFull && activeRating >= starValue - 0.5;

            return (
              <div key={i} className="w-6 h-6 flex items-center justify-center transition-transform hover:scale-110">
                {isFull ? (
                  <StarIcon className={`w-6 h-6 ${color} drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]`} filled={true} />
                ) : isHalf ? (
                  <StarHalfIcon className={`w-6 h-6 ${color} drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]`} />
                ) : (
                  <StarIcon className="w-6 h-6 text-gray-700/50" filled={false} />
                )}
              </div>
            );
          })}
        </div>

      </div>

      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Arraste ou clique
      </p>
    </div>
  );
};

export default StarRating;