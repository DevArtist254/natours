const mongoose = require('mongoose');
const Tour = require("./toursModel")

const reviewSchema = mongoose.Schema({
    reviews: {
        type: String,
        required: [true, "Must have a review"]
    },
    rating : {
    type : Number,
    //Works for dates also
    min : [1, "please enter correct value of above 1.0"],
    max: [5, "please enter the correct value of below 5.0"]
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    reviewedTour : {
        type : mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Must have a tour"]
    },
    createdBy : {
        type : mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Must have a user"]
    }
},
{
    toJSON : {virtuals : true},
    toObject: {virtuals : true}
}
)

reviewSchema.index({tour: 1,user: 1}, {unique: true})

reviewSchema.pre(/^find/, function(next){
    this.populate({
        //start by 1st ref with ObjectId then populate *less performance on id
        path: "createdBy",
        select: "fullName"
      })
    //   .populate({
    //     //start by 1st ref with ObjectId then populate *less performance on id
    //     path: "reviewedTour",
    //     select: "name"
    //   })

    next()
})

reviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match: {reviewedTour: tourId}
          },
          {
              $group :{
                  _id: "$reviewedTour",
                  nRating: {$sum : 1},
                  avgRating: {$avg : "$rating"}
              }
          }
    ])

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    })
}

reviewSchema.post('save', function(){
    //this points to current review
    this.constructor.calcAverageRatings(this.reviewedTour)
})

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne()

    next()
})

reviewSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calcAverageRatings(this.r.reviewedTour);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;