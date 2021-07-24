const app = require('./app');
const port = 2540;

app.listen(port, () => {
  console.log(`the application has started in ${port}...`);
});
