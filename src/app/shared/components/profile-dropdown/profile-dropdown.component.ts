import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
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