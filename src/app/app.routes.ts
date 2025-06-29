import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layouts/layout.component';
import { HomeComponent } from './features/home/home.component';
import { WeatherComponent } from './features/weather/weather.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'weather',
        component: WeatherComponent
      }
    ]
  }
];
