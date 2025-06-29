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

export interface WeatherForecastInterval {
  dateTime: string; // ISO string or formatted date/time
  temperature: string;
  description: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  pressure: string;
  visibility: string;
  icon?: string;
}

export interface WeatherForecastDaySummary {
  date: string; // YYYY-MM-DD
  minTemperature: string;
  maxTemperature: string;
  description: string;
  icon?: string;
}

export interface WeatherForecast {
  city: string;
  intervals: WeatherForecastInterval[];
  dailySummaries: WeatherForecastDaySummary[];
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

export interface WeatherForecastResponse {
  data: WeatherForecast | null;
  error: WeatherError | null;
  success: boolean;
}

export interface CombinedWeatherData {
  city: string;
  current: WeatherData;
  forecast: WeatherForecast;
  lastUpdated: string;
}

export interface CombinedWeatherResponse {
  data: CombinedWeatherData | null;
  error: WeatherError | null;
  success: boolean;
}

export interface WeatherProvider {
  getWeather(request: WeatherRequest): Promise<WeatherResponse>;
  getForecast?(request: WeatherRequest): Promise<WeatherForecastResponse>;
  getCombinedWeather?(request: WeatherRequest): Promise<CombinedWeatherResponse>;
  isAvailable(): boolean;
  getName(): string;
} 