const GameConsole = require("../models/GameConsole");
const Accessory = require("../models/Accessory");
const Game = require("../models/Game");
const mongoose = require("mongoose");
const async = require("async");
const path = require("node:path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExt}`);
  },
});
const upload = multer({ storage: storage });

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
  upload.single("console-picture"),
  (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.consoleId);
    const gameConsole = new GameConsole({
      ...req.body,
      _id: id,
      img_path: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    GameConsole.findByIdAndUpdate(id, gameConsole).exec(
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
        // Else, delete the gameConsole and redirect to console list page.
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
  upload.single("console-picture"),
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
