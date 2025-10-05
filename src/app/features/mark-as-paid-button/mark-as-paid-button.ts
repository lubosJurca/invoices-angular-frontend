import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Invoice } from '../../shared/models/models';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../shared/services/toast.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-mark-as-paid-button',
  imports: [ButtonModule, ConfirmDialogModule],
  templateUrl: './mark-as-paid-button.html',
  styleUrl: './mark-as-paid-button.css',
})
export class MarkAsPaidButton {
  @Input() invoice!: Invoice | null;

  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);
  private dataService = inject(DataService);

  confirmEditStatus(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Are you sure you want to change status to paid in this invoice?',
      header: 'Mark as Paid?',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Mark as Paid',
        severity: 'help',
      },
      accept: () => {
        if (!this.invoice || !this.invoice._id) {
          this.toastService.error('Invalid invoice data.');
          return;
        }

        this.dataService.editMarkAsPaid(this.invoice?._id).subscribe({
          next: () => {
            this.toastService.success('Successfully changed to paid!');
            // Trigger a refresh of the invoice list after deletion
            this.dataService.refreshTrigger$.next(
              !this.dataService.refreshTrigger$.value
            );
          },
          error: (err) => {
            console.error('Error editing invoice:', err);
            this.toastService.error(
              'Failed to edit the invoice. Please try again later.'
            );
          },
        });
      },
    });
  }
}
