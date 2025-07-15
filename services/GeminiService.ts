

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Anime, AnimeStatus, Recommendation } from '../types';

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

/**
 * Translates text to the specified target language using the Gemini API.
 * @param text The text to translate.
 * @param targetLang The target language code (e.g., "pt-BR" for Brazilian Portuguese).
 * @returns The translated text, or the original text if translation fails.
 */
export const translateText = async (text: string, targetLang: string = "pt-BR"): Promise<string> => {
  if (!text || text.trim() === "") {
    return "";
  }
  
  if (!process.env.API_KEY) {
    console.error("Gemini API key is not configured. Translation skipped.");
    return text; // Return original text if API key is missing
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


  const prompt = `Traduza a seguinte sinopse de anime para o português brasileiro, mantendo a formatação de parágrafos e o tom original. Evite adicionar qualquer comentário ou introdução sua, apenas forneça a tradução direta do texto. Texto original: "${text}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    const translatedText = response.text;

    if (translatedText && translatedText.trim() !== "") {
      return translatedText.trim();
    } else {
      console.warn("Gemini API returned empty translation for:", text);
      return text; // Fallback to original text if translation is empty
    }
  } catch (error) {
    console.error("Error translating text with Gemini API:", error);
    return text;
  }
};


/**
 * Generates personalized anime recommendations using the Gemini API based on the user's highly-rated animes.
 * @param animeList The user's full list of animes.
 * @returns A promise that resolves to an array of Recommendation objects.
 */
export const getRecommendations = async (animeList: Anime[]): Promise<Recommendation[]> => {
  if (!process.env.API_KEY) {
    throw new Error("A chave da API Gemini não está configurada.");
  }

  const topRatedAnimes = animeList
    .filter(a => a.status === AnimeStatus.COMPLETED && a.rating && a.rating >= 7)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 15)
    .map(a => ({ title: a.title, genres: a.genres?.join(', '), rating: a.rating }));

  if (topRatedAnimes.length < 3) {
    throw new Error("Você precisa ter pelo menos 3 animes completos com nota 7 ou superior para gerar recomendações.");
  }

  const prompt = `
    Com base na seguinte lista de animes que um usuário avaliou bem, sugira 5 outros animes que ele provavelmente gostaria.
    Forneça uma justificativa concisa e convincente para cada sugestão, explicando por que o usuário gostaria dela com base em seus gostos (gêneros, temas, etc.).
    Liste também os principais gêneros para cada anime recomendado.

    Animes que o usuário gostou:
    ${JSON.stringify(topRatedAnimes, null, 2)}

    O formato da resposta DEVE ser um array JSON ESTRITO e VÁLIDO.
    Cada objeto no array deve ter EXATAMENTE as seguintes chaves: "title" (string), "justification" (string), e "genres" (array de strings).
    Exemplo de um objeto: { "title": "Nome do Anime", "justification": "Justificativa...", "genres": ["Ação", "Aventura"] }
    
    IMPORTANTE:
    - Não inclua NENHUM texto, explicação ou formatação de markdown (como \`\`\`json) fora do array JSON. A resposta deve ser apenas o array JSON puro.
    - Certifique-se de que o JSON não contenha vírgulas finais (trailing commas).
  `;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData) && parsedData.every(item => 'title' in item && 'justification' in item && 'genres' in item)) {
      return parsedData as Recommendation[];
    } else {
      console.warn("Gemini returned invalid JSON structure", parsedData);
      throw new Error("Formato de JSON retornado pela IA é inválido.");
    }
  } catch (error: any) {
    console.error("Error generating recommendations with Gemini API:", error);
    if (error.message.includes("JSON")) {
       throw new Error("A IA retornou uma resposta em um formato inesperado. Tente novamente.");
    }
    throw new Error(`Falha ao se comunicar com a IA: ${error.message}`);
  }
};