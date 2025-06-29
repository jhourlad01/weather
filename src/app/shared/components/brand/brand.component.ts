import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="routerLink" class="brand-link d-flex align-items-center" [class]="linkClass">
      <i class="bi bi-sun me-2" [style]="iconStyle"></i>
      <span class="fw-bold" [class]="textClass" [style]="textStyle">{{ brandName }}</span>
    </a>
  `,
  styles: [`
    .brand-link {
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .brand-link:hover {
      transform: translateY(-1px);
      opacity: 0.9;
    }
    
    .brand-link.navbar-brand {
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.025em;
      color: #1D1D1F;
    }
    
    .brand-link.footer-brand {
      font-weight: 700;
      font-size: 1.125rem;
      letter-spacing: -0.025em;
      color: #1D1D1F;
    }
    
    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .brand-link.navbar-brand,
      .brand-link.footer-brand {
        color: #FFFFFF;
      }
    }
  `]
})
export class BrandComponent {
  @Input() brandName = 'WeatherApp';
  @Input() routerLink = '/';
  @Input() variant: 'navbar' | 'footer' = 'navbar';
  @Input() iconSize = '2.625rem';
  @Input() textSize = 'fs-4';

  readonly textStyle = 'letter-spacing: -0.02em;';

  get linkClass(): string {
    return this.variant === 'navbar' ? 'navbar-brand' : 'footer-brand';
  }

  get textClass(): string {
    return this.textSize;
  }

  get iconStyle(): string {
    return `font-size: ${this.iconSize}; line-height: 1; display: inline-flex; align-items: center; color: #FFD700;`;
  }
} 