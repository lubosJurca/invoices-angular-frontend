import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
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
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
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
    // combineLatest to react to changes in auth, filter, or page
    combineLatest([this.auth.currentUser$, this.filterStatus$, this.page$])
      .pipe(
        tap(([user, filter, page]) => {
          console.log('🔄 Auth/Filter change:', { user: !!user, filter, page });
          // Navigate to dashboard with updated query params
          // it's inside tap to avoid affecting the stream
          if (user) {
            this.router.navigate(['/dashboard'], {
              queryParams: { filter, page },
            });
          } else {
            this.router.navigate(['/']); // if no user, go to home
          }
        }),
        // switchMap to fetch data based on the latest values
        // if user is null, return of(null) to clear data
        switchMap(
          ([user, filter, page]): Observable<GetAllInvoicesResponse | null> => {
            if (user) {
              return this.fetchInvoice(filter, page);
            } else {
              console.log('❌ No user, clearing data');
              this.currentInvoiceData.next(null);
              return of(null);
            }
          }
        )
      )
      // subscribe to update currentInvoiceData
      .subscribe({
        next: (response) => {
          console.log('📦 Constructor subscription received:', !!response);
          if (response) {
            this.currentInvoiceData.next(response);
            console.log('✅ Data updated:', response);
          }
        },
        error: (error) =>
          console.error('❌ Constructor subscription error:', error),
      });
  }

  ngOnInit() {
    // Initialize filter and page from query params
    // Has to be in ngOnInit because constructor is too early
    this.activatedRoute.queryParams.subscribe((params) => {
      const initialFilter = params['filter'] || 'all';
      const initialPage = Number(params['page']) || 1;

      this.filterStatus.next(initialFilter);
      this.page.next(initialPage);
      console.log('Initial values from query params:', {
        initialFilter,
        initialPage,
      });
    });
  }

  setFilterStatus(filter: string) {
    this.filterStatus.next(filter);
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
        params: params,
        headers: this.auth.getAuthHeaders(),
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
