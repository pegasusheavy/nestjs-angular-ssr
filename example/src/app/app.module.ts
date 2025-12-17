import { Module } from '@nestjs/common';
import { join } from 'path';
import {
  AngularSSRModule,
  InMemoryCacheStorage,
} from '@lexmata/nestjs-angular-ssr';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    // API routes module
    ApiModule,

    // Angular SSR module - import LAST so it catches all non-API routes
    AngularSSRModule.forRoot({
      // Path to the Angular browser build
      browserDistFolder: join(process.cwd(), 'angular/dist/example-app/browser'),

      // Path to the index.server.html template
      indexHtml: join(process.cwd(), 'angular/dist/example-app/server/index.server.html'),

      // Bootstrap function that returns the CommonEngine
      bootstrap: async () => {
        // Dynamic import of the Angular SSR server bundle
        const serverPath = join(process.cwd(), 'angular/dist/example-app/server/server.mjs');
        const { default: commonEngine } = await import(serverPath);
        return commonEngine;
      },

      // Angular application bootstrap function (for CommonEngine)
      angularBootstrap: async () => {
        const mainServerPath = join(process.cwd(), 'angular/dist/example-app/server/main.server.mjs');
        const { default: bootstrap } = await import(mainServerPath);
        return bootstrap;
      },

      // Cache configuration
      cache: {
        expiresIn: 60_000, // 1 minute cache
        storage: new InMemoryCacheStorage(),
      },

      // Custom error handler
      errorHandler: (error, _req, res) => {
        console.error('SSR Error:', error.message);
        res.status(500).send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Error</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                  background: #1a1a2e;
                  color: #eee;
                }
                .error-container {
                  text-align: center;
                  padding: 2rem;
                }
                h1 { color: #e94560; }
                p { color: #aaa; }
              </style>
            </head>
            <body>
              <div class="error-container">
                <h1>Something went wrong</h1>
                <p>Please try again later.</p>
              </div>
            </body>
          </html>
        `);
      },
    }),
  ],
})
export class AppModule {}

