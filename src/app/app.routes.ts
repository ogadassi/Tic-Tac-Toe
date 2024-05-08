import { Routes } from '@angular/router';
import { LayoutComponent } from './components/Layout-area/layout/layout.component';

export const routes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
