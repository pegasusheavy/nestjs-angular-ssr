import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';

// Token matching @lexmata/nestjs-angular-ssr/tokens
const RESPONSE = 'ANGULAR_SSR_RESPONSE';

// Express Response type for SSR
interface ExpressResponse {
  status(code: number): this;
}

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-6">
      <div class="text-center max-w-md">
        <!-- 404 Number -->
        <div class="relative mb-8">
          <span
            class="text-[12rem] font-extrabold leading-none gradient-text opacity-20 select-none"
          >
            404
          </span>
          <div class="absolute inset-0 flex items-center justify-center">
            <app-icon
              name="search"
              [size]="72"
              class="text-ember-500 animate-float"
            />
          </div>
        </div>

        <!-- Message -->
        <h1 class="text-3xl font-bold text-void-50 mb-4">Page Not Found</h1>
        <p class="text-void-400 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved to another
          location.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a routerLink="/" class="btn btn-primary gap-2">
            <app-icon name="home" [size]="18" />
            Go Home
          </a>
          <a routerLink="/products" class="btn btn-secondary gap-2">
            <app-icon name="box" [size]="18" />
            Browse Products
          </a>
        </div>

        <!-- Helpful Links -->
        <div class="mt-12 pt-8 border-t border-void-500">
          <p
            class="text-void-500 text-sm mb-4 flex items-center justify-center gap-2"
          >
            <app-icon name="question" [size]="14" />
            Helpful links
          </p>
          <div class="flex justify-center gap-6">
            <a
              routerLink="/"
              class="text-void-400 hover:text-ember-400 text-sm transition-colors flex items-center gap-1.5"
            >
              <app-icon name="home" [size]="12" />
              Home
            </a>
            <a
              routerLink="/products"
              class="text-void-400 hover:text-ember-400 text-sm transition-colors flex items-center gap-1.5"
            >
              <app-icon name="box" [size]="12" />
              Products
            </a>
            <a
              routerLink="/about"
              class="text-void-400 hover:text-ember-400 text-sm transition-colors flex items-center gap-1.5"
            >
              <app-icon name="info" [size]="12" />
              About
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(RESPONSE) private response: ExpressResponse | null
  ) {
    // Set 404 status code when rendered on the server
    if (isPlatformServer(this.platformId) && this.response) {
      this.response.status(404);
    }
  }
}
