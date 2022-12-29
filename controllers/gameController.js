const Game = require("../models/Game");
const GameConsole = require("../models/GameConsole");
const mongoose = require("mongoose");
const async = require("async");
const upload = require("./helpers/multerUpload");

// get request to list all games
exports.GET_allGames = (req, res, next) => {
  Game.find({})
    .populate({ path: "console" })
    .exec((err, game_list) => {
      if (err) return next(err);

      return res.render("gameList", {
        gameList: game_list,
      });
    });
};

// get request for a single game
exports.GET_gameView = (req, res) => {
  const id = req.params.gameId;
  Game.findById(id)
    .populate({ path: "console" })
    .exec((err, game) => {
      if (err) return next(err);

      return res.render("gameView", {
        game,
      });
    });
};

//  get request to create a new game
exports.GET_createGame = (req, res) => {
  GameConsole.find({}).exec((err, gameConsole_list) => {
    if (err) return next(err);
    return res.render("gameForm", {
      gameConsoleList: gameConsole_list,
    });
  });
};

// post request to create a new game
exports.POST_createGame = [
  upload.single("console-picture"),
  (req, res, next) => {
    const game = new Game({
      ...req.body,
      img_path: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    game.save((err, newGame) => {
      if (err) return next(err);

      res.redirect(newGame.url);
    });
  },
];

// get request to update a game
exports.GET_updateGame = (req, res, next) => {
  async.parallel(
    {
      gameConsole_list(callback) {
        return GameConsole.find(callback);
      },
      game(callback) {
        const gameId = mongoose.Types.ObjectId(req.params.gameId);
        return Game.findById(gameId)
          .populate({ path: "console" })
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);

      // Set the pre-selected game console selection for dropdown.
      const game_consoleId = results.game.console._id.toString();
      results.gameConsole_list.some((gameConsole) => {
        if (gameConsole._id.toString() === game_consoleId) {
          gameConsole.isSelected = true;
          return true;
        }
      });

      res.render("gameForm", {
        game: results.game,
        gameConsoleList: results.gameConsole_list,
      });
    }
  );
};

// post request to update a game
exports.POST_updateGame = (req, res, next) => {
  // Find the game in teh BD.
  const gameId = mongoose.Types.ObjectId(req.params.gameId);
  const oldGame = new Game({ ...req.body, _id: gameId });
  Game.findByIdAndUpdate(gameId, oldGame).exec((err, newGame) => {
    if (err) return next(err);

    res.redirect(newGame.url);
  });
};

// get request to delete a game
exports.GET_deleteGame = (req, res, next) => {
  const gameId = mongoose.Types.ObjectId(req.params.gameId);
  Game.findByIdAndRemove(gameId).exec((err) => {
    if (err) return next(err);

    return res.redirect("/games");
  });
};
