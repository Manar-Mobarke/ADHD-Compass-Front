import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SpecialistsDirectoryComponent } from './pages/specialists-directory/specialists-directory';
import { RegistrationTypeSelectionComponent } from './pages/registration-type-selection/registration-type-selection';
import { AccountRegistrationComponent } from './pages/account-registration/account-registration';
import { SignInComponent } from './pages/sign-in/sign-in';
import { SpecialistRegistrationComponent } from './pages/specialist-registration/specialist-registration';

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
    path: 'register',
    component: RegistrationTypeSelectionComponent
  },
  {
    path: 'login',
    component: SignInComponent
  },
  {
    path: 'self-register',
    component: AccountRegistrationComponent,
    data: { accountType: 'self' }
  },
  {
    path: 'parent-register',
    component: AccountRegistrationComponent,
    data: { accountType: 'parent' }
  },
  {
    path: 'specialist-register',
    component: SpecialistRegistrationComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];