
import { AniListMedia, AniListSearchResult, AniListMediaSort, AniListSeason, AniListPageInfo, AniListMediaFormat, AniListMediaStatus, AniListCharacter, AniListCharacterSearchResult } from '../types';

// O URL agora aponta para nossa própria API de proxy (Serverless Function)
const ANILIST_API_URL = '/api/anilist';

const ANIME_QUERY = `
query (
    $search: String, 
    $page: Int, 
    $perPage: Int, 
    $type: MediaType, 
    $sort: [MediaSort],
    $season: MediaSeason,
    $seasonYear: Int,
    $status: MediaStatus,
    $genre_in: [String],
    $format_in: [MediaFormat],
    $averageScore_greater: Int 
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(
        search: $search, 
        type: $type, 
        sort: $sort, 
        isAdult: false,
        season: $season,
        seasonYear: $seasonYear,
        status: $status,
        genre_in: $genre_in,
        format_in: $format_in,
        averageScore_greater: $averageScore_greater
    ) {
      id
      title {
        romaji
        english
        native
      }
      description(asHtml: false) 
      format
      status
      episodes
      duration
      startDate { year month day }
      endDate { year month day }
      season
      seasonYear
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      genres
      averageScore
      studios(isMain: true) {
        nodes {
          name
          isAnimationStudio
        }
      }
      externalLinks {
        id
        url
        site
        type
        language
      }
      siteUrl
    }
  }
}
`;

const CHARACTER_SEARCH_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    characters(search: $search, sort: [SEARCH_MATCH, FAVOURITES_DESC]) {
      id
      name {
        full
        native
      }
      image {
        large
        medium
      }
    }
  }
}
`;


interface AniListResponse {
  data: AniListSearchResult;
  errors?: Array<{ message: string; status: number; locations: any[] }>;
}

interface AniListCharacterResponse {
  data: AniListCharacterSearchResult;
  errors?: Array<{ message: string; status: number; locations: any[] }>;
}

export interface FetchAniListParams {
  searchTerm?: string;
  page?: number;
  perPage?: number;
  sort?: AniListMediaSort[];
  season?: AniListSeason;
  seasonYear?: number;
  status?: AniListMediaStatus; 
  genres?: string[];
  formats?: AniListMediaFormat[];
  minScore?: number; // 0-100
}

export const fetchAniListMedia = async (params: FetchAniListParams): Promise<{ media: AniListMedia[], pageInfo: AniListPageInfo }> => {
  const {
    searchTerm,
    page = 1,
    perPage = 10, // Default for general fetching, carousels might use more
    sort = ['POPULARITY_DESC'],
    season,
    seasonYear,
    status,
    genres,
    formats,
    minScore
  } = params;
  
  const variables: any = {
    page: page,
    perPage: perPage,
    type: 'ANIME',
    sort: sort,
  };

  if (searchTerm && searchTerm.trim() !== '') {
    variables.search = searchTerm;
  }
  if (season) {
    variables.season = season;
  }
  if (seasonYear) {
    variables.seasonYear = seasonYear;
  }
  if (status) {
    variables.status = status;
  }
  if (genres && genres.length > 0) {
    variables.genre_in = genres;
  }
  if (formats && formats.length > 0) {
    variables.format_in = formats;
  }
  if (minScore && minScore > 0) {
    variables.averageScore_greater = minScore;
  }


  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Agora enviamos a query e as variáveis para o nosso próprio backend
      body: JSON.stringify({
        query: ANIME_QUERY,
        variables: variables,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Erro no proxy da API AniList:", { status: response.status, statusText: response.statusText, body: errorBody });
      throw new Error(`O proxy da API AniList falhou com o status ${response.status}: ${response.statusText}. Corpo: ${errorBody}`);
    }

    const jsonResponse: AniListResponse = await response.json();

    if (jsonResponse.errors) {
      console.error("Erros GraphQL da API AniList (via proxy):", { errors: jsonResponse.errors, variables });
      throw new Error(`Erro GraphQL da API AniList: ${jsonResponse.errors.map(e => e.message).join(', ')}`);
    }

    if (jsonResponse.data && jsonResponse.data.Page) {
      return {
        media: jsonResponse.data.Page.media || [],
        pageInfo: jsonResponse.data.Page.pageInfo || { total: 0, currentPage: 1, lastPage:1, hasNextPage: false, perPage: perPage}
      };
    }

    return { media: [], pageInfo: { total: 0, currentPage: 1, lastPage:1, hasNextPage: false, perPage: perPage} };
  } catch (error: any) {
    console.error("Erro ao buscar da API AniList via proxy. URL:", ANILIST_API_URL, "Variáveis:", JSON.stringify(variables), "Detalhes do erro:", error);
    // Erros de rede agora serão entre nosso frontend e nosso backend
    if (error instanceof TypeError && error.message.toLowerCase().includes("failed to fetch")) {
        throw new Error(`Erro de rede ao contatar nosso proxy: ${error.message}. Verifique a conexão com a internet e o status do servidor.`);
    }
    throw new Error(`Falha ao processar a requisição da API AniList. Erro original: ${error.message || String(error)}`);
  }
};

// Original searchAniList for AnimeForm (typically small perPage, specific search match)
export const searchAniList = async (searchTerm: string, page: number = 1, perPage: number = 10): Promise<AniListMedia[]> => {
    const result = await fetchAniListMedia({ searchTerm, page, perPage, sort: ['SEARCH_MATCH', 'POPULARITY_DESC']});
    return result.media;
};

export const searchAniListCharacters = async (searchTerm: string, page: number = 1, perPage: number = 18): Promise<AniListCharacter[]> => {
    if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
    }

    const variables = {
        search: searchTerm,
        page,
        perPage,
    };

    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: CHARACTER_SEARCH_QUERY,
                variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`Busca de personagens via proxy falhou com status ${response.status}`);
        }

        const jsonResponse: AniListCharacterResponse = await response.json();

        if (jsonResponse.errors) {
            throw new Error(`Erro GraphQL: ${jsonResponse.errors.map(e => e.message).join(', ')}`);
        }

        return jsonResponse.data?.Page?.characters || [];

    } catch (error: any) {
        console.error("Erro ao buscar personagens da AniList via proxy:", error);
        throw new Error(`Falha ao buscar personagens. ${error.message}`);
    }
};
