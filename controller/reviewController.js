const Review = require('./../model/reviewsModel')
const ErrorHandle = require('./../utils/errorApp')
const catchAsync = require("./../utils/catchAsync")
const Tour = require('../model/toursModel')

exports.createAReview = catchAsync(async (req,res,next) => {
    const tour = await Tour.findOne({name : req.body.reviewedTour})
    const {reviews,rating} = req.body

    const review = await Review.create({
        createdBy : req.user.id,
        reviewedTour: tour.id,
        reviews,
        rating,
    })

    res.status(200).json({
        message: "success",
        review
    })
})

exports.getAllReviews = catchAsync(async (req,res,next) => {
    const reviews = await Review.find({})

    res.status(200).json({
        message: "success",
        results: reviews.length,
        reviews
    })
})


