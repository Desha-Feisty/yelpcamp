const express = require('express')
const router = express.Router({mergeParams: true})
const { reviewSchema } = require('../schemas')
const Review = require('../models/review.js')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { isLoggedIn } = require('../middelware.js')




const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
    const msgArray = error.details.map(el => el.message)
    throw new ExpressError(msgArray, 400);
}
else{
    next()
}
}



router.post('/',isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewid',isLoggedIn, catchAsync(async(req, res) => {
    const { id, reviewid} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router