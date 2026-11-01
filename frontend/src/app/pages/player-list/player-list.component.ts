import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Player } from '../../core/player.model';
import { PlayerService } from '../../core/player.service';
import { errorMessage } from '../../core/error-message';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <section class="page">
      <div class="page-heading">
        <div><div class="eyebrow">VISÃO GERAL DA MESA</div><h1>Jogadores</h1><p>Seu lineup de hoje, em um só lugar.</p></div>
        <a class="button button-dark" routerLink="/players/new">Adicionar jogador <span>＋</span></a>
      </div>
      @if (message) { <div class="alert" role="alert">{{ message }}</div> }
      <div class="stats">
        <article class="stat-card"><span>JOGADORES NA MESA</span><strong>{{ players.length.toString().padStart(2, '0') }}</strong><small>participantes cadastrados</small></article>
        <article class="stat-card"><span>FICHAS EM JOGO</span><strong>{{ totalChips.toLocaleString('pt-BR') }}</strong><small>total distribuído</small></article>
        <article class="stat-card accent"><span>STACK MÉDIO</span><strong>{{ averageChips.toLocaleString('pt-BR') }}</strong><small>fichas por jogador</small></article>
      </div>
      <section class="table-card">
        <div class="table-title"><div><h2>Lineup atual</h2><p>Todos os jogadores que você acompanha.</p></div><span class="count">{{ players.length }} REGISTROS</span></div>
        @if (loading) { <div class="empty">Carregando jogadores...</div> }
        @else if (players.length === 0) {
          <div class="empty"><span class="empty-icon">♧</span><strong>A mesa está vazia.</strong><p>Cadastre o primeiro jogador para começar.</p><a routerLink="/players/new">Adicionar jogador <span>→</span></a></div>
        } @else {
          <div class="table-wrap">
            <table>
              <thead><tr><th>JOGADOR</th><th>APELIDO</th><th>FICHAS</th><th>ATUALIZADO</th><th><span class="visually-hidden">Ações</span></th></tr></thead>
              <tbody>
                @for (player of players; track player.id) {
                  <tr>
                    <td><span class="avatar">{{ initials(player.name) }}</span><strong>{{ player.name }}</strong></td>
                    <td><span class="nickname">{{ player.nickname }}</span></td>
                    <td><span class="chip-dot"></span><strong>{{ player.chips.toLocaleString('pt-BR') }}</strong></td>
                    <td class="updated">{{ player.updatedAt | date:'dd/MM/yyyy, HH:mm' }}</td>
                    <td class="actions"><a [routerLink]="['/players', player.id]" aria-label="Ver detalhes">↗</a><button type="button" (click)="remove(player)" [attr.aria-label]="'Excluir ' + player.nickname">×</button></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
      <div class="page-note"><span>♠</span> Os dados da sua mesa são privados e visíveis apenas para sua conta.</div>
    </section>
  `,
  styles: [`
    .page { max-width:1120px; margin:0 auto; padding:56px 28px 32px; }
    .page-heading { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:32px; }
    .eyebrow { color:#788a5b; font-size:9px; font-weight:700; letter-spacing:1.8px; }
    h1 { margin:8px 0 4px; font:500 42px/1.1 var(--font-display); letter-spacing:-1.5px; color:#1b2520; }
    .page-heading p,.table-title p { margin:0; color:#81887f; font-size:12px; }
    .button { display:flex; justify-content:space-between; align-items:center; gap:28px; padding:13px 16px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:600; }
    .button-dark { background:#17221d; color:#f6f7ef; }
    .button-dark:hover { background:#293a30; }
    .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:24px; }
    .stat-card { min-height:135px; display:flex; flex-direction:column; align-items:flex-start; padding:19px 22px; background:#fff; border:1px solid #e8ebe4; border-radius:5px; }
    .stat-card > span { color:#788178; font-size:9px; font-weight:700; letter-spacing:1.2px; }
    .stat-card strong { margin:9px 0 3px; font:500 31px/1.1 var(--font-display); color:#1d2821; letter-spacing:-.7px; }
    .stat-card small { color:#90968e; font-size:10px; }
    .stat-card.accent { background:#e9f0d7; border-color:#e9f0d7; }
    .stat-card.accent > span { color:#607442; }
    .table-card { background:#fff; border:1px solid #e8ebe4; border-radius:5px; }
    .table-title { display:flex; justify-content:space-between; align-items:center; padding:21px 23px; border-bottom:1px solid #edf0ea; }
    .table-title h2 { margin:0 0 5px; font:500 19px var(--font-display); }
    .count { color:#8a9289; font-size:8px; letter-spacing:1.2px; }
    .table-wrap { overflow:auto; }
    table { width:100%; border-collapse:collapse; text-align:left; white-space:nowrap; }
    th { padding:13px 22px; color:#8b928a; font-size:8px; letter-spacing:1.1px; font-weight:700; background:#fbfcf9; }
    td { padding:14px 22px; border-top:1px solid #eff1ed; color:#303b33; font-size:11px; }
    tbody tr:hover { background:#fcfdf9; }
    td:first-child { display:flex; align-items:center; gap:11px; }
    td:first-child strong,td:nth-child(3) strong { font-size:11px; font-weight:600; }
    .avatar { display:grid; place-items:center; width:29px; height:29px; border-radius:50%; background:#e7efd4; color:#596b39; font-size:9px; font-weight:700; }
    .nickname { color:#63704f; }
    .chip-dot { display:inline-block; width:7px; height:7px; margin-right:7px; border-radius:50%; background:#b8ce6d; }
    .updated { color:#858c84; font-size:10px; }
    .actions { text-align:right; }
    .actions a,.actions button { display:inline-grid; place-items:center; width:27px; height:27px; margin-left:5px; border:1px solid #e6e9e1; border-radius:3px; color:#47534a; background:white; text-decoration:none; cursor:pointer; font-size:14px; }
    .actions a:hover,.actions button:hover { border-color:#9aab79; background:#f2f6e8; }
    .empty { display:flex; flex-direction:column; align-items:center; padding:50px 20px; color:#81887f; font-size:12px; }
    .empty-icon { margin-bottom:8px; font-size:30px; color:#a9bc77; }
    .empty strong { color:#313d34; font-size:14px; }
    .empty p { margin:6px 0 12px; }
    .empty a { color:#556b35; font-weight:600; text-decoration:none; }
    .page-note { margin-top:18px; color:#899087; font-size:10px; }
    .page-note span { color:#839957; }
    .alert { margin-bottom:18px; padding:12px; background:#f9e9e5; color:#943e32; border-radius:4px; font-size:12px; }
    .visually-hidden { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
    @media(max-width:650px) { .page { padding:34px 16px 25px; } .page-heading { align-items:flex-start; gap:18px; flex-direction:column; } h1 { font-size:36px; } .stats { grid-template-columns:1fr; gap:8px; } .stat-card { min-height:108px; } th,td { padding-left:13px; padding-right:13px; } }
  `]
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  loading = true;
  message = '';

  constructor(private readonly playersApi: PlayerService) {}

  get totalChips(): number {
    return this.players.reduce((sum, player) => sum + player.chips, 0);
  }

  get averageChips(): number {
    return this.players.length ? Math.round(this.totalChips / this.players.length) : 0;
  }

  ngOnInit(): void {
    this.loadPlayers();
  }

  initials(name: string): string {
    return name.split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('');
  }

  remove(player: Player): void {
    if (!window.confirm(`Excluir ${player.nickname} da mesa? Essa ação não pode ser desfeita.`)) {
      return;
    }
    this.playersApi.delete(player.id).subscribe({
      next: () => this.players = this.players.filter(item => item.id !== player.id),
      error: error => this.message = errorMessage(error, 'Não foi possível excluir o jogador.')
    });
  }

  private loadPlayers(): void {
    this.playersApi.list().subscribe({
      next: players => {
        this.players = players;
        this.loading = false;
      },
      error: error => {
        this.message = errorMessage(error, 'Não foi possível carregar os jogadores.');
        this.loading = false;
      }
    });
  }
}
