import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.NEXT_PUBLIC_ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.NEXT_PUBLIC_ENVIO_API_KEY || '';

export function getEnvioClient(): GraphQLClient {
  if (!ENVIO_API_URL) {
    throw new Error('Envio API URL not configured');
  }

  return new GraphQLClient(ENVIO_API_URL, {
    headers: {
      'Authorization': ENVIO_API_KEY ? `Bearer ${ENVIO_API_KEY}` : '',
      'Content-Type': 'application/json',
    },
  });
}

export async function queryEnvio<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const client = getEnvioClient();
  return client.request<T>(query, variables);
}

