import { Component, inject } from '@angular/core';
import { Data } from '../../shared/services/data';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-action-bar',
  imports: [FormsModule, Select],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css',
})
export class ActionBar {
  private data = inject(Data);
  public totalInvoices: number = 0;
  public selectedStatus: string = 'all';
  public statusOptions = new Array<{ label: string; value: string }>();

  filterData() {
    console.log('Filtering data by status:', this.selectedStatus);

    this.data.getUserData(this.selectedStatus);
  }

  constructor() {
    this.statusOptions = this.data.statusOptions;
    this.data.currentInvoiceData$.subscribe((data) => {
      if (data) {
        this.totalInvoices = data.totalInvoices;
      }
    });
  }
}
