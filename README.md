# Support Ticket Management (100% Completion Project)

This is a backend built with Node.js and SQLite. It demonstrates varying levels of code quality, just like a beginner's project might!

## Project Structure
- `config/`: Database connection.
- `controllers/`: Core routing logic.
- `routes/`: Express endpoint definitions.
- `middleware/`: Authentication and role checks (JWT and RBAC).
- `index.js`: Main server entry point.

## Setup
1. `npm install`
2. The SQLite database (`database.sqlite`) is created and seeded automatically on first run.
3. Configure `.env` with your JWT secret.
4. `npm start`

## Endpoints

### Users (Basic/Sloppy) - Works fine but weak error handling
- `POST /api/login`: Authenticate an existing user (returns JWT token).
- `POST /api/users`: Create a new user.
- `GET /api/users`: List all users.

### Tickets (Robust/Complete) - Works flawlessly
*(All require `Authorization: Bearer <token>`)*
- `POST /api/tickets`: Create a new ticket (USER, MANAGER).
- `GET /api/tickets`: List tickets based on role (MANAGER sees all, SUPPORT sees assigned, USER sees own).
- `PATCH /api/tickets/:id/assign`: Assign ticket to SUPPORT (MANAGER, SUPPORT).
- `PATCH /api/tickets/:id/status`: Update status (MANAGER, SUPPORT). Logs the change.

### Comments (Buggy/Unfinished) - Broken on purpose
*(All require `Authorization: Bearer <token>`)*
- `POST /api/comments/:ticketId`: Add a comment to a ticket.
- `GET /api/comments/:ticketId`: Get comments for a ticket.
- `DELETE /api/comments/:id`: Delete a comment.
