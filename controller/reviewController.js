const Review = require('./../model/reviewsModel')
const ErrorHandle = require('./../utils/errorApp')
const catchAsync = require("./../utils/catchAsync")
const factory = require("./factoryHandler")

exports.findAndDelete = factory.deleteOne(Review)
exports.findAndUpdate = factory.updateOne(Review)
exports.getAllReviews = factory.getAll(Review)

exports.createAReview = catchAsync(async (req,res,next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId
    const {reviews,rating} = req.body

    const review = await Review.create({
        createdBy : req.user.id,
        reviewedTour:  req.body.tour,
        reviews,
        rating,
    })

    res.status(200).json({
        message: "success",
        review
    })
})


