import { Component, inject, Output, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'app-inovoice-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
  ],
  templateUrl: './inovoice-form.html',
  styleUrl: './inovoice-form.css',
})
export class InovoiceForm {
  private formBuilder = inject(NonNullableFormBuilder);

  @Output() invoiceFormData = new EventEmitter<any>();

  invoiceForm = this.formBuilder.group({
    description: ['', Validators.required],
    paymentTerms: [7, Validators.required],
    dueDate: ['', Validators.required],
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

  constructor() {
    // Initialize with one empty item
    this.addItem();
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      this.invoiceFormData.emit(this.invoiceForm.value);
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
