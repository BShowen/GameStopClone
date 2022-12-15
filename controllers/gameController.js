// get request to list all games
exports.GET_allGames = (req, res) => {
  res.render("gameList");
};

// get request for a single game
exports.GET_gameView = (req, res) => {
  const id = req.params.gameId;
  res.render("gameView", {
    id,
  });
};
