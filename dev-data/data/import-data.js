const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../model/toursModel');
dotenv.config({ path: `./config.env` });

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importAllData = async () => {
  try {
    await Tour.create(tours);
    console.log(`Data was successfuly imported`);
  } catch (error) {
    console.log(`Data was not import`);
    process.exit(1);
  }
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log(`Data was successfuly Delete`);
  } catch (error) {
    console.log(`Data was not Deleted`);
    process.exit(1);
  }
};

if (process.argv[2] === '--delete') {
  deleteAllData();
} else if (process.argv[2] === '--import') {
  importAllData();
}
