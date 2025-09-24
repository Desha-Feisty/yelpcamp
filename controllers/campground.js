const Campground = require("../models/campground");


module.exports.index =  async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log(`request date ${req.requestTime}`);
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = async(req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res, next) => {
    console.log("Full req.body:", req.body);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

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
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Successfully updated a campground.");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(campground);
    req.flash("success", "Successfully deleted a campground.");
    res.redirect("/campgrounds");
}