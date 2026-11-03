import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error-message';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="register-page">
      <div class="register-card">
        <div class="eyebrow">NOVA CONTA</div>
        <h2>Crie sua mesa.</h2>
        <p class="form-intro">Cadastre-se para ter sua própria lista privada de jogadores.</p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label for="username">Usuário</label>
          <input id="username" type="text" formControlName="username" autocomplete="username" placeholder="Escolha um nome de usuário">
          @if (form.controls.username.touched && form.controls.username.invalid) {
            <span class="field-error">
              @if (form.controls.username.hasError('required')) { Informe um usuário. }
              @else if (form.controls.username.hasError('minlength')) { O usuário deve ter ao menos 3 caracteres. }
              @else if (form.controls.username.hasError('maxlength')) { O usuário deve ter no máximo 50 caracteres. }
              @else { Use apenas letras, números, ponto, hífen ou sublinhado. }
            </span>
          }
          <label for="password">Senha</label>
          <input id="password" type="password" formControlName="password" autocomplete="new-password" placeholder="Mínimo de 8 caracteres">
          @if (form.controls.password.touched && form.controls.password.invalid) {
            <span class="field-error">
              @if (form.controls.password.hasError('required')) { Informe uma senha. }
              @else { A senha deve ter entre 8 e 72 caracteres. }
            </span>
          }
          <label for="confirm">Confirmar senha</label>
          <input id="confirm" type="password" formControlName="confirm" autocomplete="new-password" placeholder="Repita a senha">
          @if (form.controls.confirm.touched && form.hasError('mismatch')) {
            <span class="field-error">As senhas não coincidem.</span>
          }
          @if (message) { <div class="alert" role="alert">{{ message }}</div> }
          <button class="button button-dark submit" type="submit" [disabled]="loading">
            {{ loading ? 'Criando conta...' : 'Criar conta' }} <span aria-hidden="true">↗</span>
          </button>
        </form>
        <div class="demo-hint">Já tem conta? <a routerLink="/login">Entrar</a></div>
      </div>
    </section>
  `,
  styles: [`
    .register-page { display:flex; justify-content:center; padding:50px 28px; min-height:calc(100vh - 128px); }
    .register-card { max-width:390px; width:100%; margin:auto; }
    .eyebrow { color:#75895b; font-size:10px; font-weight:700; letter-spacing:2px; }
    h2 { margin:14px 0 8px; color:#19221d; font-family:var(--font-display); font-size:35px; font-weight:500; letter-spacing:-1.3px; }
    .form-intro { color:#7a8179; font-size:13px; margin:0 0 34px; }
    label { display:block; margin:20px 0 8px; color:#3e4941; font-size:12px; font-weight:600; }
    input { width:100%; padding:13px 14px; border:1px solid #dfe3da; border-radius:4px; background:#fff; color:#19221d; font-size:13px; outline:none; }
    input:focus { border-color:#879e5b; box-shadow:0 0 0 3px #c9e17738; }
    .field-error { display:block; margin-top:5px; color:#a34436; font-size:11px; }
    .button { border:0; border-radius:4px; padding:14px 16px; font-size:12px; font-weight:600; cursor:pointer; }
    .button-dark { background:#17221d; color:#f6f7ef; }
    .button-dark:hover:not(:disabled) { background:#293a30; }
    .button:disabled { opacity:.6; cursor:wait; }
    .submit { width:100%; display:flex; align-items:center; justify-content:space-between; margin-top:24px; }
    .alert { padding:11px 13px; margin-top:18px; border-radius:4px; background:#f9e9e5; color:#943e32; font-size:12px; }
    .demo-hint { margin-top:24px; color:#81877f; font-size:11px; text-align:center; }
    .demo-hint a { color:#495449; font-weight:700; }
  `]
})
export class RegisterComponent {
  readonly form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9._-]+$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirm: ['', [Validators.required]]
  }, { validators: passwordsMatch });
  message = '';
  loading = false;

  constructor(private readonly formBuilder: FormBuilder, private readonly auth: AuthService, private readonly router: Router) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.message = '';
    const { username, password } = this.form.getRawValue();
    this.auth.register(username ?? '', password ?? '').subscribe({
      next: () => this.auth.login(username ?? '', password ?? '').subscribe({
        next: () => void this.router.navigate(['/players']),
        error: () => void this.router.navigate(['/login'])
      }),
      error: error => {
        this.message = errorMessage(error, 'Não foi possível criar a conta. Tente novamente.');
        this.loading = false;
      }
    });
  }
}
