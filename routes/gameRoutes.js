const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

// Handle GET request to display all game
router.get("/", gameController.GET_allGames);

// Handle GET request to create a new game
router.get("/new", gameController.GET_createGame);

// Handle POST request to create a new game
router.post("/new", gameController.POST_createGame);

// Handle GET request to update game
router.get("/:gameId/update", gameController.GET_updateGame);

// Handle POST request to update game
router.post("/:gameId/update", gameController.POST_updateGame);

// Handle GET request to delete a game
router.get("/:gameId/delete", gameController.GET_deleteGame);

// Handle GET request to display a single game
router.get("/:gameId", gameController.GET_gameView);

module.exports = router;
