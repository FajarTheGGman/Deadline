const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, process.argv[2], () => {
  /* eslint-disable no-console */
    console.log(`Listening: ${process.argv[2]}:5000`);
  /* eslint-enable no-console */
});
