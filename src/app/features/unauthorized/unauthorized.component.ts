import { Component } from '@angular/core';
import { GitHubLoginButtonComponent } from '../../shared/components/github-login-button/github-login-button.component';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [GitHubLoginButtonComponent],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
} 