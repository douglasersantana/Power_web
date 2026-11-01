import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Player } from '../../core/player.model';
import { PlayerService } from '../../core/player.service';
import { errorMessage } from '../../core/error-message';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <section class="page">
      <a class="back-link" routerLink="/players">← Voltar aos jogadores</a>
      @if (successMessage) { <div class="success" role="status">{{ successMessage }}</div> }
      @if (message) { <div class="alert" role="alert">{{ message }}</div> }
      @if (loading) { <div class="loading">Carregando jogador...</div> }
      @else if (player) {
        <div class="detail-heading">
          <div><div class="eyebrow">PERFIL DO JOGADOR</div><h1>{{ player.nickname }}</h1><p>{{ player.name }}</p></div>
          <a class="button button-dark" [routerLink]="['/players', player.id, 'edit']">Editar jogador <span>↗</span></a>
        </div>
        <div class="detail-grid">
          <article class="stack-card"><span class="card-label">STACK ATUAL</span><strong>{{ player.chips.toLocaleString('pt-BR') }}</strong><span class="chips-caption">◉ &nbsp;FICHAS NA MESA</span><div class="stack-footer">Valor atualizado em {{ player.updatedAt | date:'dd/MM/yyyy, HH:mm' }}</div></article>
          <article class="info-card"><div class="card-label">INFORMAÇÕES</div><div class="info-row"><span>Nome completo</span><strong>{{ player.name }}</strong></div><div class="info-row"><span>Apelido</span><strong>{{ player.nickname }}</strong></div><div class="info-row"><span>Cadastrado / atualizado</span><strong>{{ player.updatedAt | date:'dd/MM/yyyy, HH:mm' }}</strong></div></article>
          <article class="notes-card"><div class="card-label">OBSERVAÇÕES</div>
            @if (player.notes) { <p>{{ player.notes }}</p> }
            @else { <p class="muted">Nenhuma observação foi adicionada para este jogador.</p> }
          </article>
        </div>
        <div class="detail-bottom"><span>♠</span> Este registro é privado e associado à sua conta.</div>
      }
    </section>
  `,
  styles: [`
    .page { max-width:1000px; margin:0 auto; padding:42px 25px 55px; }
    .back-link { color:#71805e; font-size:11px; text-decoration:none; }
    .eyebrow,.card-label { color:#788a5b; font-size:9px; font-weight:700; letter-spacing:1.6px; }
    .detail-heading { display:flex; justify-content:space-between; align-items:flex-end; margin:30px 0 26px; }
    h1 { margin:8px 0 5px; color:#1b2520; font:500 43px/1.1 var(--font-display); letter-spacing:-1.5px; }
    .detail-heading p { margin:0; color:#81887f; font-size:12px; }
    .button { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:13px 15px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:600; }
    .button-dark { background:#17221d; color:#f6f7ef; }
    .detail-grid { display:grid; grid-template-columns:1fr 1.15fr; gap:15px; }
    .stack-card,.info-card,.notes-card { padding:23px; background:#fff; border:1px solid #e8ebe4; border-radius:5px; }
    .stack-card { display:flex; flex-direction:column; min-height:220px; background:#e9f0d7; border-color:#e9f0d7; }
    .stack-card .card-label { color:#607442; }
    .stack-card > strong { margin-top:28px; color:#1d2821; font:500 44px/1 var(--font-display); letter-spacing:-1.5px; }
    .chips-caption { margin-top:9px; color:#677b45; font-size:9px; font-weight:700; letter-spacing:1px; }
    .stack-footer { margin-top:auto; padding-top:15px; border-top:1px solid #d4dfb9; color:#71805e; font-size:9px; }
    .info-card .card-label,.notes-card .card-label { margin-bottom:18px; }
    .info-row { display:flex; justify-content:space-between; gap:15px; padding:13px 0; border-top:1px solid #edf0ea; font-size:10px; }
    .info-row span { color:#858d84; }
    .info-row strong { color:#344037; font-weight:600; text-align:right; }
    .notes-card { grid-column:1 / -1; min-height:125px; }
    .notes-card p { margin:0; color:#475248; font-size:12px; line-height:1.7; white-space:pre-wrap; }
    .notes-card .muted { color:#9aa097; }
    .detail-bottom { margin-top:18px; color:#899087; font-size:10px; }
    .detail-bottom span { color:#839957; }
    .alert,.success { margin:15px 0; padding:12px; border-radius:4px; font-size:12px; }
    .alert { background:#f9e9e5; color:#943e32; }
    .success { background:#edf4dc; color:#556b35; }
    .loading { padding:35px 0; color:#7e877d; font-size:12px; }
    @media(max-width:650px) { .page { padding:30px 16px; } .detail-heading { align-items:flex-start; gap:16px; flex-direction:column; } h1 { font-size:36px; } .detail-grid { grid-template-columns:1fr; } .notes-card { grid-column:auto; } .info-row { flex-direction:column; gap:5px; } .info-row strong { text-align:left; } }
  `]
})
export class PlayerDetailComponent implements OnInit {
  player: Player | null = null;
  loading = true;
  message = '';
  successMessage = '';
  private readonly id: number;

  constructor(private readonly route: ActivatedRoute, private readonly playersApi: PlayerService) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const saved = this.route.snapshot.queryParamMap.get('saved');
    this.successMessage = saved === 'created' ? 'Jogador cadastrado com sucesso.' : saved === 'updated' ? 'Alterações salvas com sucesso.' : '';
  }

  ngOnInit(): void {
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.message = 'Identificador de jogador inválido.';
      this.loading = false;
      return;
    }
    this.playersApi.get(this.id).subscribe({
      next: player => {
        this.player = player;
        this.loading = false;
      },
      error: error => {
        this.message = errorMessage(error, 'Não foi possível carregar este jogador.');
        this.loading = false;
      }
    });
  }
}
