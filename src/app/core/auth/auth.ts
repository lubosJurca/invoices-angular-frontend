import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../../shared/models/models';
import { environment } from '../../environments/enviroment';

interface AuthResponse {
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    this.verifyTokenWithBackend().subscribe({
      next: (response) => {
        this.currentUserSubject.next(response.user);
        console.log('Token verified successfully:', response.message);
      },
      error: (error) => {
        console.error('Token verification failed:', error);
        // Token invalid, expired, or doesn't exist
        this.currentUserSubject.next(null);

        if (error.status === 401) {
          this.logout();
        }
      },
    });
  }

  private verifyTokenWithBackend(): Observable<any> {
    return this.http.get(environment.apiUrl + '/user/current-user', {
      withCredentials: true, // This sends the cookie automatically
    });
  }

  registerUser(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<AuthResponse>(environment.apiUrl + '/users/register', user, {
        withCredentials: true,
      })
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
      .post<AuthResponse>(environment.apiUrl + '/auth/login', user, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => user !== null));
  }

  logout() {
    this.currentUserSubject.next(null);
    this.http
      .post(
        environment.apiUrl + '/auth/logout',
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe();
  }
}
