import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { AuthUser } from '../../shared/services/auth/interfaces/auth.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isAuthenticated$ = this.authService.isAuthenticated$;
  readonly user$ = this.authService.getAuthUser();
  readonly error$ = this.authService.error$;

  // City input field
  currentCity = '';
  isDetectingLocation = false;
  locationError = '';
  isAutoDetectedLocation = false; // Track if location was auto-detected

  constructor() {
    // Try to detect location on component initialization
    this.detectCurrentLocation();
  }

  // Detect user's current location
  async detectCurrentLocation(): Promise<void> {
    if (!navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by this browser.';
      return;
    }

    this.isDetectingLocation = true;
    this.locationError = '';

    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get city name
      const cityName = await this.reverseGeocode(latitude, longitude);
      
      if (cityName) {
        this.currentCity = cityName;
        this.isAutoDetectedLocation = true; // Mark as auto-detected
        console.log('Detected location:', cityName);
      } else {
        this.locationError = 'Could not determine city name from location.';
      }
    } catch (error) {
      console.error('Location detection error:', error);
      this.locationError = 'Unable to detect your location. Please enter a city manually.';
    } finally {
      this.isDetectingLocation = false;
    }
  }

  // Get current position with timeout
  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, 10000); // 10 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve(position);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Reverse geocode coordinates to get city name
  private async reverseGeocode(lat: number, lon: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${environment.openWeatherMap.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Find the best city name with country info
        for (const location of data) {
          const cityName = location.name;
          const state = location.state;
          const country = location.country;
          
          // Skip generic names like "City", "Town", etc.
          if (this.isGenericName(cityName)) continue;
          
          // Format: "City, State, Country" or "City, Country"
          if (state && country) {
            return `${cityName}, ${state}, ${country}`;
          } else if (country) {
            return `${cityName}, ${country}`;
          } else {
            return cityName;
          }
        }
        
        // Fallback to first result if no good match found
        const firstLocation = data[0];
        if (firstLocation.country) {
          return `${firstLocation.name}, ${firstLocation.country}`;
        }
        return firstLocation.name;
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Check if a name is too generic
  private isGenericName(name: string): boolean {
    const genericNames = [
      'city', 'town', 'village', 'district', 'area', 'region', 'county', 'state',
      'province', 'country', 'municipality', 'borough', 'neighborhood'
    ];
    
    const lowerName = name.toLowerCase();
    return genericNames.some(generic => lowerName.includes(generic));
  }

  loginWithProvider(provider: string): void {
    // Auth0 will handle the provider selection based on the connection parameter
    this.authService.loginWithProvider(provider);
  }

  clearError(): void {
    // For SSR compatibility, we'll let the Auth0 service handle error clearing
    // The error will be cleared when the user navigates or when Auth0 processes the error
    console.log('Error dismissed by user');
  }

  // Generate GitHub URL from user data
  getGitHubUrl(user: AuthUser | null): string {
    if (!user) return '';
    
    // Auth0 provides the GitHub profile URL directly in the profile field
    if (user.profile) {
      return user.profile;
    }
    
    // Fallback: try to construct from nickname (GitHub username)
    if (user.nickname) {
      return `https://github.com/${user.nickname}`;
    }
    
    // Fallback: try to construct from email or name if profile/nickname are not available
    if (user.email) {
      // GitHub noreply email format: username@users.noreply.github.com
      if (user.email.includes('@users.noreply.github.com')) {
        const username = user.email.split('@')[0];
        return `https://github.com/${username}`;
      }
      
      // Regular email format: try to extract username
      if (user.email.includes('@')) {
        const username = user.email.split('@')[0];
        return `https://github.com/${username}`;
      }
    }
    
    // Fallback: use the user's name (remove spaces and convert to lowercase)
    if (user.name) {
      const username = user.name.toLowerCase().replace(/\s+/g, '');
      return `https://github.com/${username}`;
    }
    
    // If no profile, nickname, email, or name, don't show the link
    return '';
  }

  // Navigate to weather page with city parameter
  checkWeather(): void {
    if (this.currentCity.trim()) {
      // Navigate to weather page with city parameter
      this.router.navigate(['/weather'], { 
        queryParams: { city: this.currentCity.trim() } 
      });
    } else {
      // Navigate to weather page without city parameter
      this.router.navigate(['/weather']);
    }
  }

  // Check if user has a valid GitHub URL
  hasGitHubUrl(user: AuthUser | null): boolean {
    return !!this.getGitHubUrl(user);
  }
} 