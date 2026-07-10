# Banking Backend API

A production-inspired banking backend built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. The project focuses on secure authentication, account management, and reliable money transfers using MongoDB transactions and idempotency.

## Features

- User Registration & Login
- JWT Authentication
- Account Management
- Money Transfer
- Ledger-based Transactions
- MongoDB Transactions
- Idempotent Transfer API
- Request Validation using Zod
- Rate Limiting
- Helmet Security
- Cookie Authentication
- Centralized Logging
- Graceful Shutdown
- Global Error Handling

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Zod
- Winston
- Helmet

## Project Structure

```
src
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── utils
├── validations
└── server.ts
```

## Installation

Clone the repository.

```bash
git clone <repository-url>
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=development
```

Start the development server.

```bash
npm run dev
```

## API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`

### Accounts

- POST `/api/account/create`
- GET `/api/account/balance/:accountId`

### Transactions

- POST `/api/transaction/transfer`

## Transaction Flow

```
Request
      │
      ▼
Validate Request
      │
      ▼
Check Idempotency
      │
      ▼
Start MongoDB Transaction
      │
      ▼
Debit Sender
      │
      ▼
Credit Receiver
      │
      ▼
Create Ledger Entry
      │
      ▼
Commit Transaction
      │
      ▼
Return Response
```

## Security

- Password hashing
- JWT authentication
- Secure cookies
- Request validation
- Helmet
- Rate limiting
- MongoDB transactions
- Idempotency support

## Future Improvements

- Redis
- BullMQ for background jobs
- Refresh Tokens
- Swagger Documentation
- Docker
- GitHub Actions
- Unit & Integration Tests
- Prometheus Metrics
- Audit Logs

## Learning Objectives

This project was built to understand:

- Backend Architecture
- REST API Design
- MongoDB Transactions
- Banking Ledger Systems
- Authentication & Authorization
- Idempotency
- Error Handling
- Logging
- Production Backend Practices

## License

MIT
