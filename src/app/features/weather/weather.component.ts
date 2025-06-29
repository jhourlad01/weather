import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { 
  WeatherService, 
  CombinedWeatherData
} from '../../shared/services/weather';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  private destroy$ = new Subject<void>();

  city = '';
  weatherData: CombinedWeatherData | null = null;
  loading = false;
  error = '';

  ngOnInit(): void {
    // Get city from query parameters
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || '';
      if (this.city) {
        this.getWeatherData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Capitalize first letter of city name
  capitalizeCity(cityName: string): string {
    if (!cityName) return '';
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  }

  getWeatherData(): void {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name';
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.weatherService.getCombinedWeather(this.city)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.data) {
            this.weatherData = response.data;
          } else {
            this.error = response.error?.message || 'Failed to fetch weather data';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'An error occurred while fetching weather data';
          console.error('Weather service error:', error);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
} 