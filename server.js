const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const app = require('./app');
const port = process.env.PORT;

const dataBase = process.env.DB__URL.replace(
  `<password>`,
  process.env.DB__PASSWORD
);

const connectDB = async (DB) => {
  try {
    await mongoose.connect(DB, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`The Database is connected ....`);
  } catch (error) {
    console.log(err.message);
    process.exit(1);
  }
};

connectDB(dataBase);

app.listen(port, () => {
  console.log(`the application has started in ${port}...`);
});
