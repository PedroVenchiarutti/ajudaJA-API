const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

// nodemailer
let transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function rum(email, subject, text) {
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <pedro.lucas.clear@gmail.com>', // sender address
    to: email, // para onde quer envia pode ser um arry ou uma string
    subject: subject, // assunto
    text: text, // texto
  });
  console.log(info);
}

module.exports = rum;
