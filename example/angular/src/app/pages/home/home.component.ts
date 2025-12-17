import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent, type IconName } from '../../shared/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <!-- Hero Section -->
    <section
      class="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      <!-- Background effects -->
      <div class="absolute inset-0 bg-hero-glow" aria-hidden="true"></div>
      <div class="absolute inset-0 bg-grid opacity-30" aria-hidden="true"></div>

      <!-- Floating orbs -->
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-ember-500/10 rounded-full blur-3xl animate-pulse-slow"
        aria-hidden="true"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-golden-400/5 rounded-full blur-3xl animate-pulse-slow animation-delay-500"
        aria-hidden="true"
      ></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 badge badge-ember mb-8 animate-float"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-ember-500"
            ></span>
          </span>
          <app-icon [name]="isServer ? 'server' : 'desktop'" [size]="12" />
          {{ renderInfo }}
        </div>

        <!-- Title -->
        <h1
          class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
        >
          <span class="gradient-text animate-gradient-x bg-[length:200%_auto]"
            >NestJS + Angular SSR</span
          >
          <br />
          <span class="text-void-50">Made Simple</span>
        </h1>

        <!-- Subtitle -->
        <p
          class="text-lg sm:text-xl text-void-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A powerful module for integrating Angular Server-Side Rendering with
          NestJS applications. Built for
          <span class="text-ember-400 font-medium">Angular v19+</span> with
          modern SSR APIs.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a routerLink="/products" class="btn btn-primary group">
            <span>View Products</span>
            <app-icon
              name="arrow-right"
              [size]="16"
              class="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href="https://github.com/Lexmata/nestjs-angular-ssr"
            target="_blank"
            class="btn btn-secondary group"
          >
            <app-icon name="github" [size]="18" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 px-6 relative">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-void-50 mb-4">
            Powerful Features
          </h2>
          <p class="text-void-300 max-w-2xl mx-auto">
            Everything you need to build blazing-fast server-rendered Angular
            applications with NestJS
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (feature of features; track feature.title) {
          <div class="card card-hover p-6 group">
            <div
              class="w-14 h-14 rounded-2xl bg-gradient-to-br from-ember-500/20 to-golden-400/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <app-icon [name]="feature.icon" [size]="24" class="text-ember-400" />
            </div>
            <h3 class="text-lg font-semibold text-void-50 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-void-400 text-sm leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
          }
        </div>
      </div>
    </section>

    <!-- Code Preview Section -->
    <section class="py-24 px-6 bg-void-700/20">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-void-50 mb-4">Quick Setup</h2>
          <p class="text-void-300">Get started with just a few lines of code</p>
        </div>

        <div class="card overflow-hidden">
          <div
            class="flex items-center gap-2 px-4 py-3 bg-void-800 border-b border-void-500"
          >
            <span class="w-3 h-3 rounded-full bg-ember-500"></span>
            <span class="w-3 h-3 rounded-full bg-golden-400"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span class="ml-4 text-void-400 text-sm font-mono"
              >app.module.ts</span
            >
          </div>
          <pre
            class="p-6 overflow-x-auto text-sm font-mono leading-relaxed"
          ><code class="text-void-300"><span class="text-ember-400">import</span> {{ '{' }} AngularSSRModule {{ '}' }} <span class="text-ember-400">from</span> <span class="text-golden-400">'&#64;lexmata/nestjs-angular-ssr'</span>;

<span class="text-void-500">&#64;Module</span>({{ '{' }}
  <span class="text-ember-400">imports</span>: [
    AngularSSRModule.<span class="text-golden-400">forRoot</span>({{ '{' }}
      <span class="text-ember-400">browserDistFolder</span>: <span class="text-golden-400">'./dist/browser'</span>,
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
    </section>
  `,
})
export class HomeComponent implements OnInit {
  renderInfo = 'Loading...';
  isServer = false;

  features: { icon: IconName; title: string; description: string }[] = [
    {
      icon: 'rocket',
      title: 'Angular v19+ Support',
      description:
        'Built for the modern Angular SSR API with full compatibility and latest features.',
    },
    {
      icon: 'database',
      title: 'Built-in Caching',
      description:
        'Configurable response caching with pluggable storage backends for optimal performance.',
    },
    {
      icon: 'plug',
      title: 'Request Injection',
      description:
        'Access Express request/response directly in your Angular components.',
    },
    {
      icon: 'bolt',
      title: 'High Performance',
      description:
        'Static file serving with optimized caching headers and minimal overhead.',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    this.isServer = isPlatformServer(this.platformId);
    this.renderInfo = this.isServer
      ? 'Server-Side Rendered'
      : 'Client Hydrated';
  }
}
