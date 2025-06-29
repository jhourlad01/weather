import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BrandComponent } from '../brand/brand.component';
import { CheckWeatherButtonComponent } from '../check-weather-button/check-weather-button.component';
import { GitHubLoginButtonComponent } from '../github-login-button/github-login-button.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, BrandComponent, CheckWeatherButtonComponent, GitHubLoginButtonComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  readonly isAuthenticated$ = this.authService.isAuthenticated$;
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  onCheckWeather(): void {
    // Navigate to weather page or trigger weather check
    this.router.navigate(['/weather']);
  }
} 