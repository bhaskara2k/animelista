import React from 'react';
import { Anime, AnimeStatus, AchievementDefinition, AchievementTier } from '../types';
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
  SparklesIcon
} from '../components/Icons';

// --- Helper Progress Calculations ---

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

const calculateCompletedAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => a.status === AnimeStatus.COMPLETED).length;
};

const calculateRatedAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => typeof a.rating === 'number' && a.rating > 0).length;
};

const calculateUniqueGenresExplored = (animeList: Anime[]): number => {
  const uniqueGenres = new Set<string>();
  animeList.forEach(anime => {
    if (anime.status === AnimeStatus.COMPLETED || (anime.currentEpisode > 0 && anime.status !== AnimeStatus.PLANNED && anime.status !== AnimeStatus.DROPPED)) {
      anime.genres?.forEach(genre => uniqueGenres.add(genre));
    }
  });
  return uniqueGenres.size;
};

const calculatePerfectScoreAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => typeof a.rating === 'number' && a.rating === 10).length;
};

const calculateWatchingAnimes = (animeList: Anime[]): number => {
  return animeList.filter(a => a.status === AnimeStatus.WATCHING).length;
};

const calculateUniquePlatformsUsed = (animeList: Anime[]): number => {
  const platforms = new Set<string>();
  animeList.forEach(anime => {
    anime.streamingPlatforms?.forEach(p => {
      if (p.name) platforms.add(p.name.toLowerCase().trim());
    });
  });
  return platforms.size;
};

// --- The Expanded Anime & Solo Leveling Achievement System ---

export const achievementDefinitions: AchievementDefinition[] = [
  // 1. SOLO LEVELING: ASCENSÃO DE CAÇADOR (Episódios Assistidos)
  {
    categoryId: 'soloLevelingEps',
    categoryTitle: 'Ascensão de Caçador (Solo Leveling)',
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
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_150_EPISODES',
        title: 'Sobrevivente da Dungeon Dupla (Rank D)',
        description: 'Superou os primeiros testes mortais. Alcançou 150 episódios.',
        target: 150,
        xpReward: 100,
        rank: 'D',
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_350_EPISODES',
        title: 'Líder de Raid (Rank C)',
        description: 'Liderando esquadrões de maratona com maestria. 350 episódios.',
        target: 350,
        xpReward: 150,
        rank: 'C',
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_750_EPISODES',
        title: 'Caçador Veterano (Rank B)',
        description: 'Seu nome já é temido nos portais dimensionais. 750 episódios.',
        target: 750,
        xpReward: 250,
        rank: 'B',
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_1500_EPISODES',
        title: 'Força de Elite (Rank A)',
        description: 'Um dos pilares da Associação de Caçadores. 1.500 episódios assistidos.',
        target: 1500,
        xpReward: 400,
        rank: 'A',
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_3000_EPISODES',
        title: 'Caçador Rank S',
        description: 'Capaz de limpar dungeons de rank vermelho sozinho. 3.000 episódios.',
        target: 3000,
        xpReward: 650,
        rank: 'S',
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_5000_EPISODES',
        title: 'Autoridade de Nível Nacional',
        description: 'Poder capaz de rivalizar com o arsenal de nações inteiras. 5.000 episódios.',
        target: 5000,
        xpReward: 1000,
        rank: 'S',
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_8000_EPISODES',
        title: 'ERGA-SE! Monarca das Sombras',
        description: 'O exército das sombras agora se curva perante você. 8.000 episódios!',
        target: 8000,
        xpReward: 2000,
        rank: 'MONARCH',
        animeReference: 'Solo Leveling',
      },
      {
        id: 'WATCHED_12000_EPISODES',
        title: 'Monarca da Destruição Absoluta',
        description: 'Transcendeu todos os limites conhecidos do multiverso otaku. 12.000 episódios!',
        target: 12000,
        xpReward: 3500,
        rank: 'MONARCH',
        animeReference: 'Solo Leveling',
      },
    ],
  },

  // 2. SHONEN: A GRANDE JORNADA (Animes Concluídos)
  {
    categoryId: 'shonenJourney',
    categoryTitle: 'A Grande Jornada (Shonen & Clássicos)',
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
        animeReference: 'One Piece',
      },
      {
        id: 'COMPLETED_15_ANIMES',
        title: 'Aprovado no Exame Chunin',
        description: 'Dominou o chakra e provou seu valor diante dos Kages. 15 animes.',
        target: 15,
        xpReward: 180,
        rank: 'C',
        animeReference: 'Naruto',
      },
      {
        id: 'COMPLETED_25_ANIMES',
        title: 'As Esferas do Dragão',
        description: 'Shenlong atendeu ao seu pedido de maratona! 25 animes completos.',
        target: 25,
        xpReward: 280,
        rank: 'C',
        animeReference: 'Dragon Ball',
      },
      {
        id: 'COMPLETED_50_ANIMES',
        title: 'Capitão do Gotei 13',
        description: 'Liberou a Bankai da sua coleção. 50 animes concluídos.',
        target: 50,
        xpReward: 450,
        rank: 'B',
        animeReference: 'Bleach',
      },
      {
        id: 'COMPLETED_75_ANIMES',
        title: 'Haki do Conquistador',
        description: 'Apenas os predestinados a reinar alcançam essa marca. 75 animes.',
        target: 75,
        xpReward: 650,
        rank: 'A',
        animeReference: 'One Piece',
      },
      {
        id: 'COMPLETED_100_ANIMES',
        title: 'Alquimista Federal Lendário',
        description: 'Desvendou a Verdade por trás do portal da Alquimia. 100 animes!',
        target: 100,
        xpReward: 900,
        rank: 'A',
        animeReference: 'Fullmetal Alchemist',
      },
      {
        id: 'COMPLETED_150_ANIMES',
        title: 'Rei dos Piratas',
        description: 'Conquistou todos os mares conhecidos! Mais de 150 animes na estante.',
        target: 150,
        xpReward: 1500,
        rank: 'S',
        animeReference: 'One Piece',
      },
      {
        id: 'COMPLETED_200_ANIMES',
        title: 'Deus do Novo Mundo',
        description: '200 histórias épicas gravadas para sempre na sua memória.',
        target: 200,
        xpReward: 2500,
        rank: 'MONARCH',
      },
      {
        id: 'COMPLETED_300_ANIMES',
        title: 'Lenda Imortal dos Animes',
        description: '300 animes concluídos! Uma biblioteca viva da animação mundial.',
        target: 300,
        xpReward: 4000,
        rank: 'MONARCH',
      },
    ],
  },

  // 3. HUNTER X HUNTER: LICENÇA HUNTER (Gêneros Explorados)
  {
    categoryId: 'exploredGenres',
    categoryTitle: 'Licença Hunter de Gêneros (Hunter x Hunter)',
    categoryIcon: AcademicCapIcon,
    calculateProgress: calculateUniqueGenresExplored,
    tiers: [
      {
        id: 'EXPLORED_3_GENRES',
        title: 'Nen Despertado',
        description: 'Descobriu sua afinidade inicial explorando 3 gêneros diferentes.',
        target: 3,
        xpReward: 50,
        rank: 'E',
        animeReference: 'Hunter x Hunter',
      },
      {
        id: 'EXPLORED_6_GENRES',
        title: 'Licença Hunter Oficial',
        description: 'Aprovado no Exame Hunter! Explorou 6 gêneros do multiverso.',
        target: 6,
        xpReward: 120,
        rank: 'D',
        animeReference: 'Hunter x Hunter',
      },
      {
        id: 'EXPLORED_10_GENRES',
        title: 'Hunter de 1 Estrela',
        description: 'Contribuições notáveis explorando 10 gêneros variados.',
        target: 10,
        xpReward: 250,
        rank: 'C',
        animeReference: 'Hunter x Hunter',
      },
      {
        id: 'EXPLORED_14_GENRES',
        title: 'Hunter de 2 Estrelas',
        description: 'Versatilidade incomparável assistindo a 14 gêneros.',
        target: 14,
        xpReward: 400,
        rank: 'B',
        animeReference: 'Hunter x Hunter',
      },
      {
        id: 'EXPLORED_18_GENRES',
        title: 'Hunter de 3 Estrelas & Zodíaco',
        description: 'Membro do conselho supremo. 18 gêneros desbravados.',
        target: 18,
        xpReward: 700,
        rank: 'A',
        animeReference: 'Hunter x Hunter',
      },
      {
        id: 'EXPLORED_22_GENRES',
        title: 'Presidente da Associação Hunter',
        description: 'Conhecimento absoluto sobre 22 gêneros do universo dos animes.',
        target: 22,
        xpReward: 1200,
        rank: 'S',
        animeReference: 'Hunter x Hunter',
      },
    ],
  },

  // 4. DEATH NOTE: CADERNO DE AVALIAÇÕES (Animes Avaliados)
  {
    categoryId: 'ratedAnimes',
    categoryTitle: 'Caderno de Julgamento (Death Note)',
    categoryIcon: StarIcon,
    calculateProgress: calculateRatedAnimes,
    tiers: [
      {
        id: 'RATED_1_ANIME',
        title: 'Primeiro Veredito',
        description: 'Escreveu sua primeira opinião crítica no caderno de notas.',
        target: 1,
        xpReward: 50,
        rank: 'E',
        animeReference: 'Death Note',
      },
      {
        id: 'RATED_5_ANIMES',
        title: 'Dedução de Detetive',
        description: 'Investigou e avaliou 5 animes com senso crítico apurado.',
        target: 5,
        xpReward: 100,
        rank: 'D',
        animeReference: 'Death Note',
      },
      {
        id: 'RATED_15_ANIMES',
        title: 'Olhos de Shinigami',
        description: 'Capaz de enxergar o valor exato de cada obra. 15 animes avaliados.',
        target: 15,
        xpReward: 220,
        rank: 'C',
        animeReference: 'Death Note',
      },
      {
        id: 'RATED_35_ANIMES',
        title: 'O Julgamento de Kira',
        description: '35 notas distribuídas com precisão cirúrgica.',
        target: 35,
        xpReward: 400,
        rank: 'B',
        animeReference: 'Death Note',
      },
      {
        id: 'RATED_70_ANIMES',
        title: 'Suprema Corte Otaku',
        description: 'Mais de 70 avaliações registradas. Seu veredito é respeitado.',
        target: 70,
        xpReward: 700,
        rank: 'A',
      },
      {
        id: 'RATED_120_ANIMES',
        title: 'Árbitro do Multiverso',
        description: 'Julgou mais de 120 animes com sabedoria imparcial.',
        target: 120,
        xpReward: 1200,
        rank: 'S',
      },
      {
        id: 'RATED_180_ANIMES',
        title: 'Voz da Crítica Suprema',
        description: 'Mais de 180 avaliações! Uma autoridade incontestável no assunto.',
        target: 180,
        xpReward: 2000,
        rank: 'MONARCH',
      },
    ],
  },

  // 5. HALL DA FAMA: OBRAS-PRIMAS NOTA 10
  {
    categoryId: 'perfectScores',
    categoryTitle: 'Hall da Fama (Obras-Primas Nota 10)',
    categoryIcon: FireIcon,
    calculateProgress: calculatePerfectScoreAnimes,
    tiers: [
      {
        id: 'PERFECT_1_ANIME',
        title: 'Amor à Primeira Vista',
        description: 'Coroou uma obra inesquecível com a nota máxima (10/10).',
        target: 1,
        xpReward: 60,
        rank: 'D',
      },
      {
        id: 'PERFECT_3_ANIMES',
        title: 'A Trindade Sagrada',
        description: '3 obras-primas absolutas imortalizadas no seu altar de favoritos.',
        target: 3,
        xpReward: 160,
        rank: 'C',
      },
      {
        id: 'PERFECT_7_ANIMES',
        title: 'As 7 Maravilhas do Anime',
        description: '7 animes perfeitos dignos de serem lembrados por gerações.',
        target: 7,
        xpReward: 350,
        rank: 'B',
      },
      {
        id: 'PERFECT_15_ANIMES',
        title: 'O Panteão dos Clássicos',
        description: '15 títulos com Nota 10! Um acervo de pura excelência artística.',
        target: 15,
        xpReward: 750,
        rank: 'A',
      },
      {
        id: 'PERFECT_25_ANIMES',
        title: 'Museu das Obras Eternas',
        description: 'Mais de 25 animes Nota 10 catalogados no topo do seu ranking.',
        target: 25,
        xpReward: 1500,
        rank: 'S',
      },
    ],
  },

  // 6. ONE PUNCH MAN: TREINO DO SAITAMA (Em Andamento)
  {
    categoryId: 'saitamaTraining',
    categoryTitle: 'Treino de Maratonista (One Punch Man)',
    categoryIcon: TrendingUpIcon,
    calculateProgress: calculateWatchingAnimes,
    tiers: [
      {
        id: 'SIMULTANEOUS_1_ANIME',
        title: 'Aquecimento do Saitama',
        description: 'Tem pelo menos 1 anime sendo assistido no momento.',
        target: 1,
        xpReward: 30,
        rank: 'E',
        animeReference: 'One Punch Man',
      },
      {
        id: 'SIMULTANEOUS_3_ANIMES',
        title: 'Rotina de Exercícios',
        description: 'Acompanhando 3 animes em andamento simultaneamente.',
        target: 3,
        xpReward: 100,
        rank: 'D',
        animeReference: 'One Punch Man',
      },
      {
        id: 'SIMULTANEOUS_7_ANIMES',
        title: 'Treino Intenso: 7 em Andamento',
        description: '100 flexões, 100 abdominais e 7 animes da temporada sem falhar!',
        target: 7,
        xpReward: 250,
        rank: 'C',
        animeReference: 'One Punch Man',
      },
      {
        id: 'SIMULTANEOUS_12_ANIMES',
        title: 'Quebrador de Limitador',
        description: 'Equilibrando 12 animes semanais ao mesmo tempo!',
        target: 12,
        xpReward: 500,
        rank: 'B',
        animeReference: 'One Punch Man',
      },
      {
        id: 'SIMULTANEOUS_20_ANIMES',
        title: 'Golpe Sério de Maratonista',
        description: '20 animes em andamento ao mesmo tempo! Um soco de produtividade otaku.',
        target: 20,
        xpReward: 1000,
        rank: 'A',
        animeReference: 'One Punch Man',
      },
    ],
  },

  // 7. MULTIVERSO DO STREAMING (Plataformas Conectadas)
  {
    categoryId: 'streamingMultiverse',
    categoryTitle: 'Multiverso do Streaming (Plataformas)',
    categoryIcon: ShieldIcon,
    calculateProgress: calculateUniquePlatformsUsed,
    tiers: [
      {
        id: 'PLATFORM_1',
        title: 'Assinante Dedicado',
        description: 'Cadastrou animes de pelo menos 1 plataforma de streaming.',
        target: 1,
        xpReward: 50,
        rank: 'E',
      },
      {
        id: 'PLATFORM_2',
        title: 'Conexão Cruzada',
        description: 'Aproveitando o catálogo de 2 plataformas diferentes.',
        target: 2,
        xpReward: 100,
        rank: 'D',
      },
      {
        id: 'PLATFORM_3',
        title: 'O Portal do Multiverso',
        description: 'Crunchyroll, Netflix, Disney+, YouTube... 3 serviços integrados!',
        target: 3,
        xpReward: 220,
        rank: 'C',
      },
      {
        id: 'PLATFORM_4',
        title: 'Omnipresença Transmitida',
        description: 'Animes espalhados por 4 plataformas de transmissão diferentes.',
        target: 4,
        xpReward: 450,
        rank: 'B',
      },
      {
        id: 'PLATFORM_5',
        title: 'Senhor de Todos os Feeds',
        description: 'Dominando 5 ou mais serviços de streaming na sua coleção.',
        target: 5,
        xpReward: 800,
        rank: 'A',
      },
    ],
  },
];
