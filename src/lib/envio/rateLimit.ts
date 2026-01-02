/**
 * Rate Limiter for Envio API Calls
 * 
 * Implements token bucket algorithm to prevent API rate limit errors.
 */

class RateLimiter {
  private tokens: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second
  private lastRefill: number;

  constructor(maxTokens: number = 100, refillRate: number = 10) {
    this.tokens = maxTokens;
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // seconds
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Try to consume a token
   * Returns true if successful, false if rate limited
   */
  tryConsume(cost: number = 1): boolean {
    this.refill();

    if (this.tokens >= cost) {
      this.tokens -= cost;
      return true;
    }

    return false;
  }

  /**
   * Wait until a token is available (with timeout)
   */
  async waitForToken(cost: number = 1, timeoutMs: number = 5000): Promise<void> {
    const startTime = Date.now();

    while (!this.tryConsume(cost)) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error('Rate limit timeout exceeded');
      }

      // Wait 100ms before trying again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus() {
    this.refill();
    return {
      tokens: Math.floor(this.tokens),
      maxTokens: this.maxTokens,
      refillRate: this.refillRate,
    };
  }
}

// Singleton instance
export const envioRateLimiter = new RateLimiter(
  parseInt(process.env.API_RATE_LIMIT || '100'),
  10 // 10 requests per second
);

/**
 * Execute a function with rate limiting
 */
export async function rateLimitedCall<T>(
  fn: () => Promise<T>,
  cost: number = 1
): Promise<T> {
  await envioRateLimiter.waitForToken(cost);
  return fn();
}
