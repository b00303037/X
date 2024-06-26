import { Routes } from '@angular/router';

// pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/home/login/login.component';
import { SubscriptionComponent } from './pages/home/subscription/subscription.component';
import { ServiceComponent } from './pages/home/service/service.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'subscription',
        component: SubscriptionComponent,
      },
      {
        path: 'service',
        component: ServiceComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'subscription',
  },
];
