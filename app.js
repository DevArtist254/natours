const express = require('express');
const toursRoute = require('./routes/tourRoutes');

const app = express();

//place a middleware to interspect
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello world');
  req.timeStamp = new Date().toISOString();
  next();
});

//Route management
app.use('/natours/v1/tours', toursRoute);

module.exports = app;
