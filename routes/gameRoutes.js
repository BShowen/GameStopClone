const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

router.get("/", gameController.GET_allGames);

router.get("/:gameId", gameController.GET_gameView);

module.exports = router;
