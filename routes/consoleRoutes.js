const express = require("express");
const router = express.Router();

const consoleController = require("../controllers/consoleController");

// Handle GET request to display all consoles
router.get("/", consoleController.GET_consoleList);

// Handle GET request to view a single console
router.get("/:consoleId", consoleController.GET_consoleView);

module.exports = router;
