
// api/anilist.ts
// Este arquivo atuará como um proxy para a API do AniList para evitar problemas de CORS.
// O Vercel irá implantar isso automaticamente como uma Serverless Function.

// Esta é a sintaxe para uma Edge Function do Vercel, que é mais rápida e eficiente.
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const ANILIST_API_URL = 'https://graphql.anilist.co';

  // 1. Apenas encaminhe requisições POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Pegue o corpo (query e variáveis) da requisição que nosso frontend enviou
    const body = await request.json();

    // 3. Faça a requisição real para a API do AniList a partir do servidor
    const apiResponse = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // 4. Verifique se a resposta da AniList foi bem-sucedida
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      // Retorne o erro da AniList para nosso frontend
      return new Response(errorText, {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Pegue a resposta JSON da AniList
    const data = await apiResponse.json();

    // 6. Envie os dados de volta para o nosso frontend
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Adicionar cabeçalhos CORS para permitir que nosso frontend leia a resposta
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error: any) {
    console.error('Erro no proxy da API AniList:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
