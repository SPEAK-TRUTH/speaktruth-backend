const mongoose = require('mongoose');
const config = require('../config');

// Set the strictQuery option
mongoose.set('strictQuery', true);

const connect = mongoose.connect(config.databaseURL, { dbName: config.databaseName });
connect
  .then(() => console.log('MongoDB is successfully connected!'))
  .catch((err) => console.error(err));
