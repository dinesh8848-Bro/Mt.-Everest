import { Routes } from '@angular/router';
import { UserList } from './features/user-list/user-list';

export const routes: Routes = [
  { path: 'users', component: UserList },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];