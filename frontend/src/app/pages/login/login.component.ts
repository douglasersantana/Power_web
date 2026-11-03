import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error-message';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="login-layout">
      <div class="login-art">
        <div class="art-label"><span></span> SUA MESA, SOB CONTROLE</div>
        <div class="art-copy">
          <div class="suit">♠</div>
          <h1>O jogo muda.<br><em>Seu controle, não.</em></h1>
          <p>Organize os jogadores, acompanhe as fichas e mantenha cada partida na mão.</p>
        </div>
        <div class="art-bottom"><span>01 — 04</span><span>POKER NIGHT MANAGEMENT</span></div>
      </div>
      <div class="login-panel">
        <div class="login-form-wrap">
          <div class="eyebrow">BEM-VINDO DE VOLTA</div>
          <h2>Entre na sua mesa.</h2>
          <p class="form-intro">Acesse sua conta para gerenciar jogadores e fichas.</p>
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <label for="username">Usuário</label>
            <input id="username" type="text" formControlName="username" autocomplete="username" placeholder="Seu nome de usuário">
            @if (form.controls.username.touched && form.controls.username.hasError('required')) {
              <span class="field-error">Informe seu usuário.</span>
            }
            <label for="password">Senha</label>
            <input id="password" type="password" formControlName="password" autocomplete="current-password" placeholder="Sua senha">
            @if (form.controls.password.touched && form.controls.password.hasError('required')) {
              <span class="field-error">Informe sua senha.</span>
            }
            @if (message) { <div class="alert" role="alert">{{ message }}</div> }
            <button class="button button-dark submit" type="submit" [disabled]="loading">
              {{ loading ? 'Autenticando...' : 'Entrar na mesa' }} <span aria-hidden="true">↗</span>
            </button>
          </form>
          <div class="demo-hint">Ainda não tem conta? <a routerLink="/register">Criar conta</a></div>
          <div class="demo-hint">Conta de demonstração <strong>admin</strong> · senha <strong>Poker123!</strong></div>
        </div>
        <div class="login-copyright">© 2026 POKER LEDGER <span>·</span> FEITO PARA QUEM LEVA O JOGO A SÉRIO</div>
      </div>
    </section>
  `,
  styles: [`
    .login-layout { display:grid; grid-template-columns:1fr 1fr; min-height:calc(100vh - 128px); }
    .login-art { position:relative; display:flex; flex-direction:column; justify-content:space-between; overflow:hidden; padding:40px clamp(28px,7vw,100px); background:#c9e177; color:#18221d; }
    .login-art:after { content:""; position:absolute; width:400px; height:400px; right:-120px; bottom:40px; border:1px solid #a9c351; border-radius:50%; box-shadow:0 0 0 46px #c9e177, 0 0 0 47px #a9c351, 0 0 0 94px #c9e177, 0 0 0 95px #a9c351; opacity:.65; }
    .art-label,.art-bottom { z-index:1; display:flex; justify-content:space-between; font-size:9px; font-weight:700; letter-spacing:1.8px; }
    .art-label { justify-content:flex-start; align-items:center; gap:9px; }
    .art-label span { width:7px; height:7px; border-radius:50%; background:#1b2921; }
    .art-copy { position:relative; z-index:1; padding:36px 0 68px; }
    .suit { font-size:54px; margin-bottom:30px; }
    h1 { margin:0; font-family:var(--font-display); font-size:clamp(38px,5vw,68px); font-weight:500; line-height:1.05; letter-spacing:-3px; }
    h1 em { font-weight:400; }
    .art-copy p { max-width:330px; margin-top:22px; color:#44513b; font-size:14px; line-height:1.8; }
    .art-bottom { color:#45523c; }
    .login-panel { display:flex; flex-direction:column; justify-content:center; padding:50px clamp(28px,8vw,112px); position:relative; }
    .login-form-wrap { max-width:390px; width:100%; margin:auto; }
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
    .demo-hint strong { color:#495449; }
    .login-copyright { color:#929890; text-align:center; font-size:8px; letter-spacing:1.2px; }
    .login-copyright span { color:#829957; }
    @media (max-width:760px) { .login-layout { grid-template-columns:1fr; } .login-art { min-height:300px; padding:26px 28px; } .art-copy { padding:22px 0 24px; } .suit { font-size:32px; margin-bottom:12px; } .art-copy p { margin-top:12px; } .art-bottom { font-size:8px; } .login-panel { min-height:520px; padding:38px 28px; } }
  `]
})
export class LoginComponent {
  readonly form = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
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
    this.auth.login(username ?? '', password ?? '').subscribe({
      next: () => void this.router.navigate(['/players']),
      error: error => {
        this.message = errorMessage(error, 'Não foi possível autenticar. Verifique sua conexão e tente novamente.');
        this.loading = false;
      }
    });
  }
}
