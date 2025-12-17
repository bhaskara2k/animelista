
import { AniListMedia, AniListSearchResult, AniListMediaSort, AniListSeason, AniListPageInfo, AniListMediaFormat, AniListMediaStatus, AniListCharacter, AniListCharacterSearchResult } from '../types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

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
      body: JSON.stringify({
        query: ANIME_QUERY,
        variables: variables,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("AniList API Error Response (not ok):", { status: response.status, statusText: response.statusText, body: errorBody, variables });
      throw new Error(`AniList API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
    }

    const jsonResponse: AniListResponse = await response.json();

    if (jsonResponse.errors) {
      console.error("AniList API GraphQL Errors:", { errors: jsonResponse.errors, variables });
      throw new Error(`GraphQL Error from AniList API: ${jsonResponse.errors.map(e => e.message).join(', ')}`);
    }

    if (jsonResponse.data && jsonResponse.data.Page) {
      return {
        media: jsonResponse.data.Page.media || [],
        pageInfo: jsonResponse.data.Page.pageInfo || { total: 0, currentPage: 1, lastPage:1, hasNextPage: false, perPage: perPage}
      };
    }

    return { media: [], pageInfo: { total: 0, currentPage: 1, lastPage:1, hasNextPage: false, perPage: perPage} };
  } catch (error: any) {
    console.error("Error fetching from AniList API. URL:", ANILIST_API_URL, "Variables:", JSON.stringify(variables), "Error Details:", error);
    if (error instanceof TypeError && error.message.toLowerCase().includes("failed to fetch")) {
        // This specific message often indicates network or CORS issues.
        throw new Error(`Network error or CORS issue: ${error.message}. Check browser console, network connectivity, and ensure the AniList API is accessible from your current origin. URL: ${ANILIST_API_URL}`);
    }
    // Re-throw other errors or a generic one
    throw new Error(`Failed to process AniList API request. Original error: ${error.message || String(error)}`);
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
            throw new Error(`AniList character search failed with status ${response.status}`);
        }

        const jsonResponse: AniListCharacterResponse = await response.json();

        if (jsonResponse.errors) {
            throw new Error(`GraphQL Error: ${jsonResponse.errors.map(e => e.message).join(', ')}`);
        }

        return jsonResponse.data?.Page?.characters || [];

    } catch (error: any) {
        console.error("Error fetching characters from AniList:", error);
        throw new Error(`Failed to search for characters. ${error.message}`);
    }
};
