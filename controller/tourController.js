const Tour = require('../model/toursModel');
const ErrorHandle = require('./../utils/errorApp')
const catchAsync = require("./../utils/catchAsync")
const factory = require("./factoryHandler")

exports.getTourFiveTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  req.query.fields = 'name,price,duration,ratingsAverage';
  next();
} 

exports.getAllTours = factory.getAll(Tour)
exports.getATour = factory.getOne(Tour,{path:"reviews"})
exports.createATour = factory.createOne(Tour)
exports.findAndUpdate = factory.updateOne(Tour)
exports.findAndDelete = factory.deleteOne(Tour)

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


//tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin = catchAsync(async (req,res,next) =>{
  const {distance,latlng,unit} = req.params
  const [lat,lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if(!lat || !lng) {
    next(new ErrorHandle('Please provide latitude and longitude in the format lat,lng.', 400))
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin : {
        $centerSphere: [[lng,lat], radius]
      }
    }
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  })
})

exports.getDistances = catchAsync(async (req,res,next) =>{
  const {latlng,unit} = req.params
  const [lat,lng] = latlng.split(',');

  const mult = unit === 'mi' ? 0.00621371 : 0.001

  if(!lat || !lng) {
    next(new ErrorHandle('Please provide latitude and longitude in the format lat,lng.', 400))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'point',
          coordinates: [lng *1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: mult
      },
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  })
})