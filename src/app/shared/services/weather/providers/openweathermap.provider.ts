import { Injectable } from '@angular/core';
import {
  WeatherProvider,
  WeatherRequest,
  WeatherResponse,
  WeatherData,
  WeatherForecastResponse,
  WeatherForecast,
  WeatherForecastInterval,
  WeatherForecastDaySummary,
  CombinedWeatherResponse,
  CombinedWeatherData
} from '../interfaces/weather.interface';
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
    icon: string;
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

interface OpenWeatherMapForecastResponse {
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      description: string;
      main: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    visibility: number;
    dt_txt: string;
  }[];
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

  async getForecast(request: WeatherRequest): Promise<WeatherForecastResponse> {
    try {
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
      const units = request.units || 'metric';
      const lang = request.lang || 'en';
      const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(request.city)}&appid=${this.apiKey}&units=${units}&lang=${lang}`;
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
      const data: OpenWeatherMapForecastResponse = await response.json();
      // Transform intervals
      const intervals: WeatherForecastInterval[] = data.list.map(item => ({
        dateTime: item.dt_txt,
        temperature: `${Math.round(item.main.temp)}°${units === 'metric' ? 'C' : 'F'}`,
        description: item.weather[0]?.description || 'Unknown',
        feelsLike: `Feels like ${Math.round(item.main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`,
        humidity: `${item.main.humidity}%`,
        windSpeed: `${item.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`,
        pressure: `${item.main.pressure} hPa`,
        visibility: item.visibility ? `${Math.round(item.visibility / 1000)} km` : 'Unknown',
        icon: item.weather[0]?.icon || undefined
      }));
      // Group by day for daily summaries
      const dailyMap = new Map<string, WeatherForecastDaySummary>();
      for (const item of data.list) {
        const date = item.dt_txt.split(' ')[0];
        const minTemp = Math.round(item.main.temp_min);
        const maxTemp = Math.round(item.main.temp_max);
        const description = item.weather[0]?.description || 'Unknown';
        const icon = item.weather[0]?.icon || undefined;
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            minTemperature: `${minTemp}°${units === 'metric' ? 'C' : 'F'}`,
            maxTemperature: `${maxTemp}°${units === 'metric' ? 'C' : 'F'}`,
            description,
            icon
          });
        } else {
          const summary = dailyMap.get(date)!;
          summary.minTemperature = `${Math.min(parseInt(summary.minTemperature), minTemp)}°${units === 'metric' ? 'C' : 'F'}`;
          summary.maxTemperature = `${Math.max(parseInt(summary.maxTemperature), maxTemp)}°${units === 'metric' ? 'C' : 'F'}`;
        }
      }
      const dailySummaries = Array.from(dailyMap.values());
      const forecast: WeatherForecast = {
        city: data.city.name,
        intervals,
        dailySummaries
      };
      return {
        data: forecast,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('OpenWeatherMap API error (forecast):', error);
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

  async getCombinedWeather(request: WeatherRequest): Promise<CombinedWeatherResponse> {
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

      // Fetch both current weather and forecast in parallel
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        this.getWeather(request),
        this.getForecast(request)
      ]);

      // Check for errors in either response
      if (!currentWeatherResponse.success) {
        return {
          data: null,
          error: currentWeatherResponse.error,
          success: false
        };
      }

      if (!forecastResponse.success) {
        return {
          data: null,
          error: forecastResponse.error,
          success: false
        };
      }

      // Combine the data
      const combinedData: CombinedWeatherData = {
        city: currentWeatherResponse.data!.city,
        current: currentWeatherResponse.data!,
        forecast: forecastResponse.data!,
        lastUpdated: new Date().toISOString()
      };

      return {
        data: combinedData,
        error: null,
        success: true
      };

    } catch (error) {
      console.error('OpenWeatherMap combined API error:', error);
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