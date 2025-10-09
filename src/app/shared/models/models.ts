export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export interface InvoiceAddress {
  street: string;
  city: string;
  country: string;
  postCode?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface Invoice {
  _id?: string;
  createdAt: Date | string;
  dueDate: Date | string;

  description: string;
  paymentTerms?: number;
  clientName: string;
  clientEmail: string;
  status: string;

  senderAddress: InvoiceAddress;
  clientAddress: InvoiceAddress;

  items: InvoiceItem[];
  total: number;

  createdBy?: string;
  updatedAt?: Date | string;
}

export interface GetAllInvoicesResponse {
  totalInvoices: number;
  data: Invoice[];
  message: string;
}
