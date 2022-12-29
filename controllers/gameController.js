const Game = require("../models/Game");
const GameConsole = require("../models/GameConsole");
const mongoose = require("mongoose");
const async = require("async");
const upload = require("./helpers/multerUpload");
const path = require("node:path");
const fs = require("node:fs");

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
  upload.single("game-image"),
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
exports.POST_updateGame = [
  upload.single("game-image"),
  (req, _, next) => {
    // Find the game in the DB.
    const gameId = mongoose.Types.ObjectId(req.params.gameId);
    Game.findById(gameId).exec((err, foundGame) => {
      if (err) return next(err);
      req.game = foundGame;
      next();
    });
  },
  (req, _, next) => {
    if (req.body["delete-photo"]) {
      const absolutePath = path.normalize(
        __dirname + "/../public" + req.game.img_path
      );
      fs.unlink(absolutePath, (err) => {
        if (err) return next(err);
      });
      // game.img_path must be set to this string, otherwise game.hasImage will
      // return true when it should return false. What is happening is an
      // attribute it being changed on the model, but the hasImage method is
      // operating on the value before it was changed.
      req.game.img_path = "/images/placeholder_image.jpg";
    }
    delete req.body["delete-photo"];
    next();
  },
  (req, res, next) => {
    const { game } = req;
    // Create a new game model with params from the form.
    const updatedGame = new Game({
      ...req.body,
      _id: game._id,
      img_path: game.img_path,
    });

    if (req.file !== undefined && game.hasImage) {
      // If game has image and user is uploading a new image.
      // Remove old image. Update with new image.

      // Delete old image
      const absolutePath = path.normalize(
        __dirname + "/../public" + game.img_path
      );
      fs.unlink(absolutePath, (err) => {
        if (err) return next(err);
      });

      // Update the img_path on the updatedGame.
      updatedGame.img_path = `/uploads/${req.file.filename}`;
    } else if (req.file !== undefined && !game.hasImage) {
      // If game doesn't have image and user is supplying one, use new image.
      updatedGame.img_path = `/uploads/${req.file.filename}`;
    }

    // Perform the update.
    Game.findByIdAndUpdate(game._id, updatedGame).exec((err, newGame) => {
      if (err) return next(err);

      res.redirect(newGame.url);
    });
  },
];

// get request to delete a game
exports.GET_deleteGame = (req, res, next) => {
  const gameId = mongoose.Types.ObjectId(req.params.gameId);
  Game.findByIdAndRemove(gameId).exec((err, game) => {
    if (err) return next(err);

    // delete the game record and delete the game photo.
    if (game.hasImage) {
      const absolutePath = path.normalize(
        __dirname + "/../public" + game.img_path
      );
      fs.unlink(absolutePath, (err) => {
        if (err) return next(err);
      });
    }

    return res.redirect("/games");
  });
};
