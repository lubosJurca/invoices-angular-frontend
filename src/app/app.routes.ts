import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { LoginPage } from './features/login-page/login-page';
import { authGuard } from './core/auth/auth-guard-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home',
  },
  {
    path: 'login',
    component: LoginPage,
    title: 'Login',
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./features/sign-up-page/sign-up-page').then((m) => m.SignUpPage),
    title: 'Sign Up',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/table-page/table-page').then((m) => m.TablePage),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./features/detail-page/detail-page').then(
            (m) => m.DetailPage
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage
      ),
  },
];
