const mongoose = require('mongoose');
require('dotenv').config();
// Set the strictQuery option
mongoose.set('strictQuery', true);

const connect = mongoose.connect(process.env.MONGODB_URL, { dbName: process.env.DATABASE_NAME });
connect
  .then(() => console.log('MongoDB is successfully connected!'))
  .catch((err) => console.error(err));




