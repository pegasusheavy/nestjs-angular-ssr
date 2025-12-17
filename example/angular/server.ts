import 'zone.js/node';
import { CommonEngine } from '@angular/ssr/node';
import bootstrap from './src/main.server';

/**
 * This is the main entry point for the Angular SSR server.
 * It exports the CommonEngine for use with NestJS.
 */

// Create the Angular CommonEngine - designed for custom server integrations
export const commonEngine = new CommonEngine();

// Export bootstrap function and engine for NestJS integration
export { bootstrap };
export default commonEngine;

