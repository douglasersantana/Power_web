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

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.usernameKey, response.username);
      })
    );
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  username(): string {
    return localStorage.getItem(this.usernameKey) ?? '';
  }

  isAuthenticated(): boolean {
    return this.token() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    void this.router.navigate(['/login']);
  }
}
