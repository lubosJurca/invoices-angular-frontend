import { Component, inject } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-mobile-cards',
  imports: [TagModule, AsyncPipe, DatePipe, CurrencyPipe, PaginatorModule],
  templateUrl: './mobile-cards.html',
  styleUrl: './mobile-cards.css',
})
export class MobileCards {
  private dataService = inject(DataService);
  private router = inject(Router);

  public cardsData = this.dataService.allInvoicesData$.pipe(
    map((data) => {
      return data?.data || [];
    })
  );

  public loading = this.dataService.loading$;
  public filterStatus = this.dataService.filterStatus$;

  first: number = 0;
  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  getSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
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
