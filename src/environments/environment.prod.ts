export const environment = {
  production: true,
  // Add other environment variables below as needed
  auth0: {
    domain: '',
    clientId: '',
    redirectUri: 'https://your-domain.com',
    scope: 'openid profile email'
  },
  openWeatherMap: {
    apiKey: 'YOUR_OPENWEATHERMAP_API_KEY_HERE'
  }
}; 