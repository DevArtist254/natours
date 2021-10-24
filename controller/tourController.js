const Tour = require('../model/toursModel');
const APIFeatured = require('./../utils/features');
const ErrorHandle = require('./../utils/errorApp')
const catchAsync = require("./../utils/catchAsync")

exports.getTourFiveTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  req.query.fields = 'name,price,duration,ratingsAverage';
  next();
} 

exports.getAllTours = catchAsync(async (req, res, next) => {
  let feature = new APIFeatured(Tour.find(), req.query)
      .filter()
      .sorted()
      .fields()
      .pagination();

    const tours = await feature.query;
    res.status(200).json({
      message: 'success',
      results: tours.length,
      data: { tours },
    });
}) 

exports.createATour = catchAsync(async (req, res,next) => {
  const tour = await Tour.create(req.body);

  //Sending 404 errors null falsy val NULL = tour
  if(!tour){
    return new ErrorHandle(`There is no such tour`, 404)
  }

    res.status(200).json({
      message: 'success',
      tour,
    });
}) 

exports.getATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id, (err, tour) => {
    console.log(err);
  }).populate('reviews')

  if(!tour){
    return new ErrorHandle(`There is no such tour`, 404)
  }

  res.status(200).json({
    message: 'success',
    data: {
      tour,
    },
  });
}) 

exports.findAndUpdate = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!tour){
    return new ErrorHandle(`There is no such tour`, 404)
  }
  
  res.status(200).json({
    message: 'success',
    data: {
      tour,
    },
  });
}) 

exports.findAndDelete = catchAsync(async (req, res,next) => {
  await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      message: 'success',
    });
}) 

exports.getStatsAvgs = catchAsync(async (req, res,next) => {
  //Set up the pipeline on the model
  const stats = await Tour.aggregate([
    //1st filter the in coming data
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: '$difficulty',
        avgPrice: {
          $avg: '$price'
        },
        minPrice: {
          $min: '$price'
        },
        maxPrice: {
          $max: '$price'
        }
      }
    }
  ]);

  res.status(200).json({
    message: 'success',
    data: { stats },
  });
}) 

exports.getHolidayStats = catchAsync(async (req,res,next) => {
  const stats = await Tour.aggregate([
    {$unwind : '$startDates'},
    {
      $match : {
        startDates :{
          $gte : new Date(`2021-1-1`),
          $lte : new Date(`2021-12-31`)
        }
      }
    },
    {
      $group : {
        _id : {
          $month : '$startDates'
        },
        numMon : {
          $sum : 1
        },
        tours : {
          $push : '$name'
        }
      }
    }
  ])
  
  res.status(200).json({
    message: 'success',
    data: { stats },
  });
}) 
