const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  duration: {
    type: Number,
    default: 5,
  },
  maxGroupSize: {
    type: Number,
  },
  difficulty: String,
  ratingsAverage: Number,
  price: { type: Number, require: true },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
