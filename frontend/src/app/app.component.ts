import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    @if (auth.isAuthenticated()) {
      <header class="topbar">
        <a class="brand" routerLink="/players"><span class="brand-mark">♠</span> poker<span>ledger</span></a>
        <nav aria-label="Navegação principal">
          <a routerLink="/players" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Jogadores</a>
          <a routerLink="/players/new" routerLinkActive="active">Novo jogador</a>
        </nav>
        <div class="account">
          <span>{{ auth.username() }}</span>
          <button class="logout-button" type="button" (click)="auth.logout()">Sair <span aria-hidden="true">↗</span></button>
        </div>
      </header>
    }
    <main [class.authenticated]="auth.isAuthenticated()">
      <router-outlet />
    </main>
    <footer class="site-footer">POKER LEDGER <span>·</span> GESTÃO DE MESA</footer>
  `,
  styles: [`
    .topbar { height: 74px; padding: 0 clamp(20px, 6vw, 92px); display:flex; align-items:center; gap:64px; background:#101a18; color:#f8f6ef; }
    .brand { display:flex; gap:7px; align-items:center; color:#f8f6ef; font-family:var(--font-display); font-size:20px; font-weight:700; letter-spacing:-.7px; text-decoration:none; white-space:nowrap; }
    .brand > span:last-child { color:#b8c2b8; font-weight:400; }
    .brand-mark { display:grid; place-items:center; width:30px; height:30px; margin-right:4px; border:1px solid #53655b; border-radius:50%; color:#c9e177; font-size:17px; }
    nav { display:flex; align-items:center; gap:28px; flex:1; height:100%; }
    nav a { height:100%; display:flex; align-items:center; color:#aab5ac; text-decoration:none; font-size:13px; border-bottom:2px solid transparent; }
    nav a:hover, nav a.active { color:#fff; border-color:#c9e177; }
    .account { display:flex; align-items:center; gap:20px; color:#aab5ac; font-size:12px; }
    .logout-button { border:0; background:none; color:#f8f6ef; cursor:pointer; font:inherit; }
    .logout-button:hover { color:#c9e177; }
    main { min-height:calc(100vh - 128px); }
    main.authenticated { min-height:calc(100vh - 128px); }
    .site-footer { padding:18px 6vw; color:#89948a; text-align:center; font-size:9px; letter-spacing:1.6px; }
    .site-footer span { color:#c9e177; padding:0 6px; }
    @media (max-width:680px) { .topbar { padding:0 18px; gap:16px; height:66px; flex-wrap:wrap; } .brand { font-size:17px; } nav { gap:14px; } nav a { font-size:11px; } .account { gap:8px; } .account > span { display:none; } }
  `]
})
export class AppComponent {
  constructor(readonly auth: AuthService) {}
}
