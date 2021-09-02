const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Programming errors for uncaught errors
process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  process.exit(1)
})


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

const server = app.listen(port, () => {
  console.log(`the application has started in ${port}...`);
});


//Safty net for mongoose and mongod errors
process.on("unhandledRejection", err => {
  console.log(err.name, err.message);

  //Closing the server after ending all calls
  server.close(() => {
    process.exit(1)
  })
})

