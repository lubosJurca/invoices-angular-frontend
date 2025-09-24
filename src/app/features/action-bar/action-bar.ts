import { Component, inject } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-action-bar',
  imports: [FormsModule, Select, AsyncPipe],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css',
})
export class ActionBar {
  private dataService = inject(DataService);

  public filterStatus$ = this.dataService.filterStatus$;
  public totalInvoices$ = this.dataService.allInvoicesData$.pipe(
    map((data) => data?.totalInvoices ?? 0)
  );

  public statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
  ];

  onFilterChange(event: any) {
    this.dataService.setFilterStatus(event.value);
  }
}
