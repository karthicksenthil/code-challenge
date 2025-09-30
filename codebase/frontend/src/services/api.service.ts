 
import type { EnergyAccount, Payment, PaymentRequest, PaymentResponse } from '../types';

// Base URL for API
const API_BASE_URL = 'http://localhost:4000';

class ApiService {

  /**
   * Fetch all energy accounts
   */
  async getAccounts(): Promise<EnergyAccount[]> {

    const response = await fetch(`${API_BASE_URL}/accounts`);
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return response.json();
    
  }

  /**
   * Process a payment for an account
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {

    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Payment failed');
    return response.json();

  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<Payment[]> {
 
    const response = await fetch(`${API_BASE_URL}/payments`);
    if (!response.ok) throw new Error('Failed to fetch payment history');
    return response.json();

  }

}

export const apiService = new ApiService();