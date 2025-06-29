export interface WeatherData {
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

export interface WeatherError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface WeatherRequest {
  city: string;
  units?: 'metric' | 'imperial';
  lang?: string;
}

export interface WeatherResponse {
  data: WeatherData | null;
  error: WeatherError | null;
  success: boolean;
}

export interface WeatherProvider {
  getWeather(request: WeatherRequest): Promise<WeatherResponse>;
  isAvailable(): boolean;
  getName(): string;
} 