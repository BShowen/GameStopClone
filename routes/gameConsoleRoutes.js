const express = require("express");
const router = express.Router();

const gameConsoleController = require("../controllers/gameConsoleController");

// Handle GET request to display all consoles
router.get("/", gameConsoleController.GET_gameConsoleList);

// Handle GET request to update a console
router.get("/:consoleId/update", gameConsoleController.GET_gameConsoleUpdate);

// Handle POST request to update a console
router.post("/:consoleId/update", gameConsoleController.POST_gameConsoleUpdate);

router.get("/:consoleId/delete", gameConsoleController.GET_gameConsoleDelete);

// Handle GET request to view a single console
router.get("/:consoleId", gameConsoleController.GET_gameConsoleView);

module.exports = router;
