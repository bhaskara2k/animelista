// utils/translationUtils.ts
import { AniListMediaStatus } from '../types';

const genreTranslations: Record<string, string> = {
  // Common Genres
  "Action": "Ação",
  "Adventure": "Aventura",
  "Comedy": "Comédia",
  "Drama": "Drama",
  "Ecchi": "Ecchi",
  "Fantasy": "Fantasia",
  "Hentai": "Hentai", // Explicit, handle with care if app is public
  "Horror": "Terror",
  "Mahou Shoujo": "Mahou Shoujo",
  "Mecha": "Mecha",
  "Music": "Música",
  "Mystery": "Mistério",
  "Psychological": "Psicológico",
  "Romance": "Romance",
  "Sci-Fi": "Ficção Científica",
  "Slice of Life": "Slice of Life",
  "Sports": "Esportes",
  "Supernatural": "Sobrenatural",
  "Thriller": "Suspense",
  // Demographics / Themes often listed as genres
  "Boys Love": "Boys Love", // (Yaoi)
  "Girls Love": "Girls Love", // (Yuri)
  "Gourmet": "Gourmet",
  "Harem": "Harém",
  "Josei": "Josei",
  "Kids": "Infantil",
  "Martial Arts": "Artes Marciais",
  "School": "Escolar",
  "Seinen": "Seinen",
  "Shoujo": "Shoujo",
  "Shounen": "Shounen",
  "Space": "Espacial",
  "Super Power": "Super Poderes",
  "Vampire": "Vampiro",
  "Historical": "Histórico",
  "Military": "Militar",
  "Police": "Policial",
  "Demons": "Demônios", // (Akuma)
  "Game": "Jogo",
  "Cars": "Carros", // (Jidousha)
  "Parody": "Paródia", // (Dajjare)
  "Samurai": "Samurai",
  "Adult Cast": "Elenco Adulto", // (Otona) - New from AniList
  "Anthropomorphic": "Antropomórfico", // (Gijinka) - New from AniList
  "CGDCT": "CGDCT", // (Cute Girls Doing Cute Things) - New from AniList
  "Childcare": "Puericultura", // (Ikuji) - New from AniList
  "Combat Sports": "Esportes de Combate", // (Kakutougi) - New from AniList
  "Delinquents": "Delinquentes", // (Yankee) - New from AniList
  "Detective": "Detetive", // (Tantei) - New from AniList
  "Educational": "Educacional", // (Kyouiku) - New from AniList
  "Gag Humor": "Humor Pastelão", // (Gag) - New from AniList
  "High Stakes Game": "Jogo de Alto Risco", // (High Stakes Game) - New from AniList
  "Idols (Female)": "Idols (Feminino)", // (Idol) - New from AniList
  "Idols (Male)": "Idols (Masculino)", // (Idol) - New from AniList
  "Isekai": "Isekai", // (Isekai) - New from AniList
  "Iyashikei": "Iyashikei", // (Iyashikei) - New from AniList
  "Love Polygon": "Polígono Amoroso", // (Love Polygon) - New from AniList
  "Magical Sex Shift": "Troca Mágica de Sexo", // (Magical Sex Shift) - New from AniList
  "Medical": "Médico", // (Iryou) - New from AniList
  "Mythology": "Mitologia", // (Shinwa) - New from AniList
  "Organized Crime": "Crime Organizado", // (Yakuza) - New from AniList
  "Otaku Culture": "Cultura Otaku", // (Otaku) - New from AniList
  "Performing Arts": "Artes Cênicas", // (Geinoukai) - New from AniList
  "Pets": "Animais de Estimação", // (Pet) - New from AniList
  "Reincarnation": "Reencarnação", // (Tensei) - New from AniList
  "Reverse Harem": "Harém Invertido", // (Reverse Harem) - New from AniList
  "Romantic Comedy": "Comédia Romântica", // (RomCom) - New from AniList
  "Showbiz": "Showbiz", // (Geinoukai) - New from AniList
  "Strategy Game": "Jogo de Estratégia", // (Strategy Game) - New from AniList
  "Survival": "Sobrevivência", // (Survival) - New from AniList
  "Team Sports": "Esportes de Equipe", // (Team Sports) - New from AniList
  "Time Travel": "Viagem no Tempo", // (Time Travel) - New from AniList
  "Video Game": "Video Game", // (Video Game) - New from AniList
  "Villainess": "Vilã", // (Akuyaku Reijou) - New from AniList
  "Visual Arts": "Artes Visuais", // (Bijutsu) - New from AniList
  "Workplace": "Ambiente de Trabalho", // (Work) - New from AniList
};

const formatTranslations: Record<string, string> = {
  "TV": "TV",
  "TV_SHORT": "TV Curta",
  "MOVIE": "Filme",
  "SPECIAL": "Especial",
  "OVA": "OVA", // Original Video Animation
  "ONA": "ONA", // Original Net Animation
  "MUSIC": "Música", // Music Video
  "MANGA": "Mangá", // (If API ever returns this for media type, though unlikely for anime search)
  "NOVEL": "Novel", // (Light Novel)
  "ONE_SHOT": "One-shot", // (For Manga)
};

const aniListStatusTranslations: Record<AniListMediaStatus | string, string> = {
  'FINISHED': 'Finalizado',
  'RELEASING': 'Em Lançamento',
  'NOT_YET_RELEASED': 'Não Lançado',
  'CANCELLED': 'Cancelado',
  'HIATUS': 'Em Hiato',
};

export const translateGenre = (englishGenre: string): string => {
  return genreTranslations[englishGenre] || englishGenre;
};

export const translateFormat = (englishFormat: string): string => {
  return formatTranslations[englishFormat] || englishFormat;
};

export const translateAniListStatus = (englishStatus: AniListMediaStatus | string | undefined): string => {
  if (!englishStatus) return 'N/A';
  return aniListStatusTranslations[englishStatus] || englishStatus.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};
