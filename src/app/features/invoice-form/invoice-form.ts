import {
  Component,
  inject,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Invoice } from '../../shared/models/models';

@Component({
  selector: 'app-invoice-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
    Select,
  ],
  templateUrl: './invoice-form.html',
})
export class InvoiceForm implements OnChanges {
  private formBuilder = inject(NonNullableFormBuilder);
  @Input() invoiceInput?: Invoice | null;
  @Output() invoiceFormData = new EventEmitter<any>();

  statusOptins = [
    { name: 'Draft', value: 'draft' },
    { name: 'Pending', value: 'pending' },
    { name: 'Paid', value: 'paid' },
  ];

  invoiceForm = this.formBuilder.group({
    description: ['', Validators.required],
    dueDate: [null as Date | null, Validators.required],
    clientName: ['', Validators.required],
    clientEmail: ['', [Validators.required, Validators.email]],
    status: ['draft', Validators.required],
    senderAddress: this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
      country: ['', Validators.required],
    }),
    clientAddress: this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
      country: ['', Validators.required],
    }),
    items: this.formBuilder.array([]),
    total: [0, Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoiceInput'] && this.invoiceInput) {
      this.invoiceForm.patchValue({
        description: this.invoiceInput.description,
        dueDate: this.invoiceInput.dueDate
          ? new Date(this.invoiceInput.dueDate)
          : null,
        clientName: this.invoiceInput.clientName,
        clientEmail: this.invoiceInput.clientEmail,
        status: this.invoiceInput.status,
        senderAddress: {
          street: this.invoiceInput.senderAddress.street,
          city: this.invoiceInput.senderAddress.city,
          postCode: this.invoiceInput.senderAddress.postCode,
          country: this.invoiceInput.senderAddress.country,
        },
        clientAddress: {
          street: this.invoiceInput.clientAddress.street,
          city: this.invoiceInput.clientAddress.city,
          postCode: this.invoiceInput.clientAddress.postCode,
          country: this.invoiceInput.clientAddress.country,
        },
      });

      // Get reference to items FormArray
      const itemsArray = this.invoiceForm.get('items') as FormArray;

      //  Clear items
      itemsArray.clear();

      // Add items from invoiceInput
      this.invoiceInput.items.forEach((item) => {
        itemsArray.push(
          this.formBuilder.group({
            name: [item.name, Validators.required],
            quantity: [item.quantity, Validators.required],
            price: [item.price, Validators.required],
          })
        );
      });
    }
  }

  constructor() {
    // Initialize with one empty item
    this.addItem();
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      this.invoiceFormData.emit(this.invoiceForm.value);
      this.invoiceForm.reset();
    }
  }

  // Getter for items FormArray
  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  // Add new item to the items array
  addItem(): void {
    const itemGroup = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.items.push(itemGroup);
  }

  // Remove item from the items array
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // Calculate total for a single item
  calculateItemTotal(quantity: number, price: number): number {
    return (quantity || 0) * (price || 0);
  }

  // Calculate total for all items
  calculateTotal(): number {
    return this.items.controls.reduce((total, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return total + quantity * price;
    }, 0);
  }

  hasError(controlName: string): boolean {
    const control = this.invoiceForm?.get(controlName);
    return !!(control?.touched && control?.invalid);
  }
}
