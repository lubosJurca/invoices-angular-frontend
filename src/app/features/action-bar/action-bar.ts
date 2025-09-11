import { Component, inject } from '@angular/core';
import { DataService } from '../../shared/services/data';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-action-bar',
  imports: [FormsModule, Select],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css',
})
export class ActionBar {
  private data = inject(DataService);
  public totalInvoices: number = 0;
  public statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
  ];

  onFilterChange(event: any) {
    this.data.setFilterStatus(event.value);
  }

  constructor() {
    this.data.currentInvoiceData$.subscribe((data) => {
      if (data) {
        this.totalInvoices = data.totalInvoices;
      }
    });
  }
}
