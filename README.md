# Support CRM Backend

The backend is a REST API for a support ticket management system. It provides ticket creation, searching, status updates, ticket details, and internal notes for the React Support CRM frontend.

## Project Overview

This service is the server-side portion of the full-stack Support CRM assignment. It follows a simple layered architecture:

```text
HTTP Request
    |
    v
Routes -> Controllers -> Services -> Mongoose Models -> MongoDB Atlas
```

The backend is responsible for validation, ticket ID generation, persistence, filtering, status updates, note creation, error handling, and CORS configuration.

## Features

- Create support tickets
- Generate unique ticket IDs
- List tickets sorted by newest first
- Filter tickets by status
- Search by ticket ID, customer name, customer email, subject, or description
- Retrieve one ticket with its internal notes
- Update ticket status
- Add internal notes to a ticket
- MongoDB Atlas connection through Mongoose
- Optional in-memory MongoDB fallback when no URI is configured
- Request logging with Morgan
- CORS support for the frontend
- Zod request validation
- Health-check endpoint

## Technology Stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod
- dotenv
- Morgan
- CORS
- mongodb-memory-server for local fallback development

## Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection and cleanup
│   ├── controllers/
│   │   └── ticket.controller.js
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   ├── models/
│   │   ├── Note.js
│   │   └── Ticket.js
│   ├── routes/
│   │   └── ticket.routes.js
│   ├── services/
│   │   └── ticket.service.js
│   ├── utils/
│   │   └── ticketId.js
│   ├── validators/
│   │   └── ticket.validator.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB Atlas cluster or a local MongoDB installation
- A MongoDB database user with read and write access
- The Atlas network access list configured for the development machine

## Installation

From this directory, install the dependencies:

```bash
npm install
```

Create a file named `.env` in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?appName=Cluster0
CLIENT_URL=http://localhost:5173
```

Replace the username, password, and cluster hostname with the values from MongoDB Atlas. Do not commit the real `.env` file or expose the database password in source control.

## Running the Backend

Development mode with automatic restart:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API runs at:

```text
http://localhost:5000
```

## Health Check

Request:

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "Support CRM API is running"
}
```

## API Reference

### Create a Ticket

```http
POST /api/tickets
Content-Type: application/json
```

Request body:

```json
{
  "customer_name": "Aarav Sharma",
  "customer_email": "aarav@example.com",
  "subject": "Unable to access account",
  "description": "The customer cannot sign in after resetting the password."
}
```

Successful response: `201 Created`

```json
{
  "ticket_id": "TKT-0001",
  "created_at": "2026-09-19T10:00:00.000Z"
}
```

Validation rules:

- Customer name must contain at least 2 characters.
- Customer email must be valid.
- Subject must contain at least 3 characters.
- Description must contain at least 10 characters.

### List and Search Tickets

```http
GET /api/tickets
GET /api/tickets?status=Open
GET /api/tickets?search=account
```

Supported query parameters:

| Parameter | Description |
| --- | --- |
| `status` | `Open`, `In Progress`, or `Closed` |
| `search` | Searches ticket ID, customer name, email, subject, and description |

Response:

```json
{
  "success": true,
  "data": []
}
```

### Get Ticket Details

```http
GET /api/tickets/TKT-0001
```

The response includes ticket fields and an array of internal notes.

### Update Status or Add a Note

```http
PUT /api/tickets/TKT-0001
Content-Type: application/json
```

Update status:

```json
{
  "status": "In Progress"
}
```

Add a note:

```json
{
  "notes": "Customer was contacted and the issue is being investigated."
}
```

Both fields can be sent together. Valid statuses are `Open`, `In Progress`, and `Closed`.

## Data Models

### Ticket

- `ticket_id`: unique public ticket identifier
- `customer_name`: customer name
- `customer_email`: customer email address
- `subject`: short issue title
- `description`: detailed issue description
- `status`: ticket status, defaulting to `Open`
- `created_at`: creation timestamp
- `updated_at`: last update timestamp

### Note

- `ticket_id`: associated ticket identifier
- `note_text`: internal note content
- `created_at`: note creation timestamp

## Error Handling

The API returns JSON errors for invalid routes, failed validation, missing tickets, and server/database errors. Typical status codes are:

- `200 OK`: successful read or update
- `201 Created`: ticket created
- `400 Bad Request`: validation failed
- `404 Not Found`: route or ticket does not exist
- `500 Internal Server Error`: unexpected server or database error

## Connecting the Frontend

The frontend uses this default API URL:

```text
http://localhost:5000
```

To change it, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start both applications in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## Security and Deployment Notes

- Keep MongoDB credentials in environment variables.
- Add only trusted frontend origins to `CLIENT_URL` in production.
- Restrict MongoDB Atlas network access appropriately.
- Use a managed secret store for deployed environments.
- Add authentication and authorization before exposing the API publicly.
- Add pagination and rate limiting for large production datasets.

## Future Enhancements

- User authentication and role-based permissions
- Ticket assignment to support agents
- File attachments
- Email notifications
- Pagination and advanced reporting
- Audit history for status changes
- Automated tests and API documentation with OpenAPI