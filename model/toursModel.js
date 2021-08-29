const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    //Data validation (Neva accept things as they come into the database)
    //DV - checks data and returns an error if the desired outcome is not met
    require: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
    default: 5,
  },
  imageCover: {
    type: String,
    unique: true,
    require: true,
  },
  images: [String],
  maxGroupSize: {
    type: Number,
    maxLength: [40, "only 40 people are allowed in the trip"],
    minLength: [1, "input error"]
  },
  summary: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    require: true,
    enum :{
      values : ["easy","medium","difficult"],
      message : "Please input the correct value"
    }
  },
  ratingsAverage: {
    type : Number,
    //Works for dates also
    min : [1, "please enter correct value of above 1.0"],
    max: [5, "please enter the correct value of below 5.0"]
  },
  ratingsQuantity: Number,
  price: { 
    type: Number, 
    require: true ,
    validate: {
      validator : function (val) {
        //should return true or false only work with new documents
        return val > this.price 
      },
      message : "the price ({VALUE}) should be above 100"
    } 
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

// //Document hooks for .pre() .create()
// tourSchema.pre("save,/^find/,aggrerate",  function(next){
//   /**
//    * Document processing be4 save() & create() - this
//    * Query procressing middleware be4 /^find/  - this.find()
//    * Aggregate processing middleware be4 - this.pipeline()
//    */
//   console.log(this);
//   next()
// })

// tourSchema.post("save", function(doc,next){
//   //the document after the hook
//   console.log(doc);
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
