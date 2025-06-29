import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-weather-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './check-weather-button.component.html',
  styleUrls: ['./check-weather-button.component.scss']
})
export class CheckWeatherButtonComponent {
  @Input() loading = false;
} 