const mongoose = require('mongoose');

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

reviewSchema.pre(/^find/, function(next){
    this.populate({
        //start by 1st ref with ObjectId then populate *less performance on id
        path: "createdBy",
        select: "fullName"
      }).populate({
        //start by 1st ref with ObjectId then populate *less performance on id
        path: "reviewedTour",
        select: "name"
      })

    next()
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;