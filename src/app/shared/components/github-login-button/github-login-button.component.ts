import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-github-login-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn btn-dark btn-sm d-flex align-items-center gap-2" 
      type="button"
      (click)="loginWithGitHub()"
    >
      <i class="bi bi-github"></i>
      <span class="d-none d-md-inline">Login with GitHub</span>
    </button>
  `,
  styles: [`
    .btn {
      transition: all 0.2s ease;
    }
    
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class GitHubLoginButtonComponent {
  private authService = inject(AuthService);

  loginWithGitHub(): void {
    this.authService.loginWithProvider('github');
  }
} 