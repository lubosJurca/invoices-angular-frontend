import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { TagModule } from 'primeng/tag';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-table',
  imports: [TableModule, CommonModule, TagModule],
  templateUrl: './main-table.html',
})
export class MainTable {
  private dataService = inject(DataService);
  private router = inject(Router);

  public tableData$ = this.dataService.allInvoicesData$.pipe(
    map((data) => {
      console.log('Table Data:', data);
      return data?.data || [];
    })
  );

  public loading$ = this.dataService.loading$;
  public filterStatus$ = this.dataService.filterStatus$;

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
