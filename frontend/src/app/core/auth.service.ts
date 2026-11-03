import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  username: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'poker-ledger-token';
  private readonly usernameKey = 'poker-ledger-username';
  private readonly expiresKey = 'poker-ledger-expires';

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.usernameKey, response.username);
        localStorage.setItem(this.expiresKey, response.expiresAt);
      })
    );
  }

  register(username: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, { username, password });
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  username(): string {
    return localStorage.getItem(this.usernameKey) ?? '';
  }

  isAuthenticated(): boolean {
    if (this.token() === null) {
      return false;
    }
    const expiresAt = Date.parse(localStorage.getItem(this.expiresKey) ?? '');
    if (!Number.isNaN(expiresAt) && expiresAt <= Date.now()) {
      this.clearSession();
      return false;
    }
    return true;
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.expiresKey);
  }
}
