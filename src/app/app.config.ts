import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { WEATHER_PROVIDER } from './shared/services/weather/weather.service';
import { MockWeatherProvider } from './shared/services/weather/providers/mock-weather.provider';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    // Weather provider configuration
    MockWeatherProvider,
    { provide: WEATHER_PROVIDER, useExisting: MockWeatherProvider }
  ]
};
