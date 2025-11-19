import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'browse',
    loadChildren: () => import('./features/browse/browse.routes').then(m => m.BROWSE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'subject/:slug',
    loadComponent: () => import('./features/subject/subject.component').then(m => m.SubjectComponent),
    canActivate: [authGuard]
  },
  {
    path: 'lesson/:slug',
    loadComponent: () => import('./features/lesson/lesson.component').then(m => m.LessonComponent),
    canActivate: [authGuard]
  },
  {
    path: 'studio',
    loadChildren: () => import('./features/studio/studio.routes').then(m => m.STUDIO_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
