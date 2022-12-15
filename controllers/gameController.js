// get request to list all games
exports.GET_allGames = (req, res) => {
  res.send("Respond with a GAME resource");
};

// get request for a single game
exports.GET_gameView = (req, res) => {
  const id = req.params.gameId;
  res.send(`Game ID: ${id}`);
};
