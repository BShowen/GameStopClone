const Accessory = require("../models/Accessory");

// GET request for all accessories
exports.GET_allAccessories = (req, res) => {
  res.send("GET request for all accessories");
};

// GET request to create a new accessory
exports.GET_accessoryCreate = (req, res) => {
  res.send("GET request to create a new accessory");
};

// POST request to create a new accessory
exports.POST_accessoryCreate = (req, res) => {
  res.send("POST request to create a new accessory");
};

// GET request to update a new accessory
exports.GET_accessoryUpdate = (req, res) => {
  res.send("GET request to update a new accessory");
};

// POST request to update a new accessory
exports.POST_accessoryUpdate = (req, res) => {
  res.send("POST request to update a new accessory");
};

// GET request to delete a new accessory
exports.GET_accessoryDelete = (req, res) => {
  res.send("GET request to delete a new accessory");
};

// GET request to view a single accessory
exports.GET_accessoryView = (req, res) => {
  res.send("GET request to view a single accessory");
};
