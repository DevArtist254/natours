const express = require('express');
const toursRoute = require('./routes/tourRoutes');

const app = express();

//place a middleware to interspect
app.use(express.json());

app.use('/natours/v1/tours', toursRoute);

module.exports = app;
