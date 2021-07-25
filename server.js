const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`the application has started in ${port}...`);
});

//mongodb+srv://dbTours:<password>@cluster0.myge4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
