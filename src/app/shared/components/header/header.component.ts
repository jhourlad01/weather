import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BrandComponent } from '../brand/brand.component';
import { ProfileDropdownComponent, MenuItem } from '../profile-dropdown/profile-dropdown.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, BrandComponent, ProfileDropdownComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly isAuthenticated$ = this.authService.isAuthenticated$;

  onMenuItemClick(item: MenuItem): void {
    console.log('Menu item clicked:', item.action);
    // Handle menu item actions here
    switch (item.action) {
      case 'weather':
        this.router.navigate(['/']);
        break;
      case 'logout':
        console.log('Logout clicked');
        break;
    }
  }
} 