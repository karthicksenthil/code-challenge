# Energy Accounts — Fullstack Example (TypeScript)

## Overview
This repository contains a minimal fullstack example (React + Node.js, TypeScript) that:
- Shows customer energy accounts
- Allows making credit-card payments (mocked processor)
- Payment history
- Backend tests for core logic

## Start
### Backend

```bash
cd backend
npm install
npm start
```
### Frontend
```bash
cd frontend
npm install
npm start
```

The frontend expects the backend at `http://localhost:4000`. You can change that in `frontend/src/services/api.service.ts`.

## Notes
- The credit card processor is mocked.
- Backend tests use Jest.
