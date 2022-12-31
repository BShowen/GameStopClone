const path = require("node:path");
const fs = require("node:fs");

// A model is passed in and the model's image is deleted.
// Nothing is returned from this function and that is intentional. If there is
// an error deleting the image, that error is passed up to the caller by
// calling the provided callback. Caller is responsible for handling the error.
function deleteImage({ model }, cb) {
  const absolutePath = path.normalize(
    // Get the path to the photo that is to be deleted.
    // All models with images have an attr. for retrieving the image's path.
    // We use that atr. to compute an absolute path to that image.
    __dirname + "/../../public" + model.img_path
  );

  // Perform the deletion of the photo.
  fs.unlink(absolutePath, (err) => {
    // Call the callback if there is en error.
    if (err) cb(err);
  });
}

module.exports = deleteImage;
