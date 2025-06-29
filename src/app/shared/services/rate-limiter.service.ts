import { Injectable } from '@angular/core';

interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

interface RequestRecord {
  timestamp: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class RateLimiterService {
  private requestHistory = new Map<string, RequestRecord>();
  
  // Default rate limiting configuration
  private defaultConfig: RateLimitConfig = {
    maxRequests: 10, // 10 requests
    timeWindow: 60000 // per minute
  };

  /**
   * Check if a request is allowed based on rate limiting
   * @param key - Unique identifier for the rate limit (e.g., 'weather-api', 'user-123')
   * @param config - Optional custom rate limit configuration
   * @returns true if request is allowed, false if rate limited
   */
  isAllowed(key: string, config?: Partial<RateLimitConfig>): boolean {
    const rateConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    const record = this.requestHistory.get(key);

    if (!record) {
      // First request for this key
      this.requestHistory.set(key, { timestamp: now, count: 1 });
      return true;
    }

    // Check if we're still within the time window
    if (now - record.timestamp < rateConfig.timeWindow) {
      // Within time window, check if we haven't exceeded the limit
      if (record.count < rateConfig.maxRequests) {
        record.count++;
        return true;
      } else {
        // Rate limit exceeded
        return false;
      }
    } else {
      // Time window has passed, reset the counter
      this.requestHistory.set(key, { timestamp: now, count: 1 });
      return true;
    }
  }

  /**
   * Get remaining requests for a key
   * @param key - Unique identifier for the rate limit
   * @param config - Optional custom rate limit configuration
   * @returns number of remaining requests
   */
  getRemainingRequests(key: string, config?: Partial<RateLimitConfig>): number {
    const rateConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    const record = this.requestHistory.get(key);

    if (!record) {
      return rateConfig.maxRequests;
    }

    // Check if we're still within the time window
    if (now - record.timestamp < rateConfig.timeWindow) {
      return Math.max(0, rateConfig.maxRequests - record.count);
    } else {
      // Time window has passed, all requests are available
      return rateConfig.maxRequests;
    }
  }

  /**
   * Get time until rate limit resets
   * @param key - Unique identifier for the rate limit
   * @param config - Optional custom rate limit configuration
   * @returns time in milliseconds until reset, or 0 if not rate limited
   */
  getTimeUntilReset(key: string, config?: Partial<RateLimitConfig>): number {
    const rateConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    const record = this.requestHistory.get(key);

    if (!record) {
      return 0;
    }

    const timeElapsed = now - record.timestamp;
    if (timeElapsed < rateConfig.timeWindow) {
      return rateConfig.timeWindow - timeElapsed;
    }

    return 0;
  }

  /**
   * Clear rate limit history for a specific key
   * @param key - Unique identifier for the rate limit
   */
  clearHistory(key: string): void {
    this.requestHistory.delete(key);
  }

  /**
   * Clear all rate limit history
   */
  clearAllHistory(): void {
    this.requestHistory.clear();
  }

  /**
   * Get current rate limit status for a key
   * @param key - Unique identifier for the rate limit
   * @param config - Optional custom rate limit configuration
   * @returns object with rate limit status information
   */
  getStatus(key: string, config?: Partial<RateLimitConfig>): {
    isAllowed: boolean;
    remainingRequests: number;
    timeUntilReset: number;
    isRateLimited: boolean;
  } {
    const isAllowed = this.isAllowed(key, config);
    const remainingRequests = this.getRemainingRequests(key, config);
    const timeUntilReset = this.getTimeUntilReset(key, config);

    return {
      isAllowed,
      remainingRequests,
      timeUntilReset,
      isRateLimited: !isAllowed
    };
  }
} 