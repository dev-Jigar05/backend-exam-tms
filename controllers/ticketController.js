const db = require("../config/db");

const ticketController = {
  
  createTicket: async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ error: "Valid title is required." });
      }

      if (
        !description ||
        typeof description !== "string" ||
        description.trim().length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Valid description is required." });
      }

      const result = await db.query(
        "INSERT INTO tickets (title, description, created_by) VALUES ($1, $2, $3) RETURNING id, title, status, priority, created_at",
        [title.trim(), description.trim(), req.user.id],
      );

      res.status(201).json(result.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: "error occurred while creating the ticket",
      });
    }
  },

  getTickets: async (req, res) => {
    try {
      let query = `
                SELECT t.id, t.title, t.description, t.status, t.priority, t.created_at,
                       u.name as creator_name,
                       a.name as assignee_name
                FROM tickets t
                JOIN users u ON t.created_by = u.id
                LEFT JOIN users a ON t.assigned_to = a.id
            `;
      const params = [];

      if (req.user.role === "SUPPORT") {
        query += " WHERE t.assigned_to = $1";
        params.push(req.user.id);
      } else if (req.user.role === "USER") {
        query += " WHERE t.created_by = $1";
        params.push(req.user.id);
      }

      query += " ORDER BY t.created_at DESC";

      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to retrieve tickets." });
    }
  },

  assignTicket: async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { userId } = req.body;

      if (isNaN(ticketId))
        return res.status(400).json({ error: "Invalid ticket ID." });
      if (!userId || isNaN(parseInt(userId)))
        return res.status(400).json({ error: "Valid userId is required." });

      const ticketCheck = await db.query(
        "SELECT id FROM tickets WHERE id = $1",
        [ticketId],
      );
      if (ticketCheck.rows.length === 0)
        return res.status(404).json({ error: "Ticket not found." });

      const userCheck = await db.query(
        "SELECT u.id, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1",
        [userId],
      );
      if (userCheck.rows.length === 0)
        return res.status(404).json({ error: "User not found." });
      if (userCheck.rows[0].role_name === "USER")
        return res
          .status(400)
          .json({ error: "Cannot assign tickets to standard users." });

      const result = await db.query(
        "UPDATE tickets SET assigned_to = $1 WHERE id = $2 RETURNING id, title, assigned_to",
        [userId, ticketId],
      );

      res.json(result.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to assign ticket." });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { status } = req.body;

      if (isNaN(ticketId))
        return res.status(400).json({ error: "Invalid ticket ID." });

      const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          error:
            "Invalid status. Must be OPEN, IN_PROGRESS, RESOLVED, or CLOSED.",
        });
      }

      const ticket = await db.query(
        "SELECT status FROM tickets WHERE id = $1",
        [ticketId],
      );
      if (ticket.rows.length === 0)
        return res.status(404).json({ error: "Ticket not found." });

      const oldStatus = ticket.rows[0].status;

      await db.query("BEGIN");

      const result = await db.query(
        "UPDATE tickets SET status = $1 WHERE id = $2 RETURNING id, status",
        [status, ticketId],
      );

      await db.query(
        "INSERT INTO ticket_status_logs (ticket_id, old_status, new_status, changed_by) VALUES ($1, $2, $3, $4)",
        [ticketId, oldStatus, status, req.user.id],
      );

      await db.query("COMMIT");

      res.json(result.rows[0]);
    } catch (e) {
      await db.query("ROLLBACK");
      console.error(e);
      res.status(500).json({ error: "Failed to update ticket status." });
    }
  },
};

module.exports = ticketController;
