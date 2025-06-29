import { Injectable } from '@angular/core';
import { WeatherProvider, WeatherRequest, WeatherResponse, WeatherData } from '../interfaces/weather.interface';
import { environment } from '../../../../../environments/environment';

// OpenWeatherMap API response interfaces
interface OpenWeatherMapResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  dt: number;
}

interface OpenWeatherMapError {
  cod: string;
  message: string;
}

@Injectable()
export class OpenWeatherMapProvider implements WeatherProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = environment.openWeatherMap?.apiKey || '';
  }

  getName(): string {
    return 'OpenWeatherMap';
  }

  isAvailable(): boolean {
    // Check if we're on the client side and have an API key
    return typeof window !== 'undefined' && !!this.apiKey;
  }

  async getWeather(request: WeatherRequest): Promise<WeatherResponse> {
    try {
      // Validate request
      if (!request.city || request.city.trim() === '') {
        return {
          data: null,
          error: {
            message: 'City name is required',
            code: 'INVALID_CITY'
          },
          success: false
        };
      }

      // Check if provider is available
      if (!this.isAvailable()) {
        return {
          data: null,
          error: {
            message: 'OpenWeatherMap provider is not available. Please check API key configuration.',
            code: 'PROVIDER_UNAVAILABLE'
          },
          success: false
        };
      }

      // Build API URL
      const units = request.units || 'metric';
      const lang = request.lang || 'en';
      const url = `${this.baseUrl}/weather?q=${encodeURIComponent(request.city)}&appid=${this.apiKey}&units=${units}&lang=${lang}`;

      // Make API call
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData: OpenWeatherMapError = await response.json();
        return {
          data: null,
          error: {
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            code: errorData.cod || 'API_ERROR',
            details: { status: response.status, statusText: response.statusText }
          },
          success: false
        };
      }

      const data: OpenWeatherMapResponse = await response.json();
      
      // Transform OpenWeatherMap data to our format
      const weatherData: WeatherData = {
        city: data.name,
        temperature: `${Math.round(data.main.temp)}°${units === 'metric' ? 'C' : 'F'}`,
        description: data.weather[0]?.description || 'Unknown',
        feelsLike: `Feels like ${Math.round(data.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`,
        pressure: `${data.main.pressure} hPa`,
        visibility: data.visibility ? `${Math.round(data.visibility / 1000)} km` : 'Unknown',
        uvIndex: 'Not available', // OpenWeatherMap free tier doesn't include UV index
        sunrise: this.formatTime(data.sys.sunrise),
        sunset: this.formatTime(data.sys.sunset)
      };

      return {
        data: weatherData,
        error: null,
        success: true
      };

    } catch (error) {
      console.error('OpenWeatherMap API error:', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'NETWORK_ERROR',
          details: { originalError: error }
        },
        success: false
      };
    }
  }

  private formatTime(timestamp: number): string {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Unknown';
    }
  }
} 