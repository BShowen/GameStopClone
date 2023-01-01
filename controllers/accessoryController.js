const Accessory = require("../models/Accessory");
const GameConsole = require("../models/GameConsole");
const mongoose = require("mongoose");
const async = require("async");
const upload = require("./helpers/multerUpload");
const deleteImage = require("./helpers/deleteImage");

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
exports.POST_accessoryCreate = [
  upload.single("model-image"),
  (req, res, next) => {
    const newAccessory = new Accessory({
      ...req.body,
      img_path: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    newAccessory.save((err, savedAccessory) => {
      if (err) return next(err);
      res.redirect(savedAccessory.url);
    });
  },
];

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
        Accessory.findById(id).populate({ path: "gameConsole" }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);

      const { gameConsole_list, accessory } = results;
      // set the selected console to the pre selected console
      const accessoryConsoleId = accessory.gameConsole._id.toString();
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
exports.POST_accessoryUpdate = [
  upload.single("model-image"),
  (req, _, next) => {
    // Find the accessory in the DB.
    const accessoryId = mongoose.Types.ObjectId(req.params.id);
    Accessory.findById(accessoryId).exec((err, accessory) => {
      if (err) return next(err);
      req.accessory = accessory;
      next();
    });
  },
  // This function removes the model's image when the user has removed the image
  (req, _, next) => {
    // If the user wants to delete the image for this model.
    if (req.body["delete-photo"]) {
      // Remove the form attr. that tells this method to delete the image.
      // If not removed then there will be an unexpected attribute error
      // from mongoose.
      delete req.body["delete-photo"];

      // Delete the image or log the error if image isn't found
      deleteImage({ model: req.accessory }, (err) => {
        // An error deleting the photo is simply logged. Ideally this would be
        // sent to some logger or ticketed for the dev to review. Because this
        // is not a real world app I am simply logging the error.
        console.log(err);
      });

      // model.img_path must be set to this string, otherwise model.hasImage will
      // return true when it should return false. What is happening is an
      // attribute it being changed on the model, but the hasImage method is
      // operating on the value before it was changed.
      req.accessory.img_path = "/images/placeholder_image.jpg";
    }
    next();
  },
  (req, res, next) => {
    const { accessory } = req;
    // Create a new accessory model with params from the form.
    const updatedAccessory = new Accessory({
      ...req.body,
      _id: accessory._id,
      img_path: accessory.img_path,
    });

    if (req.file) {
      // If the user is supplying an image.
      updatedAccessory.img_path = `/uploads/${req.file.filename}`;
    }

    // Perform the update.
    Accessory.findByIdAndUpdate(accessory._id, updatedAccessory).exec(
      (err, newAccessory) => {
        if (err) return next(err);

        res.redirect(newAccessory.url);
      }
    );
  },
];

// GET request to delete a new accessory
exports.GET_accessoryDelete = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Accessory.findByIdAndDelete(id).exec((err, accessory) => {
    if (err) return next(err);

    // Delete the image associated with this model.
    if (accessory.hasImage) {
      deleteImage({ model: accessory }, (err) => {
        // An error deleting the photo is simply logged. Ideally this would be
        // sent to some logger or ticketed for the dev to review. Because this
        // is not a real world app I am simply logging the error.
        console.log(err);
      });
    }

    res.redirect("/accessories");
  });
};

// GET request to view a single accessory
exports.GET_accessoryView = (req, res, next) => {
  // get accessory from the DB and populate console field.
  const id = mongoose.Types.ObjectId(req.params.id);
  Accessory.findById(id)
    .populate({ path: "gameConsole" })
    .exec((err, accessory) => {
      if (err) return next(err);

      // render accessoryView
      res.render("accessoryView", {
        accessory,
      });
    });
};
