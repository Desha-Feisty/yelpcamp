const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  console.log(`Request user: ${req.user}`);
  if (!req.isAuthenticated()) {
    req.flash("error", "You have to sign in first");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msgArray = error.details.map((el) => el.message);
    throw new ExpressError(msgArray, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (
    !campground ||
    !campground.author ||
    !req.user ||
    !campground.author.equals(req.user._id)
  ) {
    req.flash("error", "You are not authorized!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  console.log("review: ", review, "\n", "request user: ", req.user)
  if (
    !req.user ||
    !review.author ||
    !review.author.equals(req.user._id)
  ) {
    req.flash("error", "You are not authorized!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msgArray = error.details.map((el) => el.message);
    throw new ExpressError(msgArray, 400);
  } else {
    next();
  }
};
