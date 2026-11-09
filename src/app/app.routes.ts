import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SpecialistsDirectoryComponent } from './pages/specialists-directory/specialists-directory';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'specialists',
    component: SpecialistsDirectoryComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];