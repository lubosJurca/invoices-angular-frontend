import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Observable, of, map } from 'rxjs';
import { Invoice, Severity } from '../../shared/models/models';
import { DataService } from '../../shared/services/data.service';
import { ConfirmationService } from 'primeng/api';
import { DeleteButton } from '../delete-button/delete-button';
import { MarkAsPaidButton } from '../mark-as-paid-button/mark-as-paid-button';
import { InvoiceDrawer } from '../invoice-drawer/invoice-drawer';

@Component({
  selector: 'app-detail-page',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    TableModule,
    ProgressSpinner,
    DeleteButton,
    MarkAsPaidButton,

    InvoiceDrawer,
  ],
  providers: [ConfirmationService],
  templateUrl: './detail-page.html',
})
export class DetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);

  public invoice: Observable<Invoice | null> = of(null);
  public loading = true;
  public invoiceId: string | null = null;

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');

    // Set loading to false immediately since we're using async pipe
    this.loading = false;

    if (this.invoiceId) {
      this.invoice = this.dataService.allInvoicesData$.pipe(
        map((data) => {
          const invoice =
            data?.data.find((inv) => inv._id === this.invoiceId) || null;
          return invoice;
        })
      );
    } else {
      this.invoice = of(null);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getSeverity(status: string): Severity {
    const severityMap: { [key: string]: Severity } = {
      draft: 'warn',
      paid: 'success',
      pending: 'info',
    };
    return severityMap[status] || 'secondary';
  }

  calculateItemTotal(quantity: number, price: number): number {
    return quantity * price;
  }
}
