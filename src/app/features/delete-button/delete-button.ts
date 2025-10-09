import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../shared/services/toast.service';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-button',
  imports: [ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './delete-button.html',
})
export class DeleteButton {
  @Input() invoiceId!: string | null;
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);
  private dataService = inject(DataService);
  private router = inject(Router);

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete this invoice?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        if (!this.invoiceId) {
          this.toastService.error('Invalid invoice ID.');
          return;
        }

        this.dataService.deleteInvoice(this.invoiceId).subscribe({
          next: () => {
            this.toastService.success('Successfully deleted!');
            this.router.navigate(['/dashboard']);
            // Trigger a refresh of the invoice list after deletion
            this.dataService.refreshTrigger$.next(
              !this.dataService.refreshTrigger$.value
            );
          },
          error: (err) => {
            console.error('Error deleting invoice:', err);
            this.toastService.error(
              'Failed to delete the invoice. Please try again later.'
            );
          },
        });
      },
    });
  }
}
