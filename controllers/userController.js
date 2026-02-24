const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {

    login: async (req, res) => {
        try {
            const result = await db.query(
                `SELECT u.*, r.name as role_name 
                 FROM users u 
                 JOIN roles r ON u.role_id = r.id 
                 WHERE u.email = $1`,
                [req.body.email],
            );

            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const match = await bcrypt.compare(req.body.password, user.password);

            if (match) {
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role_name },
                    process.env.JWT_SECRET,
                );
                res.json({ token, role: user.role_name });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const roleRes = await db.query("SELECT id FROM roles WHERE name = $1", [
                req.body.role,
            ]);

            if (roleRes.rows.length === 0) {
                return res.status(400).send("bad role");
            }

            const roleId = roleRes.rows[0].id;
            const hash = await bcrypt.hash(req.body.password, 10);

            const insertRes = await db.query(
                "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id",
                [req.body.name, req.body.email, hash, roleId],
            );

            res.json({ id: insertRes.rows[0].id });
        } catch (e) {
            res.status(500).json({ error: e.message, detail: e.detail });
        }
    },

    getUsers: async (req, res) => {
        try {
            const result = await db.query(
                "SELECT name, email, created_at FROM users",
            );
            res.json(result.rows);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = userController;
