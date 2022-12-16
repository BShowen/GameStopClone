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
  Console.findById(id).exec((err, Console) => {
    if (err) return next(err);
    return res.render("consoleView", {
      console: Console,
    });
  });
};

// get request to update a console
exports.GET_consoleUpdate = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  Console.findById(id).exec((err, console) => {
    return res.render("consoleUpdate", {
      console,
    });
  });
};

// post request to update a console
exports.POST_consoleUpdate = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  const newConsole = new Console({ ...req.body, _id: id });
  Console.findByIdAndUpdate(id, newConsole).exec((err, result) => {
    if (err) return next(err);

    res.redirect(result.url);
  });
};

// get request to delete a console
exports.GET_consoleDelete = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.consoleId);
  Console.findByIdAndDelete(id).exec((err, result) => {
    res.redirect("/consoles");
  });
};
