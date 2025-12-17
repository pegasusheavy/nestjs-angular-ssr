# NestJS Angular SSR Example

This is a complete example application demonstrating how to use `@lexmata/nestjs-angular-ssr` to integrate Angular SSR with NestJS.

## Project Structure

```
example/
├── src/                          # NestJS application
│   ├── main.ts                   # Entry point
│   └── app/
│       ├── app.module.ts         # Main module with AngularSSRModule
│       └── api/                  # API controllers
│           ├── users/
│           ├── products/
│           └── health/
├── angular/                      # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.config.server.ts
│   │   │   ├── app.routes.ts
│   │   │   └── pages/
│   │   ├── main.ts
│   │   ├── main.server.ts
│   │   └── styles.css
│   ├── server.ts                 # Angular SSR entry
│   └── angular.json
├── package.json
└── README.md
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 10.0.0

## Getting Started

### 1. Install Dependencies

From the root of the `nestjs-angular-ssr` project:

```bash
# Install main project dependencies
pnpm install

# Build the main library
pnpm build

# Install example dependencies
cd example
pnpm install
cd angular
pnpm install
```

### 2. Build the Applications

```bash
# From the example directory
cd example

# Build Angular (creates browser and server bundles)
cd angular
pnpm build
cd ..

# Build NestJS
pnpm build:nest
```

### 3. Run the Application

```bash
# From the example directory
pnpm start
```

The application will be available at `http://localhost:4000`.

## Available Routes

### Frontend Routes (Angular SSR)

- `/` - Home page with SSR info
- `/products` - Products listing (fetches from API)
- `/products/:id` - Product detail page
- `/about` - About page with server health status
- `/*` - 404 Not Found page (sets 404 status code)

### API Routes (NestJS)

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/products` - List all products (supports `?category=` filter)
- `GET /api/products/categories` - Get product categories
- `GET /api/products/:id` - Get product by ID
- `GET /api/health` - Health check endpoint
- `GET /api/health/clear-cache` - Clear SSR cache

## Key Features Demonstrated

### 1. AngularSSRModule Configuration

```typescript
// src/app/app.module.ts
AngularSSRModule.forRoot({
  browserDistFolder: join(process.cwd(), 'angular/dist/example-app/browser'),
  bootstrap: async () => {
    const { default: angularApp } =
      await import('../../angular/dist/example-app/server/server.mjs');
    return angularApp;
  },
  cache: {
    expiresIn: 60_000,
    storage: new InMemoryCacheStorage(),
  },
  errorHandler: (error, req, res) => {
    // Custom error handling
  },
});
```

### 2. Server-Side Status Code

The 404 page demonstrates setting HTTP status codes from Angular components:

```typescript
// not-found.component.ts
import { RESPONSE } from '@lexmata/nestjs-angular-ssr/tokens';

constructor(
  @Inject(PLATFORM_ID) private platformId: object,
  @Optional() @Inject(RESPONSE) private response: Response | null,
) {
  if (isPlatformServer(this.platformId) && this.response) {
    this.response.status(404);
  }
}
```

### 3. Cache Management

The health controller demonstrates programmatic cache management:

```typescript
// health.controller.ts
@Get('clear-cache')
async clearCache() {
  await this.ssrService.clearCache();
  return { success: true };
}
```

### 4. SSR Detection

The home page shows whether content is server-rendered or client-hydrated:

```typescript
// home.component.ts
ngOnInit() {
  this.renderInfo = isPlatformServer(this.platformId)
    ? '⚡ Server-Side Rendered'
    : '🖥️ Client Hydrated';
}
```

## Development

### Watch Mode

For development with hot reload:

```bash
# Terminal 1: Watch Angular
cd example/angular
pnpm watch

# Terminal 2: Watch NestJS
cd example
pnpm start:dev
```

## License

MIT License - Lexmata LLC
