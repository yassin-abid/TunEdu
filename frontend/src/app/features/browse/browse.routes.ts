import { Routes } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { YearsComponent } from './years.component';
import { SubjectsComponent } from './subjects.component';

export const BROWSE_ROUTES: Routes = [
  { path: '', component: BrowseComponent },
  { path: ':slug', component: YearsComponent },
  { path: 'year/:slug', component: SubjectsComponent }
];
