import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Invoice } from '../../shared/models/models';
import { TagModule } from 'primeng/tag';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-table',
  imports: [TableModule, CommonModule, TagModule],
  templateUrl: './main-table.html',
  styleUrl: './main-table.css',
})
export class MainTable {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  public tableData$: Invoice[] = []; // Initialize as empty array
  public loading$: boolean = true;

  public filterStatus$ = this.dataService.filterStatus$;

  ngOnInit(): void {
    this.dataService.allInvoicesData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('New data received:', data);

        // Always ensure we have an array
        this.tableData$ = data?.data ? [...data.data] : [];
        this.loading$ = data === null;

        // Force change detection
        this.cdr.detectChanges();
      });
  }

  getSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      draft: 'warn',
      paid: 'success',
      pending: 'info',
    };
    return severityMap[status] || 'secondary';
  }
}
