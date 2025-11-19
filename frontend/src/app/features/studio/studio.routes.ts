import { Routes } from '@angular/router';
import { StudioComponent } from './studio.component';

export const STUDIO_ROUTES: Routes = [
  { path: '', component: StudioComponent },
  {
    path: 'subject',
    loadComponent: () => import('./add-subject/add-subject.component').then(m => m.AddSubjectComponent)
  },
  {
    path: 'lesson',
    loadComponent: () => import('./add-lesson/add-lesson.component').then(m => m.AddLessonComponent)
  },
  {
    path: 'session',
    loadComponent: () => import('./add-session/add-session.component').then(m => m.AddSessionComponent)
  },
  {
    path: 'exercise',
    loadComponent: () => import('./add-exercise/add-exercise.component').then(m => m.AddExerciseComponent)
  },
  {
    path: 'manual',
    loadComponent: () => import('./add-manual/add-manual.component').then(m => m.AddManualComponent)
  }
];
