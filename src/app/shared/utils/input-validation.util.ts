/**
 * Input validation utilities for security
 */

export class InputValidationUtil {
  
  /**
   * Validates city name input
   * @param city - The city name to validate
   * @returns true if valid, false otherwise
   */
  static validateCityName(city: string): boolean {
    if (!city || typeof city !== 'string') {
      return false;
    }
    
    const trimmedCity = city.trim();
    
    // Check length (1-50 characters)
    if (trimmedCity.length < 1 || trimmedCity.length > 50) {
      return false;
    }
    
    // Allow letters, spaces, hyphens, apostrophes, and some special characters
    // This regex allows international city names while preventing XSS
    const cityRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s\-'.,()]+$/;
    
    return cityRegex.test(trimmedCity);
  }
  
  /**
   * Sanitizes city name input
   * @param city - The city name to sanitize
   * @returns sanitized city name or empty string if invalid
   */
  static sanitizeCityName(city: string): string {
    if (!this.validateCityName(city)) {
      return '';
    }
    
    return city.trim();
  }
  
  /**
   * Prevents XSS by escaping HTML characters
   * @param text - The text to escape
   * @returns escaped text
   */
  static escapeHtml(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
  }
} 