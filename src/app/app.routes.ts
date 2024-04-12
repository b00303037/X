import { Routes } from '@angular/router';

// pages
import { HomeComponent } from './pages/home/home.component';
import { SubscriptionComponent } from './pages/home/subscription/subscription.component';
import { ServiceComponent } from './pages/home/service/service.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
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
    path: 'admin',
    component: AdminComponent,
  },
];
