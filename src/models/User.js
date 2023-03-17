const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcrypt = require('bcryptjs')
const {salt} = require("../config")

const userSchema = new Schema({
    username : { type: String, trim: true, required: true },
    email : { type: String, trim: true, required: true, unique: true },
    password : { type: String }
}, {
    timestamps: true,
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
})

module.exports = model('User', userSchema)