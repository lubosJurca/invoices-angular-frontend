import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-action-bar',
  imports: [FormsModule, Select],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css',
})
export class ActionBar implements OnInit {
  private data = inject(DataService);
  private changeDetectionService = inject(ChangeDetectorRef);
  public filterStatus$ = this.data.filterStatus$;
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

  // Lifecycle hook to subscribe to invoice data changes
  // and update totalInvoices accordingly
  // has to be ngOnInit because constructor is too early
  // changeDetectionService is needed to update the view
  ngOnInit(): void {
    this.data.currentInvoiceData$.subscribe((data) => {
      if (data) {
        this.totalInvoices = data.totalInvoices;
        this.changeDetectionService.detectChanges();
      }
    });
  }
}
