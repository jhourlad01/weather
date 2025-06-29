// Export main weather service
export { WeatherService, WEATHER_PROVIDER } from './weather.service';

// Export interfaces
export type { 
  WeatherData, 
  WeatherError, 
  WeatherRequest, 
  WeatherResponse, 
  WeatherProvider,
  WeatherForecast,
  WeatherForecastInterval,
  WeatherForecastDaySummary,
  WeatherForecastResponse,
  CombinedWeatherData,
  CombinedWeatherResponse
} from './interfaces/weather.interface';

// Export providers
export { MockWeatherProvider } from './providers/mock-weather.provider';
export { OpenWeatherMapProvider } from './providers/openweathermap.provider'; 