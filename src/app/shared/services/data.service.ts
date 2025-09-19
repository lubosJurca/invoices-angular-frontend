import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { GetAllInvoicesResponse } from '../models/models';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  finalize,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  // Loading subjects
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Error subjects
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  //Data subject
  private currentInvoiceData =
    new BehaviorSubject<GetAllInvoicesResponse | null>(null);
  public currentallInvoicesData$ = this.currentInvoiceData.asObservable();

  //Filter subject
  private filterStatus = new BehaviorSubject<string>('all');
  public filterStatus$ = this.filterStatus.asObservable();

  public allInvoicesData$ = combineLatest([
    this.auth.currentUser$,
    this.filterStatus$.pipe(distinctUntilChanged()),
  ]).pipe(
    switchMap(([user, filter]) => {
      if (!user) {
        this.loadingSubject.next(false);
        return of(null);
      }
      // Set loading to true when starting to fetch
      this.loadingSubject.next(true);
      this.errorSubject.next(null); // Clear previous error

      return this.fetchAllInvoices(filter);
    }),
    tap((data) => {
      console.log('Data updated:', data);
      // Create new reference for the BehaviorSubject
      this.currentInvoiceData.next(data ? { ...data } : null);
    }),
    catchError((error) => {
      console.error('Data service error:', error);
      this.errorSubject.next('Failed to load invoices. Please try again.');
      return of(null);
    }),
    shareReplay(1),
    finalize(() => {
      this.loadingSubject.next(false);
    })
  );

  constructor() {
    console.log('DataService initialized');
  }

  initializeService(initialFilter: string = 'all') {
    this.filterStatus.next(initialFilter);
  }

  setFilterStatus(filter: string) {
    if (this.filterStatus.value !== filter) {
      this.filterStatus.next(filter);
    }
  }

  private fetchAllInvoices(
    filter: string
  ): Observable<GetAllInvoicesResponse | null> {
    const params = new HttpParams().set('filter', filter);

    console.log('Fetching invoices with filter:', filter);

    return this.http
      .get<GetAllInvoicesResponse>(`${environment.apiUrl}/invoices/`, {
        params: params,
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          console.log('Invoice data fetched successfully');
        }),
        catchError((error) => {
          console.error('HTTP Error:', error);
          throw error;
        })
      );
  }

  // Helper method to get current data synchronously
  getCurrentData(): GetAllInvoicesResponse | null {
    return this.currentInvoiceData.value;
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
