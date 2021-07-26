const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const app = require('./app');
const port = process.env.PORT;

const DB = process.env.DB__URL.replace(`<password>`, process.env.DB__PASSWORD);

mongoose
  .connect(DB, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB was connected`));

app.listen(port, () => {
  console.log(`the application has started in ${port}...`);
});
