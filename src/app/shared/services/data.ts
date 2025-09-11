import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { GetAllInvoicesResponse, User } from '../models/models';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AuthService } from '../../core/auth/auth';

interface FilterOption {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private currentInvoiceData =
    new BehaviorSubject<GetAllInvoicesResponse | null>(null);
  public currentInvoiceData$ = this.currentInvoiceData.asObservable();
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private filterStatus = new BehaviorSubject<string>('all');
  public filterStatus$ = this.filterStatus.asObservable();

  // constructor() {
  //   this.filterStatus$
  //     .pipe(switchMap(() => this.fetchInvoice()))
  //     .subscribe((response) => {
  //       if (response) {
  //         this.currentInvoiceData.next(response);
  //         console.log('Fetched invoice data on filter change:', response);
  //       }
  //     });

  //   this.auth.currentUser$.subscribe((user) => {
  //     if (user) {
  //       console.log('User logged in, fetching invoices...');
  //       this.fetchInvoice().subscribe();
  //     } else {
  //       this.currentInvoiceData.next(null);
  //     }
  //   });
  // }

  constructor() {
    console.log('🏗️ Constructor called');

    combineLatest([this.auth.currentUser$, this.filterStatus$])
      .pipe(
        tap(([user, filter]) =>
          console.log('🔄 Auth/Filter change:', { user: !!user, filter })
        ),
        switchMap(
          ([user, filter]): Observable<GetAllInvoicesResponse | null> => {
            // Add return type here too
            if (user) {
              console.log('✅ User exists, calling fetchInvoice');
              return this.fetchInvoice();
            } else {
              console.log('❌ No user, clearing data');
              this.currentInvoiceData.next(null);
              return of(null);
            }
          }
        )
      )
      .subscribe({
        next: (response) => {
          console.log('📦 Constructor subscription received:', !!response);
          if (response) {
            this.currentInvoiceData.next(response);
          }
        },
        error: (error) =>
          console.error('❌ Constructor subscription error:', error),
      });
  }

  setFilterStatus(filter: FilterOption) {
    this.filterStatus.next(filter.value);
  }

  private fetchInvoice(): Observable<GetAllInvoicesResponse | null> {
    // Add | null here
    console.log('🔥 fetchInvoice() method called!');

    let params = new HttpParams();

    if (this.filterStatus.value !== 'all') {
      params = params.set('filter', this.filterStatus.value);
      console.log('Set filter param:', this.filterStatus.value);
    } else {
      console.log('Filter is "all", not sending filter param');
    }

    console.log('About to make HTTP request with params:', params.toString());

    return this.http
      .get<GetAllInvoicesResponse>(`${environment.apiUrl}/invoices/`, {
        withCredentials: true,
        params: params,
      })
      .pipe(
        tap((response) => {
          console.log('✅ HTTP request successful:', response);
        }),
        catchError((error) => {
          console.error('❌ HTTP Error:', error);
          return of(null); // This is why we need | null in the return type
        })
      );
  }

  // public getUserData(
  //   status: string = 'all',
  //   page: number = 1,
  //   limit: number = 10,
  //   skip: number = 1
  // ): void {
  //   this.http
  //     .get<GetAllInvoicesResponse>(
  //       environment.apiUrl +
  //         `/invoices/?filter=${status}&page=${page}&limit=${limit}&skip=${skip}`,
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .pipe(
  //       tap((response: GetAllInvoicesResponse) => {
  //         this.currentInvoiceData.next(response);
  //       }),
  //       catchError((error) => {
  //         console.error('Error fetching invoice data:', error);
  //         return EMPTY;
  //       }),
  //       takeUntil(this.auth.currentUser$.pipe(tap((user) => !user)))
  //     )
  //     .subscribe();
  // }

  // public getFilteredData(){ {
  //   this.http.get<GetAllInvoicesResponse>(environment.apiUrl + '/invoices/?filter='+status, {withCredentials: true,})
  // }
}
