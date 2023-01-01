const GameConsole = require("../models/GameConsole");
const Accessory = require("../models/Accessory");
const Game = require("../models/Game");
const mongoose = require("mongoose");
const async = require("async");
const upload = require("./helpers/multerUpload");
const deleteImage = require("./helpers/deleteImage");

// get request to list all game consoles
exports.GET_gameConsoleList = (req, res, next) => {
  GameConsole.find({}).exec((err, gameConsole_list) => {
    if (err) return next(err);
    return res.render("gameConsoleList", {
      gameConsoleList: gameConsole_list,
    });
  });
};

// get request for a single game console
exports.GET_gameConsoleView = (req, res, next) => {
  // get all games associated with this console
  // get all accessories associated with this console
  const gameConsoleId = mongoose.Types.ObjectId(req.params.consoleId);
  async.parallel(
    {
      accessory_list(callback) {
        return Accessory.find({ console: gameConsoleId }).exec(callback);
      },
      game_list(callback) {
        return Game.find({ console: gameConsoleId }).exec(callback);
      },
      gameConsole(callback) {
        return GameConsole.findById(gameConsoleId).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);

      const { accessory_list, game_list, gameConsole } = results;
      return res.render("gameConsoleView", {
        gameConsole,
        accessoryList: accessory_list,
        gameList: game_list,
      });
    }
  );
};

// get request to update a game console
exports.GET_gameConsoleUpdate = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  GameConsole.findById(id).exec((err, gameConsole) => {
    return res.render("gameConsoleForm", {
      gameConsole,
    });
  });
};

// post request to update a game console
exports.POST_gameConsoleUpdate = [
  upload.single("model-image"),
  (req, _, next) => {
    // Find the console in the DB.
    const consoleId = mongoose.Types.ObjectId(req.params.consoleId);
    GameConsole.findById(consoleId).exec((err, gameConsole) => {
      if (err) return next(err);
      req.gameConsole = gameConsole;
      next();
    });
  },
  (req, _, next) => {
    // If the user wants to delete the image for this model.
    if (req.body["delete-photo"]) {
      // Remove the form attr. that tells this method to delete the image.
      // If not removed then there will be an unexpected attribute error
      // from mongoose.
      delete req.body["delete-photo"];
      deleteImage({ model: req.gameConsole }, (err) => {
        // An error deleting the photo is simply logged. Ideally this would be
        // sent to some logger or ticketed for the dev to review. Because this
        // is not a real world app I am simply logging the error.
        console.log(err);
      });

      // img_path must be set to this string, otherwise game.hasImage will
      // return true when it should return false. What is happening is an
      // attribute it being changed on the model, but the hasImage method is
      // operating on the value before it was changed.
      req.gameConsole.img_path = "/images/placeholder_image.jpg";
    }
    next();
  },
  (req, res, next) => {
    const { gameConsole } = req;
    const updatedGameConsole = new GameConsole({
      ...req.body,
      _id: gameConsole._id,
      img_path: gameConsole.img_path,
    });

    if (req.file) {
      // If the user is supplying an image.
      updatedGameConsole.img_path = `/uploads/${req.file.filename}`;
    }

    // Perform the update.
    GameConsole.findByIdAndUpdate(gameConsole._id, updatedGameConsole).exec(
      (err, updatedGameConsole) => {
        if (err) return next(err);

        res.redirect(updatedGameConsole.url);
      }
    );
  },
];

// get request to delete a game console
exports.GET_gameConsoleDelete = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  async.parallel(
    {
      // get all games associated with this console.
      game_list(callback) {
        return Game.find({ console: id }).exec(callback);
      },
      // get all accessories associated with this console.
      accessory_list(callback) {
        return Accessory.find({ console: id }).exec(callback);
      },
      // get the gameConsole.
      gameConsole(callback) {
        return GameConsole.findById(id).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);

      const { game_list, accessory_list, gameConsole } = results;
      // If gameConsole has any games or accessories
      if (game_list.length > 0 || accessory_list.length > 0) {
        // render gameConsole view with error messages.
        res.render("gameConsoleView", {
          gameConsole,
          gameList: game_list,
          accessoryList: accessory_list,
          showErrorMessage: true,
        });
      } else {
        // delete the gameConsole record and delete the gameConsole photo.
        if (gameConsole.hasImage) {
          deleteImage({ model: gameConsole }, (err) => {
            // An error deleting the photo is simply logged. Ideally this would be
            // sent to some logger or ticketed for the dev to review. Because this
            // is not a real world app I am simply logging the error.
            console.log(err);
          });
        }

        GameConsole.deleteOne({ _id: id }).exec((err) => {
          if (err) return next(err);

          res.redirect("/gameConsoles");
        });
      }
    }
  );
};

// get request to create a new game console
exports.GET_gameConsoleCreate = (req, res) => {
  res.render("gameConsoleForm");
};

// post request to create a new game console
exports.POST_gameConsoleCreate = [
  upload.single("model-image"),
  (req, res, next) => {
    const gameConsole = new GameConsole({
      ...req.body,
      img_path: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    gameConsole.save((err, result) => {
      if (err) return next(err);
      res.redirect(result.url);
    });
  },
];
