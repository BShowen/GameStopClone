const express = require("express");
const router = express.Router();

const consoleController = require("../controllers/consoleController");

// Handle GET request to display all consoles
router.get("/", consoleController.GET_consoleList);

// Handle GET request to update a console
router.get("/:consoleId/update", consoleController.GET_consoleUpdate);

// Handle POST request to update a console
router.post("/:consoleId/update", consoleController.POST_consoleUpdate);

router.get("/:consoleId/delete", consoleController.GET_consoleDelete);

// Handle GET request to view a single console
router.get("/:consoleId", consoleController.GET_consoleView);

module.exports = router;
