const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require("../middelware");
const campgrounds = require("../controllers/campground");
const multer = require("multer")
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })


const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === "chickennugget") {
        return next();
    }
    // res.send('Unauthenticated user')
    throw new AppError("Wrong password", 401);
};


router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/")
.get(catchAsync(campgrounds.index))
.post(
    isLoggedIn,
    upload.array('campground[image]'),
    validateCampground,
    catchAsync(campgrounds.createCampground)
);


router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Can't find this campground!");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router
.route("/:id")
.get(catchAsync(campgrounds.showCampground))
.put(
    isLoggedIn,
    isAuthor,
    upload.array('campground[image]'),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
)
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

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
