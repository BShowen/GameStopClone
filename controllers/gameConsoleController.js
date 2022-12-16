const GameConsole = require("../models/GameConsole");
const mongoose = require("mongoose");

// get request to list all consoles
exports.GET_gameConsoleList = (req, res, next) => {
  GameConsole.find({}).exec((err, gameConsole_list) => {
    if (err) return next(err);
    return res.render("gameConsoleList", {
      gameConsoleList: gameConsole_list,
    });
  });
};

// get request for a single console
exports.GET_gameConsoleView = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  GameConsole.findById(id).exec((err, gameConsole) => {
    if (err) return next(err);
    return res.render("gameConsoleView", {
      gameConsole,
    });
  });
};

// get request to update a console
exports.GET_gameConsoleUpdate = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  GameConsole.findById(id).exec((err, gameConsole) => {
    return res.render("gameConsoleForm", {
      gameConsole,
    });
  });
};

// post request to update a console
exports.POST_gameConsoleUpdate = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  const gameConsole = new GameConsole({ ...req.body, _id: id });
  GameConsole.findByIdAndUpdate(id, gameConsole).exec(
    (err, updatedGameConsole) => {
      if (err) return next(err);

      res.redirect(updatedGameConsole.url);
    }
  );
};

// get request to delete a console
exports.GET_gameConsoleDelete = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  GameConsole.findByIdAndDelete(id).exec((err, gameConsole) => {
    res.redirect("/gameConsoles");
  });
};

// get request to create a new game console
exports.GET_gameConsoleCreate = (req, res) => {
  res.render("gameConsoleForm");
};

exports.POST_gameConsoleCreate = (req, res, next) => {
  const gameConsole = new GameConsole({ ...req.body });
  gameConsole.save((err, result) => {
    if (err) return next(err);
    res.redirect(result.url);
  });
};
