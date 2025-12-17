
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import StarRating from './StarRating';
import { Anime } from '../types';
import { CheckIcon, XMarkIcon } from './Icons';

interface RatingPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  anime: Anime | null;
  onSaveRating: (animeId: string, rating: number) => void;
}

const RatingPromptModal: React.FC<RatingPromptModalProps> = ({ isOpen, onClose, anime, onSaveRating }) => {
  const [currentRating, setCurrentRating] = useState(0);

  useEffect(() => {
    if (anime) {
      setCurrentRating(anime.rating || 0);
    }
  }, [anime]);

  if (!isOpen || !anime) return null;

  const handleSave = () => {
    onSaveRating(anime.id, currentRating);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Avalie ${anime.title}!`}>
      <div className="text-center">
        <p className="text-text-primary mb-2">
          Parabéns por completar <strong className="text-accent">{anime.title}</strong>!
        </p>
        <p className="text-text-secondary mb-6">Que nota você daria para este anime?</p>
        
        <div className="flex justify-center mb-8">
          <StarRating 
            rating={currentRating} 
            onSetRating={setCurrentRating} 
            size="w-8 h-8" 
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md text-text-primary bg-surface-secondary hover:bg-surface-hover transition-colors flex items-center justify-center space-x-2"
          >
            <XMarkIcon className="w-5 h-5"/>
            <span>Pular</span>
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-md text-white bg-accent-cta hover:bg-accent-cta-hover transition-colors flex items-center justify-center space-x-2"
          >
            <CheckIcon className="w-5 h-5"/>
            <span>Salvar Nota</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RatingPromptModal;
