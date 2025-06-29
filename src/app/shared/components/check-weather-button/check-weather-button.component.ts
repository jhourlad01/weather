import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-weather-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn btn-primary btn-lg px-4 py-2"
      [disabled]="loading">
      <i class="bi bi-cloud-sun me-2"></i>
      {{ loading ? 'Loading...' : 'Check Weather' }}
    </button>
  `,
  styles: [`
    .btn {
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    .btn:disabled {
      transform: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class CheckWeatherButtonComponent {
  @Input() loading = false;
} 