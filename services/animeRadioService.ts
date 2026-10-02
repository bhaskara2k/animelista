// Service providing Anime Radio stations and Anime Openings/Endings catalog

export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  animeTitle: string;
  audioUrl: string;
  coverUrl?: string;
  isLiveRadio?: boolean;
  type?: 'OP' | 'ED' | 'RADIO';
  slug?: string;
  category?: 'black_clover' | 'shonen' | 'recent' | 'classics';
}

// 24/7 High-Quality Live Anime Web Radio Stations
export const LIVE_RADIO_STATIONS: RadioTrack[] = [
  {
    id: 'listen-moe-jpop',
    title: 'LISTEN.moe J-Pop & Anison',
    artist: 'Transmissão Ao Vivo 24/7',
    animeTitle: 'Rádio Anime Oficial',
    audioUrl: 'https://listen.moe/stream',
    coverUrl: 'https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png',
    isLiveRadio: true,
    type: 'RADIO',
  },
  {
    id: 'gensokyo-radio',
    title: 'Gensokyo Radio',
    artist: 'Trilhas & Músicas de Animes',
    animeTitle: 'Mundo dos Animes & Games',
    audioUrl: 'https://stream.gensokyoradio.net/1/',
    coverUrl: 'https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/DBibwSqcnZEqzxncGHrOvq8YYnaNWQ3E2p5SehoF.jpg',
    isLiveRadio: true,
    type: 'RADIO',
  },
  {
    id: 'listen-moe-kpop',
    title: 'LISTEN.moe Asian Pop & OSTs',
    artist: 'Hits Asiáticos & Temas',
    animeTitle: 'Rádio 24 Horas',
    audioUrl: 'https://listen.moe/kpop/stream',
    coverUrl: 'https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RzZH6YW4N77UI4LIppb7vG39XRaJRMVHqVJvpX7z.png',
    isLiveRadio: true,
    type: 'RADIO',
  },
];

// Curated Collection of 100+ Legendary Anime Openings (with real covers & audio streams)
export const ICONIC_OPENINGS: RadioTrack[] = [
  {
    "id": "bc-op3",
    "title": "Black Rover (OP 3)",
    "artist": "Vickeblanka",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP3-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP3",
    "category": "black_clover"
  },
  {
    "id": "bc-op10",
    "title": "Black Catcher (OP 10)",
    "artist": "Vickeblanka",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP10.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP10",
    "category": "black_clover"
  },
  {
    "id": "bc-op1",
    "title": "Haruka Mirai (OP 1)",
    "artist": "Kankaku Piero",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP1",
    "category": "black_clover"
  },
  {
    "id": "bc-op13",
    "title": "Grandeur (OP 13)",
    "artist": "Snow Man",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP13.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP13",
    "category": "black_clover"
  },
  {
    "id": "bc-op2",
    "title": "PAiNT it BLACK (OP 2)",
    "artist": "BiSH",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP2-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP2",
    "category": "black_clover"
  },
  {
    "id": "bc-op7",
    "title": "JUSTadICE (OP 7)",
    "artist": "Seiko Oomori",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP7-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP7",
    "category": "black_clover"
  },
  {
    "id": "bc-op4",
    "title": "Guess Who Is Back (OP 4)",
    "artist": "Kumi Koda",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP4-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP4",
    "category": "black_clover"
  },
  {
    "id": "bc-op5",
    "title": "Gamushara (OP 5)",
    "artist": "Miyuna",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP5-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP5",
    "category": "black_clover"
  },
  {
    "id": "bc-op6",
    "title": "Rakugaki Page (OP 6)",
    "artist": "Kankaku Piero",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP6-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP6",
    "category": "black_clover"
  },
  {
    "id": "bc-op8",
    "title": "sky & blue (OP 8)",
    "artist": "GIRLFRIEND",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP8.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP8",
    "category": "black_clover"
  },
  {
    "id": "bc-op9",
    "title": "RiGHT NOW (OP 9)",
    "artist": "EMPiRE",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP9.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP9",
    "category": "black_clover"
  },
  {
    "id": "bc-op11",
    "title": "Stories (OP 11)",
    "artist": "Snow Man",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP11.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP11",
    "category": "black_clover"
  },
  {
    "id": "bc-op12",
    "title": "Everlasting Shine (OP 12)",
    "artist": "TOMORROW X TOGETHER",
    "animeTitle": "Black Clover",
    "audioUrl": "https://a.animethemes.moe/BlackClover-OP12.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RgewOW7Lw8i92A3JTad8vcF7fiT98qpizy3SQ28q.png",
    "type": "OP",
    "slug": "OP12",
    "category": "black_clover"
  },
  {
    "id": "naruto-op1",
    "title": "R★O★C★K★S (OP1)",
    "artist": "Naruto",
    "animeTitle": "Naruto",
    "audioUrl": "https://a.animethemes.moe/Naruto-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/DBibwSqcnZEqzxncGHrOvq8YYnaNWQ3E2p5SehoF.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "naruto-op2",
    "title": "Haruka Kanata (OP2)",
    "artist": "Asian Kung-Fu Generation",
    "animeTitle": "Naruto",
    "audioUrl": "https://a.animethemes.moe/Naruto-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/DBibwSqcnZEqzxncGHrOvq8YYnaNWQ3E2p5SehoF.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "naruto-op3",
    "title": "Kanashimi wo Yasashisa ni (OP3)",
    "artist": "Naruto",
    "animeTitle": "Naruto",
    "audioUrl": "https://a.animethemes.moe/Naruto-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/DBibwSqcnZEqzxncGHrOvq8YYnaNWQ3E2p5SehoF.jpg",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "naruto-op4",
    "title": "GO!!! (OP4)",
    "artist": "FLOW",
    "animeTitle": "Naruto",
    "audioUrl": "https://a.animethemes.moe/Naruto-OP4v2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/DBibwSqcnZEqzxncGHrOvq8YYnaNWQ3E2p5SehoF.jpg",
    "type": "OP",
    "slug": "OP4",
    "category": "shonen"
  },
  {
    "id": "naruto-op5",
    "title": "Seishun Kyosokyoku (OP5)",
    "artist": "Naruto",
    "animeTitle": "Naruto",
    "audioUrl": "https://a.animethemes.moe/Naruto-OP5.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/DBibwSqcnZEqzxncGHrOvq8YYnaNWQ3E2p5SehoF.jpg",
    "type": "OP",
    "slug": "OP5",
    "category": "shonen"
  },
  {
    "id": "narutoshippuuden-op1",
    "title": "Hero's Come Back (OP1)",
    "artist": "Naruto: Shippuuden",
    "animeTitle": "Naruto: Shippuuden",
    "audioUrl": "https://a.animethemes.moe/NarutoShippuuden-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RzZH6YW4N77UI4LIppb7vG39XRaJRMVHqVJvpX7z.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "narutoshippuuden-op2",
    "title": "distance (OP2)",
    "artist": "Naruto: Shippuuden",
    "animeTitle": "Naruto: Shippuuden",
    "audioUrl": "https://a.animethemes.moe/NarutoShippuuden-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RzZH6YW4N77UI4LIppb7vG39XRaJRMVHqVJvpX7z.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "narutoshippuuden-op3",
    "title": "Blue Bird (OP3)",
    "artist": "Ikimonogakari",
    "animeTitle": "Naruto: Shippuuden",
    "audioUrl": "https://a.animethemes.moe/NarutoShippuuden-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RzZH6YW4N77UI4LIppb7vG39XRaJRMVHqVJvpX7z.png",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "narutoshippuuden-op4",
    "title": "CLOSER (OP4)",
    "artist": "Naruto: Shippuuden",
    "animeTitle": "Naruto: Shippuuden",
    "audioUrl": "https://a.animethemes.moe/NarutoShippuuden-OP4.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RzZH6YW4N77UI4LIppb7vG39XRaJRMVHqVJvpX7z.png",
    "type": "OP",
    "slug": "OP4",
    "category": "shonen"
  },
  {
    "id": "narutoshippuuden-op5",
    "title": "Hotaru no Hikari (OP5)",
    "artist": "Ikimonogakari",
    "animeTitle": "Naruto: Shippuuden",
    "audioUrl": "https://a.animethemes.moe/NarutoShippuuden-OP5.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/RzZH6YW4N77UI4LIppb7vG39XRaJRMVHqVJvpX7z.png",
    "type": "OP",
    "slug": "OP5",
    "category": "shonen"
  },
  {
    "id": "bleach-op1",
    "title": "*~Asterisk (OP1)",
    "artist": "Orange Range",
    "animeTitle": "BLEACH",
    "audioUrl": "https://a.animethemes.moe/Bleach-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ZDNvEtoikjQ2NkyCzPmB3xQQvPrQnYbAUiLgmxh8.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "bleach-op2",
    "title": "D-tecnolife (OP2)",
    "artist": "UVERworld",
    "animeTitle": "BLEACH",
    "audioUrl": "https://a.animethemes.moe/Bleach-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ZDNvEtoikjQ2NkyCzPmB3xQQvPrQnYbAUiLgmxh8.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "bleach-op3",
    "title": "Ichirin no Hana (OP3)",
    "artist": "HIGH and MIGHTY COLOR",
    "animeTitle": "BLEACH",
    "audioUrl": "https://a.animethemes.moe/Bleach-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ZDNvEtoikjQ2NkyCzPmB3xQQvPrQnYbAUiLgmxh8.png",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "onepiece-op1",
    "title": "We Are! (OP1)",
    "artist": "Hiroshi Kitadani",
    "animeTitle": "One Piece",
    "audioUrl": "https://a.animethemes.moe/OnePiece-OP1-NCDVD480.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Wt5oiJVYw1ZbaWXNua7GSg9OCYx1JKooiNU5UmSp.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "onepiece-op2",
    "title": "Believe (OP2)",
    "artist": "Folder5",
    "animeTitle": "One Piece",
    "audioUrl": "https://a.animethemes.moe/OnePiece-OP2-NCDVD480.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Wt5oiJVYw1ZbaWXNua7GSg9OCYx1JKooiNU5UmSp.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "onepiece-op3",
    "title": "Hikari E (OP3)",
    "artist": "One Piece",
    "animeTitle": "One Piece",
    "audioUrl": "https://a.animethemes.moe/OnePiece-OP3-NCDVD480.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Wt5oiJVYw1ZbaWXNua7GSg9OCYx1JKooiNU5UmSp.jpg",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "onepiece-op4",
    "title": "Bon Voyage! (OP4)",
    "artist": "One Piece",
    "animeTitle": "One Piece",
    "audioUrl": "https://a.animethemes.moe/OnePiece-OP4-NCDVD480.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Wt5oiJVYw1ZbaWXNua7GSg9OCYx1JKooiNU5UmSp.jpg",
    "type": "OP",
    "slug": "OP4",
    "category": "shonen"
  },
  {
    "id": "onepiece-op5",
    "title": "Kokoro no Chizu (OP5)",
    "artist": "One Piece",
    "animeTitle": "One Piece",
    "audioUrl": "https://a.animethemes.moe/OnePiece-OP5-NCDVD480.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Wt5oiJVYw1ZbaWXNua7GSg9OCYx1JKooiNU5UmSp.jpg",
    "type": "OP",
    "slug": "OP5",
    "category": "shonen"
  },
  {
    "id": "dragonballz-op1",
    "title": "Cha-La Head-Cha-La (OP1)",
    "artist": "Hironobu Kageyama",
    "animeTitle": "Dragon Ball Z",
    "audioUrl": "https://a.animethemes.moe/DragonBallZ-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/mPaZWpIpdL683kNGU2KVQOqwSBvYn9MMn68pRK3Q.png",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "dragonballz-op2",
    "title": "We Gotta Power (OP2)",
    "artist": "Hironobu Kageyama",
    "animeTitle": "Dragon Ball Z",
    "audioUrl": "https://a.animethemes.moe/DragonBallZ-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/mPaZWpIpdL683kNGU2KVQOqwSBvYn9MMn68pRK3Q.png",
    "type": "OP",
    "slug": "OP2",
    "category": "classics"
  },
  {
    "id": "dragonballsuper-op1",
    "title": "Chouzetsu☆Dynamic! (OP1)",
    "artist": "Dragon Ball Super",
    "animeTitle": "Dragon Ball Super",
    "audioUrl": "https://a.animethemes.moe/DragonBallSuper-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/MC2OhoBqxHWkprqxPaRJaRSvDGFGsszzfXFdq5Gi.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "dragonballsuper-op2",
    "title": "Genkai Toppa x Survivor (OP2)",
    "artist": "Dragon Ball Super",
    "animeTitle": "Dragon Ball Super",
    "audioUrl": "https://a.animethemes.moe/DragonBallSuper-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/MC2OhoBqxHWkprqxPaRJaRSvDGFGsszzfXFdq5Gi.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "classics"
  },
  {
    "id": "hunterxhunter-op1",
    "title": "departure! (OP1)",
    "artist": "Hunter x Hunter",
    "animeTitle": "Hunter x Hunter",
    "audioUrl": "https://a.animethemes.moe/HunterHunter2011-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/dSjOXdxaSFxvgAwj2tF7nHvtAeoxAakXGJmr0Qy3.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "fullmetalalchemistbrotherhood-op1",
    "title": "again (OP1)",
    "artist": "Yui",
    "animeTitle": "Fullmetal Alchemist: Brotherhood",
    "audioUrl": "https://a.animethemes.moe/FullmetalAlchemistBrotherhood-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gfq2CHywTELCdwvhg1qbHQ5kj5uoDoxFOvJ64qcG.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "fullmetalalchemistbrotherhood-op2",
    "title": "Hologram (OP2)",
    "artist": "NICO Touches the Walls",
    "animeTitle": "Fullmetal Alchemist: Brotherhood",
    "audioUrl": "https://a.animethemes.moe/FullmetalAlchemistBrotherhood-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gfq2CHywTELCdwvhg1qbHQ5kj5uoDoxFOvJ64qcG.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "fullmetalalchemistbrotherhood-op3",
    "title": "Golden Time Lover (OP3)",
    "artist": "Sukima Switch",
    "animeTitle": "Fullmetal Alchemist: Brotherhood",
    "audioUrl": "https://a.animethemes.moe/FullmetalAlchemistBrotherhood-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gfq2CHywTELCdwvhg1qbHQ5kj5uoDoxFOvJ64qcG.png",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "fullmetalalchemistbrotherhood-op4",
    "title": "Period (OP4)",
    "artist": "CHEMISTRY",
    "animeTitle": "Fullmetal Alchemist: Brotherhood",
    "audioUrl": "https://a.animethemes.moe/FullmetalAlchemistBrotherhood-OP4.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gfq2CHywTELCdwvhg1qbHQ5kj5uoDoxFOvJ64qcG.png",
    "type": "OP",
    "slug": "OP4",
    "category": "shonen"
  },
  {
    "id": "fullmetalalchemistbrotherhood-op5",
    "title": "Rain (OP5)",
    "artist": "SID",
    "animeTitle": "Fullmetal Alchemist: Brotherhood",
    "audioUrl": "https://a.animethemes.moe/FullmetalAlchemistBrotherhood-OP5.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gfq2CHywTELCdwvhg1qbHQ5kj5uoDoxFOvJ64qcG.png",
    "type": "OP",
    "slug": "OP5",
    "category": "shonen"
  },
  {
    "id": "yuuyuuhakusho-op1",
    "title": "Hohoemi no Bakudan (OP1)",
    "artist": "Yuu☆Yuu☆Hakusho",
    "animeTitle": "Yuu☆Yuu☆Hakusho",
    "audioUrl": "https://a.animethemes.moe/YuuYuuHakusho-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/epusZeVlpNY12Y10vg1HWJremEhy3glKxALLtubY.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "yuuyuuhakusho-op1-en",
    "title": "Hohoemi no Bakudan (OP1-EN)",
    "artist": "Yuu☆Yuu☆Hakusho",
    "animeTitle": "Yuu☆Yuu☆Hakusho",
    "audioUrl": "https://a.animethemes.moe/YuuYuuHakusho-OP1-EN.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/epusZeVlpNY12Y10vg1HWJremEhy3glKxALLtubY.png",
    "type": "OP",
    "slug": "OP1-EN",
    "category": "shonen"
  },
  {
    "id": "saintseiya-op1",
    "title": "Pegasus Gensou (OP1)",
    "artist": "Saint Seiya",
    "animeTitle": "Saint Seiya",
    "audioUrl": "https://a.animethemes.moe/SaintSeiya-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/LVRGUdYWS7DvfrJCowGsTn7x4T4WTIt0PzkvXncS.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "saintseiya-op2",
    "title": "Saint Shinwa (OP2)",
    "artist": "Hironobu Kageyama",
    "animeTitle": "Saint Seiya",
    "audioUrl": "https://a.animethemes.moe/SaintSeiya-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/LVRGUdYWS7DvfrJCowGsTn7x4T4WTIt0PzkvXncS.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "classics"
  },
  {
    "id": "inuyasha-op1",
    "title": "Change the World (OP1)",
    "artist": "InuYasha",
    "animeTitle": "InuYasha",
    "audioUrl": "https://a.animethemes.moe/InuYasha-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/yBbBBW7B1hB1y4xU9txKsXtbEylj90STpYqPfqTT.png",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "inuyasha-op2",
    "title": "I Am (OP2)",
    "artist": "InuYasha",
    "animeTitle": "InuYasha",
    "audioUrl": "https://a.animethemes.moe/InuYasha-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/yBbBBW7B1hB1y4xU9txKsXtbEylj90STpYqPfqTT.png",
    "type": "OP",
    "slug": "OP2",
    "category": "classics"
  },
  {
    "id": "inuyasha-op3",
    "title": "Owarinai Yume (OP3)",
    "artist": "Aikawa Nanase",
    "animeTitle": "InuYasha",
    "audioUrl": "https://a.animethemes.moe/InuYasha-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/yBbBBW7B1hB1y4xU9txKsXtbEylj90STpYqPfqTT.png",
    "type": "OP",
    "slug": "OP3",
    "category": "classics"
  },
  {
    "id": "rurounikenshinmeijikenkakuromantan-op1",
    "title": "Sobakasu (OP1)",
    "artist": "JUDY AND MARY",
    "animeTitle": "Rurouni Kenshin: Meiji Kenkaku Romantan",
    "audioUrl": "https://a.animethemes.moe/RurouniKenshin-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/t0A5k7LxmjwEesiT1LANkIIjVR6ehy1dQzwil33D.png",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "rurounikenshinmeijikenkakuromantan-op2",
    "title": "1/2 (OP2)",
    "artist": "Makoto Kawamoto",
    "animeTitle": "Rurouni Kenshin: Meiji Kenkaku Romantan",
    "audioUrl": "https://a.animethemes.moe/RurouniKenshin-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/t0A5k7LxmjwEesiT1LANkIIjVR6ehy1dQzwil33D.png",
    "type": "OP",
    "slug": "OP2",
    "category": "classics"
  },
  {
    "id": "rurounikenshinmeijikenkakuromantan-op3",
    "title": "Kimi ni Fureru Dake de (OP3)",
    "artist": "CURIO",
    "animeTitle": "Rurouni Kenshin: Meiji Kenkaku Romantan",
    "audioUrl": "https://a.animethemes.moe/RurouniKenshin-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/t0A5k7LxmjwEesiT1LANkIIjVR6ehy1dQzwil33D.png",
    "type": "OP",
    "slug": "OP3",
    "category": "classics"
  },
  {
    "id": "digimonadventure-op1",
    "title": "Butter-Fly (OP1)",
    "artist": "Kouji Wada",
    "animeTitle": "Digimon Adventure",
    "audioUrl": "https://a.animethemes.moe/DigimonAdventure-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Q5i9VJNB2WFbGsSNnyEWIsLxOkOTefjWjrnEK6u2.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "digimonadventure-op1-en",
    "title": "Season 1 Opening Theme (OP1-EN)",
    "artist": "Digimon Adventure",
    "animeTitle": "Digimon Adventure",
    "audioUrl": "https://a.animethemes.moe/DigimonAdventure-OP1-EN.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Q5i9VJNB2WFbGsSNnyEWIsLxOkOTefjWjrnEK6u2.jpg",
    "type": "OP",
    "slug": "OP1-EN",
    "category": "classics"
  },
  {
    "id": "fairytail-op1",
    "title": "MASAYUME CHASING (OP1)",
    "artist": "BoA",
    "animeTitle": "Fairy Tail",
    "audioUrl": "https://a.animethemes.moe/FairyTail2014-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/pUTqUFWPLjDfW75apWQbgA5wsw7YxXEw5vaT3dd7.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "fairytail-op2",
    "title": "STRIKE BACK (OP2)",
    "artist": "BACK-ON",
    "animeTitle": "Fairy Tail",
    "audioUrl": "https://a.animethemes.moe/FairyTail2014-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/pUTqUFWPLjDfW75apWQbgA5wsw7YxXEw5vaT3dd7.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "fairytail-op3",
    "title": "Mysterious Magic (OP3)",
    "artist": "Fairy Tail",
    "animeTitle": "Fairy Tail",
    "audioUrl": "https://a.animethemes.moe/FairyTail2014-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/pUTqUFWPLjDfW75apWQbgA5wsw7YxXEw5vaT3dd7.jpg",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "fairytail-op4",
    "title": "BREAK OUT (OP4)",
    "artist": "Fairy Tail",
    "animeTitle": "Fairy Tail",
    "audioUrl": "https://a.animethemes.moe/FairyTail2014-OP4.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/pUTqUFWPLjDfW75apWQbgA5wsw7YxXEw5vaT3dd7.jpg",
    "type": "OP",
    "slug": "OP4",
    "category": "shonen"
  },
  {
    "id": "fairytail-op5",
    "title": "Yume-iro Graffiti (OP5)",
    "artist": "Fairy Tail",
    "animeTitle": "Fairy Tail",
    "audioUrl": "https://a.animethemes.moe/FairyTail2014-OP5.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/pUTqUFWPLjDfW75apWQbgA5wsw7YxXEw5vaT3dd7.jpg",
    "type": "OP",
    "slug": "OP5",
    "category": "shonen"
  },
  {
    "id": "souleater-op1",
    "title": "Resonance (OP1)",
    "artist": "T.M.Revolution",
    "animeTitle": "Soul Eater",
    "audioUrl": "https://a.animethemes.moe/SoulEater-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gvLyGAA92WC6RsDCQZbUkGuzsjgKK4T6BX63H2Zx.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "souleater-op2",
    "title": "PAPERMOON (OP2)",
    "artist": "Tommy heavenly⁶",
    "animeTitle": "Soul Eater",
    "audioUrl": "https://a.animethemes.moe/SoulEater-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gvLyGAA92WC6RsDCQZbUkGuzsjgKK4T6BX63H2Zx.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "souleater-op1-repeatshow",
    "title": "Counter Identity (OP1-RepeatShow)",
    "artist": "Soul Eater",
    "animeTitle": "Soul Eater",
    "audioUrl": "https://a.animethemes.moe/SoulEater-OP1-RepeatShow.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/gvLyGAA92WC6RsDCQZbUkGuzsjgKK4T6BX63H2Zx.png",
    "type": "OP",
    "slug": "OP1-RepeatShow",
    "category": "shonen"
  },
  {
    "id": "dgrayman-op1",
    "title": "INNOCENT SORROW (OP1)",
    "artist": "abingdon boys school",
    "animeTitle": "D.Gray-man",
    "audioUrl": "https://a.animethemes.moe/DGrayMan-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/VegkSOtKkEL3f0h66wElAM7KMT7TNRMBhfbBhUM7.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "dgrayman-op2",
    "title": "Brightdown (OP2)",
    "artist": "D.Gray-man",
    "animeTitle": "D.Gray-man",
    "audioUrl": "https://a.animethemes.moe/DGrayMan-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/VegkSOtKkEL3f0h66wElAM7KMT7TNRMBhfbBhUM7.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "dgrayman-op3",
    "title": "Doubt & Trust (OP3)",
    "artist": "D.Gray-man",
    "animeTitle": "D.Gray-man",
    "audioUrl": "https://a.animethemes.moe/DGrayMan-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/VegkSOtKkEL3f0h66wElAM7KMT7TNRMBhfbBhUM7.png",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "tengentoppagurrenlagann-op1",
    "title": "Sorairo Days (OP1)",
    "artist": "Shouko Nakagawa",
    "animeTitle": "Tengen Toppa Gurren Lagann",
    "audioUrl": "https://a.animethemes.moe/TengenToppaGurrenLagann-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/zpM65yQigQTdbG1PIIWPPuMB4QBWUEPn9LobfVex.png",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "codegeassdakkannoroz-op1",
    "title": "Running In My Head (OP1)",
    "artist": "MIYAVI",
    "animeTitle": "Code Geass: Dakkan no Rozé",
    "audioUrl": "https://a.animethemes.moe/CodeGeassDakkanNoRoze-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/vEyjdsjX6HKM78NxEPOzNSwipUiHjRhY5aGfDfQj.png",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "deathnote-op1",
    "title": "THE WORLD (OP1)",
    "artist": "Nightmare",
    "animeTitle": "Death Note",
    "audioUrl": "https://a.animethemes.moe/DeathNote-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/WrRVLWaCX8gDha9yjdEJLH2zpynxHKowG2gEXVaK.png",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "deathnote-op2",
    "title": "What's up people? (OP2)",
    "artist": "Maximum the Hormone",
    "animeTitle": "Death Note",
    "audioUrl": "https://a.animethemes.moe/DeathNote-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/WrRVLWaCX8gDha9yjdEJLH2zpynxHKowG2gEXVaK.png",
    "type": "OP",
    "slug": "OP2",
    "category": "classics"
  },
  {
    "id": "cowboybebop-op1",
    "title": "Tank! (OP1)",
    "artist": "Cowboy Bebop",
    "animeTitle": "Cowboy Bebop",
    "audioUrl": "https://a.animethemes.moe/CowboyBebop-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/SfXyZUYbg7jNilXUhnQWoQl5oF2nFufNtHJrCap4.png",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "neongenesisevangelion-op1",
    "title": "Zankoku na Tenshi no Thesis (OP1)",
    "artist": "Youko Takahashi",
    "animeTitle": "Neon Genesis Evangelion",
    "audioUrl": "https://a.animethemes.moe/NeonGenesisEvangelion-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/n9L9LIzW1n1hYNvR8IMuvnU6ZpJC4xKkzuvGi8Md.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "classics"
  },
  {
    "id": "jojonokimyounabouken-op1",
    "title": "JoJo ~Sono Chi no Sadame~ (OP1)",
    "artist": "Hiroaki TOMMY Tominaga",
    "animeTitle": "JoJo no Kimyou na Bouken",
    "audioUrl": "https://a.animethemes.moe/JojoNoKimyouNaBouken-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/z506uqDHswd33hydnqxly8dhQfqL1nrs69374ieM.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "jojonokimyounabouken-op2",
    "title": "BLOODY STREAM (OP2)",
    "artist": "Coda",
    "animeTitle": "JoJo no Kimyou na Bouken",
    "audioUrl": "https://a.animethemes.moe/JojoNoKimyouNaBouken-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/z506uqDHswd33hydnqxly8dhQfqL1nrs69374ieM.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "gintama-op1",
    "title": "Kagerou (OP1)",
    "artist": "Gintama.",
    "animeTitle": "Gintama.",
    "audioUrl": "https://a.animethemes.moe/GintamaS5-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/zGYBqLDA3COsKa1giehDSSG8OetlApKYb7W9cqda.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "jujutsukaisen-op1",
    "title": "Kaikai Kitan (OP1)",
    "artist": "Eve",
    "animeTitle": "Jujutsu Kaisen",
    "audioUrl": "https://a.animethemes.moe/JujutsuKaisen-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ggrh8wGLhZcYLtZskZD4h41Xh7Wxt735rdzygtRw.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "jujutsukaisen-op2",
    "title": "VIVID VICE (OP2)",
    "artist": "Who-ya Extended",
    "animeTitle": "Jujutsu Kaisen",
    "audioUrl": "https://a.animethemes.moe/JujutsuKaisen-OP2-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ggrh8wGLhZcYLtZskZD4h41Xh7Wxt735rdzygtRw.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "recent"
  },
  {
    "id": "kimetsunoyaiba-op1",
    "title": "Gurenge (OP1)",
    "artist": "LiSA",
    "animeTitle": "Kimetsu no Yaiba",
    "audioUrl": "https://a.animethemes.moe/KimetsuNoYaiba-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/2CTJVQ8P7jNnKzrQ6D0yoAidqeUXbnNE9q6UU6x9.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "shingekinokyojin-op1",
    "title": "Guren no Yumiya (OP1)",
    "artist": "Linked Horizon",
    "animeTitle": "Shingeki no Kyojin",
    "audioUrl": "https://a.animethemes.moe/ShingekiNoKyojin-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/mLoIEyGITkJPGCBxvjTpDyDYRM8rDb4ZuFGCKEaH.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "shingekinokyojin-op2",
    "title": "Jiyuu no Tsubasa (OP2)",
    "artist": "Linked Horizon",
    "animeTitle": "Shingeki no Kyojin",
    "audioUrl": "https://a.animethemes.moe/ShingekiNoKyojin-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/mLoIEyGITkJPGCBxvjTpDyDYRM8rDb4ZuFGCKEaH.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "bokunoheroacademia-op1",
    "title": "The Day (OP1)",
    "artist": "Porno Graffitti",
    "animeTitle": "Boku no Hero Academia",
    "audioUrl": "https://a.animethemes.moe/BokuNoHeroAcademia-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ddPmvU8eKAtzdm0Pxw93fXzjrtfeS7NarOMiTety.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "onepunchman-op1",
    "title": "THE HERO !! ~Okoreru Kobushi ni Hi wo Tsukero~ (OP1)",
    "artist": "JAM Project",
    "animeTitle": "One Punch Man",
    "audioUrl": "https://a.animethemes.moe/OnePunchMan-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ZF8O9bo6HzfHdjT3wBPBLwHQgezVMYJtnl5k1NEO.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "mobpsycho100-op1",
    "title": "99 (OP1)",
    "artist": "MOB CHOIR",
    "animeTitle": "Mob Psycho 100",
    "audioUrl": "https://a.animethemes.moe/MobPsycho100-OP1-BD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/nY8fvsWBmeHWE0RFEJjjmrBHga024vFvA9O1padY.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "chainsawman-op1",
    "title": "KICK BACK (OP1)",
    "artist": "Kenshi Yonezu",
    "animeTitle": "Chainsaw Man",
    "audioUrl": "https://a.animethemes.moe/ChainsawMan-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/I56a7g5t4kDpD2lIh8GeavpQbT7GxTXbcbjOSoDb.png",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "oredakelevelupnaken-op1",
    "title": "LEveL (OP1)",
    "artist": "TOMORROW X TOGETHER",
    "animeTitle": "Ore dake Level Up na Ken",
    "audioUrl": "https://a.animethemes.moe/SoloLeveling-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/rcukcV4KIE1UnsOnSVaZkCBGqR1MpUFX7MsbWAh4.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "oredakelevelupnaken-op1-tv",
    "title": "LEveL (OP1-TV)",
    "artist": "TOMORROW X TOGETHER",
    "animeTitle": "Ore dake Level Up na Ken",
    "audioUrl": "https://a.animethemes.moe/SoloLeveling-OP1-TV-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/rcukcV4KIE1UnsOnSVaZkCBGqR1MpUFX7MsbWAh4.png",
    "type": "OP",
    "slug": "OP1-TV",
    "category": "shonen"
  },
  {
    "id": "tokyoghoul-op1",
    "title": "unravel (OP1)",
    "artist": "TK from Ling tosite sigure",
    "animeTitle": "Tokyo Ghoul",
    "audioUrl": "https://a.animethemes.moe/TokyoGhoul-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/lXVlVtsCoYd2kmM4QsbXWqd63eJu2rX6OXZkia0k.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "swordartonline-op1",
    "title": "crossing field (OP1)",
    "artist": "LiSA",
    "animeTitle": "Sword Art Online",
    "audioUrl": "https://a.animethemes.moe/SwordArtOnline-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/IYdmoTRiGhAdf7rVnBdz0Fb3O2YbblCtvSMxeRu1.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "swordartonline-op2",
    "title": "INNOCENCE (OP2)",
    "artist": "Eir Aoi",
    "animeTitle": "Sword Art Online",
    "audioUrl": "https://a.animethemes.moe/SwordArtOnline-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/IYdmoTRiGhAdf7rVnBdz0Fb3O2YbblCtvSMxeRu1.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "vinlandsaga-op1",
    "title": "MUKANJYO (OP1)",
    "artist": "Survive Said The Prophet",
    "animeTitle": "Vinland Saga",
    "audioUrl": "https://a.animethemes.moe/VinlandSaga-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/oo9llPii2BWD2J2yaPmk1ceBEmfMIxz04zg9Qv8A.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "vinlandsaga-op2",
    "title": "Dark Crow (OP2)",
    "artist": "MAN WITH A MISSION",
    "animeTitle": "Vinland Saga",
    "audioUrl": "https://a.animethemes.moe/VinlandSaga-OP2-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/oo9llPii2BWD2J2yaPmk1ceBEmfMIxz04zg9Qv8A.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "drstone-op1",
    "title": "Good Morning World! (OP1)",
    "artist": "BURNOUT SYNDROMES",
    "animeTitle": "Dr. Stone",
    "audioUrl": "https://a.animethemes.moe/DrStone-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/eogV8EZFVQMzsVYY10cnAEEP0i4GoUumj9ebiHCb.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "drstone-op2",
    "title": "Sangenshoku (OP2)",
    "artist": "PELICAN FANCLUB",
    "animeTitle": "Dr. Stone",
    "audioUrl": "https://a.animethemes.moe/DrStone-OP2-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/eogV8EZFVQMzsVYY10cnAEEP0i4GoUumj9ebiHCb.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "haikyuu-op1",
    "title": "Imagination (OP1)",
    "artist": "SPYAIR",
    "animeTitle": "Haikyuu!!",
    "audioUrl": "https://a.animethemes.moe/Haikyuu-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/XcpppDG8n9WuWdCn6VBIT9zfVFNN2H6FSpE6c7Ls.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "haikyuu-op2",
    "title": "Ah Yeah!! (OP2)",
    "artist": "Sukima Switch",
    "animeTitle": "Haikyuu!!",
    "audioUrl": "https://a.animethemes.moe/Haikyuu-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/XcpppDG8n9WuWdCn6VBIT9zfVFNN2H6FSpE6c7Ls.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "enennoshouboutai-op1",
    "title": "Inferno (OP1)",
    "artist": "Mrs. GREEN APPLE",
    "animeTitle": "Enen no Shouboutai",
    "audioUrl": "https://a.animethemes.moe/EnenNoShouboutai-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/qQcEpzCFH64eRF39UEkNAWH0TOaDVcRyMPUmdRBX.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "enennoshouboutai-op2",
    "title": "MAYDAY feat. Ryo from CRYSTAL LAKE (OP2)",
    "artist": "coldrain",
    "animeTitle": "Enen no Shouboutai",
    "audioUrl": "https://a.animethemes.moe/EnenNoShouboutai-OP2-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/qQcEpzCFH64eRF39UEkNAWH0TOaDVcRyMPUmdRBX.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "noragami-op1",
    "title": "Goya no Machiawase (OP1)",
    "artist": "Hello Sleepwalkers",
    "animeTitle": "Noragami",
    "audioUrl": "https://a.animethemes.moe/Noragami-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/dijg7rt8OPBcmVLFaoAOtHaUv9p9JRXdmKuhcpmx.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "kiseijuuseinokakuritsu-op1",
    "title": "Let Me Hear (OP1)",
    "artist": "Fear, and Loathing in Las Vegas",
    "animeTitle": "Kiseijuu: Sei no Kakuritsu",
    "audioUrl": "https://a.animethemes.moe/Kiseijuu-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/KfrIYZi58vkaJ2grFLMQfl2azhXHOrJyem5uxz1l.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "psychopass-op1",
    "title": "abnormalize (OP1)",
    "artist": "Ling Tosite Sigure",
    "animeTitle": "Psycho Pass",
    "audioUrl": "https://a.animethemes.moe/PsychoPass-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/9f65alVDZgOnefAa0qY0ik2AF3Lkx0wMGozK6llz.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "psychopass-op2",
    "title": "Out of Control (OP2)",
    "artist": "Nothing's Carved in Stone",
    "animeTitle": "Psycho Pass",
    "audioUrl": "https://a.animethemes.moe/PsychoPass-OP2v2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/9f65alVDZgOnefAa0qY0ik2AF3Lkx0wMGozK6llz.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "fatezero-op1",
    "title": "oath sign (OP1)",
    "artist": "LiSA",
    "animeTitle": "Fate/Zero",
    "audioUrl": "https://a.animethemes.moe/FateZero-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/ey5VnEXFMRS2veM8OstyuGnzSU22zlQyax6w0M44.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "fatestaynight-op1",
    "title": "disillusion (OP1)",
    "artist": "Sachi Tainaka",
    "animeTitle": "Fate/stay night",
    "audioUrl": "https://a.animethemes.moe/FateStayNight-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/G8ZwO1epSjjfs9xBOOftnvE1CtpdnlhEtyaH6Dp8.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "fatestaynight-op2",
    "title": "Kirameku Namida wa Hoshi ni (OP2)",
    "artist": "Sachi Tainaka",
    "animeTitle": "Fate/stay night",
    "audioUrl": "https://a.animethemes.moe/FateStayNight-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/G8ZwO1epSjjfs9xBOOftnvE1CtpdnlhEtyaH6Dp8.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "rezerokarahajimeruisekaiseikatsu-op1",
    "title": "Redo (OP1)",
    "artist": "Konomi Suzuki",
    "animeTitle": "Re:Zero kara Hajimeru Isekai Seikatsu",
    "audioUrl": "https://a.animethemes.moe/ReZero-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/bnwog76jnd3YG8RZFb6m3FEJkfKRXOJBJxB2LlYO.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "rezerokarahajimeruisekaiseikatsu-op2",
    "title": "Paradisus-Paradoxum (OP2)",
    "artist": "MYTH & ROID",
    "animeTitle": "Re:Zero kara Hajimeru Isekai Seikatsu",
    "audioUrl": "https://a.animethemes.moe/ReZero-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/bnwog76jnd3YG8RZFb6m3FEJkfKRXOJBJxB2LlYO.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "dandadan-op1",
    "title": "Otonoke (OP1)",
    "artist": "Creepy Nuts",
    "animeTitle": "Dandadan",
    "audioUrl": "https://a.animethemes.moe/Dandadan-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/small-cover/0uSFMw1W4FcDzm2jwPPuGDx2LC26gcQ63DhlD0QP.avif",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "kaijuu8gou-op1",
    "title": "Abyss (OP1)",
    "artist": "YUNGBLUD",
    "animeTitle": "Kaijuu 8-gou",
    "audioUrl": "https://a.animethemes.moe/Kaijuu8Gou-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/VPBSBSm3RW8MhlVrnBC61Uc8ZlEOMYVywm4proQv.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "mashle-op1",
    "title": "Knock Out (OP1)",
    "artist": "Taiiku Okazaki",
    "animeTitle": "Mashle",
    "audioUrl": "https://a.animethemes.moe/Mashle-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/j9yLJ1ffhU8KpmJOKNseUl598BwScItuGrbN99xU.png",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "jigokuraku-op1",
    "title": "W●RK (OP1)",
    "artist": "millennium parade",
    "animeTitle": "Jigokuraku",
    "audioUrl": "https://a.animethemes.moe/Jigokuraku-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/OVmqp7Sk8lXXT06zpwAc4sL6Xc2h4sNMgSmuVHZH.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "kaguyasamawakokurasetaiotonaenokaidan-op1",
    "title": "Abunai Kioku (OP1)",
    "artist": "Masayuki Suzuki",
    "animeTitle": "Kaguya-sama wa Kokurasetai: Otona e no Kaidan",
    "audioUrl": "https://a.animethemes.moe/KaguyaSamaWaKokurasetaiOtonaENoKaidan-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/small-cover/WC2qEglUko0htk98oCFICmV1WZxElIU6enITJnGy.avif",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "spyxfamily-op1",
    "title": "Mixed Nuts (OP1)",
    "artist": "Official HIGE DANdism",
    "animeTitle": "Spy x Family",
    "audioUrl": "https://a.animethemes.moe/SpyXFamily-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/s481umbdgWIWwMDPwzPgu1EZEvxKq4Zy2coxs255.png",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "bocchitherock-op1",
    "title": "Seishun Complex (OP1)",
    "artist": "Kessoku Band",
    "animeTitle": "Bocchi the Rock!",
    "audioUrl": "https://a.animethemes.moe/BocchiTheRock-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/YpJswECL8eyNiPJIMyBDbzencxzgy1JlgwgLU7xH.png",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "cyberpunkedgerunners-op1",
    "title": "This Fffire (OP1)",
    "artist": "Franz Ferdinand",
    "animeTitle": "Cyberpunk: Edgerunners",
    "audioUrl": "https://a.animethemes.moe/CyberpunkEdgerunners-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/QalPZOn9JlcjCZX9KXDay5V6XRH3dDTrYhykTdZt.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "sousounofrieren-op1",
    "title": "Yuusha (OP1)",
    "artist": "YOASOBI",
    "animeTitle": "Sousou no Frieren",
    "audioUrl": "https://a.animethemes.moe/SousouNoFrieren-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/h30TFwGNgWbYB8uBi2VjoCt0FACcvq5H2KTesWLt.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "sousounofrieren-op2",
    "title": "Haru (OP2)",
    "artist": "Yorushika",
    "animeTitle": "Sousou no Frieren",
    "audioUrl": "https://a.animethemes.moe/SousouNoFrieren-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/h30TFwGNgWbYB8uBi2VjoCt0FACcvq5H2KTesWLt.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "recent"
  },
  {
    "id": "oshinoko-op1",
    "title": "Idol (OP1)",
    "artist": "YOASOBI",
    "animeTitle": "[Oshi no Ko]",
    "audioUrl": "https://a.animethemes.moe/OshiNoKo-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/KZ2cO6LbgXo2oevDokEfaaPxxUt9uL6989SL3DxD.png",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "shigatsuwakiminouso-op1",
    "title": "Hikaru nara (OP1)",
    "artist": "Goose House",
    "animeTitle": "Shigatsu wa Kimi no Uso",
    "audioUrl": "https://a.animethemes.moe/KimiUso-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/IACYfE1FmR1HtjMfiKNWiSB0uwMChbaN4mxNL29i.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "shigatsuwakiminouso-op2",
    "title": "Nanairo Symphony (OP2)",
    "artist": "Coala Mode.",
    "animeTitle": "Shigatsu wa Kimi no Uso",
    "audioUrl": "https://a.animethemes.moe/KimiUso-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/IACYfE1FmR1HtjMfiKNWiSB0uwMChbaN4mxNL29i.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "bokudakegainaimachi-op1",
    "title": "Re:Re: (OP1)",
    "artist": "Asian Kung-Fu Generation",
    "animeTitle": "Boku dake ga Inai Machi",
    "audioUrl": "https://a.animethemes.moe/BokuDakeGaInaiMachi-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/qiHWDekjW2vRG23gigem3wqYweH7KU163gFbpnaV.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "mushokutenseiiiiisekaiittarahonkidasu-op1",
    "title": "Ketsui no Uta (OP1)",
    "artist": "Yuiko Oohara",
    "animeTitle": "Mushoku Tensei III: Isekai Ittara Honki Dasu",
    "audioUrl": "https://a.animethemes.moe/MushokuTenseiS3-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/small-cover/E9z6r5bwQCMLmZhw7RKll9g1sauOcwPEUslB3Zyy.avif",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "mushokutenseiiiiisekaiittarahonkidasu-op2",
    "title": "Mebuki no Uta (OP2)",
    "artist": "Yuiko Oohara",
    "animeTitle": "Mushoku Tensei III: Isekai Ittara Honki Dasu",
    "audioUrl": "https://a.animethemes.moe/MushokuTenseiS3-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/small-cover/E9z6r5bwQCMLmZhw7RKll9g1sauOcwPEUslB3Zyy.avif",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "mushokutenseiiiiisekaiittarahonkidasu-op3",
    "title": "Hikari no Uta (OP3)",
    "artist": "Yuiko Oohara",
    "animeTitle": "Mushoku Tensei III: Isekai Ittara Honki Dasu",
    "audioUrl": "https://a.animethemes.moe/MushokuTenseiS3-OP3.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/small-cover/E9z6r5bwQCMLmZhw7RKll9g1sauOcwPEUslB3Zyy.avif",
    "type": "OP",
    "slug": "OP3",
    "category": "shonen"
  },
  {
    "id": "overlord-op1",
    "title": "Clattanoia (OP1)",
    "artist": "OxT",
    "animeTitle": "Overlord",
    "audioUrl": "https://a.animethemes.moe/Overlord-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/fbPWhD9ewuWOwk4VfyoprTtKXUFbXhLzMFiBDlEB.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "tenseishitaraslimedattaken-op1",
    "title": "Nameless Story (OP1)",
    "artist": "Takuma Terashima",
    "animeTitle": "Tensei shitara Slime Datta Ken",
    "audioUrl": "https://a.animethemes.moe/Tensura-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/2xOHLl0dZRWbuib5QOgcW6JKLeH4oN5CLSZAnyaR.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "tenseishitaraslimedattaken-op2",
    "title": "Meguru Mono (OP2)",
    "artist": "Takuma Terashima",
    "animeTitle": "Tensei shitara Slime Datta Ken",
    "audioUrl": "https://a.animethemes.moe/Tensura-OP2-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/2xOHLl0dZRWbuib5QOgcW6JKLeH4oN5CLSZAnyaR.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  },
  {
    "id": "kagenojitsuryokushaninaritakute-op1",
    "title": "HIGHEST (OP1)",
    "artist": "OxT",
    "animeTitle": "Kage no Jitsuryokusha ni Naritakute!",
    "audioUrl": "https://a.animethemes.moe/ShadowGarden-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/0a6bFrsvYY9xi5gTwZK1aoYmJFmp6z6eJyWpqKhO.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "shangrilafrontierkusogehunterkamigeniidomantosu-op1",
    "title": "BROKEN GAMES (OP1)",
    "artist": "FZMZ",
    "animeTitle": "Shangri-La Frontier: Kusoge Hunter, Kamige ni Idoman to su",
    "audioUrl": "https://a.animethemes.moe/ShangrilaFrontier-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Xi95n62JXvVRaLhEXraVR1ZBPJM2pUQBC18WgCvq.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "shangrilafrontierkusogehunterkamigeniidomantosu-op2",
    "title": "Danger Danger (OP2)",
    "artist": "Reol",
    "animeTitle": "Shangri-La Frontier: Kusoge Hunter, Kamige ni Idoman to su",
    "audioUrl": "https://a.animethemes.moe/ShangrilaFrontier-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/Xi95n62JXvVRaLhEXraVR1ZBPJM2pUQBC18WgCvq.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "recent"
  },
  {
    "id": "windbreaker-op1",
    "title": "Zettai Reido (OP1)",
    "artist": "natori",
    "animeTitle": "Wind Breaker",
    "audioUrl": "https://a.animethemes.moe/WindBreaker-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/v0g6kUQBiKfLX0c7eZvOah4OLKPMqESZLsiSL3uv.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "dungeonmeshi-op1",
    "title": "Sleep Walking Orchestra (OP1)",
    "artist": "BUMP OF CHICKEN",
    "animeTitle": "Dungeon Meshi",
    "audioUrl": "https://a.animethemes.moe/DungeonMeshi-OP1-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/z7f3jk0LRPIUqO7MKxZ5p7yQTTjHgRY8kGr4WuRY.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "recent"
  },
  {
    "id": "dungeonmeshi-op2",
    "title": "Unmei (OP2)",
    "artist": "sumika",
    "animeTitle": "Dungeon Meshi",
    "audioUrl": "https://a.animethemes.moe/DungeonMeshi-OP2-NCBD1080.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/z7f3jk0LRPIUqO7MKxZ5p7yQTTjHgRY8kGr4WuRY.jpg",
    "type": "OP",
    "slug": "OP2",
    "category": "recent"
  },
  {
    "id": "steinsgate-op1",
    "title": "Hacking to the Gate (OP1)",
    "artist": "Kanako Itou",
    "animeTitle": "Steins;Gate",
    "audioUrl": "https://a.animethemes.moe/SteinsGate-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/F2y3VFbZpLc1q06wndCkRa02jmU8qQnhtNOAnDv0.jpg",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "angelbeats-op1",
    "title": "My Soul, Your Beats! (OP1)",
    "artist": "Lia",
    "animeTitle": "Angel Beats!",
    "audioUrl": "https://a.animethemes.moe/AngelBeats-OP1.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/87jrHcYYj2dhrR5ToxgXhOFif0F54jq9BPfKleeF.png",
    "type": "OP",
    "slug": "OP1",
    "category": "shonen"
  },
  {
    "id": "angelbeats-op2",
    "title": "My Soul, Your Beats! (OP2)",
    "artist": "LiSA",
    "animeTitle": "Angel Beats!",
    "audioUrl": "https://a.animethemes.moe/AngelBeats-OP2.ogg",
    "coverUrl": "https://pub-92474f7785774e91a790e086dfa6b2ef.r2.dev/anime/large-cover/87jrHcYYj2dhrR5ToxgXhOFif0F54jq9BPfKleeF.png",
    "type": "OP",
    "slug": "OP2",
    "category": "shonen"
  }
];

// In-memory cache for searches
const searchCache = new Map<string, RadioTrack[]>();

/**
 * Searches AnimeThemes API for any anime name and extracts openings & endings with audio streams.
 */
export async function searchAnimeOpenings(query: string): Promise<RadioTrack[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  if (searchCache.has(cleanQuery)) {
    return searchCache.get(cleanQuery)!;
  }

  try {
    const url = `https://api.animethemes.moe/search?q=${encodeURIComponent(query)}&fields[search]=anime&include[anime]=animethemes.song.artists,animethemes.animethemeentries.videos.audio,images`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      console.warn('AnimeThemes API error status:', res.status);
      return [];
    }

    const data = await res.json();
    const tracks: RadioTrack[] = [];

    (data.search?.anime || []).slice(0, 5).forEach((anime: any) => {
      const cover = anime.images?.[0]?.link || '';
      (anime.animethemes || []).forEach((theme: any) => {
        const entry = theme.animethemeentries?.[0];
        const audioUrl = entry?.videos?.[0]?.audio?.link || entry?.videos?.[0]?.link;

        if (audioUrl) {
          tracks.push({
            id: `${anime.slug || 'anime'}-${theme.slug || 'theme'}-${entry?.id || Math.random().toString(36).substring(7)}`,
            title: theme.song?.title ? `${theme.song.title} (${theme.slug || 'Tema'})` : `${theme.slug || 'Tema'} - ${anime.name}`,
            artist: theme.song?.artists?.[0]?.name || anime.name,
            animeTitle: anime.name,
            audioUrl: audioUrl,
            coverUrl: cover,
            type: theme.type === 'ED' ? 'ED' : 'OP',
            slug: theme.slug,
          });
        }
      });
    });

    searchCache.set(cleanQuery, tracks);
    return tracks;
  } catch (error) {
    console.error('Failed to search anime themes:', error);
    return [];
  }
}
