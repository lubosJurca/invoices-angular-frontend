import { Component, inject } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  tap,
} from 'rxjs';
import { TagModule } from 'primeng/tag';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';
import { Severity } from '../../shared/models/models';

@Component({
  selector: 'app-mobile-cards',
  imports: [TagModule, AsyncPipe, DatePipe, CurrencyPipe, PaginatorModule],
  templateUrl: './mobile-cards.html',
  styleUrl: './mobile-cards.css',
})
export class MobileCards {
  private dataService = inject(DataService);
  private router = inject(Router);

  private paginationSubject = new BehaviorSubject<number>(0);
  private pagination$ = this.paginationSubject.asObservable();

  // Observable for cards data with pagination reset on data change
  public cardsData = this.dataService.allInvoicesData$.pipe(
    map((data) => {
      return data?.data || [];
    }),
    distinctUntilChanged(),
    tap((data) => {
      // If data changes, reset pagination
      this.first = 0;
    })
  );

  first: number = 0;
  rows: number = 10;

  // Observable for paginated cards
  // This will slice the cards data based on the current pagination state
  // CombineLatest is used to react to changes in either the cards data or pagination state
  public paginatedCards$ = combineLatest([
    this.cardsData,
    this.pagination$,
  ]).pipe(
    map(([cards, first]) => {
      return cards.slice(first, first + 10);
    })
  );

  onPageChange(event: PaginatorState) {
    // Update the first item index based on pagination event
    this.first = event.first ?? 0;
    // Notify pagination subject of the change
    this.paginationSubject.next(this.first);
  }

  public filterStatus = this.dataService.filterStatus$;
  public loading = this.dataService.loading$;

  getSeverity(status: string): Severity {
    const severityMap: { [key: string]: Severity } = {
      draft: 'warn',
      paid: 'success',
      pending: 'info',
    };
    return severityMap[status] || 'secondary';
  }

  navigateToDetail(invoiceId: string): void {
    this.router.navigate(['/dashboard/detail', invoiceId]);
  }
}
