const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate);

router.post(
  "/",
  requireRole(["USER", "MANAGER"]),
  ticketController.createTicket,
);

router.get(
  "/",
  requireRole(["USER", "SUPPORT", "MANAGER"]),
  ticketController.getTickets,
);

router.patch(
  "/:id/assign",
  requireRole(["MANAGER", "SUPPORT"]),
  ticketController.assignTicket,
);

router.patch(
  "/:id/status",
  requireRole(["MANAGER", "SUPPORT"]),
  ticketController.updateStatus,
);

module.exports = router;
