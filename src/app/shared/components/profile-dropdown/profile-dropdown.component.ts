import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface for dropdown menu items
 */
export interface MenuItem {
  /** Display text for the menu item */
  label: string;
  /** Action identifier for the menu item */
  action: string;
  /** Optional icon class */
  icon?: string;
  /** Whether to show on mobile only */
  mobileOnly?: boolean;
}

/**
 * Profile Dropdown Component
 * 
 * Displays a user profile dropdown menu with avatar and menu items.
 * Emits events when menu items are clicked.
 */
@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown position-relative">
      <button 
        class="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center gap-2" 
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        <div class="avatar-placeholder rounded-circle bg-secondary d-flex align-items-center justify-content-center" 
             style="width: 32px; height: 32px;">
          <i class="bi bi-person text-white"></i>
        </div>
        <span class="d-none d-md-inline">User</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end position-absolute">
        <li *ngFor="let item of menuItems" [class.d-lg-none]="item.mobileOnly">
          <button 
            class="dropdown-item d-flex align-items-center gap-2" 
            type="button"
            (click)="onItemClick(item)"
          >
            <i *ngIf="item.icon" [class]="item.icon"></i>
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .dropdown {
      position: relative;
    }
    
    .avatar-placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .dropdown-item:hover {
      background-color: #f8f9fa;
    }
    
    .dropdown-toggle::after {
      display: none;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 1000;
      min-width: 200px;
    }
  `]
})
export class ProfileDropdownComponent {
  /** Event emitter for menu item clicks */
  @Output() menuItemClick = new EventEmitter<MenuItem>();

  /** Available menu items */
  menuItems: MenuItem[] = [
    {
      label: 'Weather',
      action: 'weather',
      icon: 'bi bi-cloud-sun',
      mobileOnly: true
    },
    {
      label: 'Logout',
      action: 'logout',
      icon: 'bi bi-box-arrow-right'
    }
  ];

  /**
   * Handles menu item click events
   * 
   * @param item - The clicked menu item
   */
  onItemClick(item: MenuItem): void {
    this.menuItemClick.emit(item);
  }
} 