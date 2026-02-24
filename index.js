require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const commentRoutes = require("./routes/commentRoutes");
const db = require("./config/db");
const fs = require("fs");

// Apply schema automatically
setTimeout(() => {
    const schemaSql = fs.readFileSync('./schema.sql', 'utf8');
    schemaSql.split(';').forEach(async (query) => {
        if (query.trim()) {
            try {
                await db.query(query);
            } catch (e) {
                // Ignore safe errors like 'already exists'
            }
        }
    });
}, 1000);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is Running!");
});

app.use("/api", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/comments", commentRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on http://localhost:3000");
});
