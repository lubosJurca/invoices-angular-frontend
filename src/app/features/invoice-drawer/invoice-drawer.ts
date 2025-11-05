import { Component, DestroyRef, inject, Input } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InvoiceForm } from '../invoice-form/invoice-form';
import { DataService } from '../../shared/services/data.service';
import { Invoice } from '../../shared/models/models';
import { ToastService } from '../../shared/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-invoice-drawer',
  imports: [DrawerModule, ButtonModule, InputTextModule, InvoiceForm],
  templateUrl: './invoice-drawer.html',
})
export class InvoiceDrawer {
  @Input() invoice?: Invoice | null;
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  private destroyRef$ = inject(DestroyRef);
  visible: boolean = false;

  onFormSubmit(formData: Invoice) {
    if (this.invoice && this.invoice._id) {
      return this.dataService
        .editInvoice(this.invoice._id, formData)
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe({
          next: (response) => {
            this.toastService.success(`Invoice successfully updated!`);
            this.dataService.refreshTrigger$.next(
              !this.dataService.refreshTrigger$.value
            );
            this.visible = false;
          },
          error: (error) => {
            this.toastService.error(
              'Failed to edit invoice. Please try again.'
            );
            console.error('Error creating invoice:', error);
          },
        });
    } else {
      return this.dataService
        .createInvoice(formData)
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe({
          next: (response) => {
            this.toastService.success(
              `Invoice for ${response?.invoice.clientName} created successfully`
            );
            this.dataService.refreshTrigger$.next(
              !this.dataService.refreshTrigger$.value
            );
            this.visible = false;
          },
          error: (error) => {
            this.toastService.error(
              'Failed to create invoice. Please try again.'
            );
            console.error('Error creating invoice:', error);
          },
        });
    }
  }
}
