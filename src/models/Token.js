const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose

const tokenSchema = new Schema({
    userId : { type: SchemaTypes.ObjectId, required: true, ref: "User" },
    token : { type: String, required: true },
    createdAt : { type: Date, required: true, default: () => Date.now(), expires: 900 }
})

module.exports = model('Token', tokenSchema)