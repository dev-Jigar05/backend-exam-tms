# Helpdesk Backend API

This is a backend project for a Helpdesk Ticket Management System. It is built using **Node.js, Express, and SQLite**.

## Requirements

- Node.js (v18+)
- npm

## Setup Process

1. **Download the code**: Clone or download the project repository to your local machine.

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory (or use the existing one) and add the required JWT secret:
   ```env
   JWT_SECRET=supersecret12345
   PORT=3000
   ```
   *(Note: The application uses SQLite, so no external database connection URL is required)*.

4. **Run the server**:
   Start the application using:
   ```bash
   npm start
   ```

The server will automatically initialize the SQLite database using the `schema.sql` file and will be accessible at:
**`http://localhost:3000`** (or whichever port is defined in `.env`).

## API Endpoints

### Authentication & Users
- `POST /api/login` — Login
  - Body: 
    ```json
    { "email": "admin@helpdesk.com", "password": "admin123" }
    ```
- `POST /api/users` — Create a new user (**MANAGER** only)
  - Body: 
    ```json
    { 
      "name": "John Doe", 
      "email": "john@helpdesk.com", 
      "password": "password123", 
      "role": "SUPPORT" 
    }
    ```
  - Roles can be: `MANAGER`, `SUPPORT`, `USER`
- `GET /api/users` — Get all users (**MANAGER** only)

### Tickets
- `POST /api/tickets` — Create a new ticket (**USER**, **MANAGER** only)
  - Body: 
    ```json
    { 
      "title": "Laptop not booting", 
      "description": "My office laptop does not start after update", 
      "priority": "MEDIUM" 
    }
    ```
  - Priority can be: `LOW`, `MEDIUM`, `HIGH`
- `GET /api/tickets` — Get all tickets (**USER**, **SUPPORT**, **MANAGER** only)
- `PATCH /api/tickets/:id/assign` — Assign a ticket to someone (**MANAGER**, **SUPPORT** only)
  - Body: 
    ```json
    { "userId": 2 }
    ```
- `PATCH /api/tickets/:id/status` — Update ticket status (**MANAGER**, **SUPPORT** only)
  - Body: 
    ```json
    { "status": "IN_PROGRESS" }
    ```
  - Status can be: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

### Comments
- `POST /api/comments/:ticketId` — Add a comment to a ticket
  - Body: 
    ```json
    { "content": "We are checking the issue" }
    ```
- `GET /api/comments/:ticketId` — Get comments for a ticket
- `DELETE /api/comments/:id` — Delete a comment
