import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { GetAllInvoicesResponse, User } from '../models/models';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { AuthService } from '../../core/auth/auth';

@Injectable({
  providedIn: 'root',
})
export class Data {
  private currentInvoiceData =
    new BehaviorSubject<GetAllInvoicesResponse | null>(null);
  public currentInvoiceData$ = this.currentInvoiceData.asObservable();
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  constructor() {
    this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.getUserData();
      } else {
        this.currentInvoiceData.next(null);
      }
    });
  }
  public getUserData(): void {
    this.http
      .get<GetAllInvoicesResponse>(environment.apiUrl + '/invoices/', {
        withCredentials: true,
      })
      .pipe(
        tap((response: GetAllInvoicesResponse) => {
          this.currentInvoiceData.next(response);
        }),
        catchError((error) => {
          console.error('Error fetching invoice data:', error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
