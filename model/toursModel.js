const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
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
  },
  summary: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    require: true,
  },
  ratingsAverage: Number,
  ratingsQuantity: Number,
  price: { type: Number, require: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
