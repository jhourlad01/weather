export const environment = {
  production: false,
  // Add other environment variables below as needed
  auth0: {
    domain: 'hrforge.auth0.com',
    clientId: 'XqJ0e10Bv4jYwFmi8Mhq7tLozGBJgGjv',
    redirectUri: 'http://localhost:4200',
    scope: 'openid profile email'
  },
  openWeatherMap: {
    apiKey: 'https://openweathermap.org/forecast16#geo16'
  }
}; 