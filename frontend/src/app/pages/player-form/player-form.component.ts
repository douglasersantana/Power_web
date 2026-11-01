import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../core/player.service';
import { errorMessage } from '../../core/error-message';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="page">
      <a class="back-link" routerLink="/players">← Voltar aos jogadores</a>
      <div class="form-header"><div class="eyebrow">{{ isEdit ? 'ATUALIZE A MESA' : 'AMPLIE SEU LINEUP' }}</div>
        <h1>{{ isEdit ? 'Editar jogador' : 'Novo jogador' }}</h1>
        <p>{{ isEdit ? 'Altere os dados e o stack deste participante.' : 'Adicione um participante e registre seu stack inicial.' }}</p>
      </div>
      @if (message) { <div class="alert" role="alert">{{ message }}</div> }
      @if (loading) { <div class="loading">Carregando dados do jogador...</div> }
      @else {
        <form class="form-card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-section"><span class="section-number">01</span><div><h2>Identificação</h2><p>Como este jogador aparece na sua mesa.</p></div></div>
          <div class="field-grid">
            <div class="field">
              <label for="name">Nome completo <span>*</span></label>
              <input id="name" formControlName="name" maxlength="100" placeholder="Ex.: Rafael Costa">
              @if (form.controls.name.touched && form.controls.name.invalid) { <small class="field-error">Informe um nome com até 100 caracteres.</small> }
            </div>
            <div class="field">
              <label for="nickname">Apelido na mesa <span>*</span></label>
              <input id="nickname" formControlName="nickname" maxlength="40" placeholder="Ex.: riverking">
              @if (form.controls.nickname.touched && form.controls.nickname.invalid) { <small class="field-error">Informe um apelido com até 40 caracteres.</small> }
            </div>
          </div>
          <div class="form-section stack-section"><span class="section-number">02</span><div><h2>Stack de fichas</h2><p>Quantidade atual de fichas deste jogador.</p></div></div>
          <div class="field chips-field">
            <label for="chips">Fichas <span>*</span></label>
            <div class="number-input"><span>◉</span><input id="chips" type="number" formControlName="chips" min="0" step="1" placeholder="0"><small>CHIPS</small></div>
            @if (form.controls.chips.touched && form.controls.chips.invalid) { <small class="field-error">Informe um total de fichas igual ou maior que zero.</small> }
          </div>
          <div class="field notes-field">
            <label for="notes">Observações <small>OPCIONAL</small></label>
            <textarea id="notes" formControlName="notes" rows="4" maxlength="500" placeholder="Anotações úteis sobre o jogador..."></textarea>
            @if (form.controls.notes.touched && form.controls.notes.hasError('maxlength')) { <small class="field-error">Use no máximo 500 caracteres.</small> }
          </div>
          <div class="form-actions"><a class="cancel" routerLink="/players">Cancelar</a>
            <button class="button button-dark" type="submit" [disabled]="saving">{{ saving ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Cadastrar jogador') }} <span>↗</span></button>
          </div>
        </form>
      }
      <p class="required-note"><span>*</span> Campos obrigatórios</p>
    </section>
  `,
  styles: [`
    .page { max-width:790px; margin:0 auto; padding:42px 25px 55px; }
    .back-link { color:#71805e; font-size:11px; text-decoration:none; }
    .back-link:hover { color:#344927; }
    .form-header { margin:28px 0 25px; }
    .eyebrow { color:#788a5b; font-size:9px; font-weight:700; letter-spacing:1.8px; }
    h1 { margin:8px 0 5px; color:#1b2520; font:500 40px/1.1 var(--font-display); letter-spacing:-1.4px; }
    .form-header p { margin:0; color:#81887f; font-size:12px; }
    .form-card { padding:27px 30px 24px; background:#fff; border:1px solid #e8ebe4; border-radius:5px; }
    .form-section { display:flex; gap:14px; align-items:flex-start; padding-bottom:21px; border-bottom:1px solid #edf0ea; }
    .section-number { display:grid; place-items:center; width:27px; height:27px; border-radius:50%; background:#e9f0d7; color:#607442; font-size:9px; font-weight:700; }
    .form-section h2 { margin:2px 0 4px; color:#253128; font:500 18px var(--font-display); }
    .form-section p { margin:0; color:#90968e; font-size:10px; }
    .field-grid { display:grid; grid-template-columns:1fr 1fr; gap:17px; padding:20px 0 26px; }
    .field label { display:block; margin-bottom:8px; color:#3e4941; font-size:11px; font-weight:600; }
    .field label > span,.required-note span { color:#829957; }
    .field input,.field textarea { width:100%; padding:11px 12px; border:1px solid #dfe3da; border-radius:4px; background:#fff; color:#19221d; font:12px var(--font-body); outline:none; }
    .field input:focus,.field textarea:focus { border-color:#879e5b; box-shadow:0 0 0 3px #c9e17738; }
    .field input::placeholder,.field textarea::placeholder { color:#aeb3aa; }
    .field-error { display:block; margin-top:5px; color:#a34436; font-size:10px; }
    .stack-section { margin-bottom:19px; }
    .chips-field { max-width:280px; margin-bottom:24px; }
    .number-input { display:flex; align-items:center; border:1px solid #dfe3da; border-radius:4px; }
    .number-input:focus-within { border-color:#879e5b; box-shadow:0 0 0 3px #c9e17738; }
    .number-input > span { padding-left:12px; color:#91a65d; }
    .number-input input { min-width:0; border:0; box-shadow:none !important; }
    .number-input small { padding-right:11px; color:#99a097; font-size:8px; letter-spacing:1px; }
    .notes-field { margin-bottom:23px; }
    .notes-field label small { margin-left:6px; color:#9ba198; font-size:8px; letter-spacing:1px; }
    .field textarea { resize:vertical; min-height:80px; }
    .form-actions { display:flex; justify-content:flex-end; align-items:center; gap:23px; padding-top:18px; border-top:1px solid #edf0ea; }
    .cancel { color:#737c72; text-decoration:none; font-size:11px; }
    .button { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:12px 15px; border:0; border-radius:4px; background:#17221d; color:#f6f7ef; font-size:11px; font-weight:600; cursor:pointer; }
    .button:hover:not(:disabled) { background:#293a30; }
    .button:disabled { opacity:.6; cursor:wait; }
    .required-note { color:#878e85; font-size:10px; }
    .alert { padding:12px; margin-bottom:15px; border-radius:4px; background:#f9e9e5; color:#943e32; font-size:12px; }
    .loading { padding:25px; color:#7e877d; font-size:12px; }
    @media(max-width:600px) { .page { padding:30px 16px; } .form-card { padding:22px 18px; } .field-grid { grid-template-columns:1fr; gap:15px; } h1 { font-size:34px; } }
  `]
})
export class PlayerFormComponent implements OnInit {
  readonly isEdit: boolean;
  readonly id: number | null;
  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/\S/)]],
    nickname: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(/\S/)]],
    chips: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    notes: ['', [Validators.maxLength(500)]]
  });
  loading = false;
  saving = false;
  message = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly playersApi: PlayerService
  ) {
    this.isEdit = this.route.snapshot.data['mode'] === 'edit';
    const parsedId = Number(this.route.snapshot.paramMap.get('id'));
    this.id = this.isEdit && Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  }

  ngOnInit(): void {
    if (this.isEdit && this.id === null) {
      this.message = 'Identificador de jogador inválido.';
      return;
    }
    if (this.id !== null) {
      this.loading = true;
      this.playersApi.get(this.id).subscribe({
        next: player => {
          this.form.patchValue({
            name: player.name,
            nickname: player.nickname,
            chips: player.chips,
            notes: player.notes ?? ''
          });
          this.loading = false;
        },
        error: error => {
          this.message = errorMessage(error, 'Não foi possível carregar os dados do jogador.');
          this.loading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isEdit && this.id === null) {
      this.message = 'Identificador de jogador inválido.';
      return;
    }
    this.saving = true;
    this.message = '';
    const value = this.form.getRawValue();
    const request = {
      name: (value.name ?? '').trim(),
      nickname: (value.nickname ?? '').trim(),
      chips: Number(value.chips),
      notes: (value.notes ?? '').trim()
    };
    const operation = this.id === null
      ? this.playersApi.create(request)
      : this.playersApi.update(this.id, request);
    operation.subscribe({
      next: player => void this.router.navigate(['/players', player.id], {
        queryParams: { saved: this.isEdit ? 'updated' : 'created' }
      }),
      error: error => {
        this.message = errorMessage(error, 'Não foi possível salvar. Tente novamente.');
        this.saving = false;
      }
    });
  }
}
