import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface WeatherData {
  city: string;
  temperature: string;
  description: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  pressure: string;
  visibility: string;
  uvIndex: string;
  sunrise: string;
  sunset: string;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  city = '';
  weatherData: WeatherData | null = null;
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
    
    // TODO: Implement actual weather API call
    // For now, simulate API call with more comprehensive data
    setTimeout(() => {
      this.loading = false;
      const capitalizedCity = this.capitalizeCity(this.city);
      this.weatherData = {
        city: capitalizedCity,
        temperature: '22°C',
        description: 'Partly Cloudy',
        feelsLike: 'Feels like 24°C',
        humidity: '65%',
        windSpeed: '12 km/h',
        pressure: '1013 hPa',
        visibility: '10 km',
        uvIndex: 'Moderate (5)',
        sunrise: '06:30 AM',
        sunset: '07:45 PM'
      };
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
} 