import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initializeAuth(); // Now accessible!
    }),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Nora,
        options: {
          darkModeSelector: '.dark-theme',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    MessageService,
  ],
};
