import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { GetAllInvoicesResponse, Invoice } from '../models/models';
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

interface CreateInvoiceResponse {
  message: string;
  invoice: Invoice;
}

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

  //Refresh trigger subject
  public refreshTrigger$ = new BehaviorSubject<boolean>(false);

  // ------------------- Fetching all invoices with filtering and refresh -------------------
  // Combined observable to fetch data based on user, filter, and refresh trigger
  public allInvoicesData$ = combineLatest([
    this.auth.currentUser$,
    this.filterStatus$.pipe(distinctUntilChanged()),
    this.refreshTrigger$,
  ]).pipe(
    switchMap(([user, filter]) => {
      if (!user) {
        this.loadingSubject.next(false);
        return of(null);
      }
      // Set loading to true when starting to fetch
      this.loadingSubject.next(true);
      this.errorSubject.next(null); // Clear previous error

      return this.fetchAllInvoices(filter).pipe(
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
    }),
    tap((data) => {
      // Create new reference for the BehaviorSubject
      this.currentInvoiceData.next(data ? { ...data } : null);
    }),
    catchError((error) => {
      console.error('Data service error:', error);
      this.errorSubject.next('Failed to load invoices. Please try again.');
      this.loadingSubject.next(false); // Ensure loading is set to false on error
      return of(null);
    }),
    shareReplay(1)
  );

  // ------------------- Create Invoice -------------------
  // Create Invoice method
  public createInvoice(
    formData: Invoice
  ): Observable<CreateInvoiceResponse | null> {
    return this.http
      .post<CreateInvoiceResponse>(
        `${environment.apiUrl}/invoices/createInvoice`,
        formData,
        {
          headers: this.auth.getAuthHeaders(),
        }
      )
      .pipe(
        tap((response) => {
          console.log('Invoice created successfully');
          // Trigger a refresh of the invoice list
          this.refreshTrigger$.next(!this.refreshTrigger$.value);
        }),
        catchError((error) => {
          console.error('Error creating invoice:', error);
          throw error;
        })
      );
  }

  setFilterStatus(filter: string) {
    if (this.filterStatus.value !== filter) {
      this.filterStatus.next(filter);
    }
  }

  // ---------------- Delete Invoice -------------------
  deleteInvoice(invoiceId: string): Observable<{ message: string } | null> {
    return this.http.delete<{ message: string }>(
      `${environment.apiUrl}/invoices/${invoiceId}`,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  // -------------------  helper methods -------------------
  fetchAllInvoices(filter: string): Observable<GetAllInvoicesResponse | null> {
    const params = new HttpParams().set('filter', filter);

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
