const JWT = require("jsonwebtoken")
const crypto = require("crypto")
const bcrypt = require('bcryptjs')

const sendEmail = require("../utils/email/sendEmail")
const User = require("../models/User")
const Token = require("../models/Token")


const signUp = async (data) => {
    try {
    const { email } = data
    let user = await User.findOne({ email })

    if(user) throw new Error("Email already exists")
    

    user = new User(data)

    //generate a JWT token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET)
    await user.save()

    return( data = {
        userId: user._id,
        email: user.email,
        username: user.username,
        token
    })

} catch (err) {
    console.log(err);
  }
}
const signIn = async (email, password) => {
    let user = await User.findOne({ email })

    // if(!user) throw new Error("User does not exists. Please try again")
    if(!user){
        const error = new Error("User does not exists. Please try again")
        error.status = 404
        throw error
    }

    const isValid = await bcrypt.compare(password, user.password)

    const token = JWT.sign({ id: user._id}, process.env.JWT_SECRET)

    if(isValid){
        return (data = {
            userId: user._id,
            email: user.email,
            username: user.username,
            token
        })
    }else{
        throw new Error("Incorrect credentials")
    }
}

const requestResetPassword = async (email) => {
    const user = await User.findOne({email})
    if(!user) throw new Error("User does not exists")

    const token = await Token.findOne({ userId: user._id })
    if(token) await token.deleteOne()

    const resetToken = crypto.randomBytes(32).toString("hex")
    const hash = await bcrypt.hash(resetToken, process.env.SALT)

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
    }).save()

    const link = `${process.env.CLIENT_URL}/api/auth/passwordReset?token=${resetToken}&id=${user._id}`

    //send an email
    sendEmail(
        user.email,
        "Password Reset Request",
        { username: user.username, link },
        "./template/requestResetPassword.handlebars"
    )

    return link
}

const resetPassword = async (userId, token, newPassword) => {
    const passwordResetToken = await Token.findOne({ userId})

    if(!passwordResetToken) throw new Error("Invalid entry or the password reset has expired")

    const isValid = await bcrypt.compare(token, passwordResetToken.token)

    if(!isValid) throw new Error("Invalid entry or the password reset has expired")

    const hash = await bcrypt.hash(newPassword, process.env.SALT)

    await User.updateOne({ _id: userId }, { $set: { password: hash }})

    const user = await User.findById({ _id: userId })

    sendEmail(
        user.email,
        "Password Reset Successfully",
        { username: user.username },
        "./template/resetPassword.handlebars"
    )

    await passwordResetToken.deleteOne()

    return true
}

module.exports = {
    signUp,
    signIn,
    requestResetPassword,
    resetPassword
}