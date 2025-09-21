import { Component, DestroyRef, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InovoiceForm } from '../inovoice-form/inovoice-form';
import { DataService } from '../../shared/services/data.service';
import { Invoice } from '../../shared/models/models';
import { ToastService } from '../../shared/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-new-invoice-drawer',
  imports: [DrawerModule, ButtonModule, InputTextModule, InovoiceForm],
  templateUrl: './new-invoice-drawer.html',
  styleUrl: './new-invoice-drawer.css',
})
export class NewInvoiceDrawer {
  private dataService$ = inject(DataService);
  private toastService$ = inject(ToastService);
  private destroyRef$ = inject(DestroyRef);
  visible: boolean = false;

  onInvoiceCreated(formData: Invoice) {
    return this.dataService$
      .createInvoice(formData)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => {
          this.toastService$.success(
            `Invoice for ${response?.invoice.clientName} created successfully`
          );
          this.visible = false;
        },
        error: (error) => {
          this.toastService$.error(
            'Failed to create invoice. Please try again.'
          );
          console.error('Error creating invoice:', error);
        },
      });
  }
}
