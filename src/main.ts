import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from './environments/environment';

// SSR-safe redirect URI
const getRedirectUri = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return environment.auth0.redirectUri; // Fallback for SSR
};

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: getRedirectUri(),
        scope: environment.auth0.scope
      }
    })
  ]
}).catch(err => console.error(err));
