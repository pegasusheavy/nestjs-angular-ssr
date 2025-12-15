# @pegasus-heavy/nestjs-angular-ssr

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <span style="font-size: 48px; margin: 0 20px;">+</span>
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="120" alt="Angular Logo" />
</p>

<p align="center">
  Angular SSR (v19+) module for NestJS framework
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://github.com/pegasusheavy/nestjs-angular-ssr/actions/workflows/ci.yml"><img src="https://github.com/pegasusheavy/nestjs-angular-ssr/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@pegasus-heavy/nestjs-angular-ssr"><img src="https://img.shields.io/npm/v/@pegasus-heavy/nestjs-angular-ssr.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@pegasus-heavy/nestjs-angular-ssr"><img src="https://img.shields.io/npm/dm/@pegasus-heavy/nestjs-angular-ssr.svg" alt="npm downloads" /></a>
</p>

## Description

A NestJS module that integrates Angular SSR (Server-Side Rendering) for Angular v19+ applications. This module provides a seamless way to serve Angular applications with server-side rendering through a NestJS backend, similar to how `@nestjs/ng-universal` worked for older Angular Universal versions.

## Features

- 🚀 **Angular v19+ Support** - Built for the modern Angular SSR API
- 📦 **Easy Integration** - Simple `forRoot()` and `forRootAsync()` configuration
- 💾 **Built-in Caching** - Configurable response caching with pluggable storage
- 🔌 **Request/Response Injection** - Access Express request/response in Angular components
- ⚡ **Performance** - Static file serving with caching headers
- 🛠️ **Customizable** - Custom error handlers, cache key generators, and more

## Installation

```bash
pnpm add @pegasus-heavy/nestjs-angular-ssr

# or with npm
npm install @pegasus-heavy/nestjs-angular-ssr

# or with yarn
yarn add @pegasus-heavy/nestjs-angular-ssr
```

## Prerequisites

- Node.js >= 18.0.0
- NestJS >= 10.0.0
- Angular >= 19.0.0 with SSR configured

## Usage

### Basic Setup

Import `AngularSSRModule` in your NestJS application module:

```typescript
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AngularSSRModule } from '@pegasus-heavy/nestjs-angular-ssr';

// Import the bootstrap function from your Angular SSR server entry
import bootstrap from './path-to-angular/server/main.server';

@Module({
  imports: [
    AngularSSRModule.forRoot({
      browserDistFolder: join(process.cwd(), 'dist/my-app/browser'),
      bootstrap: () => bootstrap(),
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

For more complex setups where you need to inject dependencies:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AngularSSRModule } from '@pegasus-heavy/nestjs-angular-ssr';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AngularSSRModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        browserDistFolder: configService.get('BROWSER_DIST_FOLDER'),
        bootstrap: async () => {
          const { default: bootstrap } = await import('./angular/server/main.server');
          return bootstrap();
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Full Example

Here's a complete example showing how to integrate Angular SSR with a NestJS application.

### Project Structure

```
my-app/
├── src/
│   ├── app/                      # NestJS application
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── api/                  # Your API modules
│   │       └── users/
│   │           ├── users.module.ts
│   │           └── users.controller.ts
│   └── main.ts                   # NestJS entry point
├── angular/                      # Angular application
│   ├── src/
│   │   ├── app/
│   │   ├── main.ts
│   │   └── main.server.ts
│   └── angular.json
├── dist/
│   └── angular/
│       ├── browser/              # Angular browser build
│       └── server/
│           └── server.mjs        # Angular SSR server bundle
└── package.json
```

### Angular Server Entry Point

Your Angular application needs to export the `AngularAppEngine`. With Angular v19+, your `angular/server.ts` should look like:

```typescript
// angular/server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { AppServerModule } from './src/main.server';

const angularApp = new AngularAppEngine();

export default angularApp;
```

### NestJS Main Entry Point

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for API routes (optional)
  app.setGlobalPrefix('api', {
    exclude: ['/'], // Exclude root for Angular SSR
  });

  await app.listen(4000);
  console.log('Application is running on: http://localhost:4000');
}

bootstrap();
```

### NestJS App Module

```typescript
// src/app/app.module.ts
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AngularSSRModule } from '@pegasus-heavy/nestjs-angular-ssr';
import { UsersModule } from './api/users/users.module';

// Dynamic import for the Angular SSR engine
const angularBootstrap = async () => {
  const { default: angularApp } = await import('../../dist/angular/server/server.mjs');
  return angularApp;
};

@Module({
  imports: [
    // Your API modules
    UsersModule,

    // Angular SSR module - should be imported LAST
    AngularSSRModule.forRoot({
      browserDistFolder: join(process.cwd(), 'dist/angular/browser'),
      bootstrap: angularBootstrap,
      // Optional: customize render paths
      renderPath: '*',
      // Optional: configure caching
      cache: {
        expiresIn: 60000, // 1 minute
      },
    }),
  ],
})
export class AppModule {}
```

### API Controller Example

```typescript
// src/app/api/users/users.controller.ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id: Number(id), name: 'John Doe' };
  }
}
```

### Complete App Module with All Features

```typescript
// src/app/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AngularSSRModule, InMemoryCacheStorage } from '@pegasus-heavy/nestjs-angular-ssr';
import { UsersModule } from './api/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,

    // Angular SSR with async configuration
    AngularSSRModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Dynamic import of Angular SSR engine
        const { default: angularApp } = await import('../../dist/angular/server/server.mjs');

        return {
          browserDistFolder: join(process.cwd(), 'dist/angular/browser'),
          bootstrap: async () => angularApp,

          // Cache configuration
          cache: {
            expiresIn: configService.get('SSR_CACHE_TTL', 60000),
            storage: new InMemoryCacheStorage(),
          },

          // Custom error handler
          errorHandler: (error, req, res) => {
            console.error('SSR Error:', error.message);
            res.status(500).send(`
              <!DOCTYPE html>
              <html>
                <head><title>Error</title></head>
                <body>
                  <h1>Something went wrong</h1>
                  <p>Please try again later.</p>
                </body>
              </html>
            `);
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Build Scripts (package.json)

```json
{
  "scripts": {
    "build": "npm run build:angular && npm run build:nest",
    "build:angular": "ng build && ng run my-app:server",
    "build:nest": "nest build",
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main.js"
  }
}
```

### Environment Configuration

```bash
# .env
SSR_CACHE_TTL=60000
NODE_ENV=production
```

## API Reference

### `forRoot()` Options

| Property            | Type                              | Default                                 | Description                                   |
| ------------------- | --------------------------------- | --------------------------------------- | --------------------------------------------- |
| `browserDistFolder` | `string`                          | **required**                            | Path to the Angular browser build directory   |
| `bootstrap`         | `() => Promise<AngularAppEngine>` | **required**                            | Function that returns the Angular SSR engine  |
| `serverDistFolder`  | `string?`                         | -                                       | Path to the server bundle directory           |
| `indexHtml`         | `string?`                         | `{browserDistFolder}/index.server.html` | Path to the index.html template               |
| `renderPath`        | `string \| string[]?`             | `'*'`                                   | Route path(s) to render the Angular app       |
| `rootStaticPath`    | `string \| RegExp?`               | `'*'`                                   | Path pattern for serving static files         |
| `extraProviders`    | `StaticProvider[]?`               | -                                       | Additional providers for SSR                  |
| `inlineCriticalCss` | `boolean?`                        | `true`                                  | Inline critical CSS to reduce render-blocking |
| `cache`             | `boolean \| CacheOptions?`        | `true`                                  | Cache configuration                           |
| `errorHandler`      | `ErrorHandler?`                   | -                                       | Custom error handler function                 |

### Cache Options

| Property       | Type                 | Default                | Description                         |
| -------------- | -------------------- | ---------------------- | ----------------------------------- |
| `expiresIn`    | `number?`            | `60000`                | Cache expiration in milliseconds    |
| `storage`      | `CacheStorage?`      | `InMemoryCacheStorage` | Custom cache storage implementation |
| `keyGenerator` | `CacheKeyGenerator?` | `UrlCacheKeyGenerator` | Custom cache key generator          |

## Request and Response Injection

Access Express `Request` and `Response` objects in your Angular components using the provided string tokens:

```typescript
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import type { Response } from 'express';
import { RESPONSE } from '@pegasus-heavy/nestjs-angular-ssr/tokens';

@Component({
  selector: 'app-not-found',
  template: '<h1>404 - Page Not Found</h1>',
})
export class NotFoundComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private response: Response | null,
  ) {
    if (isPlatformServer(this.platformId) && this.response) {
      this.response.status(404);
    }
  }
}
```

> **Note**: `REQUEST` and `RESPONSE` are string tokens (`'ANGULAR_SSR_REQUEST'` and `'ANGULAR_SSR_RESPONSE'`) that work with both NestJS and Angular dependency injection systems.

## Custom Cache Storage

Implement the `CacheStorage` interface for custom caching solutions (e.g., Redis):

```typescript
import { CacheStorage, CacheEntry } from '@pegasus-heavy/nestjs-angular-ssr';

export class RedisCacheStorage implements CacheStorage {
  constructor(private redis: RedisClient) {}

  async get(key: string): Promise<CacheEntry | undefined> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : undefined;
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    await this.redis.set(key, JSON.stringify(entry));
  }

  async delete(key: string): Promise<boolean> {
    return (await this.redis.del(key)) > 0;
  }

  async clear(): Promise<void> {
    await this.redis.flushdb();
  }

  async has(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) > 0;
  }
}
```

## Custom Cache Key Generator

Create custom cache keys based on request properties:

```typescript
import { Request } from 'express';
import { CacheKeyGenerator } from '@pegasus-heavy/nestjs-angular-ssr';

export class MobileAwareCacheKeyGenerator implements CacheKeyGenerator {
  generateCacheKey(request: Request): string {
    const userAgent = request.headers['user-agent'] || '';
    const isMobile = /mobile/i.test(userAgent) ? 'mobile' : 'desktop';
    const url = request.hostname + request.originalUrl;
    return `${url}:${isMobile}`.toLowerCase();
  }
}
```

## AngularSSRService API

The `AngularSSRService` can be injected to programmatically manage SSR:

```typescript
import { Injectable } from '@nestjs/common';
import { AngularSSRService } from '@pegasus-heavy/nestjs-angular-ssr';

@Injectable()
export class CacheManagementService {
  constructor(private readonly ssrService: AngularSSRService) {}

  async clearAllCache(): Promise<void> {
    await this.ssrService.clearCache();
  }

  async invalidatePage(cacheKey: string): Promise<boolean> {
    return this.ssrService.invalidateCache(cacheKey);
  }
}
```

## Angular Project Setup

Ensure your Angular project is configured for SSR. With Angular v19+:

```bash
ng add @angular/ssr
```

Your Angular project should have a server entry point that exports the Angular app engine bootstrap function.

## Contributing

We welcome contributions! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## Support

- 📖 [Documentation](https://github.com/pegasusheavy/nestjs-angular-ssr#readme)
- 🐛 [Issue Tracker](https://github.com/pegasusheavy/nestjs-angular-ssr/issues)
- 💬 [Discussions](https://github.com/pegasusheavy/nestjs-angular-ssr/discussions)

## License

MIT License - Copyright (c) 2025 Pegasus Heavy Industries LLC

See [LICENSE](LICENSE) for details.
