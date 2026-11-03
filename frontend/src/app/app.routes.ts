import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PlayerListComponent } from './pages/player-list/player-list.component';
import { PlayerFormComponent } from './pages/player-form/player-form.component';
import { PlayerDetailComponent } from './pages/player-detail/player-detail.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'players', component: PlayerListComponent, canActivate: [authGuard] },
  { path: 'players/new', component: PlayerFormComponent, canActivate: [authGuard], data: { mode: 'create' } },
  { path: 'players/:id', component: PlayerDetailComponent, canActivate: [authGuard] },
  { path: 'players/:id/edit', component: PlayerFormComponent, canActivate: [authGuard], data: { mode: 'edit' } },
  { path: '', pathMatch: 'full', redirectTo: 'players' },
  { path: '**', redirectTo: 'players' }
];
