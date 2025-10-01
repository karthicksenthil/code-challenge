import request from 'supertest';
import express from 'express';

const app = express();
app.use('/accounts', /* attach routes */); // Simplified; in real, import app

describe('GET /accounts', () => {
  it('should return accounts with calculated balances', async () => {
    const res = await request(app).get('/accounts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('balance');
    // Specific check
    const account1 = res.body.find((a: any) => a.id === 'A-0001');
    expect(account1.balance).toBe(30);
  });
});