const express = require('express');

const app = express();
const port = 2540;

app.get('/', (req, res) => {
  res.status(200).send('hello from the server');
});

app.listen(port, () => {
  console.log(`the application has started in ${port}...`);
});
