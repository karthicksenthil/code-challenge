import express from 'express';
import cors from 'cors';
import { AccountWithBalance, Payment, PaymentRequest, DueCharge } from './types';
import { accounts, dueCharges, payments } from './mocks';

const app = express();
app.use(cors()); // Enable CORS for frontend
app.use(express.json());

app.get('/accounts', (req, res) => {
  const energyAccounts: AccountWithBalance[] = accounts.map(account => {
    const charges = dueCharges.filter(charge => charge.accountId === account.id);
    const balance = charges.reduce((sum, charge) => sum + charge.amount, 0);
    return { ...account, balance };
  });
  res.json(energyAccounts);
});

app.post('/payments', (req, res) => {
  const { accountId, amount, cardNumber } = req.body as PaymentRequest;

  if (!accountId || typeof amount !== 'number' || !cardNumber) return res.json({ error: 'accountId, amount and card required' });
  // Mock credit card processing - always succeeds
  const payment: Payment = {
    id: `P-${Date.now()}`,
    accountId,
    amount,
    date: new Date().toISOString(),
    cardLastFour: cardNumber.slice(-4)
  };
  payments.push(payment);
  const newCharge: DueCharge = {
      id: 'D-P-' + Date.now(),
      accountId,
      date: new Date().toISOString().slice(0,10),
      amount: -Math.abs(payment.amount)
    };
    dueCharges.push(newCharge);
  res.json({ success: true, message: 'Payment successful' });
});

app.get('/payments', (req, res) => {
  res.json(payments);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));