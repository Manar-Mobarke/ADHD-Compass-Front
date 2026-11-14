import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'specialists',
    loadComponent: () =>
      import('./pages/specialists-directory/specialists-directory').then(
        (module) => module.SpecialistsDirectoryComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/registration-type-selection/registration-type-selection').then(
        (module) => module.RegistrationTypeSelectionComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/sign-in/sign-in').then((module) => module.SignInComponent)
  },
  {
    path: 'self-register',
    loadComponent: () =>
      import('./pages/account-registration/account-registration').then(
        (module) => module.AccountRegistrationComponent
      ),
    data: { accountType: 'self' }
  },
  {
    path: 'parent-register',
    loadComponent: () =>
      import('./pages/account-registration/account-registration').then(
        (module) => module.AccountRegistrationComponent
      ),
    data: { accountType: 'parent' }
  },
  {
    path: 'specialist-register',
    loadComponent: () =>
      import('./pages/specialist-registration/specialist-registration').then(
        (module) => module.SpecialistRegistrationComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];