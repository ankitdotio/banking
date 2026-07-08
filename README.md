# Production Ready Backend

A production-ready backend starter template built with **Node.js**, **Express**, and **TypeScript**. It provides a solid foundation for building scalable REST APIs with security, logging, validation, code quality tools, and a clean project structure already configured.

> **Goal:** Stop setting up the same backend over and over again. Clone this template and start building your application immediately.

---

## Features

- TypeScript configured
- Express 5
- Environment variable validation
- ESLint + Prettier
- Husky + lint-staged
- Commitlint
- Winston logging
- Centralized error handling
- Rate limiting
- Helmet security
- CORS configuration
- Compression
- Health check endpoint
- Graceful shutdown
- Docker support
- Production-ready folder structure
- Consistent API response format
- Ready for authentication modules
- Ready for PostgreSQL/MongoDB integration

---

## Tech Stack

- Node.js
- Express
- TypeScript
- pnpm
- Zod
- Winston
- Helmet
- Express Rate Limit
- Compression
- CORS
- ESLint
- Prettier
- Husky
- Docker

---

# Project Structure

```
src
├── config
├── constants
├── controller
├── middleware
├── model
├── router
├── service
├── types
├── util
├── app.ts
└── server.ts
```

### Folder Overview

| Folder     | Purpose                   |
| ---------- | ------------------------- |
| config     | Environment configuration |
| constants  | Application constants     |
| controller | Request handlers          |
| middleware | Express middleware        |
| model      | Database models           |
| router     | API routes                |
| service    | Business logic            |
| util       | Shared helper functions   |
| types      | TypeScript types          |

---

# Getting Started

## Prerequisites

- Node.js 22+
- pnpm

Install pnpm

```bash
corepack enable

corepack prepare pnpm@latest --activate
```

or

```bash
npm install -g pnpm
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project

```bash
cd project-name
```

Install dependencies

```bash
pnpm install
```

Copy the environment file

```bash
cp .env.example .env
```

Start development server

```bash
pnpm dev
```

---

# Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| pnpm dev          | Start development server |
| pnpm build        | Build project            |
| pnpm start        | Run production build     |
| pnpm lint         | Run ESLint               |
| pnpm lint:fix     | Fix lint issues          |
| pnpm format       | Format project           |
| pnpm format:check | Check formatting         |
| pnpm typecheck    | TypeScript type checking |
| pnpm test         | Run tests                |

---

# Environment Variables

Create a `.env` file.

Example

```env
NODE_ENV=development

PORT=3000

SERVER_URI=http://localhost:3000

CLIENT_ORIGIN=http://localhost:5173
```

---

# Request Lifecycle

```
Incoming Request
        │
        ▼
Rate Limiter
        │
        ▼
Helmet
        │
        ▼
CORS
        │
        ▼
JSON Parser
        │
        ▼
Router
        │
        ▼
Controller
        │
        ▼
Service
        │
        ▼
Database
        │
        ▼
Response
```

---

# API Response Format

Successful response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {}
}
```

Error response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Logging

The project uses **Winston** for logging.

Different log levels are used depending on the environment.

- info
- warn
- error
- debug

---

# Security

Included by default

- Helmet
- CORS
- Rate Limiting
- Environment Validation
- Global Error Handler

---

# Docker

Build image

```bash
docker build -t backend .
```

Run container

```bash
docker run -p 3000:3000 backend
```

---

# Health Check

```
GET /health
```

Example response

```json
{
  "status": "UP"
}
```

---

# Code Style

This project uses

- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint

Every commit is automatically linted and formatted.

---

# Recommended Workflow

1. Create a new route
2. Create its controller
3. Create the service
4. Add validation
5. Add tests
6. Update documentation

---

# Future Improvements

- JWT Authentication
- Refresh Tokens
- OAuth
- Redis
- BullMQ
- PostgreSQL
- Drizzle ORM
- Swagger / OpenAPI
- Unit Testing
- Integration Testing
- GitHub Actions
- Prometheus Metrics
- OpenTelemetry
- Sentry Integration
- File Uploads
- Background Jobs
- Email Service
- RBAC Authorization

---

# Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# License

This project is licensed under the MIT License.

---

## Why this template?

Most backend projects start with the same repetitive setup:

- Configure TypeScript
- Install Express
- Configure ESLint
- Setup logging
- Configure security
- Setup environment variables
- Create folder structure

This template eliminates that boilerplate so you can focus on building your application instead of configuring it.

---

## Author

Built and maintained by **Ankit Sharma**.

If you find this project useful, consider giving it a ⭐.
