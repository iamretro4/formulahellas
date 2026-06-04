/**
 * Shared cache module for quiz data
 * Reduces duplicate Sanity API calls across different routes
 */

interface CachedQuizData {
  data: any;
  timestamp: number;
  quizId?: string;
}

let quizDataCache: CachedQuizData | null = null;

/**
 * Get cached quiz data if it's still fresh
 * @param maxAge Maximum age in milliseconds (default: 30 seconds)
 * @returns Cached quiz data or null if expired/not found
 */
export function getCachedQuiz(maxAge: number = 30000): any | null {
  if (!quizDataCache) {
    return null;
  }

  const now = Date.now();
  const age = now - quizDataCache.timestamp;

  if (age < maxAge) {
    return quizDataCache.data;
  }

  // Cache expired
  return null;
}

/**
 * Set cached quiz data
 * @param data Quiz data to cache
 * @param quizId Optional quiz ID for cache invalidation
 */
export function setCachedQuiz(data: any, quizId?: string): void {
  quizDataCache = {
    data,
    timestamp: Date.now(),
    quizId,
  };
}

/**
 * Invalidate the cache (useful when quiz is activated/deactivated)
 */
export function invalidateQuizCache(): void {
  quizDataCache = null;
}

/**
 * Check if cache is near quiz start time and should be refreshed
 * @param scheduledStartTime Quiz scheduled start time
 * @param bufferMs Buffer time in milliseconds before quiz start (default: 2 minutes)
 * @returns true if cache should be refreshed
 */
export function shouldRefreshCache(scheduledStartTime: string | Date, bufferMs: number = 120000): boolean {
  if (!quizDataCache) {
    return true;
  }

  const startTime = new Date(scheduledStartTime).getTime();
  const now = Date.now();
  const timeUntilStart = startTime - now;

  // Refresh cache if we're within buffer time of quiz start
  if (timeUntilStart > 0 && timeUntilStart < bufferMs) {
    return true;
  }

  // Refresh cache if quiz should be active but we're not sure
  const quizDuration = 2 * 60 * 60 * 1000; // 2 hours
  const endTime = startTime + quizDuration;
  if (now >= startTime && now <= endTime) {
    // During active period, use shorter cache
    const age = now - quizDataCache.timestamp;
    return age >= 30000; // 30 seconds during active period
  }

  return false;
}
