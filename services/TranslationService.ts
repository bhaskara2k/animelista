import { translateText as translateWithGemini } from './GeminiService';

const CACHE_PREFIX = 'animelista_synopsis_pt_';

/**
 * Strips HTML tags from text.
 */
const cleanHtml = (html?: string): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

/**
 * Translates a single text chunk (up to 450 characters) using MyMemory API.
 */
const translateChunkWithMyMemory = async (text: string): Promise<string> => {
  if (!text || text.trim() === '') return '';

  const encoded = encodeURIComponent(text.trim());
  const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|pt-BR`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return text;

    const data = await res.json();
    const translated = data?.responseData?.translatedText;

    if (translated && typeof translated === 'string' && !translated.toLowerCase().includes('quota exceeded')) {
      return translated;
    }
    return text;
  } catch (e) {
    clearTimeout(timeoutId);
    return text;
  }
};

/**
 * Translates full English text by dividing it into paragraphs and chunks,
 * then recombining with proper line breaks.
 */
export const translateWithFreeTranslator = async (fullText: string): Promise<string> => {
  if (!fullText || fullText.trim() === '') return '';

  const paragraphs = fullText.split(/\n+/);
  const translatedParagraphs: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // If paragraph is short, translate directly
    if (trimmed.length <= 400) {
      const translated = await translateChunkWithMyMemory(trimmed);
      translatedParagraphs.push(translated);
    } else {
      // Split into sentences if paragraph is too long for 1 request
      const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [trimmed];
      let currentChunk = '';
      const chunkTranslations: string[] = [];

      for (const sentence of sentences) {
        if ((currentChunk + ' ' + sentence).length > 400 && currentChunk) {
          const res = await translateChunkWithMyMemory(currentChunk);
          chunkTranslations.push(res);
          currentChunk = sentence;
        } else {
          currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
        }
      }

      if (currentChunk) {
        const res = await translateChunkWithMyMemory(currentChunk);
        chunkTranslations.push(res);
      }

      translatedParagraphs.push(chunkTranslations.join(' '));
    }
  }

  return translatedParagraphs.join('\n\n');
};

/**
 * Tries to fetch official Portuguese overview from TMDB.
 */
const fetchSynopsisFromTmdb = async (title: string, tmdbKey?: string): Promise<string | null> => {
  const key = tmdbKey || (typeof window !== 'undefined' ? localStorage.getItem('animelista_tmdb_key') : null);
  if (!key) return null;

  try {
    const cleanTitle = title.replace(/\s*\(TV\)\s*/i, '').trim();
    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(cleanTitle)}&language=pt-BR&api_key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const firstHit = data?.results?.[0];
    if (firstHit && firstHit.overview && firstHit.overview.trim().length > 30) {
      return firstHit.overview.trim();
    }
    return null;
  } catch (e) {
    return null;
  }
};

/**
 * Main coordinator function that provides Portuguese synopsis:
 * 1. Checks localStorage cache.
 * 2. Tries TMDB (Option 3).
 * 3. Tries Gemini (if configured).
 * 4. Uses free neural translator fallback (Option 1).
 * 5. Caches the result in localStorage.
 */
export const getPortugueseSynopsis = async (
  animeId: string | number,
  title: string,
  englishSynopsis?: string
): Promise<string> => {
  const cacheKey = `${CACHE_PREFIX}${animeId}`;

  // 1. Check local storage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached && cached.trim().length > 0) {
      return cached;
    }
  } catch (e) {}

  const rawDescription = cleanHtml(englishSynopsis);
  if (!rawDescription) return '';

  // 2. Try Option 3: TMDB official PT-BR synopsis
  try {
    const tmdbSynopsis = await fetchSynopsisFromTmdb(title);
    if (tmdbSynopsis) {
      try {
        localStorage.setItem(cacheKey, tmdbSynopsis);
      } catch (e) {}
      return tmdbSynopsis;
    }
  } catch (e) {}

  // 3. Try Gemini (if configured)
  try {
    const geminiKey = process.env.API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('animelista_gemini_key') : null);
    if (geminiKey) {
      const geminiResult = await translateWithGemini(rawDescription, 'pt-BR');
      if (geminiResult && geminiResult !== rawDescription) {
        try {
          localStorage.setItem(cacheKey, geminiResult);
        } catch (e) {}
        return geminiResult;
      }
    }
  } catch (e) {}

  // 4. Try Option 1: Free Neural Translation (MyMemory chunking)
  try {
    const freeTranslation = await translateWithFreeTranslator(rawDescription);
    if (freeTranslation && freeTranslation.trim().length > 0) {
      try {
        localStorage.setItem(cacheKey, freeTranslation);
      } catch (e) {}
      return freeTranslation;
    }
  } catch (e) {
    console.warn('Free translation fallback failed:', e);
  }

  // 5. Fallback to original text if everything fails
  return rawDescription;
};
