const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const fs = require("fs");
const path = require("path");
const res = require("express/lib/response");

const {
  email: { host, username, port, password, from }
} = require("../../config");

const sendEmail = async (email, subject, payload, template) => {
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: username,
      pass: password
    }
  });

  const source = fs.readFileSync(path.join(__dirname, template), "utf8")
  const compiledTemplate = handlebars.compile(source)

  // send mail with defined transport object
  const options = () => ({
    from: from,
    to: email,
    subject: subject,
    html: compiledTemplate(payload) //res.render("", payload)
  });

  transporter.sendMail(options(), (error, info) => {
    if(error) return error
    else{
        console.log(info)
        return res.status(200).json({ success: true })
    }
  })
};

module.exports = sendEmail;
