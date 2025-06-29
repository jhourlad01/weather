# Weather Application

A secure Angular weather application with authentication and real-time weather data.

## Features

- User authentication with Auth0
- Real-time weather data from OpenWeatherMap API
- Protected routes with authentication guards
- Input validation and security measures
- Rate limiting for API calls
- Responsive design with Bootstrap

## Services

### Weather Service
Injectable service for weather data operations. Supports multiple weather providers through dependency injection. SOLID principle-compliant with interface segregation and dependency inversion.

### Authentication Service
Injectable service for user authentication and authorization. Handles Auth0 integration with proper abstraction layers. SOLID principle-compliant with single responsibility and dependency inversion.

Both services can be injected into components and support provider pattern for extensibility.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account
- OpenWeatherMap API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd weather
```

2. Install dependencies
```bash
npm install
```

3. Update environment files with your API keys and Auth0 configuration

4. Start development server
```bash
npm start
```

## API Integration

The application integrates with:
- OpenWeatherMap API for weather data
- Auth0 for authentication
- GitHub OAuth for social login

## License

This project is licensed under the MIT License.
