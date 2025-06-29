import { Injectable, inject, InjectionToken } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherProvider, WeatherRequest, WeatherResponse, WeatherData, WeatherForecastResponse, CombinedWeatherResponse } from './interfaces/weather.interface';
import { RateLimiterService } from '../rate-limiter.service';

// Injection token for weather provider
export const WEATHER_PROVIDER = new InjectionToken<WeatherProvider>('WEATHER_PROVIDER');

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherProvider = inject(WEATHER_PROVIDER, { optional: true });
  private rateLimiter = inject(RateLimiterService);

  // Rate limiting configuration for weather API calls
  private readonly rateLimitConfig = {
    maxRequests: 30, // 30 requests
    timeWindow: 60000 // per minute
  };

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

    // Check rate limiting
    const rateLimitKey = `weather-api-${city.toLowerCase()}`;
    if (!this.rateLimiter.isAllowed(rateLimitKey, this.rateLimitConfig)) {
      const status = this.rateLimiter.getStatus(rateLimitKey, this.rateLimitConfig);
      return throwError(() => new Error(`Rate limit exceeded. Please wait ${Math.ceil(status.timeUntilReset / 1000)} seconds before trying again.`));
    }

    const request: WeatherRequest = {
      city: city.trim(),
      units,
      lang
    };

    return from(this.weatherProvider.getWeather(request)).pipe(
      catchError((error: Error | unknown) => {
        console.error('Weather service error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
        return of({
          data: null,
          error: {
            message: errorMessage,
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

  /**
   * Get 5-day/3-hour weather forecast for a city
   * @param city - The city name
   * @param units - Temperature units (metric/imperial)
   * @param lang - Language for weather descriptions
   * @returns Observable of weather forecast response
   */
  getForecast(city: string, units: 'metric' | 'imperial' = 'metric', lang = 'en'): Observable<WeatherForecastResponse> {
    if (!this.weatherProvider || typeof this.weatherProvider.getForecast !== 'function') {
      return throwError(() => new Error('Forecast not supported by this provider'));
    }
    if (!this.weatherProvider.isAvailable()) {
      return throwError(() => new Error(`Weather provider ${this.weatherProvider?.getName()} is not available`));
    }

    // Check rate limiting
    const rateLimitKey = `weather-forecast-${city.toLowerCase()}`;
    if (!this.rateLimiter.isAllowed(rateLimitKey, this.rateLimitConfig)) {
      const status = this.rateLimiter.getStatus(rateLimitKey, this.rateLimitConfig);
      return throwError(() => new Error(`Rate limit exceeded. Please wait ${Math.ceil(status.timeUntilReset / 1000)} seconds before trying again.`));
    }

    const request = { city: city.trim(), units, lang };
    return from(this.weatherProvider.getForecast(request)).pipe(
      catchError((error: Error | unknown) => {
        console.error('Weather forecast service error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather forecast';
        return of({
          data: null,
          error: {
            message: errorMessage,
            code: 'SERVICE_ERROR'
          },
          success: false
        });
      })
    );
  }

  /**
   * Get combined current weather and 5-day forecast for a city
   * @param city - The city name
   * @param units - Temperature units (metric/imperial)
   * @param lang - Language for weather descriptions
   * @returns Observable of combined weather response
   */
  getCombinedWeather(city: string, units: 'metric' | 'imperial' = 'metric', lang = 'en'): Observable<CombinedWeatherResponse> {
    if (!this.weatherProvider || typeof this.weatherProvider.getCombinedWeather !== 'function') {
      return throwError(() => new Error('Combined weather not supported by this provider'));
    }
    if (!this.weatherProvider.isAvailable()) {
      return throwError(() => new Error(`Weather provider ${this.weatherProvider?.getName()} is not available`));
    }

    // Check rate limiting
    const rateLimitKey = `weather-combined-${city.toLowerCase()}`;
    if (!this.rateLimiter.isAllowed(rateLimitKey, this.rateLimitConfig)) {
      const status = this.rateLimiter.getStatus(rateLimitKey, this.rateLimitConfig);
      return throwError(() => new Error(`Rate limit exceeded. Please wait ${Math.ceil(status.timeUntilReset / 1000)} seconds before trying again.`));
    }

    const request = { city: city.trim(), units, lang };
    return from(this.weatherProvider.getCombinedWeather(request)).pipe(
      catchError((error: Error | unknown) => {
        console.error('Combined weather service error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch combined weather data';
        return of({
          data: null,
          error: {
            message: errorMessage,
            code: 'SERVICE_ERROR'
          },
          success: false
        });
      })
    );
  }

  /**
   * Get rate limit status for a city
   * @param city - The city name
   * @returns rate limit status information
   */
  getRateLimitStatus(city: string): {
    isAllowed: boolean;
    remainingRequests: number;
    timeUntilReset: number;
    isRateLimited: boolean;
  } {
    const rateLimitKey = `weather-api-${city.toLowerCase()}`;
    return this.rateLimiter.getStatus(rateLimitKey, this.rateLimitConfig);
  }
} 