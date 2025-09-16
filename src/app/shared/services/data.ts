import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { GetAllInvoicesResponse, User } from '../models/models';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../core/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';

interface FilterOption {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private currentInvoiceData =
    new BehaviorSubject<GetAllInvoicesResponse | null>(null);
  public currentInvoiceData$ = this.currentInvoiceData.asObservable();
  private filterStatus = new BehaviorSubject<string>('all');
  public filterStatus$ = this.filterStatus.asObservable();
  private page = new BehaviorSubject<number>(1);
  public page$ = this.page.asObservable();

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const initialFilter = params['filter'] || 'all';
      const initialPage = Number(params['page']) || 1;

      this.filterStatus.next(initialFilter);
      this.page.next(initialPage);
      console.log('Initialized from query params:', {
        initialFilter,
        initialPage,
      });
    });

    combineLatest([this.auth.currentUser$, this.filterStatus$, this.page$])
      .pipe(
        tap(([user, filter, page]) => {
          console.log('🔄 Auth/Filter change:', { user: !!user, filter, page });
          if (user) {
            this.router.navigate(['/dashboard'], {
              queryParams: { filter, page },
            });
          }
        }),
        switchMap(
          ([user, filter, page]): Observable<GetAllInvoicesResponse | null> => {
            if (user) {
              return this.fetchInvoice(filter, page);
            } else {
              console.log('❌ No user, clearing data');
              this.currentInvoiceData.next(null);
              this.page.next(1);
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

  private fetchInvoice(
    filter: string,
    page: number
  ): Observable<GetAllInvoicesResponse | null> {
    let params = new HttpParams();

    params = params.set('filter', filter);
    params = params.set('page', page.toString());

    console.log('About to make HTTP request with params:', params.toString());

    return this.http
      .get<GetAllInvoicesResponse>(`${environment.apiUrl}/invoices/`, {
        withCredentials: true,
        params: params,
      })
      .pipe(
        tap((response) => {
          console.log('HTTP request successful:', response);
        }),
        catchError((error) => {
          console.error('❌ HTTP Error:', error);
          return of(null); // This is why we need | null in the return type
        })
      );
  }
}
