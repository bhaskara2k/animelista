import React from 'react';
import { Anime, AnimeStatus, AudioType, AchievementDefinition, AchievementTier } from '../types';
import { 
  FilmIcon, 
  BookOpenIcon, 
  StarIcon, 
  AcademicCapIcon, 
  TrendingUpIcon, 
  BoltIcon, 
  CrownIcon, 
  FireIcon, 
  ShieldIcon,
  SparklesIcon,
  HeartIcon,
  TvIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  FaceSmileIcon,
  LanguageIcon,
  BookmarkIcon
} from '../components/Icons';

// --- Helper Functions & Progress Calculations ---

const hasAnyGenre = (anime: Anime, targets: string[]): boolean => {
  if (!anime.genres || !Array.isArray(anime.genres)) return false;
  const lowerTargets = targets.map(t => t.toLowerCase());
  return anime.genres.some(g => lowerTargets.includes(g.toLowerCase()));
};

// 1. Total de episódios assistidos
const calculateTotalEpisodesWatched = (animeList: Anime[]): number => {
  return animeList.reduce((acc, anime) => {
    if (anime.status === AnimeStatus.COMPLETED && typeof anime.totalEpisodes === 'number' && anime.totalEpisodes > 0) {
      return acc + anime.totalEpisodes;
    } else if (anime.currentEpisode > 0 && (anime.status === AnimeStatus.WATCHING || anime.status === AnimeStatus.ON_HOLD)) {
      return acc + anime.currentEpisode;
    }
    return acc;
  }, 0);
};

// 2. Animes concluídos
const calculateCompletedAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => a.status === AnimeStatus.COMPLETED).length;
};

// 3. Animes avaliados
const calculateRatedAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => typeof a.rating === 'number' && a.rating > 0).length;
};

// 4. Gêneros únicos explorados
const calculateUniqueGenresExplored = (animeList: Anime[]): number => {
  const uniqueGenres = new Set<string>();
  animeList.forEach(anime => {
    if (anime.status === AnimeStatus.COMPLETED || (anime.currentEpisode > 0 && anime.status !== AnimeStatus.PLANNED && anime.status !== AnimeStatus.DROPPED)) {
      anime.genres?.forEach(genre => uniqueGenres.add(genre.toLowerCase().trim()));
    }
  });
  return uniqueGenres.size;
};

// 5. Obras-primas Nota 10
const calculatePerfectScoreAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => typeof a.rating === 'number' && a.rating === 10).length;
};

// 6. Assistindo simultaneamente
const calculateWatchingAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => a.status === AnimeStatus.WATCHING).length;
};

// 7. Plataformas de streaming únicas
const calculateUniquePlatformsUsed = (animeList: Anime[]): number => {
  const platforms = new Set<string>();
  animeList.forEach(anime => {
    anime.streamingPlatforms?.forEach(p => {
      if (p.name) platforms.add(p.name.toLowerCase().trim());
    });
  });
  return platforms.size;
};

// 8. Isekai & Fantasia
const calculateIsekaiFantasyAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.status === AnimeStatus.COMPLETED || a.currentEpisode > 0) &&
    hasAnyGenre(a, ['Fantasy', 'Fantasia', 'Isekai', 'Adventure', 'Aventura', 'Magic', 'Magia'])
  ).length;
};

// 9. Ação & Sobrenatural (Shonen Sombrio)
const calculateActionSupernaturalAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.status === AnimeStatus.COMPLETED || a.currentEpisode > 0) &&
    hasAnyGenre(a, ['Action', 'Ação', 'Supernatural', 'Sobrenatural', 'Demons', 'Demônios', 'Martial Arts'])
  ).length;
};

// 10. Sci-Fi, Mecha & Psicológico
const calculateSciFiMechaPsychologicalAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.status === AnimeStatus.COMPLETED || a.currentEpisode > 0) &&
    hasAnyGenre(a, ['Sci-Fi', 'Ficção Científica', 'Mecha', 'Psychological', 'Psicológico', 'Thriller', 'Suspense'])
  ).length;
};

// 11. Romance, Drama & Slice of Life
const calculateRomanceDramaSliceOfLifeAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.status === AnimeStatus.COMPLETED || a.currentEpisode > 0) &&
    hasAnyGenre(a, ['Romance', 'Drama', 'Slice of Life', 'Cotidiano'])
  ).length;
};

// 12. Esportes
const calculateSportsAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.status === AnimeStatus.COMPLETED || a.currentEpisode > 0) &&
    hasAnyGenre(a, ['Sports', 'Esporte', 'Esportes'])
  ).length;
};

// 13. Comédia
const calculateComedyAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.status === AnimeStatus.COMPLETED || a.currentEpisode > 0) &&
    hasAnyGenre(a, ['Comedy', 'Comédia'])
  ).length;
};

// 14. Animes longos (50+ episódios)
const calculateLongRunnerAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.status === AnimeStatus.COMPLETED || a.status === AnimeStatus.WATCHING) &&
    ((typeof a.totalEpisodes === 'number' && a.totalEpisodes >= 50) || a.currentEpisode >= 50)
  ).length;
};

// 15. Minisséries / Speedrun (1 cour <= 13 episódios completos)
const calculateShortAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    a.status === AnimeStatus.COMPLETED &&
    typeof a.totalEpisodes === 'number' && 
    a.totalEpisodes > 0 && 
    a.totalEpisodes <= 13
  ).length;
};

// 16. Lançamentos em Simulcast / Grade semanal
const calculateSimulcastAiringAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    (a.airingDaysOfWeek && a.airingDaysOfWeek.length > 0) ||
    (a.nextAiringDate && a.nextAiringDate.length > 0) ||
    a.status === AnimeStatus.WATCHING
  ).length;
};

// 17. Animes com anotações salvas
const calculateAnimesWithNotes = (animeList: Anime[]): number => {
  return animeList.filter(a => typeof a.notes === 'string' && a.notes.trim().length > 0).length;
};

// 18. Fila de planejamento (Backlog)
const calculatePlannedBacklogAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => a.status === AnimeStatus.PLANNED).length;
};

// 19. Áudio especializado (Dublado / Legendado configurado)
const calculateAudioConfiguredAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => 
    a.audioType === AudioType.DUBBED || 
    a.audioType === AudioType.SUBTITLED || 
    a.audioType === AudioType.BOTH
  ).length;
};


// ============================================================================
// SISTEMA EXPANDIDO DE CONQUISTAS (116 DESAFIOS OTAKU & SOLO LEVELING)
// ============================================================================

export const achievementDefinitions: AchievementDefinition[] = [
  // --------------------------------------------------------------------------
  // 1. SOLO LEVELING: ASCENSÃO DE CAÇADOR (11 TIERS - ATÉ 20.000 EPISÓDIOS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'soloLevelingEps',
    categoryTitle: 'Ascensão de Caçador',
    categoryIcon: BoltIcon,
    calculateProgress: calculateTotalEpisodesWatched,
    tiers: [
      {
        id: 'WATCHED_50_EPISODES',
        title: 'O Despertar (Rank E)',
        description: 'O Sistema selecionou você. Assistiu aos seus primeiros 50 episódios.',
        target: 50,
        xpReward: 50,
        rank: 'E',
      },
      {
        id: 'WATCHED_150_EPISODES',
        title: 'Sobrevivente da Dungeon Dupla (Rank D)',
        description: 'Superou os primeiros testes mortais. Alcançou 150 episódios.',
        target: 150,
        xpReward: 100,
        rank: 'D',
      },
      {
        id: 'WATCHED_350_EPISODES',
        title: 'Líder de Raid (Rank C)',
        description: 'Liderando esquadrões de maratona com maestria. 350 episódios.',
        target: 350,
        xpReward: 150,
        rank: 'C',
      },
      {
        id: 'WATCHED_750_EPISODES',
        title: 'Caçador Veterano (Rank B)',
        description: 'Seu nome já é temido nos portais dimensionais. 750 episódios.',
        target: 750,
        xpReward: 250,
        rank: 'B',
      },
      {
        id: 'WATCHED_1500_EPISODES',
        title: 'Força de Elite (Rank A)',
        description: 'Um dos pilares da Associação de Caçadores. 1.500 episódios assistidos.',
        target: 1500,
        xpReward: 400,
        rank: 'A',
      },
      {
        id: 'WATCHED_3000_EPISODES',
        title: 'Caçador Rank S',
        description: 'Capaz de limpar dungeons de rank vermelho sozinho. 3.000 episódios.',
        target: 3000,
        xpReward: 650,
        rank: 'S',
      },
      {
        id: 'WATCHED_5000_EPISODES',
        title: 'Autoridade de Nível Nacional',
        description: 'Poder capaz de rivalizar com o arsenal de nações inteiras. 5.000 episódios.',
        target: 5000,
        xpReward: 1000,
        rank: 'S',
      },
      {
        id: 'WATCHED_8000_EPISODES',
        title: 'ERGA-SE! Monarca das Sombras',
        description: 'O exército das sombras agora se curva perante você. 8.000 episódios!',
        target: 8000,
        xpReward: 2000,
        rank: 'MONARCH',
      },
      {
        id: 'WATCHED_12000_EPISODES',
        title: 'Monarca da Destruição Absoluta',
        description: 'Transcendeu todos os limites conhecidos do multiverso otaku. 12.000 episódios!',
        target: 12000,
        xpReward: 3500,
        rank: 'MONARCH',
      },
      {
        id: 'WATCHED_16000_EPISODES',
        title: 'Soberano das Dimensões Celestiais',
        description: 'Batalha nos confins do vazio contra os próprios governantes. 16.000 episódios!',
        target: 16000,
        xpReward: 5000,
        rank: 'MONARCH',
      },
      {
        id: 'WATCHED_20000_EPISODES',
        title: 'A Divindade Suprema da Maratona',
        description: 'Atingiu o ápice eterno da existência anime. Vinte mil episódios assistidos!',
        target: 20000,
        xpReward: 7500,
        rank: 'MONARCH',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. SHONEN: A GRANDE JORNADA (12 TIERS - ATÉ 500 ANIMES COMPLETOS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'shonenJourney',
    categoryTitle: 'A Grande Jornada',
    categoryIcon: CrownIcon,
    calculateProgress: calculateCompletedAnimes,
    tiers: [
      {
        id: 'COMPLETED_1_ANIME',
        title: 'Primeiro Passo do Protagonista',
        description: 'Sua lenda começou! Completou seu primeiro anime do início ao fim.',
        target: 1,
        xpReward: 50,
        rank: 'E',
      },
      {
        id: 'COMPLETED_5_ANIMES',
        title: 'Entrando na Grand Line',
        description: 'O mapa dos mares foi traçado. 5 animes completados.',
        target: 5,
        xpReward: 100,
        rank: 'D',
      },
      {
        id: 'COMPLETED_15_ANIMES',
        title: 'Aprovado no Exame Chunin',
        description: 'Dominou o chakra e provou seu valor diante dos Kages. 15 animes.',
        target: 15,
        xpReward: 180,
        rank: 'C',
      },
      {
        id: 'COMPLETED_25_ANIMES',
        title: 'As Esferas do Dragão',
        description: 'Shenlong atendeu ao seu pedido de maratona! 25 animes completos.',
        target: 25,
        xpReward: 280,
        rank: 'C',
      },
      {
        id: 'COMPLETED_50_ANIMES',
        title: 'Capitão do Gotei 13',
        description: 'Liberou a Bankai da sua coleção. 50 animes concluídos.',
        target: 50,
        xpReward: 450,
        rank: 'B',
      },
      {
        id: 'COMPLETED_75_ANIMES',
        title: 'Haki do Conquistador',
        description: 'Apenas os predestinados a reinar alcançam essa marca. 75 animes.',
        target: 75,
        xpReward: 650,
        rank: 'A',
      },
      {
        id: 'COMPLETED_100_ANIMES',
        title: 'Rei dos Magos de Clover',
        description: 'Seu grimório brilha com luz eterna. Centena lendária alcançada!',
        target: 100,
        xpReward: 1000,
        rank: 'A',
      },
      {
        id: 'COMPLETED_150_ANIMES',
        title: 'Rei dos Piratas!',
        description: 'Encontrou o tesouro supremo e conquistou todos os mares. 150 animes!',
        target: 150,
        xpReward: 1500,
        rank: 'S',
      },
      {
        id: 'COMPLETED_200_ANIMES',
        title: 'Deus do Novo Mundo',
        description: 'Governa um império inigualável de histórias e memórias. 200 animes!',
        target: 200,
        xpReward: 2200,
        rank: 'S',
      },
      {
        id: 'COMPLETED_300_ANIMES',
        title: 'Zen\'o-sama do Multiverso',
        description: 'Poder absoluto sobre todas as realidades da animação japonesa. 300 animes!',
        target: 300,
        xpReward: 3500,
        rank: 'MONARCH',
      },
      {
        id: 'COMPLETED_400_ANIMES',
        title: 'O Escolhido da Chama Eterna',
        description: 'Um acervo lendário que ecoará através das eras. 400 animes concluídos!',
        target: 400,
        xpReward: 5000,
        rank: 'MONARCH',
      },
      {
        id: 'COMPLETED_500_ANIMES',
        title: 'Mito Absoluto da Cultura Otaku',
        description: 'Meio milhar de jornadas vividas com alma e paixão! 500 animes!',
        target: 500,
        xpReward: 7000,
        rank: 'MONARCH',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. HUNTER X HUNTER: LICENÇA HUNTER DE GÊNEROS (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'genreLicense',
    categoryTitle: 'Licença Hunter de Gêneros',
    categoryIcon: AcademicCapIcon,
    calculateProgress: calculateUniqueGenresExplored,
    tiers: [
      {
        id: 'EXPLORED_2_GENRES',
        title: 'Nen Despertado (Rank E)',
        description: 'Descobriu que o mundo dos animes vai muito além de um único estilo. 2 gêneros.',
        target: 2,
        xpReward: 40,
        rank: 'E',
      },
      {
        id: 'EXPLORED_5_GENRES',
        title: 'Licença Hunter Oficial (Rank D)',
        description: 'Aprovado no exame mais difícil do planeta. 5 gêneros explorados.',
        target: 5,
        xpReward: 90,
        rank: 'D',
      },
      {
        id: 'EXPLORED_8_GENRES',
        title: 'Hunter Single-Star (Rank C)',
        description: 'Contribuição notável para o ecossistema das narrativas. 8 gêneros.',
        target: 8,
        xpReward: 160,
        rank: 'C',
      },
      {
        id: 'EXPLORED_12_GENRES',
        title: 'Hunter Double-Star (Rank B)',
        description: 'Mestre versátil com conhecimento refinado. 12 gêneros explorados.',
        target: 12,
        xpReward: 280,
        rank: 'B',
      },
      {
        id: 'EXPLORED_16_GENRES',
        title: 'Hunter Triple-Star (Rank A)',
        description: 'A mais seleta honraria da Associação Hunter. 16 gêneros no currículo.',
        target: 16,
        xpReward: 500,
        rank: 'A',
      },
      {
        id: 'EXPLORED_22_GENRES',
        title: 'Presidente da Associação Hunter (Rank S)',
        description: 'Netero se orgulharia da sua sabedoria infinita. 22 gêneros dominados!',
        target: 22,
        xpReward: 1000,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 4. DEATH NOTE: CADERNO DE JULGAMENTO (9 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'deathNote',
    categoryTitle: 'Caderno de Julgamento',
    categoryIcon: BookOpenIcon,
    calculateProgress: calculateRatedAnimes,
    tiers: [
      {
        id: 'RATED_1_ANIME',
        title: 'Primeira Página Preenchida',
        description: 'Escreveu sua primeira nota no caderno do destino.',
        target: 1,
        xpReward: 30,
        rank: 'E',
      },
      {
        id: 'RATED_5_ANIMES',
        title: 'Investigador da Polícia Japonesa',
        description: 'Analisando os casos de perto. 5 animes avaliados.',
        target: 5,
        xpReward: 80,
        rank: 'D',
      },
      {
        id: 'RATED_15_ANIMES',
        title: 'Olhos de Shinigami',
        description: 'Agora você enxerga a verdadeira qualidade de qualquer obra. 15 avaliações.',
        target: 15,
        xpReward: 150,
        rank: 'C',
      },
      {
        id: 'RATED_30_ANIMES',
        title: 'Duelo com L',
        description: 'Uma mente afiada capaz de dissecar roteiros e animações. 30 avaliações.',
        target: 30,
        xpReward: 250,
        rank: 'B',
      },
      {
        id: 'RATED_60_ANIMES',
        title: 'O Julgamento de Kira',
        description: 'Nenhum anime escapa do seu veredito implacável. 60 animes com nota.',
        target: 60,
        xpReward: 450,
        rank: 'A',
      },
      {
        id: 'RATED_100_ANIMES',
        title: 'Rei dos Shinigamis',
        description: 'Seu caderno dita o cânone dos melhores animes da história. 100 avaliações!',
        target: 100,
        xpReward: 850,
        rank: 'S',
      },
      {
        id: 'RATED_180_ANIMES',
        title: 'Voz da Crítica Suprema',
        description: 'Autoridade máxima em resenhas e análises críticas. 180 animes avaliados!',
        target: 180,
        xpReward: 1500,
        rank: 'MONARCH',
      },
      {
        id: 'RATED_250_ANIMES',
        title: 'Árbitro do Destino Otaku',
        description: '250 vereditos lapidados com precisão cirúrgica.',
        target: 250,
        xpReward: 2200,
        rank: 'MONARCH',
      },
      {
        id: 'RATED_350_ANIMES',
        title: 'Onisciência Crítica Absoluta',
        description: 'Mais de 350 animes julgados e catalogados para a posteridade!',
        target: 350,
        xpReward: 3500,
        rank: 'MONARCH',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. HALL DA FAMA: OBRAS-PRIMAS NOTA 10 (7 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'hallOfFame',
    categoryTitle: 'Hall da Fama (Nota 10)',
    categoryIcon: StarIcon,
    calculateProgress: calculatePerfectScoreAnimes,
    tiers: [
      {
        id: 'PERFECT_1_ANIME',
        title: 'A Primeira Obra-Prima',
        description: 'Você encontrou uma história que tocou sua alma no nível máximo: Nota 10!',
        target: 1,
        xpReward: 60,
        rank: 'D',
      },
      {
        id: 'PERFECT_3_ANIMES',
        title: 'Trindade Sagrada',
        description: 'Três preciosidades imaculadas no seu repertório pessoal. 3 Notas 10.',
        target: 3,
        xpReward: 140,
        rank: 'C',
      },
      {
        id: 'PERFECT_7_ANIMES',
        title: 'Sete Maravilhas do Anime',
        description: 'Sete histórias lendárias que merecem ser lembradas para sempre.',
        target: 7,
        xpReward: 300,
        rank: 'B',
      },
      {
        id: 'PERFECT_15_ANIMES',
        title: 'Curadoria dos Deuses',
        description: 'Seu gosto refinado reuniu 15 obras com nota máxima indiscutível!',
        target: 15,
        xpReward: 600,
        rank: 'A',
      },
      {
        id: 'PERFECT_25_ANIMES',
        title: 'Panteão Lendário dos Animes',
        description: 'Vinte e cinco monumentos cinematográficos e épicos no seu Hall da Fama!',
        target: 25,
        xpReward: 1200,
        rank: 'S',
      },
      {
        id: 'PERFECT_40_ANIMES',
        title: 'Tesouro Arcano da Animação',
        description: '40 títulos reverenciados com a pontuação máxima de perfeição!',
        target: 40,
        xpReward: 2000,
        rank: 'MONARCH',
      },
      {
        id: 'PERFECT_60_ANIMES',
        title: 'Guardião do Graal Sagrado',
        description: 'Sessenta obras-primas nota 10 consagradas no topo do mundo!',
        target: 60,
        xpReward: 3200,
        rank: 'MONARCH',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. ONE PUNCH MAN: TREINO DE MARATONISTA (5 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'onePunchMarathon',
    categoryTitle: 'Treino de Maratonista',
    categoryIcon: FireIcon,
    calculateProgress: calculateWatchingAnimes,
    tiers: [
      {
        id: 'WATCHING_1_ANIME',
        title: 'Herói por Hobbie (Rank E)',
        description: 'Começou a acompanhar sua rotina diária de maratona. 1 anime assistindo.',
        target: 1,
        xpReward: 30,
        rank: 'E',
      },
      {
        id: 'WATCHING_3_ANIMES',
        title: 'Herói Classe C (Rank D)',
        description: 'Mantendo o foco e combatendo o tédio. 3 animes em andamento.',
        target: 3,
        xpReward: 70,
        rank: 'D',
      },
      {
        id: 'WATCHING_6_ANIMES',
        title: '100 Flexões e 10km Todo Dia (Rank C)',
        description: 'O treino diário não para por nada. 6 animes assistindo simultaneamente.',
        target: 6,
        xpReward: 160,
        rank: 'C',
      },
      {
        id: 'WATCHING_12_ANIMES',
        title: 'Herói Classe S (Rank A)',
        description: 'Multitasking digno dos maiores defensores da Terra. 12 animes ao mesmo tempo!',
        target: 12,
        xpReward: 400,
        rank: 'A',
      },
      {
        id: 'WATCHING_20_ANIMES',
        title: 'Quebrador de Limitador (Rank S)',
        description: 'Saitama ficaria impressionado com tamanha intensidade. 20 animes em simultâneo!',
        target: 20,
        xpReward: 900,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 7. MULTIVERSO DO STREAMING (5 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'streamingMultiverse',
    categoryTitle: 'Multiverso do Streaming',
    categoryIcon: TrendingUpIcon,
    calculateProgress: calculateUniquePlatformsUsed,
    tiers: [
      {
        id: 'STREAMING_1_PLATFORM',
        title: 'Portal Aberto',
        description: 'Vinculou sua primeira plataforma de streaming na lista.',
        target: 1,
        xpReward: 30,
        rank: 'E',
      },
      {
        id: 'STREAMING_2_PLATFORMS',
        title: 'Viajante Dimensional',
        description: 'Navegando entre 2 universos de streaming diferentes.',
        target: 2,
        xpReward: 70,
        rank: 'D',
      },
      {
        id: 'STREAMING_3_PLATFORMS',
        title: 'Mestre do Catálogo',
        description: 'Crunchyroll, Netflix, Prime... Conectado em 3 plataformas.',
        target: 3,
        xpReward: 140,
        rank: 'C',
      },
      {
        id: 'STREAMING_4_PLATFORMS',
        title: 'Navegador Interdimensional',
        description: 'Dominando o streaming com 4 plataformas integradas.',
        target: 4,
        xpReward: 250,
        rank: 'B',
      },
      {
        id: 'STREAMING_5_PLATFORMS',
        title: 'Onipresença das Plataformas',
        description: 'Nenhum lançamento escapa do seu radar! 5 plataformas ativas.',
        target: 5,
        xpReward: 500,
        rank: 'A',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 8. O CHAMADO DO ISEKAI & FANTASIA (7 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'isekaiDomain',
    categoryTitle: 'O Chamado do Isekai',
    categoryIcon: SparklesIcon,
    calculateProgress: calculateIsekaiFantasyAnimes,
    tiers: [
      {
        id: 'ISEKAI_1_ANIME',
        title: 'Atropelado pelo Caminhão-kun',
        description: 'Sua jornada em um mundo alternativo acabou de começar. 1 anime de Fantasia/Isekai.',
        target: 1,
        xpReward: 40,
        rank: 'E',
      },
      {
        id: 'ISEKAI_5_ANIMES',
        title: 'Aventureiro de Guilda Cobre',
        description: 'Pegando missões de caça e descobrindo feitiços. 5 animes do gênero.',
        target: 5,
        xpReward: 90,
        rank: 'D',
      },
      {
        id: 'ISEKAI_12_ANIMES',
        title: 'Retorno Através da Morte',
        description: 'Superando o sofrimento e salvando aliados. 12 animes de fantasia.',
        target: 12,
        xpReward: 180,
        rank: 'C',
      },
      {
        id: 'ISEKAI_25_ANIMES',
        title: 'Lorde Demônio de Tempest',
        description: 'Fundou uma nação inteira de monstros pacíficos. 25 animes explorados.',
        target: 25,
        xpReward: 350,
        rank: 'B',
      },
      {
        id: 'ISEKAI_45_ANIMES',
        title: 'Ainz Ooal Gown do Multiverso',
        description: 'Soberano absoluto da Grande Tumba de Nazarick. 45 animes de fantasia/isekai.',
        target: 45,
        xpReward: 650,
        rank: 'A',
      },
      {
        id: 'ISEKAI_75_ANIMES',
        title: 'EMINÊNCIA NAS SOMBRAS!',
        description: 'Eu sou o poder atômico que dita as ordens das sombras. 75 animes!',
        target: 75,
        xpReward: 1200,
        rank: 'S',
      },
      {
        id: 'ISEKAI_110_ANIMES',
        title: 'Criador Primordial dos Reinos Mágicos',
        description: 'Mais de 110 mundos fantásticos conquistados e eternizados!',
        target: 110,
        xpReward: 2500,
        rank: 'MONARCH',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 9. EXPANSÃO DE DOMÍNIO & SHONEN SOMBRIO (7 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'jujutsuDomain',
    categoryTitle: 'Expansão de Domínio',
    categoryIcon: ShieldIcon,
    calculateProgress: calculateActionSupernaturalAnimes,
    tiers: [
      {
        id: 'ACTION_3_ANIMES',
        title: 'Respiração da Água: Primeira Forma',
        description: 'Empunhou a espada e aprendeu o básico do combate. 3 animes de ação/sobrenatural.',
        target: 3,
        xpReward: 50,
        rank: 'E',
      },
      {
        id: 'ACTION_10_ANIMES',
        title: 'Contrato com Demônio da Motosserra',
        description: 'Puxou a corda do coração e entrou no combate insano. 10 animes.',
        target: 10,
        xpReward: 120,
        rank: 'D',
      },
      {
        id: 'ACTION_25_ANIMES',
        title: 'Flash Negro (Kokusen)',
        description: 'Distorceu o espaço e a energia amaldiçoada em um milissegundo. 25 animes.',
        target: 25,
        xpReward: 260,
        rank: 'C',
      },
      {
        id: 'ACTION_50_ANIMES',
        title: 'Shinzou wo Sasageyo! (Ofereçam seus Corações)',
        description: 'Comandou as tropas além das muralhas contra titãs vorazes. 50 animes.',
        target: 50,
        xpReward: 550,
        rank: 'B',
      },
      {
        id: 'ACTION_80_ANIMES',
        title: 'Ghoul de Olho Vermelho da Coruja',
        description: 'Equilibrou a humanidade e o apetite voraz pelas sombras. 80 animes.',
        target: 80,
        xpReward: 950,
        rank: 'A',
      },
      {
        id: 'ACTION_120_ANIMES',
        title: 'Expansão de Domínio: Vazio Ilimitado',
        description: 'Informação infinita flui pela sua consciência de batalha. 120 animes!',
        target: 120,
        xpReward: 1800,
        rank: 'S',
      },
      {
        id: 'ACTION_180_ANIMES',
        title: 'Rei Supremo das Maldições: Ryomen Sukuna',
        description: 'Sua presença no campo da ação é incomparável e devastadora. 180 animes!',
        target: 180,
        xpReward: 3200,
        rank: 'MONARCH',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 10. OPERAÇÃO SKULD: SCI-FI & MECHA & TIME TRAVEL (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'sciFiSteins',
    categoryTitle: 'Operação Skuld',
    categoryIcon: RocketLaunchIcon,
    calculateProgress: calculateSciFiMechaPsychologicalAnimes,
    tiers: [
      {
        id: 'SCIFI_1_ANIME',
        title: 'Micro-ondas com Telefone Ativado',
        description: 'Enviou o primeiro D-Mail para alterar o destino. 1 anime Sci-Fi/Psicológico.',
        target: 1,
        xpReward: 40,
        rank: 'E',
      },
      {
        id: 'SCIFI_6_ANIMES',
        title: 'Entre no Robô, Shinji!',
        description: 'Sincronização neural com a unidade EVA atingiu 100%. 6 animes.',
        target: 6,
        xpReward: 110,
        rank: 'D',
      },
      {
        id: 'SCIFI_15_ANIMES',
        title: 'Ordem Absoluta do Geass',
        description: 'Lelouch vi Britannia comanda seu intelecto brilhante. 15 animes.',
        target: 15,
        xpReward: 240,
        rank: 'C',
      },
      {
        id: 'SCIFI_30_ANIMES',
        title: 'See You Space Cowboy...',
        description: 'Caçando recompensas interestelares com trilha de jazz e estilo. 30 animes.',
        target: 30,
        xpReward: 450,
        rank: 'B',
      },
      {
        id: 'SCIFI_55_ANIMES',
        title: 'Fure os Céus com sua Broca!',
        description: 'Acredite no você que acredita em si mesmo! 55 animes de Sci-Fi/Mecha.',
        target: 55,
        xpReward: 900,
        rank: 'A',
      },
      {
        id: 'SCIFI_90_ANIMES',
        title: 'El Psy Kongroo: Linha Temporal Steins Gate',
        description: 'Enganou o mundo e a causalidade para alcançar a linha definitiva. 90 animes!',
        target: 90,
        xpReward: 1800,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 11. GUERRA DO AMOR & EMOÇÃO: ROMANCE, DRAMA & SLICE OF LIFE (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'romanceLoveIsWar',
    categoryTitle: 'Guerra do Amor & Emoção',
    categoryIcon: HeartIcon,
    calculateProgress: calculateRomanceDramaSliceOfLifeAnimes,
    tiers: [
      {
        id: 'ROMANCE_1_ANIME',
        title: 'Confissão no Terraço',
        description: 'O primeiro batimento acelerado da história. 1 anime de Romance/Drama.',
        target: 1,
        xpReward: 35,
        rank: 'E',
      },
      {
        id: 'ROMANCE_6_ANIMES',
        title: 'Tigre de Bolso Amansado',
        description: 'Descobriu que aparências duras escondem os corações mais doces. 6 animes.',
        target: 6,
        xpReward: 100,
        rank: 'D',
      },
      {
        id: 'ROMANCE_15_ANIMES',
        title: 'A Melodia de Abril',
        description: 'Uma primavera inesquecível de notas ao piano e lágrimas. 15 animes.',
        target: 15,
        xpReward: 220,
        rank: 'C',
      },
      {
        id: 'ROMANCE_30_ANIMES',
        title: 'O Fio Vermelho do Destino',
        description: 'Cruzando tempos e memórias pelo nome que jamais esquecerá. 30 animes.',
        target: 30,
        xpReward: 420,
        rank: 'B',
      },
      {
        id: 'ROMANCE_50_ANIMES',
        title: 'Olhos Estrelados de Ai Hoshino',
        description: 'O charme irresistível e os segredos do palco dramático. 50 animes.',
        target: 50,
        xpReward: 800,
        rank: 'A',
      },
      {
        id: 'ROMANCE_80_ANIMES',
        title: 'Gênio Supremo da Guerra do Amor',
        description: 'Venceu todos os jogos mentais do romance e conquistou o coração do público. 80 animes!',
        target: 80,
        xpReward: 1600,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 12. O EGOÍSTA MÁXIMO: ESPORTES & SUPERAÇÃO (5 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'sportsBlueLock',
    categoryTitle: 'O Egoísta Máximo',
    categoryIcon: ShieldIcon,
    calculateProgress: calculateSportsAnimes,
    tiers: [
      {
        id: 'SPORTS_1_ANIME',
        title: 'Primeiro Apito do Árbitro',
        description: 'Entrou em campo e sentiu a emoção da disputa esportiva. 1 anime de esporte.',
        target: 1,
        xpReward: 35,
        rank: 'E',
      },
      {
        id: 'SPORTS_3_ANIMES',
        title: 'Cortada nas Alturas de Karasuno',
        description: 'Os corvos voaram alto rumo ao campeonato nacional! 3 animes de esportes.',
        target: 3,
        xpReward: 90,
        rank: 'D',
      },
      {
        id: 'SPORTS_7_ANIMES',
        title: 'A Zona da Geração dos Milagres',
        description: 'Foco puro de 100% de capacidade atlética ativado. 7 animes.',
        target: 7,
        xpReward: 200,
        rank: 'C',
      },
      {
        id: 'SPORTS_14_ANIMES',
        title: 'O Dempsey Roll Lendário',
        description: 'Ritmo avassalador que nocauteia qualquer adversário no ringue. 14 animes.',
        target: 14,
        xpReward: 450,
        rank: 'B',
      },
      {
        id: 'SPORTS_25_ANIMES',
        title: 'O Artilheiro Egoísta de Blue Lock',
        description: 'Devorou todos os rivais e se tornou o maior atacante do mundo! 25 animes!',
        target: 25,
        xpReward: 1100,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 13. YOROZUYA DA MARATONA: COMÉDIA & NONSENSE (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'comedyGintama',
    categoryTitle: 'Yorozuya da Maratona',
    categoryIcon: FaceSmileIcon,
    calculateProgress: calculateComedyAnimes,
    tiers: [
      {
        id: 'COMEDY_2_ANIMES',
        title: 'Quebra da Quarta Parede',
        description: 'Riu das piadas que zombam dos próprios criadores do anime. 2 comédias.',
        target: 2,
        xpReward: 40,
        rank: 'E',
      },
      {
        id: 'COMEDY_8_ANIMES',
        title: 'Explosão Diária da Megumin',
        description: 'EXPLOOOOOOSION! Descarregou mana rindo sem parar. 8 animes de comédia.',
        target: 8,
        xpReward: 120,
        rank: 'D',
      },
      {
        id: 'COMEDY_20_ANIMES',
        title: 'Gelatina de Café do Saiki Kusuo',
        description: 'Usando telepatia para fugir de situações sociais bizarras. 20 comédias.',
        target: 20,
        xpReward: 280,
        rank: 'C',
      },
      {
        id: 'COMEDY_40_ANIMES',
        title: 'Waku Waku! Segredos de Anya Forger',
        description: 'Amendoim, espiões e caras engraçadas que conquistaram o mundo. 40 animes.',
        target: 40,
        xpReward: 550,
        rank: 'B',
      },
      {
        id: 'COMEDY_70_ANIMES',
        title: 'Mestre da Loja Faz-Tudo de Edo',
        description: 'Alma de prata inquebrável com o humor mais absurdo do Japão. 70 animes.',
        target: 70,
        xpReward: 1000,
        rank: 'A',
      },
      {
        id: 'COMEDY_110_ANIMES',
        title: 'Deus Supremo do Riso Otaku',
        description: 'Imune à tristeza mundana! Mais de 110 obras de humor assistidas!',
        target: 110,
        xpReward: 2000,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 14. TITÃS DOS 50+ EPISÓDIOS: ODISSEIAS INTERMINÁVEIS (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'longRunnerMarathon',
    categoryTitle: 'Titãs dos 50+ Episódios',
    categoryIcon: FilmIcon,
    calculateProgress: calculateLongRunnerAnimes,
    tiers: [
      {
        id: 'LONGRUN_1_ANIME',
        title: 'Marinheiro de Primeira Viagem',
        description: 'Completou ou mergulhou fundo em um anime de mais de 50 episódios.',
        target: 1,
        xpReward: 70,
        rank: 'D',
      },
      {
        id: 'LONGRUN_3_ANIMES',
        title: 'Sobrevivente dos Arcos de Filler',
        description: 'Nenhum episódio de praia ou filler de barco te desanimou. 3 animes longos.',
        target: 3,
        xpReward: 180,
        rank: 'C',
      },
      {
        id: 'LONGRUN_6_ANIMES',
        title: 'Guerreiro da Guerra dos Mil Anos',
        description: 'Testemunhou centenas de episódios de combates titânicos. 6 animes longos.',
        target: 6,
        xpReward: 400,
        rank: 'B',
      },
      {
        id: 'LONGRUN_10_ANIMES',
        title: 'Veterano das Grandes Guerras Shonen',
        description: 'Dez jornadas monumentais com centenas de capítulos assistidos!',
        target: 10,
        xpReward: 850,
        rank: 'A',
      },
      {
        id: 'LONGRUN_16_ANIMES',
        title: 'Imortal dos 1.000 Episódios',
        description: 'Dedicação lendária que poucos na comunidade conseguem atingir. 16 animes longos!',
        target: 16,
        xpReward: 1800,
        rank: 'S',
      },
      {
        id: 'LONGRUN_25_ANIMES',
        title: 'Monarca das Eras Intermináveis',
        description: 'Vinte e cinco colossos com mais de 50 episódios cada dominados!',
        target: 25,
        xpReward: 3200,
        rank: 'MONARCH',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 15. SPEEDRUN DE 1 COUR: MINISSÉRIES DE 12-13 EPs (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'shortMasterpieces',
    categoryTitle: 'Speedrun de 1 Cour',
    categoryIcon: BoltIcon,
    calculateProgress: calculateShortAnimes,
    tiers: [
      {
        id: 'SHORT_2_ANIMES',
        title: 'Maratona em uma Tarde',
        description: 'Sentou no sofá e terminou uma temporada inteira de uma só vez. 2 minisséries.',
        target: 2,
        xpReward: 40,
        rank: 'E',
      },
      {
        id: 'SHORT_8_ANIMES',
        title: 'Choque no Coração em Night City',
        description: 'Histórias curtas e avassaladoras que ficam marcadas para sempre. 8 animes de 1 cour.',
        target: 8,
        xpReward: 110,
        rank: 'D',
      },
      {
        id: 'SHORT_20_ANIMES',
        title: 'Rebobinando o Passado de 12 EPs',
        description: 'Ritmo perfeito e tensão do primeiro ao décimo segundo minuto. 20 animes.',
        target: 20,
        xpReward: 260,
        rank: 'C',
      },
      {
        id: 'SHORT_40_ANIMES',
        title: 'Contrato Mágico de 1 Cour',
        description: 'Quarenta histórias compactas e arrebatadoras concluídas.',
        target: 40,
        xpReward: 550,
        rank: 'B',
      },
      {
        id: 'SHORT_70_ANIMES',
        title: 'Carta de Emoções de Violet Evergarden',
        description: 'Setenta joias concluídas com maestria e precisão cirúrgica.',
        target: 70,
        xpReward: 1000,
        rank: 'A',
      },
      {
        id: 'SHORT_120_ANIMES',
        title: 'Mestre Relâmpago das Minisséries',
        description: 'Cento e vinte animes de 1 temporada completados! Velocidade lendária!',
        target: 120,
        xpReward: 2000,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 16. GUARDIÃO DO SIMULCAST & LANÇAMENTOS DA SEMANA (5 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'simulcastWatcher',
    categoryTitle: 'Guardião do Simulcast',
    categoryIcon: TvIcon,
    calculateProgress: calculateSimulcastAiringAnimes,
    tiers: [
      {
        id: 'SIMULCAST_1_ANIME',
        title: 'A Espera do Próximo Episódio',
        description: 'Acompanhando uma série semanal com expectativa lá em cima. 1 anime.',
        target: 1,
        xpReward: 30,
        rank: 'E',
      },
      {
        id: 'SIMULCAST_4_ANIMES',
        title: 'Grade Semanal do Otaku Ativo',
        description: 'Toda semana tem episódio novo reservado na sua agenda. 4 animes.',
        target: 4,
        xpReward: 90,
        rank: 'D',
      },
      {
        id: 'SIMULCAST_8_ANIMES',
        title: 'Caçador de Simulcast em Tempo Real',
        description: 'Em dia com o Japão! 8 animes acompanhados em ritmo semanal.',
        target: 8,
        xpReward: 220,
        rank: 'C',
      },
      {
        id: 'SIMULCAST_15_ANIMES',
        title: 'Guardião da Temporada Atual',
        description: 'Nenhum lançamento quente da season passa batido. 15 animes ativos!',
        target: 15,
        xpReward: 500,
        rank: 'B',
      },
      {
        id: 'SIMULCAST_25_ANIMES',
        title: 'Diretor Supremo de Programação',
        description: 'Vinte e cinco animes acompanhados rigorosamente! Maestria da temporada!',
        target: 25,
        xpReward: 1200,
        rank: 'A',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 17. O CRONISTA OTAKU: RESENHAS E ANOTAÇÕES (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'theOtakuChronicler',
    categoryTitle: 'O Cronista Otaku',
    categoryIcon: PencilSquareIcon,
    calculateProgress: calculateAnimesWithNotes,
    tiers: [
      {
        id: 'NOTES_1_ANIME',
        title: 'Primeira Nota de Margem',
        description: 'Anotou suas impressões ou pensamentos sobre um anime.',
        target: 1,
        xpReward: 30,
        rank: 'E',
      },
      {
        id: 'NOTES_5_ANIMES',
        title: 'Caderno de Roteirista',
        description: 'Registrando observações de personagens e arcos. 5 animes anotados.',
        target: 5,
        xpReward: 90,
        rank: 'D',
      },
      {
        id: 'NOTES_15_ANIMES',
        title: 'Heaven\'s Door de Rohan Kishibe',
        description: 'Lendo as páginas das histórias e catalogando segredos. 15 animes anotados.',
        target: 15,
        xpReward: 240,
        rank: 'C',
      },
      {
        id: 'NOTES_30_ANIMES',
        title: 'Manuscrito do Crítico Especializado',
        description: 'Trinta resenhas detalhadas documentando sua jornada otaku.',
        target: 30,
        xpReward: 480,
        rank: 'B',
      },
      {
        id: 'NOTES_60_ANIMES',
        title: 'Enciclopédia Humana dos Animes',
        description: 'Sessenta análises ricas e preservadas para consultas futuras.',
        target: 60,
        xpReward: 950,
        rank: 'A',
      },
      {
        id: 'NOTES_100_ANIMES',
        title: 'Biblioteca de Alexandria Otaku',
        description: 'Cem obras resenhadas com notas e reflexões pessoais eternas!',
        target: 100,
        xpReward: 1800,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 18. A GAVETA DOS DESEJOS: PLANO PARA ASSISTIR (6 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'theBacklogPlan',
    categoryTitle: 'A Gaveta dos Desejos',
    categoryIcon: BookmarkIcon,
    calculateProgress: calculatePlannedBacklogAnimes,
    tiers: [
      {
        id: 'BACKLOG_5_ANIMES',
        title: 'Lista de Promessas',
        description: 'Guardou 5 animes recomendados na sua lista de desejos.',
        target: 5,
        xpReward: 30,
        rank: 'E',
      },
      {
        id: 'BACKLOG_15_ANIMES',
        title: 'O Labirinto da Curiosidade',
        description: '15 animes guardados com carinho para o momento certo.',
        target: 15,
        xpReward: 75,
        rank: 'D',
      },
      {
        id: 'BACKLOG_35_ANIMES',
        title: 'Cronologia Complexa de Fate',
        description: 'Tanta coisa planejada quanto a ordem correta para ver a franquia Fate! 35 animes.',
        target: 35,
        xpReward: 160,
        rank: 'C',
      },
      {
        id: 'BACKLOG_70_ANIMES',
        title: 'A Biblioteca Infinita de Monogatari',
        description: '70 animes na fila esperando sua vez na tela.',
        target: 70,
        xpReward: 350,
        rank: 'B',
      },
      {
        id: 'BACKLOG_120_ANIMES',
        title: 'Tesouro Arcano Acumulado',
        description: 'Cento e vinte promessas de maratonas futuras salvas na sua coleção.',
        target: 120,
        xpReward: 700,
        rank: 'A',
      },
      {
        id: 'BACKLOG_200_ANIMES',
        title: 'O Arquivo Infinito da Imaginação',
        description: 'Duzentos animes esperando para brilhar. Você nunca ficará sem o que assistir!',
        target: 200,
        xpReward: 1400,
        rank: 'S',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 19. POLIGLOTA DOS ANIMES: DUBLAGENS & LEGENDAS (5 TIERS)
  // --------------------------------------------------------------------------
  {
    categoryId: 'audioVersatility',
    categoryTitle: 'Poliglota dos Animes',
    categoryIcon: LanguageIcon,
    calculateProgress: calculateAudioConfiguredAnimes,
    tiers: [
      {
        id: 'AUDIO_1_ANIME',
        title: 'A Voz dos Personagens',
        description: 'Definiu a preferência de áudio (Dublado ou Legendado) para um anime.',
        target: 1,
        xpReward: 30,
        rank: 'E',
      },
      {
        id: 'AUDIO_5_ANIMES',
        title: 'Rapadura é Doce Mas Não é Mole Não!',
        description: 'Homenagem à era de ouro das dublagens clássicas brasileiras. 5 animes com áudio catalogado.',
        target: 5,
        xpReward: 80,
        rank: 'D',
      },
      {
        id: 'AUDIO_15_ANIMES',
        title: 'Kamehameha Clássico da TV',
        description: 'Reconhecendo as vozes lendárias que marcaram gerações. 15 animes.',
        target: 15,
        xpReward: 180,
        rank: 'C',
      },
      {
        id: 'AUDIO_35_ANIMES',
        title: 'Meteoro de Pégasus Nostálgico',
        description: 'Trinta e cinco animes com preferência de idioma perfeitamente configurada.',
        target: 35,
        xpReward: 380,
        rank: 'B',
      },
      {
        id: 'AUDIO_70_ANIMES',
        title: 'Lorde Poliglota dos Seiyuus e Dubladores',
        description: 'Setenta animes catalogados com carinho sonoro impecável!',
        target: 70,
        xpReward: 800,
        rank: 'A',
      },
    ],
  },
];
