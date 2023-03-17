const mongoose = require('mongoose')
const config = require("../config")

const connect = mongoose.connect(config.databaseURL, { dbName: config.databaseName })
connect.then(() => console.log("Connected to DB")).catch(err => console.error(err))