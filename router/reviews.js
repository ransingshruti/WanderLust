// const express=require("express")
// const router=express.Router({mergeParams:true});
// const Listing = require("../models/listing"); //
// const Review=require("../models/reviews")
// const wrapAsync=require("../utils/wrapAsync");
// const ExpressError=require("../utils/ExpressError");
// // const { isLoggedIn } = require("../middleware");
// const { isLoggedIn, isReviewAuthor } = require("../middleware");

// router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


// const reviewController=require("../controllers/reviews")

// // review Route:

// router.post("/",isLoggedIn,wrapAsync(reviewController.createReview))

// // Delete review route

// router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
// module.exports=router

const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

const reviewController = require("../controllers/reviews");

// Create review
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

// Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;


