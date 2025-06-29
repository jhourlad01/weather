import { Injectable, inject, InjectionToken } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherProvider, WeatherRequest, WeatherResponse, WeatherData } from './interfaces/weather.interface';

// Injection token for weather provider
export const WEATHER_PROVIDER = new InjectionToken<WeatherProvider>('WEATHER_PROVIDER');

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherProvider = inject(WEATHER_PROVIDER, { optional: true });

  constructor() {
    console.log('WeatherService initialized');
    console.log('Weather provider available:', !!this.weatherProvider);
  }

  /**
   * Get weather data for a city
   * @param city - The city name
   * @param units - Temperature units (metric/imperial)
   * @param lang - Language for weather descriptions
   * @returns Observable of weather response
   */
  getWeather(city: string, units: 'metric' | 'imperial' = 'metric', lang = 'en'): Observable<WeatherResponse> {
    if (!this.weatherProvider) {
      return throwError(() => new Error('No weather provider available'));
    }

    if (!this.weatherProvider.isAvailable()) {
      return throwError(() => new Error(`Weather provider ${this.weatherProvider?.getName()} is not available`));
    }

    const request: WeatherRequest = {
      city: city.trim(),
      units,
      lang
    };

    return from(this.weatherProvider.getWeather(request)).pipe(
      catchError(error => {
        console.error('Weather service error:', error);
        return of({
          data: null,
          error: {
            message: error.message || 'Failed to fetch weather data',
            code: 'SERVICE_ERROR'
          },
          success: false
        });
      })
    );
  }

  /**
   * Get weather data as a simple observable
   * @param city - The city name
   * @returns Observable of weather data or null
   */
  getWeatherData(city: string): Observable<WeatherData | null> {
    return this.getWeather(city).pipe(
      map(response => response.data)
    );
  }

  /**
   * Check if weather service is available
   * @returns boolean indicating if service is available
   */
  isAvailable(): boolean {
    return !!this.weatherProvider && this.weatherProvider.isAvailable();
  }

  /**
   * Get the name of the current weather provider
   * @returns provider name or 'None'
   */
  getProviderName(): string {
    return this.weatherProvider?.getName() || 'None';
  }
} 