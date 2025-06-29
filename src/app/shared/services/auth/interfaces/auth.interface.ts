import { Observable } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  profile?: string;
  nickname?: string;
}

export interface AuthError {
  error?: string;
  errorDescription?: string;
  url?: string;
}

export interface AuthProvider {
  readonly isAuthenticated$: Observable<boolean>;
  readonly isLoading$: Observable<boolean>;
  readonly user$: Observable<AuthUser | null>;
  readonly error$: Observable<AuthError | null>;
  
  login(): void;
  loginWithProvider(provider: string): void;
  logout(): void;
  getAccessToken(): Observable<string>;
} 