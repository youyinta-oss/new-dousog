import { logger } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 30000,
};

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | undefined;
  let delay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt > opts.maxRetries) break;

      logger.warn(`重试 ${attempt}/${opts.maxRetries}: ${lastError.message}，${delay}ms 后重试`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
    }
  }

  throw lastError;
}
