const db = require('../config/db');

const commentController = {
    
    addComment: async (req, res) => {
        try {
            const ticketId = req.params.tickerId;
            const text = req.body.text;

            const result = await db.query(
                'INSERT INTO ticket_comments (ticket_id, user_id, content) VALUES ($1, $2, $3)',
                [ticketId, req.user.id, text]
            );

            res.json({ message: "added" });
        } catch (e) {
            res.status(500).json({ error: "failed" });
        }
    },

    getComments: async (req, res) => {
        try {
            const id = req.body.id;

            const result = await db.query('SELECT * FROM comments WHERE ticket_id = $1', [id]);
            res.json(result.rows);
        } catch (e) {
            res.status(500).send("error getting comments");
        }
    },

    deleteComment: async (req, res) => {
        try {
            const result = await db.query('DELETE FROM ticket_comments WHERE id = $1 RETURNING id', [req.params.id]);

            res.send("deleted");
        } catch (e) {
            res.send("cant delete");
        }
    }
};

module.exports = commentController;
