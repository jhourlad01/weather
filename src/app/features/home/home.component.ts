import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private authService = inject(AuthService);

  readonly isAuthenticated$ = this.authService.isAuthenticated$;
  readonly user$ = this.authService.getAuthUser();
  readonly error$ = this.authService.error$;

  loginWithProvider(provider: string): void {
    // Auth0 will handle the provider selection based on the connection parameter
    this.authService.loginWithProvider(provider);
  }

  clearError(): void {
    // For SSR compatibility, we'll let the Auth0 service handle error clearing
    // The error will be cleared when the user navigates or when Auth0 processes the error
    console.log('Error dismissed by user');
  }
} 