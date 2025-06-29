import { Injectable, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthUser } from './interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0 = inject(Auth0Service, { optional: true });

  constructor() {
    console.log('AuthService initialized');
    console.log('Auth0 service available:', !!this.auth0);
  }

  readonly isAuthenticated$ = this.auth0?.isAuthenticated$ || of(false);
  readonly isLoading$ = this.auth0?.isLoading$ || of(false);
  readonly user$ = this.auth0?.user$.pipe(
    map(user => user ? {
      id: user.sub || '',
      email: user.email || '',
      name: user.name || '',
      picture: user.picture
    } : null)
  ) || of(null);
  readonly error$ = this.auth0?.error$ || of(null);

  login(): void {
    console.log('AuthService.login() called');
    if (this.auth0 && typeof window !== 'undefined') {
      this.auth0.loginWithRedirect();
    } else {
      console.warn('Auth0 service not available or running on server');
    }
  }

  loginWithProvider(provider: string): void {
    console.log('AuthService.loginWithProvider() called with:', provider);
    if (this.auth0 && typeof window !== 'undefined') {
      this.auth0.loginWithRedirect({
        authorizationParams: {
          connection: provider
        }
      });
    } else {
      console.warn('Auth0 service not available or running on server');
    }
  }

  logout(): void {
    console.log('AuthService.logout() called');
    if (this.auth0 && typeof window !== 'undefined') {
      this.auth0.logout({
        logoutParams: {
          returnTo: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200'
        }
      });
    } else {
      console.warn('Auth0 service not available or running on server');
    }
  }

  getAuthUser(): Observable<AuthUser | null> {
    return this.user$;
  }

  getAccessToken(): Observable<string> {
    if (!this.auth0) {
      return of('');
    }
    return this.auth0.getAccessTokenSilently();
  }
} 