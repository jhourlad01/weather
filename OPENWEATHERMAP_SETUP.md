# OpenWeatherMap Setup Guide

This application uses OpenWeatherMap API to provide real weather data. Follow these steps to configure your API key:

## 1. Get an OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to your API keys section
4. Generate a new API key (the free tier includes 1000 calls/day)

## 2. Configure the API Key

### Development Environment
Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  auth0: {
    // ... existing auth0 config
  },
  openWeatherMap: {
    apiKey: 'YOUR_ACTUAL_API_KEY_HERE' // Replace with your real API key
  }
};
```

### Production Environment
Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  auth0: {
    // ... existing auth0 config
  },
  openWeatherMap: {
    apiKey: 'YOUR_ACTUAL_API_KEY_HERE' // Replace with your real API key
  }
};
```

## 3. Features

The OpenWeatherMap provider includes:
- Real-time weather data for any city
- Temperature in Celsius or Fahrenheit
- Humidity, wind speed, pressure, and visibility
- Sunrise and sunset times
- Weather descriptions in multiple languages
- SSR-compatible (works with Angular Universal)

## 4. API Limits

- Free tier: 1000 calls/day
- Rate limit: 60 calls/minute
- Data refresh: Every 10 minutes for the same location

## 5. Error Handling

The provider includes comprehensive error handling for:
- Invalid API keys
- City not found
- Network errors
- Rate limiting
- Server-side rendering compatibility

## 6. Testing

To test the setup:
1. Start the development server: `npm start`
2. Navigate to the weather page
3. Enter a city name
4. Verify that real weather data is displayed

## Security Note

Never commit your actual API key to version control. Consider using environment variables or a secure configuration management system for production deployments. 