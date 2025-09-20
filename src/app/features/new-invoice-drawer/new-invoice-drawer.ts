import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InovoiceForm } from '../inovoice-form/inovoice-form';

@Component({
  selector: 'app-new-invoice-drawer',
  imports: [DrawerModule, ButtonModule, InputTextModule, InovoiceForm],
  templateUrl: './new-invoice-drawer.html',
  styleUrl: './new-invoice-drawer.css',
})
export class NewInvoiceDrawer {
  visible: boolean = false;
  value3: string | undefined;
}
