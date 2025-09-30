export interface Account {
  id: string;
  type: 'ELECTRICITY' | 'GAS';
  address: string;
  meterNumber?: string;
  volume?: number;
}

export interface DueCharge {
  id: string;
  accountId: string;
  date: string;
  amount: number;
}

export interface Payment {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  cardLastFour: string;
}

export interface AccountWithBalance extends Account {
  balance: number;
}

export interface PaymentRequest {
  accountId: string;
  amount: number;
  cardNumber: string;
  expiry: string;
  cvv: string;
}