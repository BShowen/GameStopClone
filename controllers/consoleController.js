const Console = require("../models/Console");
const mongoose = require("mongoose");

// get request to list all consoles
exports.GET_consoleList = (req, res, next) => {
  Console.find({}).exec((err, console_list) => {
    if (err) return next(err);
    return res.render("consoleList", {
      consoleList: console_list,
    });
  });
};

// get request for a single console
exports.GET_consoleView = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  Console.findById(id).exec((err, console) => {
    if (err) return next(err);

    return res.render("consoleView", {
      console,
    });
  });
};
