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
}

// 24/7 High-Quality Live Anime Web Radio Stations
export const LIVE_RADIO_STATIONS: RadioTrack[] = [
  {
    id: 'listen-moe-jpop',
    title: 'LISTEN.moe J-Pop & Anison',
    artist: 'Transmissão Ao Vivo 24/7',
    animeTitle: 'Rádio Anime Oficial',
    audioUrl: 'https://listen.moe/stream',
    coverUrl: 'https://listen.moe/_nuxt/img/logo.670be6a.png',
    isLiveRadio: true,
    type: 'RADIO',
  },
  {
    id: 'gensokyo-radio',
    title: 'Gensokyo Radio',
    artist: 'Trilhas & Músicas de Animes',
    animeTitle: 'Mundo dos Animes & Games',
    audioUrl: 'https://stream.gensokyoradio.net/1/',
    coverUrl: 'https://gensokyoradio.net/images/logo.png',
    isLiveRadio: true,
    type: 'RADIO',
  },
  {
    id: 'listen-moe-kpop',
    title: 'LISTEN.moe Asian Pop & OSTs',
    artist: 'Hits Asiáticos & Temas',
    animeTitle: 'Rádio 24 Horas',
    audioUrl: 'https://listen.moe/kpop/stream',
    coverUrl: 'https://listen.moe/_nuxt/img/logo.670be6a.png',
    isLiveRadio: true,
    type: 'RADIO',
  },
];

// Curated Collection of Legendary Anime Openings (with massive Black Clover focus)
export const ICONIC_OPENINGS: RadioTrack[] = [
  // --- Black Clover Hits ---
  {
    id: 'bc-op3',
    title: 'Black Rover (OP 3)',
    artist: 'Vickeblanka',
    animeTitle: 'Black Clover',
    audioUrl: 'https://a.animethemes.moe/BlackClover-OP3-NCBD1080.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-bU12jG2cfWNc.jpg',
    type: 'OP',
    slug: 'OP3',
  },
  {
    id: 'bc-op10',
    title: 'Black Catcher (OP 10)',
    artist: 'Vickeblanka',
    animeTitle: 'Black Clover',
    audioUrl: 'https://a.animethemes.moe/BlackClover-OP10.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-bU12jG2cfWNc.jpg',
    type: 'OP',
    slug: 'OP10',
  },
  {
    id: 'bc-op1',
    title: 'Haruka Mirai (OP 1)',
    artist: 'Kankaku Piero',
    animeTitle: 'Black Clover',
    audioUrl: 'https://a.animethemes.moe/BlackClover-OP1-NCBD1080.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-bU12jG2cfWNc.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  {
    id: 'bc-op13',
    title: 'Grandeur (OP 13)',
    artist: 'Snow Man',
    animeTitle: 'Black Clover',
    audioUrl: 'https://a.animethemes.moe/BlackClover-OP13.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-bU12jG2cfWNc.jpg',
    type: 'OP',
    slug: 'OP13',
  },
  {
    id: 'bc-op2',
    title: 'PAiNT it BLACK (OP 2)',
    artist: 'BiSH',
    animeTitle: 'Black Clover',
    audioUrl: 'https://a.animethemes.moe/BlackClover-OP2-NCBD1080.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-bU12jG2cfWNc.jpg',
    type: 'OP',
    slug: 'OP2',
  },
  {
    id: 'bc-op7',
    title: 'JUSTadICE (OP 7)',
    artist: 'Seiko Oomori',
    animeTitle: 'Black Clover',
    audioUrl: 'https://a.animethemes.moe/BlackClover-OP7-NCBD1080.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx97940-bU12jG2cfWNc.jpg',
    type: 'OP',
    slug: 'OP7',
  },
  // --- Solo Leveling ---
  {
    id: 'sl-op1',
    title: 'LEveL (OP 1)',
    artist: 'SawanoHiroyuki[nZk]:TXT',
    animeTitle: 'Solo Leveling',
    audioUrl: 'https://a.animethemes.moe/SoloLeveling-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-m1g5wtVsqia2.png',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Jujutsu Kaisen ---
  {
    id: 'jjk-op1',
    title: 'Kaikai Kitan (OP 1)',
    artist: 'Eve',
    animeTitle: 'Jujutsu Kaisen',
    audioUrl: 'https://a.animethemes.moe/JujutsuKaisen-OP1-NCBD1080.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  {
    id: 'jjk-op2-s2',
    title: 'SPECIALZ (OP 2 Shibuya)',
    artist: 'King Gnu',
    animeTitle: 'Jujutsu Kaisen Season 2',
    audioUrl: 'https://a.animethemes.moe/JujutsuKaisenS2-OP2.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145064-7QoRkmH98i6n.jpg',
    type: 'OP',
    slug: 'OP2',
  },
  // --- Shingeki no Kyojin ---
  {
    id: 'aot-op1',
    title: 'Guren no Yumiya (OP 1)',
    artist: 'Linked Horizon',
    animeTitle: 'Shingeki no Kyojin',
    audioUrl: 'https://a.animethemes.moe/ShingekiNoKyojin-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  {
    id: 'aot-op-rumbling',
    title: 'The Rumbling (Final Season)',
    artist: 'SiM',
    animeTitle: 'Shingeki no Kyojin Final',
    audioUrl: 'https://a.animethemes.moe/ShingekiNoKyojinS4Part2-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx131681-4b1f4g7i4yWd.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Naruto Shippuden ---
  {
    id: 'naruto-op16',
    title: 'Silhouette (OP 16)',
    artist: 'KANA-BOON',
    animeTitle: 'Naruto Shippuden',
    audioUrl: 'https://a.animethemes.moe/NarutoShippuuden-OP16.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-j7pr7uhSoL1w.jpg',
    type: 'OP',
    slug: 'OP16',
  },
  {
    id: 'naruto-op3',
    title: 'Blue Bird (OP 3)',
    artist: 'Ikimonogakari',
    animeTitle: 'Naruto Shippuden',
    audioUrl: 'https://a.animethemes.moe/NarutoShippuuden-OP3.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-j7pr7uhSoL1w.jpg',
    type: 'OP',
    slug: 'OP3',
  },
  // --- Demon Slayer ---
  {
    id: 'kny-op1',
    title: 'Gurenge (OP 1)',
    artist: 'LiSA',
    animeTitle: 'Demon Slayer (Kimetsu)',
    audioUrl: 'https://a.animethemes.moe/KimetsuNoYaiba-OP1-NCBD1080.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTDYxTr2.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  {
    id: 'kny-op-yuukaku',
    title: 'Zankyou Sanka (Distrito do Entretenimento)',
    artist: 'Aimer',
    animeTitle: 'Demon Slayer',
    audioUrl: 'https://a.animethemes.moe/KimetsuNoYaibaYuukakuHen-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx142329-a1b2c3d4.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Tokyo Ghoul ---
  {
    id: 'tg-op1',
    title: 'unravel (OP 1)',
    artist: 'TK from Ling tosite sigure',
    animeTitle: 'Tokyo Ghoul',
    audioUrl: 'https://a.animethemes.moe/TokyoGhoul-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20605-A1B2C3D4.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Hunter x Hunter ---
  {
    id: 'hxh-op1',
    title: 'departure! (OP 1)',
    artist: 'Masatoshi Ono',
    animeTitle: 'Hunter x Hunter (2011)',
    audioUrl: 'https://a.animethemes.moe/HunterHunter2011-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-sIpBfNdFfvL9.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- One Piece ---
  {
    id: 'op-op1',
    title: 'We Are! (OP 1)',
    artist: 'Hiroshi Kitadani',
    animeTitle: 'One Piece',
    audioUrl: 'https://a.animethemes.moe/OnePiece-OP1-NCDVD480.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-4w5E9u2Pj4yQ.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Bleach ---
  {
    id: 'bleach-op13',
    title: 'Ranbu no Melody (OP 13)',
    artist: 'SID',
    animeTitle: 'Bleach',
    audioUrl: 'https://a.animethemes.moe/Bleach-OP13.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-e771k3M1.jpg',
    type: 'OP',
    slug: 'OP13',
  },
  // --- Chainsaw Man ---
  {
    id: 'csm-op1',
    title: 'KICK BACK (OP 1)',
    artist: 'Kenshi Yonezu',
    animeTitle: 'Chainsaw Man',
    audioUrl: 'https://a.animethemes.moe/ChainsawMan-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-0hPjZ3n.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Oshi no Ko ---
  {
    id: 'onk-op1',
    title: 'Idol (OP 1)',
    artist: 'YOASOBI',
    animeTitle: 'Oshi no Ko',
    audioUrl: 'https://a.animethemes.moe/OshiNoKo-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx150672-8v2w1j.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Frieren ---
  {
    id: 'frieren-op1',
    title: 'Yuusha (OP 1)',
    artist: 'YOASOBI',
    animeTitle: 'Frieren',
    audioUrl: 'https://a.animethemes.moe/SousouNoFrieren-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-k2j1h.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Fullmetal Alchemist: Brotherhood ---
  {
    id: 'fmab-op1',
    title: 'Again (OP 1)',
    artist: 'YUI',
    animeTitle: 'Fullmetal Alchemist: Brotherhood',
    audioUrl: 'https://a.animethemes.moe/FullmetalAlchemistBrotherhood-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-K4j2l.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Dragon Ball Z ---
  {
    id: 'dbz-op1',
    title: 'CHA-LA HEAD-CHA-LA (OP 1)',
    artist: 'Hironobu Kageyama',
    animeTitle: 'Dragon Ball Z',
    audioUrl: 'https://a.animethemes.moe/DragonBallZ-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx813-j1k2l.jpg',
    type: 'OP',
    slug: 'OP1',
  },
  // --- Death Note ---
  {
    id: 'dn-op1',
    title: 'The WORLD (OP 1)',
    artist: 'Nightmare',
    animeTitle: 'Death Note',
    audioUrl: 'https://a.animethemes.moe/DeathNote-OP1.ogg',
    coverUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-l2k3j.jpg',
    type: 'OP',
    slug: 'OP1',
  },
];

// In-memory cache for AnimeThemes search results
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
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      console.warn('AnimeThemes API error status:', res.status);
      return [];
    }

    const data = await res.json();
    const tracks: RadioTrack[] = [];

    (data.search?.anime || []).slice(0, 4).forEach((anime: any) => {
      const cover = anime.images?.[0]?.link || '';
      (anime.animethemes || []).forEach((theme: any) => {
        const entry = theme.animethemeentries?.[0];
        const audioUrl = entry?.videos?.[0]?.audio?.link || entry?.videos?.[0]?.link;

        if (audioUrl) {
          tracks.push({
            id: `${anime.slug || 'anime'}-${theme.slug || 'theme'}-${entry?.id || Math.random().toString(36).substring(7)}`,
            title: theme.song?.title || `${theme.slug || 'Tema'} - ${anime.name}`,
            artist: theme.song?.artists?.[0]?.name || 'Tema Original',
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
