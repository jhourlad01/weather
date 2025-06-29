import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { AuthUser } from '../../shared/services/auth/interfaces/auth.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isAuthenticated$ = this.authService.isAuthenticated$;
  readonly user$ = this.authService.getAuthUser();
  readonly error$ = this.authService.error$;

  // City input field
  currentCity = '';

  loginWithProvider(provider: string): void {
    // Auth0 will handle the provider selection based on the connection parameter
    this.authService.loginWithProvider(provider);
  }

  clearError(): void {
    // For SSR compatibility, we'll let the Auth0 service handle error clearing
    // The error will be cleared when the user navigates or when Auth0 processes the error
    console.log('Error dismissed by user');
  }

  // Generate GitHub URL from user data
  getGitHubUrl(user: AuthUser | null): string {
    if (!user || !user.id) return '';
    
    // Extract username from Auth0 user ID (format: github|123456)
    const githubId = user.id.split('|')[1];
    if (githubId) {
      return `https://github.com/user/${githubId}`;
    }
    
    // Fallback: try to extract from email or name
    if (user.email && user.email.includes('@')) {
      const username = user.email.split('@')[0];
      return `https://github.com/${username}`;
    }
    
    return '';
  }

  // Navigate to weather page with city parameter
  checkWeather(): void {
    if (this.currentCity.trim()) {
      // Navigate to weather page with city parameter
      this.router.navigate(['/weather'], { 
        queryParams: { city: this.currentCity.trim() } 
      });
    } else {
      // Navigate to weather page without city parameter
      this.router.navigate(['/weather']);
    }
  }

  // Check if user has a valid GitHub URL
  hasGitHubUrl(user: AuthUser | null): boolean {
    return !!this.getGitHubUrl(user);
  }
} 