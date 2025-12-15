import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from './shared/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-void-800">
      <!-- Header -->
      <header class="sticky top-0 z-50 glass border-b border-void-500/50">
        <nav class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a routerLink="/" class="flex items-center gap-3 group">
            <app-icon
              name="bolt"
              [size]="24"
              class="text-ember-500 group-hover:animate-pulse transition-transform"
            />
            <span class="font-bold text-lg text-void-50 hidden sm:block"
              >NestJS + Angular SSR</span
            >
          </a>

          <div class="flex items-center gap-1 sm:gap-2">
            <a
              routerLink="/"
              routerLinkActive="bg-void-600 text-ember-500"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg text-void-300 font-medium text-sm hover:text-ember-500 hover:bg-void-600/50 transition-all flex items-center gap-2"
            >
              <app-icon name="home" [size]="16" />
              <span class="hidden sm:inline">Home</span>
            </a>
            <a
              routerLink="/products"
              routerLinkActive="bg-void-600 text-ember-500"
              class="px-4 py-2 rounded-lg text-void-300 font-medium text-sm hover:text-ember-500 hover:bg-void-600/50 transition-all flex items-center gap-2"
            >
              <app-icon name="box" [size]="16" />
              <span class="hidden sm:inline">Products</span>
            </a>
            <a
              routerLink="/about"
              routerLinkActive="bg-void-600 text-ember-500"
              class="px-4 py-2 rounded-lg text-void-300 font-medium text-sm hover:text-ember-500 hover:bg-void-600/50 transition-all flex items-center gap-2"
            >
              <app-icon name="info" [size]="16" />
              <span class="hidden sm:inline">About</span>
            </a>
          </div>
        </nav>
      </header>

      <!-- Main content -->
      <main class="flex-1">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="border-t border-void-500/50 bg-void-700/30">
        <div
          class="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p class="text-void-400 text-sm">
              © {{ currentYear }}
              <span class="text-void-50 font-semibold"
                >Pegasus Heavy Industries LLC</span
              >
            </p>
            <span class="hidden sm:inline text-void-500">•</span>
            <p class="text-void-400 text-sm">
              Built with
              <a
                href="https://github.com/pegasusheavy/nestjs-angular-ssr"
                target="_blank"
                class="text-ember-500 hover:text-ember-400 transition-colors"
              >
                &#64;pegasus-heavy/nestjs-angular-ssr
              </a>
            </p>
          </div>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/pegasusheavy"
              target="_blank"
              class="text-void-400 hover:text-void-50 transition-colors"
              title="Pegasus Heavy Industries on GitHub"
            >
              <app-icon name="github" [size]="20" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class AppComponent {
  title = 'NestJS Angular SSR Example';
  currentYear = new Date().getFullYear();
}
