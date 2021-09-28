const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    //create tranporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD 
        }
    });

    //Define the email options
    const mailOptions = {
        from: "devartist254 <devartist254@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendEmail(mailOptions)
}

exports.default = sendEmail