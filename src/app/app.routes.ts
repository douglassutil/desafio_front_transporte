import { Routes } from '@angular/router';
import { HomeComponent } from './modules/logistic/pages/home/home.component';
import { DashboardComponent } from './modules/logistic/pages/dashboard/dashboard.component';
import { DeliveyComponent } from './modules/logistic/pages/delivey/delivey.component';

export const routes: Routes = [
  { path: 'home', title: 'Home', component: HomeComponent },
  { path: 'home', children: [
    { path: 'dashboard', title: 'Dashboard', component: DashboardComponent },
    { path: 'delivey', title: 'Lista de Entregas', component: DeliveyComponent },
  ]},  
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
