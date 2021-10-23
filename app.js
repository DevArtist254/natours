const express = require('express');

//Security middleware 
const rateLimit = require("express-rate-limit");
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")

//Routes init
const toursRoute = require('./routes/tourRoutes');
const usersRoute = require('./routes/userRoutes');
const ErrorHandler = require("./utils/errorApp")
const errorController = require("./controller/errorController")

const app = express();

//secure http requests
app.use(helmet())

//rateLimit check on amount of requests allowed on a single IP *adapt it to our own app
const limiter = rateLimit({
  max : 100,
  windowMs : 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})

//middle on the api route
app.use("/api", limiter)

//Data sanitization against NoSQL query injection {"email": { $gt : ""}}
app.use(mongoSanitize())

//Data sanitization against XSS HTML prevention
app.use(xss())

//Prevent parameter pollution then whitelist the data you to be doubled
app.use(hpp({
  whitelist : ["duration","price","maxGroupSize"]
}))

//place a middleware to interspect
app.use(express.json({limit : '10kb'}));
app.use(express.static(`${__dirname}/public/overview.html`));

app.use((req, res, next) => {
  console.log('Hello world');
  req.timeStamp = new Date().toISOString();
  next();
});

//Route management
app.use('/natours/v1/tours', toursRoute);
app.use('/natours/v1/users', usersRoute);

//error handling for wrong routes
app.all("*", (req,res,next) =>{
  //NORMAL WAY
  // res.status(404).json({
  //   status: "fail",
  //   message: `${req.originalUrl} url is not found`
  // })

  //USING EXPRESS BUILT IN ERROR HANDLERS
  // const err = new Error(`${req.originalUrl} url is not found`)
  // err.status = "fail"
  // err.statusCode = 404

  //next(err)

  next(new ErrorHandler(`${req.originalUrl} url is not found`, 404))
})

//Error handling for middleware in the gobal variable
app.use(errorController)

module.exports = app;
