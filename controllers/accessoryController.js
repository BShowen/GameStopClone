const Accessory = require("../models/Accessory");
const GameConsole = require("../models/GameConsole");
const mongoose = require("mongoose");
const async = require("async");

// GET request for all accessories
exports.GET_allAccessories = (req, res, next) => {
  Accessory.find({}).exec((err, accessory_list) => {
    if (err) return next(err);

    res.render("accessoryList", {
      accessoryList: accessory_list,
    });
  });
};

// GET request to create a new accessory
exports.GET_accessoryCreate = (req, res, next) => {
  // Get all gameConsoles
  GameConsole.find({}).exec((err, gameConsole_list) => {
    if (err) return next(err);

    // Render accessoryForm
    res.render("accessoryForm", {
      gameConsoleList: gameConsole_list,
    });
  });
};

// POST request to create a new accessory
exports.POST_accessoryCreate = (req, res, next) => {
  const newAccessory = new Accessory({ ...req.body });
  newAccessory.save((err, savedAccessory) => {
    if (err) return next(err);

    res.redirect(savedAccessory.url);
  });
};

// GET request to update a new accessory
exports.GET_accessoryUpdate = (req, res, next) => {
  // get accessory from DB and populate the console field.
  // get all consoles from the DB.
  async.parallel(
    {
      gameConsole_list(callback) {
        return GameConsole.find({}).exec(callback);
      },
      accessory(callback) {
        const id = mongoose.Types.ObjectId(req.params.id);
        Accessory.findById(id).populate({ path: "console" }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);

      const { gameConsole_list, accessory } = results;
      // set the selected console to the pre selected console
      const accessoryConsoleId = accessory.console._id.toString();
      gameConsole_list.some((gameConsole) => {
        if (gameConsole._id.toString() === accessoryConsoleId) {
          gameConsole.isSelected = true;
          return true;
        }
      });

      res.render("accessoryForm", {
        accessory,
        gameConsoleList: gameConsole_list,
      });
    }
  );
};

// POST request to update a new accessory
exports.POST_accessoryUpdate = (req, res, next) => {
  // get the accessory from the DB and update it
  const id = mongoose.Types.ObjectId(req.params.id);
  const oldAccessory = new Accessory({ ...req.body, _id: id });
  Accessory.findByIdAndUpdate(id, oldAccessory).exec((err, newAccessory) => {
    if (err) return next(err);

    res.redirect(newAccessory.url);
  });
};

// GET request to delete a new accessory
exports.GET_accessoryDelete = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Accessory.findByIdAndDelete(id).exec((err) => {
    if (err) return next(err);

    res.redirect("/accessories");
  });
};

// GET request to view a single accessory
exports.GET_accessoryView = (req, res, next) => {
  // get accessory from the DB and populate console field.
  const id = mongoose.Types.ObjectId(req.params.id);
  Accessory.findById(id)
    .populate({ path: "console" })
    .exec((err, accessory) => {
      if (err) return next(err);

      // render accessoryView
      res.render("accessoryView", {
        accessory,
      });
    });
};
