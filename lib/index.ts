// Middleware
export { AngularSSRMiddleware } from './angular-ssr.middleware';

// Module
export { AngularSSRModule } from './angular-ssr.module';

// Service
export { AngularSSRService, DEFAULT_CACHE_EXPIRATION_TIME } from './angular-ssr.service';

// Cache implementations
export { InMemoryCacheStorage } from './cache/in-memory-cache-storage';
export { UrlCacheKeyGenerator } from './cache/url-cache-key-generator';
// Interfaces
export type {
  AngularSSRModuleAsyncOptions,
  AngularSSRModuleOptions,
  CacheOptions,
  ErrorHandler,
  StaticProvider,
} from './interfaces/angular-ssr-module-options.interface';

export type { CacheKeyGenerator } from './interfaces/cache-key-generator.interface';
export type { CacheEntry, CacheStorage } from './interfaces/cache-storage.interface';

// Tokens
export { ANGULAR_SSR_OPTIONS, REQUEST, RESPONSE } from './tokens';
