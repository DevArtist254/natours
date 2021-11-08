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
  startLocation : {
    type : {
      type : String,
      default : "Point",
      enum : ["Point"]
    },
    coordinates : [Number],
    address: String,
    description: String
  },
  locations : [
    {
      type : {
        type : String,
        default : "Point",
        enum : ["Point"]
      },
      coordinates : [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides : [
    {
      //1st create a ref of the other model
      type : mongoose.Schema.ObjectId,
      ref: "User"
    }
  ]
},
{
  toJSON : {virtuals : true},
  toObject: {virtuals : true}
});

//Embedding children onto the parent
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises)

//   next()
// })

//indexing for data that is need at an inst
tourSchema.index({price : 1})
tourSchema.index({startLocation: '2dsphere'})

//Virtual populate
tourSchema.virtual("reviews",{
  ref: "Review",
  foreignField: "reviewedTour",
  localField: "_id"
})

tourSchema.pre(/^find/, function(next){
  this.populate({
    //start by 1st ref with ObjectId then populate *less performance on id
    path: "guides",
    select: "-__v -passwordChangedAt"
  })

  next()
})

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
