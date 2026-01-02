/**
 * Envio GraphQL Client with Production-Grade Error Handling
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Rate limiting to prevent API quota exhaustion
 * - Caching to reduce API calls
 * - Graceful degradation to mock data
 * - Circuit breaker pattern for resilience
 */

import { GraphQLClient } from 'graphql-request';
import { envioCache, cachedQuery } from './cache';
import { rateLimitedCall } from './rateLimit';

const ENVIO_API_URL = process.env.NEXT_PUBLIC_ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.NEXT_PUBLIC_ENVIO_API_KEY || '';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Circuit breaker state
let circuitBreakerOpen = false;
let circuitBreakerResetTime = 0;
const CIRCUIT_BREAKER_THRESHOLD = 5; // failures before opening
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 60 seconds
let consecutiveFailures = 0;

export function getEnvioClient(): GraphQLClient {
  if (!ENVIO_API_URL) {
    throw new Error('Envio API URL not configured. Set NEXT_PUBLIC_ENVIO_API_URL in .env.local');
  }

  return new GraphQLClient(ENVIO_API_URL, {
    headers: {
      'Authorization': ENVIO_API_KEY ? `Bearer ${ENVIO_API_KEY}` : '',
      'Content-Type': 'application/json',
    },
    // Timeout after 10 seconds
    timeout: 10000,
  });
}

/**
 * Execute GraphQL query with full production features:
 * - Caching
 * - Rate limiting
 * - Retry logic
 * - Circuit breaker
 * - Error handling
 */
export async function queryEnvio<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    cache?: boolean;
    cacheTTL?: number;
    retries?: number;
    useMockOnFailure?: boolean;
  }
): Promise<T> {
  const {
    cache = true,
    cacheTTL = 60000, // 60 seconds
    retries = 3,
    useMockOnFailure = USE_MOCK_DATA,
  } = options || {};

  // Generate cache key
  const cacheKey = cache ? `envio:${JSON.stringify({ query, variables })}` : '';

  // Check circuit breaker
  if (circuitBreakerOpen) {
    const now = Date.now();
    if (now < circuitBreakerResetTime) {
      console.warn('🚫 Circuit breaker open - Envio temporarily unavailable');
      if (useMockOnFailure) {
        return getMockData<T>(query);
      }
      throw new Error('Envio service temporarily unavailable (circuit breaker open)');
    } else {
      // Reset circuit breaker
      console.log('🔄 Resetting circuit breaker...');
      circuitBreakerOpen = false;
      consecutiveFailures = 0;
    }
  }

  // Try cached data first
  if (cache && cacheKey) {
    const cached = envioCache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Execute query with rate limiting and retries
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Rate limiting
      const data = await rateLimitedCall(async () => {
        const client = getEnvioClient();
        return client.request<T>(query, variables || {});
      });

      // Success - reset failure counter
      consecutiveFailures = 0;

      // Cache the result
      if (cache && cacheKey) {
        envioCache.set(cacheKey, data, cacheTTL);
      }

      return data;
    } catch (error: any) {
      lastError = error;
      
      console.error(`❌ Envio query failed (attempt ${attempt + 1}/${retries + 1}):`, error.message);

      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        break;
      }

      // Exponential backoff before retry
      if (attempt < retries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`⏳ Retrying in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }

  // All retries failed
  consecutiveFailures++;
  
  // Open circuit breaker if too many failures
  if (consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD) {
    console.error('🚨 Opening circuit breaker - too many Envio failures');
    circuitBreakerOpen = true;
    circuitBreakerResetTime = Date.now() + CIRCUIT_BREAKER_TIMEOUT;
  }

  // Fall back to mock data if enabled
  if (useMockOnFailure) {
    console.warn('⚠️  Falling back to mock data');
    return getMockData<T>(query);
  }

  throw lastError || new Error('Envio query failed');
}

/**
 * Check if Envio is available
 */
export async function checkEnvioHealth(): Promise<{
  available: boolean;
  latency?: number;
  error?: string;
}> {
  if (!ENVIO_API_URL) {
    return {
      available: false,
      error: 'Envio URL not configured',
    };
  }

  if (circuitBreakerOpen) {
    return {
      available: false,
      error: 'Circuit breaker open',
    };
  }

  const startTime = Date.now();
  
  try {
    // Simple health check query
    const client = getEnvioClient();
    await client.request(`{ __typename }`);
    
    const latency = Date.now() - startTime;
    
    return {
      available: true,
      latency,
    };
  } catch (error: any) {
    return {
      available: false,
      error: error.message,
    };
  }
}

/**
 * Get mock data based on query type
 * This provides graceful degradation when Envio is unavailable
 */
function getMockData<T>(query: string): T {
  // Import mock data dynamically to avoid circular dependencies
  const mockData = require('../mockData').default;
  
  // Parse query to determine what data to return
  if (query.includes('memoryPatterns')) {
    return mockData.patterns as T;
  }
  
  if (query.includes('walletRisk')) {
    return { walletRisk: mockData.walletRisk } as T;
  }
  
  if (query.includes('transactions')) {
    return mockData.transactions as T;
  }
  
  if (query.includes('permissions')) {
    return mockData.permissions as T;
  }
  
  // Default empty response
  return {} as T;
}

/**
 * Clear Envio cache
 */
export function clearEnvioCache(): void {
  envioCache.clear();
  console.log('🗑️  Envio cache cleared');
}

/**
 * Get Envio client statistics
 */
export function getEnvioStats() {
  return {
    cache: envioCache.getStats(),
    circuitBreaker: {
      open: circuitBreakerOpen,
      consecutiveFailures,
      resetTime: circuitBreakerResetTime,
    },
  };
}


