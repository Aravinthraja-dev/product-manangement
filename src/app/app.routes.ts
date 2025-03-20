import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditProductComponent } from './components/pages/edit-product/edit-product.component';

export const routes: Routes = [
    { path: '',  redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'add', component: EditProductComponent },
    { path: 'edit/:id', component: EditProductComponent }
    
];
