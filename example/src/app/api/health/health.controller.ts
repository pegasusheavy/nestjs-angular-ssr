import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { AngularSSRService } from '@pegasus-heavy/nestjs-angular-ssr';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  ssr: {
    enabled: boolean;
  };
}

@Controller('api/health')
export class HealthController {
  constructor(
    @Optional()
    @Inject(AngularSSRService)
    private readonly ssrService?: AngularSSRService,
  ) {}

  @Get()
  check(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      ssr: {
        enabled: !!this.ssrService,
      },
    };
  }

  @Get('clear-cache')
  async clearCache(): Promise<{ success: boolean; message: string }> {
    if (this.ssrService) {
      await this.ssrService.clearCache();
      return { success: true, message: 'SSR cache cleared successfully' };
    }
    return { success: false, message: 'SSR service not available' };
  }
}

