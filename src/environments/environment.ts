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
    apiKey: '1db6c89b928d822cefe85690762d4309'
  }
}; 