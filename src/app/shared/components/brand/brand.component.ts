import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent {
  @Input() brandName = 'WeatherApp';
  @Input() routerLink = '/';

  readonly iconClass = 'bi bi-sun me-2 fs-3 text-warning';
  readonly brandClass = 'navbar-brand fw-bold fs-4';
} 