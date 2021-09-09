const express = require('express');
const toursRoute = require('./routes/tourRoutes');
const usersRoute = require('./routes/userRoutes');
const ErrorHandler = require("./utils/errorApp")
const errorController = require("./controller/errorController")

const app = express();

//place a middleware to interspect
app.use(express.json());
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
