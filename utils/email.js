const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    //create tranporter
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "26930e2f542d29",
          pass: "6a97c4a4132934"
        }
      });

    //Define the email options
    const mailOptions = {
        from: "devartist254 <devartist254@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports  = sendEmail