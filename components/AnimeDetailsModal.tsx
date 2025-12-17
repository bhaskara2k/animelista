
import React, { useState, useEffect } from 'react';
import { AniListMedia } from '../types';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { translateText } from '../services/GeminiService'; // Assuming GeminiService.ts is created
import { XMarkIcon, PlusIcon } from './Icons';
import { translateFormat, translateGenre, translateAniListStatus } from '../utils/translationUtils';
import { translateAniListSeasonToPortuguese } from '../utils/seasonUtils';

interface AnimeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  anime: AniListMedia | null;
  onAddToList: (anime: AniListMedia) => void;
}

const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({ isOpen, onClose, anime, onAddToList }) => {
  const [translatedSynopsis, setTranslatedSynopsis] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (isOpen && anime?.description) {
      setIsTranslating(true);
      setTranslatedSynopsis(null); // Clear previous
      const originalSynopsis = stripHtml(anime.description);
      translateText(originalSynopsis, "pt-BR")
        .then(translated => {
          setTranslatedSynopsis(translated);
        })
        .catch(error => {
          console.error("Failed to translate synopsis:", error);
          setTranslatedSynopsis(originalSynopsis); // Fallback to original if translation fails
        })
        .finally(() => {
          setIsTranslating(false);
        });
    }
  }, [isOpen, anime]);

  if (!isOpen || !anime) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={anime.title.romaji || anime.title.english || "Detalhes do Anime"}>
      <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <img
            src={anime.coverImage.extraLarge || anime.coverImage.large || `https://picsum.photos/seed/${anime.id}/200/300`}
            alt={`Capa de ${anime.title.romaji}`}
            className="w-full sm:w-1/3 h-auto object-cover rounded-md shadow-lg flex-shrink-0"
            onError={(e) => (e.currentTarget.src = `https://picsum.photos/seed/${anime.id}/200/300`)}
          />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-accent mb-1">{anime.title.romaji || anime.title.english}</h2>
            {anime.title.native && <p className="text-sm text-text-secondary mb-3">{anime.title.native}</p>}

            <div className="text-sm text-text-secondary space-y-1 mb-3">
              <p><strong>Formato:</strong> {translateFormat(anime.format || 'N/A')}</p>
              {anime.seasonYear && <p><strong>Temporada:</strong> {translateAniListSeasonToPortuguese(anime.season)} {anime.seasonYear}</p>}
              {anime.status && <p><strong>Status:</strong> {translateAniListStatus(anime.status)}</p>}
              {anime.episodes && <p><strong>Episódios:</strong> {anime.episodes}</p>}
              {anime.averageScore && anime.averageScore > 0 && (
                <p><strong>Nota Média (AniList):</strong> <span className="font-semibold text-amber-400">{(anime.averageScore / 10).toFixed(1)}/10</span></p>
              )}
            </div>
             {anime.genres && anime.genres.length > 0 && (
                <div>
                    <strong className="text-sm text-text-secondary">Gêneros:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                    {anime.genres.map(genre => (
                        <span key={genre} className="px-2 py-0.5 text-xs font-medium bg-[var(--accent-700)] text-[var(--accent-100)] rounded-full">
                        {translateGenre(genre)}
                        </span>
                    ))}
                    </div>
                </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-accent mb-2">Sinopse</h3>
          {isTranslating && (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner className="w-8 h-8 text-accent" />
              <p className="ml-3 text-text-secondary">Traduzindo sinopse...</p>
            </div>
          )}
          {!isTranslating && translatedSynopsis && (
            <p className="text-text-primary whitespace-pre-wrap text-sm leading-relaxed">
              {translatedSynopsis}
            </p>
          )}
          {!isTranslating && !translatedSynopsis && (
             <p className="text-text-secondary text-sm">Sinopse não disponível ou falha na tradução.</p>
          )}
        </div>

        {anime.siteUrl && (
             <a 
                href={anime.siteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block mt-3 text-sm text-accent hover:underline"
            >
                Ver no AniList &rarr;
            </a>
        )}

      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md text-text-primary bg-surface-secondary hover:bg-surface-hover transition-colors flex items-center justify-center space-x-2"
          >
            <XMarkIcon className="w-5 h-5"/>
            <span>Fechar</span>
          </button>
          <button
            onClick={() => {
              onAddToList(anime);
              onClose(); // Close details modal after adding
            }}
            className="px-6 py-2.5 rounded-md text-white bg-accent-cta hover:bg-accent-cta-hover transition-colors flex items-center justify-center space-x-2"
          >
            <PlusIcon className="w-5 h-5"/>
            <span>Adicionar à Minha Lista</span>
          </button>
        </div>
    </Modal>
  );
};

export default AnimeDetailsModal;
