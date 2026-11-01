import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (!token || !request.url.startsWith('http://localhost:8080/')) {
    return next(request);
  }
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(
    catchError(error => {
      if (error.status === 401 && request.url.includes('/api/players')) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
