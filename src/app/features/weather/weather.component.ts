import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { WeatherService } from '../../shared/services/weather/weather.service';
import { CombinedWeatherData } from '../../shared/services/weather/interfaces/weather.interface';
import { InputValidationUtil } from '../../shared/utils/input-validation.util';

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
  error: string | null = null;
  forecastViewMode: 'daily' | 'hourly' = 'daily'; // Track current view mode
  isDetectingLocation = false;
  locationError = '';
  isAutoDetectedLocation = false; // Track if location was auto-detected

  ngOnInit(): void {
    // Get city from query parameters
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || '';
      if (this.city) {
        this.getWeatherData();
      }
    });
    
    // Try to detect location on component initialization if no city is provided
    if (!this.city) {
      this.detectCurrentLocation();
    }
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

  // Format text in Title Case (initial caps per word)
  toTitleCase(text: string): string {
    if (!text) return '';
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Convert OpenWeatherMap icon code to Bootstrap icon class and color
  getWeatherIcon(iconCode: string | undefined): { icon: string; color: string } {
    if (!iconCode) return { icon: 'bi-cloud', color: 'text-white' };
    
    // OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
    const iconMap: Record<string, { icon: string; color: string }> = {
      // Clear sky
      '01d': { icon: 'bi-sun', color: 'text-warning' }, // clear sky day - yellow
      '01n': { icon: 'bi-moon', color: 'text-white' }, // clear sky night - white
      
      // Few clouds
      '02d': { icon: 'bi-cloud-sun', color: 'text-warning' }, // few clouds day - yellow
      '02n': { icon: 'bi-cloud-moon', color: 'text-white' }, // few clouds night - white
      
      // Scattered clouds
      '03d': { icon: 'bi-cloud', color: 'text-white' }, // scattered clouds - white
      '03n': { icon: 'bi-cloud', color: 'text-white' }, // scattered clouds - white
      
      // Broken clouds
      '04d': { icon: 'bi-clouds', color: 'text-white' }, // broken clouds - white
      '04n': { icon: 'bi-clouds', color: 'text-white' }, // broken clouds - white
      
      // Shower rain
      '09d': { icon: 'bi-cloud-rain', color: 'text-secondary' }, // shower rain - light gray
      '09n': { icon: 'bi-cloud-rain', color: 'text-secondary' }, // shower rain - light gray
      
      // Rain
      '10d': { icon: 'bi-cloud-drizzle', color: 'text-secondary' }, // rain day - light gray
      '10n': { icon: 'bi-cloud-drizzle', color: 'text-secondary' }, // rain night - light gray
      
      // Thunderstorm
      '11d': { icon: 'bi-lightning', color: 'text-secondary' }, // thunderstorm - light gray
      '11n': { icon: 'bi-lightning', color: 'text-secondary' }, // thunderstorm - light gray
      
      // Snow
      '13d': { icon: 'bi-snow', color: 'text-secondary' }, // snow - light gray
      '13n': { icon: 'bi-snow', color: 'text-secondary' }, // snow - light gray
      
      // Mist
      '50d': { icon: 'bi-cloud-fog', color: 'text-white' }, // mist - white
      '50n': { icon: 'bi-cloud-fog', color: 'text-white' } // mist - white
    };
    
    return iconMap[iconCode] || { icon: 'bi-cloud', color: 'text-white' };
  }

  // Toggle between daily and hourly forecast views
  toggleForecastView(): void {
    this.forecastViewMode = this.forecastViewMode === 'daily' ? 'hourly' : 'daily';
  }

  // Detect user's current location
  async detectCurrentLocation(): Promise<void> {
    if (!navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by this browser.';
      return;
    }

    this.isDetectingLocation = true;
    this.locationError = '';

    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get city name
      const cityName = await this.reverseGeocode(latitude, longitude);
      
      if (cityName) {
        this.city = cityName;
        this.getWeatherData();
        console.log('Detected location:', cityName);
        this.isAutoDetectedLocation = true;
      } else {
        this.locationError = 'Could not determine city name from location.';
      }
    } catch (error) {
      console.error('Location detection error:', error);
      this.locationError = 'Unable to detect your location. Please enter a city manually.';
    } finally {
      this.isDetectingLocation = false;
    }
  }

  // Get current position with timeout
  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, 10000); // 10 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve(position);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Reverse geocode coordinates to get city name
  private async reverseGeocode(lat: number, lon: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=1db6c89b928d822cefe85690762d4309`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Find the best city name with country info
        for (const location of data) {
          const cityName = location.name;
          const state = location.state;
          const country = location.country;
          
          // Skip generic names like "City", "Town", etc.
          if (this.isGenericName(cityName)) continue;
          
          // Format: "City, State, Country" or "City, Country"
          if (state && country) {
            return `${cityName}, ${state}, ${country}`;
          } else if (country) {
            return `${cityName}, ${country}`;
          } else {
            return cityName;
          }
        }
        
        // Fallback to first result if no good match found
        const firstLocation = data[0];
        if (firstLocation.country) {
          return `${firstLocation.name}, ${firstLocation.country}`;
        }
        return firstLocation.name;
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Check if a name is too generic
  private isGenericName(name: string): boolean {
    const genericNames = [
      'city', 'town', 'village', 'district', 'area', 'region', 'county', 'state',
      'province', 'country', 'municipality', 'borough', 'neighborhood'
    ];
    
    const lowerName = name.toLowerCase();
    return genericNames.some(generic => lowerName.includes(generic));
  }

  getWeatherData(): void {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name';
      return;
    }

    // Validate and sanitize city input
    const sanitizedCity = InputValidationUtil.sanitizeCityName(this.city);
    if (!sanitizedCity) {
      this.error = 'Please enter a valid city name (1-50 characters, letters, spaces, hyphens, apostrophes only)';
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.weatherService.getCombinedWeather(sanitizedCity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.weatherData = response.data;
          } else {
            this.error = response.error?.message || 'Failed to fetch weather data';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch weather data';
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
} 