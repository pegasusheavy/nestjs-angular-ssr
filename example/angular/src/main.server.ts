import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * Bootstrap function for Angular SSR.
 * In Angular 19+, this must accept a BootstrapContext as the third argument.
 */
const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, config, context);

export default bootstrap;

