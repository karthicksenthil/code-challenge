import request from 'supertest';
import express from 'express';
// Similar setup as above

describe('POST /payments', () => {
  it('should process payment and return success', async () => {
    const paymentData = {
      accountId: 'A-0001',
      amount: 30,
      cardNumber: '1234567812345678',
      expiry: '12/25',
      cvv: '123'
    };
    const res = await request(app).post('/payments').send(paymentData);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});