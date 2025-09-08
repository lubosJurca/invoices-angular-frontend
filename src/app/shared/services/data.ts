import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { GetAllInvoicesResponse, User } from '../models/models';
import { BehaviorSubject, catchError, EMPTY, takeUntil, tap } from 'rxjs';
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

  public statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
  ];

  constructor() {
    this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.getUserData();
      } else {
        this.currentInvoiceData.next(null);
      }
    });
  }

  public getUserData(
    status: string = 'all',
    page: number = 1,
    limit: number = 10,
    skip: number = 1
  ): void {
    this.http
      .get<GetAllInvoicesResponse>(
        environment.apiUrl +
          `/invoices/?filter=${status}&page=${page}&limit=${limit}&skip=${skip}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((response: GetAllInvoicesResponse) => {
          this.currentInvoiceData.next(response);
        }),
        catchError((error) => {
          console.error('Error fetching invoice data:', error);
          return EMPTY;
        }),
        takeUntil(this.auth.currentUser$.pipe(tap((user) => !user)))
      )
      .subscribe();
  }

  // public getFilteredData(){ {
  //   this.http.get<GetAllInvoicesResponse>(environment.apiUrl + '/invoices/?filter='+status, {withCredentials: true,})
  // }
}
