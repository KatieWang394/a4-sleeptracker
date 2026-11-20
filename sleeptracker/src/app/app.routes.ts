import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage),
      },
      {
        path: 'sleep',
        loadComponent: () => import('./sleep/sleep.page').then(m => m.SleepPage),
      },
      {
        path: 'history',
        loadComponent: () => import('./history/history.page').then(m => m.HistoryPage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  // 旧地址仍可打开，统一转到带导航栏的新地址
  { path: 'home', redirectTo: 'tabs/home', pathMatch: 'full' },
  { path: 'sleep', redirectTo: 'tabs/sleep', pathMatch: 'full' },
  { path: 'history', redirectTo: 'tabs/history', pathMatch: 'full' },
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
];