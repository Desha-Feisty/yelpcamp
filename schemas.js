const Joi = require('joi')

module.exports.campgroundSchema = Joi.object({
        title: Joi.string().min(3).max(30).required(),
        location: Joi.string().min(3).max(50).required(),
        price: Joi.number().min(0).required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        deleteImages: Joi.array()
    })

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
})