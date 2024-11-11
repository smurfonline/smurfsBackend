const express = require("express");
const router = express.Router();
const GroundController = require("../Controllers/groundController");

router.post("/createGround", GroundController.createGround);
router.get("/", GroundController.getGrounds);
router.get("/:id", GroundController.getGround);
router.put("/:id", GroundController.updateGround);

module.exports = router;