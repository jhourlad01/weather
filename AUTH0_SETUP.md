# Auth0 Setup Guide

## Prerequisites
- Auth0 account (sign up at https://auth0.com)
- Angular application

## Step 1: Create Auth0 Application

1. Log in to your Auth0 dashboard
2. Go to **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Single Page Application**
5. Name your application (e.g., "WeatherApp")
6. Click **Create**

## Step 2: Configure Auth0 Application

1. In your application settings, note down:
   - **Domain** (e.g., `your-tenant.auth0.com`)
   - **Client ID**

2. Configure **Allowed Callback URLs**:
   - Development: `http://localhost:4200`
   - Production: `https://your-domain.com`

3. Configure **Allowed Logout URLs**:
   - Development: `http://localhost:4200`
   - Production: `https://your-domain.com`

4. Configure **Allowed Web Origins**:
   - Development: `http://localhost:4200`
   - Production: `https://your-domain.com`

## Step 3: Update Environment Configuration

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  auth0: {
    domain: 'your-tenant.auth0.com',
    clientId: 'your-client-id',
    audience: 'https://your-api-identifier', // Optional: for API access
    redirectUri: window.location.origin
  }
};
```

Update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  auth0: {
    domain: 'your-tenant.auth0.com',
    clientId: 'your-client-id',
    audience: 'https://your-api-identifier', // Optional: for API access
    redirectUri: window.location.origin
  }
};
```

## Step 4: Configure Social Connections (Optional)

1. Go to **Authentication** → **Social**
2. Enable desired providers (GitHub, Google, etc.)
3. Configure each provider with their respective credentials

## Step 5: Test the Integration

1. Run your application: `npm start`
2. Navigate to the login page
3. Test authentication flow
4. Verify user information is displayed correctly

## Features Included

- ✅ Clean Auth0 service wrapper
- ✅ Authentication guard for protected routes
- ✅ User profile display
- ✅ Login/logout functionality
- ✅ Environment-based configuration
- ✅ Responsive UI components
- ✅ Error handling

## Usage Examples

### Protecting Routes
```typescript
import { authGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'protected', component: ProtectedComponent, canActivate: [authGuard] }
];
```

### Using Auth Service
```typescript
import { AuthService } from './shared/services/auth.service';

export class MyComponent {
  constructor(private auth: AuthService) {}

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
```

### Displaying User Info
```html
<div *ngIf="auth.isAuthenticated$ | async">
  Welcome, {{ (auth.user$ | async)?.name }}!
</div>
```

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**: Ensure callback URLs match exactly
2. **CORS Issues**: Add your domain to Allowed Web Origins
3. **Token Issues**: Check audience configuration for API access

### Debug Mode

Enable Auth0 debug mode in your browser console:
```javascript
localStorage.setItem('auth0.is.authenticated', 'true');
```

## Security Best Practices

1. Never commit real Auth0 credentials to version control
2. Use environment variables for production
3. Implement proper error handling
4. Use HTTPS in production
5. Regularly rotate client secrets 