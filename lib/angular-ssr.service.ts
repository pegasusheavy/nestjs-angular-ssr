import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InMemoryCacheStorage } from './cache/in-memory-cache-storage';
import { UrlCacheKeyGenerator } from './cache/url-cache-key-generator';
import { ANGULAR_SSR_OPTIONS } from './tokens';
import         {
  type AngularSSRModuleOptions,
  type CacheOptions,
  type CacheStorage,
  type CacheKeyGenerator,
} from './interfaces';
import         { type AngularAppEngine } from '@angular/ssr';
import         { type Request, type Response } from 'express';

/**
 * Default cache expiration time in milliseconds (1 minute)
 */
export const DEFAULT_CACHE_EXPIRATION_TIME = 60_000;

@Injectable()
export class AngularSSRService implements OnModuleInit {
  private readonly logger = new Logger(AngularSSRService.name);
  private angularApp: AngularAppEngine | null = null;

  private readonly cacheEnabled: boolean;
  private readonly cacheStorage: CacheStorage;
  private readonly cacheKeyGenerator: CacheKeyGenerator;
  private readonly cacheExpiresIn: number;

  constructor(
    @Inject(ANGULAR_SSR_OPTIONS)
    private readonly options: AngularSSRModuleOptions,
  ) {
    // Initialize cache settings
    const cacheOptions = this.resolveCacheOptions(options.cache);
    this.cacheEnabled = cacheOptions !== false;

    if (this.cacheEnabled && cacheOptions) {
      this.cacheStorage = cacheOptions.storage ?? new InMemoryCacheStorage();
      this.cacheKeyGenerator = cacheOptions.keyGenerator ?? new UrlCacheKeyGenerator();
      this.cacheExpiresIn = cacheOptions.expiresIn ?? DEFAULT_CACHE_EXPIRATION_TIME;
    } else {
      // Initialize with defaults even if disabled (for type safety)
      this.cacheStorage = new InMemoryCacheStorage();
      this.cacheKeyGenerator = new UrlCacheKeyGenerator();
      this.cacheExpiresIn = DEFAULT_CACHE_EXPIRATION_TIME;
    }
  }

  async onModuleInit(): Promise<void> {
    try {
      this.angularApp = await this.options.bootstrap();
      this.logger.log('Angular SSR engine initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Angular SSR engine', error);
      throw error;
    }
  }

  /**
   * Resolve cache options from the provided configuration
   */
  private resolveCacheOptions(cache: boolean | CacheOptions | undefined): CacheOptions | false {
    if (cache === false) {
      return false;
    }
    if (cache === true || cache === undefined) {
      return {};
    }
    return cache;
  }

  /**
   * Render the Angular application for the given request
   */
  async render(request: Request, response: Response): Promise<string | null> {
    if (!this.angularApp) {
      throw new Error('Angular SSR engine not initialized');
    }

    const url = this.getRequestUrl(request);

    // Check cache first
    if (this.cacheEnabled) {
      const cacheKey = this.cacheKeyGenerator.generateCacheKey(request);
      const cached = await this.cacheStorage.get(cacheKey);

      if (cached) {
        this.logger.debug(`Cache hit for: ${url}`);
        return cached.content;
      }
    }

    try {
      // Create a native Request object for Angular SSR
      const angularRequest = this.createAngularRequest(request);

      // Render the application
      const angularResponse = await this.angularApp.handle(angularRequest);

      if (!angularResponse) {
        return null;
      }

      const html = await angularResponse.text();

      // Store in cache
      if (this.cacheEnabled && html) {
        const cacheKey = this.cacheKeyGenerator.generateCacheKey(request);
        await this.cacheStorage.set(cacheKey, {
          content: html,
          expiresAt: Date.now() + this.cacheExpiresIn,
        });
        this.logger.debug(`Cached response for: ${url}`);
      }

      return html;
    } catch (error) {
      this.logger.error(`Error rendering: ${url}`, error);

      if (this.options.errorHandler) {
        this.options.errorHandler(error as Error, request, response);
        return null;
      }

      throw error;
    }
  }

  /**
   * Get the full URL from the Express request
   */
  private getRequestUrl(request: Request): string {
    const protocol = request.protocol || 'http';
    const host = request.get('host') || 'localhost';
    const originalUrl = request.originalUrl || request.url || '/';
    return `${protocol}://${host}${originalUrl}`;
  }

  /**
   * Create a native Request object compatible with Angular SSR
   */
  private createAngularRequest(expressRequest: Request): globalThis.Request {
    const url = this.getRequestUrl(expressRequest);

    // Convert Express headers to Headers object
    const headers = new Headers();
    for (const [key, value] of Object.entries(expressRequest.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          for (const v of value) {headers.append(key, v);}
        } else {
          headers.set(key, value);
        }
      }
    }

    return new Request(url, {
      method: expressRequest.method,
      headers,
    });
  }

  /**
   * Clear the render cache
   */
  async clearCache(): Promise<void> {
    if (this.cacheEnabled) {
      await this.cacheStorage.clear();
      this.logger.log('SSR cache cleared');
    }
  }

  /**
   * Invalidate a specific cache entry
   */
  async invalidateCache(key: string): Promise<boolean> {
    if (this.cacheEnabled) {
      return await this.cacheStorage.delete(key);
    }
    return false;
  }
}
