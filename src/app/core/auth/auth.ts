import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../../shared/models/models';
import { environment } from '../../environments/enviroment';

interface AuthResponse {
  user: User;
  message?: string;
}

interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public initializeAuth(): Observable<boolean> {
    return this.http
      .get<AuthResponse>(environment.apiUrl + '/users/current-user', {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (response) => {
            this.currentUserSubject.next(response.user);
            console.log('Token verified successfully:', response.message);
          },
          error: (error) => {
            console.error('Token verification failed:', error);
            this.currentUserSubject.next(null);
            if (error.status === 401 || error.status === 403) {
              this.logout();
            }
          },
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }

  registerUser(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<AuthResponse>(environment.apiUrl + '/users/register', user)
      .pipe(
        tap((response) => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  loginUser(user: { email: string; password: string }): Observable<any> {
    return this.http
      .post<AuthResponse>(environment.apiUrl + '/auth/login', user)
      .pipe(
        tap((response) => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
            console.log('User logged in successfully:', response.user.email);
            console.log('Current user: ', this.currentUserSubject.value?.email);
          }
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => user !== null));
  }

  logout(): Observable<LogoutResponse> {
    return this.http
      .post<LogoutResponse>(environment.apiUrl + '/auth/logout', {})
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(null);
          console.log('User logged out successfully:', response.message);
        })
      );
  }

  private getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    sessionStorage.removeItem('auth_token');
  }
}
