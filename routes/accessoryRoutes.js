const express = require("express");
const router = express.Router();

const accessoryController = require("../controllers/accessoryController");

// GET request for all accessories
router.get("/", accessoryController.GET_allAccessories);

// GET request to create a new accessory
router.get("/new", accessoryController.GET_accessoryCreate);

// POST request to create a new accessory
router.post("/new", accessoryController.POST_accessoryCreate);

// GET request to update a new accessory
router.get("/:id/update", accessoryController.GET_accessoryUpdate);

// POST request to update a new accessory
router.post("/:id/update", accessoryController.POST_accessoryUpdate);

// GET request to delete a new accessory
router.get("/:id/delete", accessoryController.GET_accessoryDelete);

// GET request to view a single accessory
router.get("/:id", accessoryController.GET_accessoryView);

module.exports = router;
