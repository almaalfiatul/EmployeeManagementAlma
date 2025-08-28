import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employee-create', loadComponent: () => import('./pages/dashboard/employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
  { path: 'employee-update', loadComponent: () => import('./pages/dashboard/employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
  { path: 'employee-detail', loadComponent: () => import('./pages/dashboard/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent) },
];
