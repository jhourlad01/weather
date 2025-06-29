import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layouts/layout.component';
import { HOME_ROUTES } from './features/home/home.routes';
import { WEATHER_ROUTES } from './features/weather/weather.routes';
import { authGuard } from './shared/guards/auth.guard';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        children: HOME_ROUTES
      },
      {
        path: 'weather',
        children: WEATHER_ROUTES,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  }
];
