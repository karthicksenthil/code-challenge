 
export interface EnergyAccount {
  id: string;
  address: string;
  type: 'ELECTRICITY' | 'GAS' ;
  balance: number;
  meterNumber?: string;
  volume?: number;
}

export interface Payment {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  last4: string;
}

export interface CreditCardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentRequest {
  accountId: string;
  amount: number;
  cardNumber: string;
  cardDetails: CreditCardDetails;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  message?: string;
}