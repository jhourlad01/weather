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
Handles weather data operations with support for multiple providers through dependency injection.

### Authentication Service
Manages user authentication and authorization with Auth0 integration.

Both services follow SOLID principles and support the provider pattern for extensibility. The Weather Service uses dependency injection to switch between different weather data providers (OpenWeatherMap, mock data, etc.), while the Authentication Service provides a unified interface for different authentication methods. This architecture allows for easy testing, maintenance, and future enhancements without modifying existing components.

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

## Linting

To check code quality and enforce consistent style, run:

```bash
# Code quality check
npm run lint

# To automatically fix lint errors:
npm run lint:fix
```

## Testing

To run unit tests with Karma, use:

```bash
npm test
```

This will launch the test runner in watch mode. You can also configure or update tests in the `src/` directory.

## Git Hooks (Husky)

This project uses Husky to manage Git hooks. Automatically runs linting, tests, and security audit before each commit to ensure code quality. This ensures that only code that passes linting, tests, and security checks can be committed to the repository.

