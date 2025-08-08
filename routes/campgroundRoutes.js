const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require("../middelware");

const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === "chickennugget") {
    return next();
  }
  // res.send('Unauthenticated user')
  throw new AppError("Wrong password", 401);
};

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  console.log(`request date ${req.requestTime}`);
  res.render("campgrounds/index", { campgrounds });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
      req.flash("error", "Can't find this campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Successfully updated a campground.");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(campground);
    req.flash("success", "Successfully deleted a campground.");
    res.redirect("/campgrounds");
  })
);

router.get("/secret", verifyPassword, (req, res) => {
  res.send("my secret is ....");
});

router.get("/admin", (req, res) => {
  throw new routerError("You are not an admin", 403);
});

router.get("/error", (req, res) => {
  chicken.fly();
});

module.exports = router;
