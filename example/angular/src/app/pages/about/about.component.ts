import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../../shared/icon.component';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  ssr: {
    enabled: boolean;
  };
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="py-12 px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl sm:text-5xl font-bold text-void-50 mb-4">
            About This Example
          </h1>
          <p class="text-void-300 text-lg">
            A demonstration of the
            <code
              class="px-2 py-1 rounded bg-ember-500/20 text-ember-400 text-base"
            >
              &#64;pegasus-heavy/nestjs-angular-ssr
            </code>
            module
          </p>
        </div>

        <!-- Info Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <!-- Architecture Card -->
          <div class="card p-6">
            <div
              class="w-12 h-12 rounded-xl bg-ember-500/20 flex items-center justify-center mb-4"
            >
              <app-icon name="cubes" [size]="22" class="text-ember-400" />
            </div>
            <h3 class="text-lg font-semibold text-void-50 mb-4">Architecture</h3>
            <ul class="space-y-3">
              @for (item of architecture; track item) {
              <li class="flex items-center gap-3 text-void-300">
                <app-icon name="circle" [size]="6" class="text-ember-500" />
                {{ item }}
              </li>
              }
            </ul>
          </div>

          <!-- Features Card -->
          <div class="card p-6">
            <div
              class="w-12 h-12 rounded-xl bg-golden-400/20 flex items-center justify-center mb-4"
            >
              <app-icon name="bolt" [size]="22" class="text-golden-400" />
            </div>
            <h3 class="text-lg font-semibold text-void-50 mb-4">Features Used</h3>
            <ul class="space-y-3">
              @for (item of featuresUsed; track item) {
              <li class="flex items-center gap-3 text-void-300">
                <app-icon name="circle" [size]="6" class="text-golden-400" />
                {{ item }}
              </li>
              }
            </ul>
          </div>

          <!-- API Endpoints Card -->
          <div class="card p-6">
            <div
              class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4"
            >
              <app-icon name="satellite" [size]="22" class="text-emerald-400" />
            </div>
            <h3 class="text-lg font-semibold text-void-50 mb-4">API Endpoints</h3>
            <ul class="space-y-2">
              @for (endpoint of endpoints; track endpoint) {
              <li>
                <code
                  class="text-sm px-3 py-1.5 rounded-lg bg-void-800 text-ember-400 font-mono inline-block"
                >
                  {{ endpoint }}
                </code>
              </li>
              }
            </ul>
          </div>

          <!-- Server Status Card -->
          @if (health) {
          <div class="card p-6">
            <div
              class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4"
            >
              <app-icon name="wrench" [size]="22" class="text-emerald-400" />
            </div>
            <h3 class="text-lg font-semibold text-void-50 mb-4">Server Status</h3>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center py-2 border-b border-void-500"
              >
                <span class="text-void-400 flex items-center gap-2">
                  <app-icon name="check" [size]="12" />
                  Status
                </span>
                <span class="badge badge-success">{{ health.status }}</span>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-void-500"
              >
                <span class="text-void-400 flex items-center gap-2">
                  <app-icon name="leaf" [size]="12" />
                  Environment
                </span>
                <span class="text-void-50 font-medium">{{
                  health.environment
                }}</span>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-void-500"
              >
                <span class="text-void-400 flex items-center gap-2">
                  <app-icon name="clock" [size]="12" />
                  Uptime
                </span>
                <span class="text-void-50 font-medium">{{
                  formatUptime(health.uptime)
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-void-400 flex items-center gap-2">
                  <app-icon name="server" [size]="12" />
                  SSR Enabled
                </span>
                <span class="text-void-50 font-medium">{{
                  health.ssr.enabled ? 'Yes' : 'No'
                }}</span>
              </div>
            </div>
          </div>
          }
        </div>

        <!-- Code Example -->
        <div class="card overflow-hidden">
          <div
            class="flex items-center gap-2 px-4 py-3 bg-void-800 border-b border-void-500"
          >
            <span class="w-3 h-3 rounded-full bg-ember-500"></span>
            <span class="w-3 h-3 rounded-full bg-golden-400"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span class="ml-4 text-void-400 text-sm font-mono">Quick Start</span>
          </div>
          <pre
            class="p-6 overflow-x-auto text-sm font-mono leading-relaxed"
          ><code class="text-void-300"><span class="text-ember-400">import</span> {{ '{' }} AngularSSRModule {{ '}' }} <span class="text-ember-400">from</span> <span class="text-golden-400">'&#64;pegasus-heavy/nestjs-angular-ssr'</span>;

<span class="text-void-500">&#64;Module</span>({{ '{' }}
  <span class="text-ember-400">imports</span>: [
    AngularSSRModule.<span class="text-golden-400">forRoot</span>({{ '{' }}
      <span class="text-ember-400">browserDistFolder</span>: join(process.cwd(), <span class="text-golden-400">'dist/app/browser'</span>),
      <span class="text-ember-400">bootstrap</span>: <span class="text-void-500">async</span> () => {{ '{' }}
        <span class="text-ember-400">const</span> {{ '{' }} default: app {{ '}' }} = <span class="text-void-500">await</span> <span class="text-golden-400">import</span>(<span class="text-golden-400">'./server.mjs'</span>);
        <span class="text-ember-400">return</span> app;
      {{ '}' }},
    {{ '}' }}),
  ],
{{ '}' }})
<span class="text-ember-400">export class</span> <span class="text-void-50">AppModule</span> {{ '{' }}{{ '}' }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class AboutComponent implements OnInit {
  private http = inject(HttpClient);

  health: HealthStatus | null = null;

  architecture = [
    'NestJS backend with Express',
    'Angular v19+ with SSR',
    'Server-side rendered pages',
    'Client-side hydration',
  ];

  featuresUsed = [
    'AngularSSRModule.forRoot()',
    'Built-in response caching',
    'Custom error handling',
    'API routes alongside SSR',
  ];

  endpoints = [
    'GET /api/users',
    'GET /api/products',
    'GET /api/health',
    'GET /api/health/clear-cache',
  ];

  ngOnInit() {
    this.http.get<HealthStatus>('/api/health').subscribe({
      next: (health) => {
        this.health = health;
      },
    });
  }

  formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }
}
