import { Module } from '@nestjs/common';
import { join } from 'path';
import {
  AngularSSRModule,
  InMemoryCacheStorage,
} from '@pegasus-heavy/nestjs-angular-ssr';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    // API routes module
    ApiModule,

    // Angular SSR module - import LAST so it catches all non-API routes
    AngularSSRModule.forRoot({
      // Path to the Angular browser build
      browserDistFolder: join(process.cwd(), 'angular/dist/example-app/browser'),

      // Bootstrap function that returns the Angular SSR engine
      bootstrap: async () => {
        // Dynamic import of the Angular SSR server bundle
        const { default: angularApp } = await import(
          '../../angular/dist/example-app/server/server.mjs'
        );
        return angularApp;
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

