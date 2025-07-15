import React, { useState, useRef } from 'react';
import { StarIcon, StarHalfIcon } from './Icons';

interface StarRatingProps {
  rating: number; // Current rating (0-10), can be X.5
  onSetRating?: (rating: number) => void;
  size?: string;
  color?: string;
  interactiveColor?: string;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onSetRating,
  size = "w-5 h-5",
  color = "text-yellow-400",
  interactiveColor = "text-yellow-300",
  className = ""
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const totalDisplayStars = 10; // We will display 10 star icons
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>, starIndex: number) => { // starIndex is 0-9
    if (!onSetRating) return;
    const starElement = starRefs.current[starIndex];
    if (starElement) {
      const rect = starElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;
      setHoverRating(starIndex + (isLeftHalf ? 0.5 : 1.0));
    }
  };

  const handleMouseLeaveContainer = () => {
    if (!onSetRating) return;
    setHoverRating(null);
  };

  const handleClick = (starIndex: number) => { // starIndex is 0-9
    if (!onSetRating || hoverRating === null) return;
    // If clicking on the current rating value, toggle to 0. Otherwise, set to hoverRating.
    if (hoverRating === rating) {
        onSetRating(0);
    } else {
        onSetRating(hoverRating);
    }
  };
  
  const handleClearRating = () => {
    if(onSetRating) {
        onSetRating(0);
    }
  }

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`flex items-center space-x-0.5 ${className}`} onMouseLeave={handleMouseLeaveContainer}>
      {[...Array(totalDisplayStars)].map((_, i) => { // i is 0-9 for 10 stars
        const starPointValue = i + 1; // Represents the value of this full star (1 to 10)
        let starElement;

        if (displayRating >= starPointValue) { // e.g. rating 7.5, star 7 (7.5 >= 7) -> full
          starElement = <StarIcon className={size} filled={true} />;
        } else if (displayRating >= starPointValue - 0.5) { // e.g. rating 7.5, star 8 (7.5 >= 7.5) -> half
          starElement = <StarHalfIcon className={size} />;
        } else {
          starElement = <StarIcon className={size} filled={false} />;
        }

        return (
          <button
            type="button"
            key={i}
            ref={el => { starRefs.current[i] = el; }}
            className={`p-0 bg-transparent border-none transition-colors duration-100 
                        ${onSetRating ? `hover:${interactiveColor}` : ''}
                        ${displayRating >= starPointValue - 0.5 ? color : 'text-slate-500 hover:text-slate-400'}`}
            onClick={() => handleClick(i)}
            onMouseMove={(e) => handleMouseMove(e, i)}
            // onMouseLeave is on the container now
            disabled={!onSetRating}
            aria-label={`Avaliar como ${starPointValue} de ${totalDisplayStars}. Estado: ${displayRating >= starPointValue ? 'Cheia' : (displayRating >= starPointValue - 0.5 ? 'Meia' : 'Vazia')}`}
          >
            {starElement}
          </button>
        );
      })}
      {onSetRating && rating > 0 && (
         <button 
            type="button" 
            onClick={handleClearRating} 
            className="ml-2 text-xs text-slate-400 hover:text-red-500"
            aria-label="Remover avaliação"
            title="Remover avaliação"
            >
            Limpar
        </button>
      )}
    </div>
  );
};

export default StarRating;