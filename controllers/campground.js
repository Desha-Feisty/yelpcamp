const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log(`request date ${req.requestTime}`);
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.image = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    console.log(req.files);
    console.log(campground);
    req.flash("success", "successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    // Only update the fields that are in the schema
    const campground = await Campground.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    // Add new uploaded images if any
    if (req.files && req.files.length > 0) {
        const imgs = req.files.map((f) => ({
            url: f.path,
            filename: f.filename,
        }));
        campground.image.push(...imgs);
        await campground.save();
    }
    // Delete images if requested
    if (req.body.deleteImages && req.body.deleteImages.length) {
        for (let filename of req.body.deleteImages) {
            // Remove from Cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        // Remove from MongoDB
        await campground.updateOne({
            $pull: { image: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash("success", "Successfully updated a campground.");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(campground);
    req.flash("success", "Successfully deleted a campground.");
    res.redirect("/campgrounds");
};
