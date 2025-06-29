import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandComponent } from '../brand/brand.component';
import { CheckWeatherButtonComponent } from '../check-weather-button/check-weather-button.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, BrandComponent, CheckWeatherButtonComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }
} 