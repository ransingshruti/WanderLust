const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listings");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});

// View all listings / Add new listing
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[img]"), 
    wrapAsync(listingController.createListing)
  );

// Form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// View, edit, or delete specific listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isOwner,
  
    wrapAsync(listingController.updateListings)
  )
  .delete(isOwner, wrapAsync(listingController.destroyListings));

// Form to edit listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
// router.get("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));
module.exports = router;



