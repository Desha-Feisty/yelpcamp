const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor } = require("../middelware.js");
const { validateReview } = require("../middelware.js");
const review = require("../controllers/reviews.js")

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(review.createReview)
);

router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review.deleteReview)
);

module.exports = router;
