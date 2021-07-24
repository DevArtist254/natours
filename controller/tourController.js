const fs = require('fs');
const urlFilePath = `${__dirname}/../dev-data/data/tours-simple.json`;

//bring the files
const tours = JSON.parse(fs.readFileSync(urlFilePath, 'utf-8'));

exports.getAllTours = (req, res) => {
  res.status(200).json({
    message: 'success',
    timeStamp: req.timeStamp,
    results: tours.length,
    data: { tours },
  });
};

exports.createATour = (req, res) => {
  //req.body - is done app/JSON on the raw
  //Create an id
  const id = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ _id: id }, req.body);

  tours.push(newTour);

  fs.writeFile(urlFilePath, JSON.stringify(tours), (err) => {
    //status 201 - created
    res.status(201).json({ message: 'success', tours: newTour });
  });
};

exports.getATour = (req, res) => {
  //params - { id: '5', x: 'y' }, x? - is not a must

  //conversion from string to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ message: 'invalid' });
  }

  res.status(200).json({
    message: 'success',
    data: { tour },
  });
};
