
import React from 'react';
import { Anime, AnimeStatus, ListDensityOption } from '../types';
import AnimeItem from './AnimeItem';
import { ListBulletIcon } from './Icons'; // Changed from EyeIcon

interface AnimeListProps {
  animeList: Anime[];
  onUpdateEpisode: (id: string, newEpisodeCount: number) => void;
  onDelete: (id: string) => void;
  onEdit: (anime: Anime) => void;
  onSetStatus: (id: string, status: AnimeStatus) => void;
  onSetRating: (id: string, rating: number) => void;
  listDensity: ListDensityOption;
}

const AnimeList: React.FC<AnimeListProps> = ({ 
  animeList, 
  onUpdateEpisode, 
  onDelete, 
  onEdit, 
  onSetStatus, 
  onSetRating,
  listDensity 
}) => {
  if (animeList.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 px-6 bg-surface-primary rounded-lg shadow-custom-md border border-border-primary mt-4">
        <ListBulletIcon className="w-16 h-16 mx-auto text-text-tertiary mb-6" opticalSize={48} />
        <p className="text-xl font-semibold text-text-secondary mb-2">Sua agenda de animes está vazia.</p>
        <p className="text-text-tertiary">
          Clique no botão <strong className="text-accent">"Adicionar"</strong> no topo para começar a organizar seus animes!
        </p>
      </div>
    );
  }

  const getGridGapClass = () => {
    switch (listDensity) {
      case 'compact': return 'gap-3';
      case 'normal': return 'gap-6';
      case 'spaced': return 'gap-8';
      default: return 'gap-6';
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ${getGridGapClass()} p-4 md:p-6`}>
      {animeList.map(anime => (
        <AnimeItem
          key={anime.id}
          anime={anime}
          onUpdateEpisode={onUpdateEpisode}
          onDelete={onDelete}
          onEdit={onEdit}
          onSetStatus={onSetStatus}
          onSetRating={onSetRating}
          listDensity={listDensity}
        />
      ))}
    </div>
  );
};

export default AnimeList;
