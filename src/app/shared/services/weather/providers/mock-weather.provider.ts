import { Injectable } from '@angular/core';
import { WeatherProvider, WeatherRequest, WeatherResponse, WeatherData } from '../interfaces/weather.interface';

@Injectable()
export class MockWeatherProvider implements WeatherProvider {
  getName(): string {
    return 'Mock Weather Provider';
  }

  isAvailable(): boolean {
    // Always available for development/testing
    return true;
  }

  async getWeather(request: WeatherRequest): Promise<WeatherResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

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

    // Generate mock weather data
    const mockData: WeatherData = {
      city: this.capitalizeCity(request.city),
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

    return {
      data: mockData,
      error: null,
      success: true
    };
  }

  private capitalizeCity(cityName: string): string {
    if (!cityName) return '';
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  }
} 