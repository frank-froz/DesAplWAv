const express = require("express");
const router = express.Router();
const controller = require("../controllers/TicketController");

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id/notifications", controller.getNotifications);
router.put("/:id/assign", controller.assign);
router.put("/:id/status", controller.changeStatus);
router.delete("/:id", controller.delete);

module.exports = router;