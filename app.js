const express = require('express');
const fs = require('fs');

const app = express();
const urlFilePath = `${__dirname}/dev-data/data/tours.json`;
const port = 2540;

//place a middleware to interspect
app.use(express.json());

//bring the files
const tours = JSON.parse(fs.readFileSync(urlFilePath, 'utf-8'));

app.get('/natours/v1/tours', (req, res) => {
  res.status(200).json({
    message: 'success',
    results: tours.length,
    data: { tours },
  });
});

//post allows for creation of an items
app.post('/natours/v1/tours', (req, res) => {
  //req.body - is done app/JSON on the raw
  //Create an id
  const id = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ _id: id }, req.body);

  tours.push(newTour);

  fs.writeFile(urlFilePath, JSON.stringify(tours), (err) => {
    //status 201 - created
    res.status(201).json({ message: 'success', tours: newTour });
  });
});

app.get('/natours/v1/tours/:id/:x?', (req, res) => {
  //params - { id: '5', x: 'y' }, x? - is not a must

  //conversion from string to number
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({ message: 'invalid' });
  }

  const foundTour = tours.find((el) => el.id == id);

  res.status(200).json({
    message: 'success',
    tour: foundTour,
  });
});

app.listen(port, () => {
  console.log(`the application has started in ${port}...`);
});
