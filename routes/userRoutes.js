const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, requireRole } = require("../middleware/auth");

router.post("/login", userController.login);
router.post("/users", authenticate, requireRole(["MANAGER"]), userController.createUser);
router.get("/users", authenticate, requireRole(["MANAGER"]), userController.getUsers);

module.exports = router;
